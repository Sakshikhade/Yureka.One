import os
import sys
import json
import re
import io
import base64
import pickle
from datetime import datetime
import pandas as pd
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from google.auth.transport.requests import Request
from bs4 import BeautifulSoup
from pypdf import PdfReader

SCOPES = [
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/user.phonenumbers.read',
    'https://www.googleapis.com/auth/user.birthday.read',
    'https://www.googleapis.com/auth/user.gender.read'
]

class FinancialScanner:
    def __init__(self, service):
        self.service = service
        # High-signal indicators with weightings
        self.patterns = {
            'bill': 5, 'statement': 5, 'transaction': 4, 
            'debited': 5, 'credited': 5, 'due': 4, 'inr': 2
        }

    def get_financial_score(self, subject, snippet):
        """Scores relevance to ensure only financial emails are processed."""
        text = (subject + snippet).lower()
        score = sum(weight for kw, weight in self.patterns.items() if kw in text)
        return score

    def extract_amount(self, text):
        """Robust currency extraction that handles comma separation and decimal precision."""
        match = re.search(r'(?:rs\.?|inr|₹|amount|total)\s*[:\s]*([\d,]+\.?\d*)', text, re.IGNORECASE)
        if match:
            clean_val = match.group(1).replace(',', '')
            try: 
                val = float(clean_val)
                return f"₹ {val:,.2f}"
            except: 
                return "N/A"
        return "N/A"

    def classify_type(self, subject, snippet):
        text = (subject + snippet).lower()
        if any(k in text for k in ['statement', 'due', 'outstanding']): 
            return 'Credit Card Bill'
        if 'invoice' in text: 
            return 'Invoice'
        if 'bill' in text: 
            return 'Bill'
        return 'Transaction'

def calculate_age(birthday_dict):
    if not birthday_dict:
        return "N/A"
    year = birthday_dict.get('year')
    month = birthday_dict.get('month')
    day = birthday_dict.get('day')
    if not year or not month or not day:
        return "N/A"
    today = datetime.today()
    try:
        birth_date = datetime(year, month, day)
        age = today.year - birth_date.year - ((today.month, today.day) < (birth_date.month, birth_date.day))
        return int(age)
    except Exception:
        return "N/A"

def fetch_user_profile(people_service, first_name_fallback, last_name_fallback, dob_fallback, gender_fallback, phone_fallback):
    try:
        profile = people_service.people().get(
            resourceName='people/me',
            personFields='names,phoneNumbers,birthdays,genders'
        ).execute()
    except Exception as e:
        sys.stderr.write(f"People API warning: {str(e)}\n")
        profile = {}

    first_name, last_name = first_name_fallback, last_name_fallback
    names = profile.get('names', [])
    if names:
        first_name = names[0].get('givenName', first_name_fallback)
        last_name = names[0].get('familyName', last_name_fallback)
        
    gender = gender_fallback
    genders = profile.get('genders', [])
    if genders:
        gender = genders[0].get('formattedValue', gender_fallback)
        
    dob_string, age = dob_fallback, "N/A"
    birthdays = profile.get('birthdays', [])
    if birthdays:
        date_data = birthdays[0].get('date', {})
        if date_data:
            day = date_data.get('day', '')
            month = date_data.get('month', '')
            year = date_data.get('year', '')
            dob_string = f"{day:02d}/{month:02d}/{year}" if year else f"{day:02d}/{month:02d}"
            age = str(calculate_age(date_data))
    elif dob_fallback:
        parts = dob_fallback.split('-')
        if len(parts) == 3:
            dob_string = f"{parts[2]}/{parts[1]}/{parts[0]}"
            try:
                birth = datetime(int(parts[0]), int(parts[1]), int(parts[2]))
                today = datetime.today()
                computed_age = today.year - birth.year - ((today.month, today.day) < (birth.month, birth.day))
                age = str(int(computed_age))
            except Exception:
                pass

    found_numbers = []
    phone_numbers = profile.get('phoneNumbers', [])
    for p in phone_numbers:
        val = p.get('value') or p.get('canonicalForm')
        if val and val not in found_numbers:
            found_numbers.append(val)

    try:
        directory_res = people_service.people().get(
            resourceName='people/me',
            personFields='metadata'
        ).execute()
        source_id = directory_res.get('metadata', {}).get('sources', [{}])[0].get('id')
        if source_id:
            batch_res = people_service.people().batchGet(
                resourceNames=[f'people/{source_id}'],
                personFields='phoneNumbers'
            ).execute()
            responses = batch_res.get('responses', [])
            if responses:
                deep_person = responses[0].get('person', {})
                deep_phones = deep_person.get('phoneNumbers', [])
                for dp in deep_phones:
                    dval = dp.get('value') or dp.get('canonicalForm')
                    if dval and dval not in found_numbers:
                        found_numbers.append(dval)
    except Exception:
        pass

    mobile_number = " | ".join(found_numbers) if found_numbers else phone_fallback
        
    return {
        'name': f"{first_name} {last_name}".strip(),
        'dob': dob_string,
        'age': age,
        'gender': gender,
        'phone': mobile_number
    }

def get_local_gmail_service():
    """Manages the OAuth 2.0 lifecycle using a local Desktop Client context."""
    paths_to_try_token = [
        'components/token.pickle',
        'token.pickle',
        '/Users/anweshbiswas/Yureka.Money/components/token.pickle',
        '/Users/anweshbiswas/Yureka.Money/token.pickle'
    ]
    paths_to_try_creds = [
        'components/credentials.json',
        'credentials.json',
        '/Users/anweshbiswas/Yureka.Money/components/credentials.json',
        '/Users/anweshbiswas/Yureka.Money/credentials.json'
    ]
    
    token_path = None
    for p in paths_to_try_token:
        if os.path.exists(p):
            token_path = p
            break
            
    creds_path = None
    for p in paths_to_try_creds:
        if os.path.exists(p):
            creds_path = p
            break
            
    write_token_path = token_path or 'components/token.pickle'
    
    creds = None
    if token_path and os.path.exists(token_path):
        with open(token_path, 'rb') as token:
            creds = pickle.load(token)
            
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            try:
                creds.refresh(Request())
                with open(write_token_path, 'wb') as token:
                    pickle.dump(creds, token)
            except Exception as refresh_err:
                raise Exception(f"Local token refresh failed: {str(refresh_err)}")
        else:
            raise Exception("Local desktop OAuth credentials expired or invalid. Re-authorization required.")
            
    return build('gmail', 'v1', credentials=creds)

def robust_urlsafe_b64decode(data):
    try:
        b_data = data.encode('ascii', errors='ignore')
        b_data = b_data.replace(b'-', b'+').replace(b'_', b'/')
        padding = len(b_data) % 4
        if padding:
            b_data += b'=' * (4 - padding)
        return base64.b64decode(b_data)
    except Exception as e:
        sys.stderr.write(f"Base64 urlsafe decode error: {str(e)}\n")
        return b""

def extract_all_body_and_attachments(service, message_id, payload):
    html_text = ""
    pdf_text = ""
    stack = [payload]
    
    while stack:
        current_part = stack.pop()
        mime_type = current_part.get('mimeType', '')
        filename = current_part.get('filename', '')
        
        if 'parts' in current_part:
            stack.extend(current_part['parts'])
            continue
            
        if mime_type in ['text/plain', 'text/html'] and not filename:
            data = current_part.get('body', {}).get('data', '')
            if data:
                try:
                    decoded_bytes = robust_urlsafe_b64decode(data)
                    decoded_str = decoded_bytes.decode('utf-8', errors='ignore')
                    html_text += " " + decoded_str
                except Exception as e:
                    sys.stderr.write(f"MIME body decode error: {str(e)}\n")
                    
        elif filename.lower().endswith('.pdf') or mime_type == 'application/pdf':
            attachment_id = current_part.get('body', {}).get('attachmentId')
            if attachment_id:
                try:
                    attachment = service.users().messages().attachments().get(
                        userId='me', messageId=message_id, id=attachment_id
                    ).execute()
                    file_data = robust_urlsafe_b64decode(attachment['data'])
                    
                    pdf_io = io.BytesIO(file_data)
                    reader = PdfReader(pdf_io)
                    for page in reader.pages:
                        extracted = page.extract_text()
                        if extracted:
                            pdf_text += extracted + "\n"
                except Exception as e:
                    sys.stderr.write(f"PDF extraction error: {str(e)}\n")
                    
    return html_text, pdf_text

def parse_transaction_data(combined_text, sender, subject, financial_scanner):
    sender_lower = sender.lower()
    brand_name = re.sub(r'\s*<.*?>', '', sender).replace('"', '').replace("'", "").strip()
    
    # Custom matches for exact precision if applicable
    amount = "N/A"
    normalized_text = re.sub(r'\s+', ' ', combined_text)
    
    if "eatclub" in sender_lower:
        match = re.search(r'(?:Online Paid|Grand Total|Total|Sub Total)[:\s]*[₹Rs\.?]*\s*([\d,]+\.\d{2})', normalized_text, re.IGNORECASE)
        if match:
            amount = f"₹ {float(match.group(1).replace(',', '')):,.2f}"
    elif "namecheap" in sender_lower:
        match = re.search(r'(?:Total|Charged|Amount)[:\s]*(?:US\s*\||\$)\s*([\d,]+\.\d{2})', normalized_text, re.IGNORECASE)
        if match:
            amount = f"$ {float(match.group(1).replace(',', '')):,.2f}"
    elif "phonepe" in sender_lower:
        match = re.search(r'(?:Transaction Value|Amount|Paid)[:\s]*[₹Rs\.?]*\s*([\d,]+(?:\.\d{2})?)', normalized_text, re.IGNORECASE)
        if match:
            amount = f"₹ {float(match.group(1).replace(',', '')):,.2f}"
    elif "axis" in sender_lower:
        match = re.search(r'(?:debited for|spent|amount of|INR)[:\s]*INR\s*([\d,]+\.\d{2})', normalized_text, re.IGNORECASE)
        if match:
            amount = f"₹ {float(match.group(1).replace(',', '')):,.2f}"
    elif "shiprocket" in sender_lower:
        match = re.search(r'(?:Invoice Total|Amount Paid|Total Amount|Paid Total)[:\s]*[₹Rs\.?]*\s*\b(\d+(?:\.\d{2})?)\b', normalized_text, re.IGNORECASE)
        if match:
            amount = f"₹ {float(match.group(1).replace(',', '')):,.2f}"

    # Fallback to FinancialScanner amount parser
    if amount == "N/A":
        amount = financial_scanner.extract_amount(normalized_text)

    # Context / details
    subject_cleaned = re.sub(r'(Order Confirmed:|Your order|Invoice for|Receipt for|Your delivery from|Your purchase|Confirmed|Booking|#\d+|\d+)', '', subject, flags=re.IGNORECASE).strip()
    description = subject_cleaned[:60] if len(subject_cleaned) > 5 else subject[:60].strip()

    return brand_name, amount, description

def execute_financial_scanner(gmail_service):
    scanner = FinancialScanner(gmail_service)
    emails_data = []
    
    # Broad scan restricted to high-probability financial subjects
    query = 'subject:(bill OR transaction OR statement OR debited OR credited OR payment) OR has:attachment'
    
    # Optimize: Limit to top 80 most recent financial emails to ensure execution under 10 seconds
    response = gmail_service.users().messages().list(userId='me', q=query, maxResults=80).execute()
    messages = response.get('messages', [])

    for msg in messages:
        try:
            msg_detail = gmail_service.users().messages().get(userId='me', id=msg['id'], format='full').execute()
            payload = msg_detail.get('payload', {})
            headers = payload.get('headers', [])
            snippet = msg_detail.get('snippet', '')
            
            subject = next((h['value'] for h in headers if h['name'].lower() == 'subject'), '(No Subject)')
            sender = next((h['value'] for h in headers if h['name'].lower() == 'from'), '(Unknown Sender)')
            date = next((h['value'] for h in headers if h['name'].lower() == 'date'), '(Unknown Date)')
            
            # Apply relevance score
            if scanner.get_financial_score(subject, snippet) >= 5:
                html_content, pdf_content = extract_all_body_and_attachments(gmail_service, msg['id'], payload)
                soup = BeautifulSoup(html_content, 'html.parser')
                clean_html_text = soup.get_text(separator=' ').strip()
                
                unified_corpus = f"{clean_html_text}\n{snippet}\n{pdf_content}"
                brand, amount, description = parse_transaction_data(unified_corpus, sender, subject, scanner)
                
                if amount != "N/A":
                    clean_date = re.sub(r'([\+\s-]\d{4}.*)$', '', date).strip()
                    classified_type = scanner.classify_type(subject, snippet)
                    
                    emails_data.append({
                        'brandName': brand,
                        'amount': amount,
                        'description': description,
                        'date': clean_date,
                        'sender': sender,
                        'type': classified_type
                    })
        except Exception as e:
            sys.stderr.write(f"Failed parsing message {msg['id']}: {str(e)}\n")
            
    return emails_data

def main():
    fallback_data = {}
    if len(sys.argv) > 2:
        try:
            fallback_data = json.loads(sys.argv[2])
        except Exception:
            pass

    gmail_service = None
    people_service = None
    
    # Try local credentials first
    try:
        gmail_service = get_local_gmail_service()
        creds = gmail_service._http.credentials
        people_service = build('people', 'v1', credentials=creds)
        sys.stderr.write("Successfully initialized Gmail & People services using local Desktop OAuth context.\n")
    except Exception as local_err:
        sys.stderr.write(f"Local Desktop OAuth failed/missing: {str(local_err)}. Falling back to access token...\n")
        
        if len(sys.argv) < 2:
            print(json.dumps({"error": "Missing access token and local desktop credentials"}))
            return
            
        access_token = sys.argv[1]
        creds = Credentials(token=access_token)
        try:
            people_service = build('people', 'v1', credentials=creds)
            gmail_service = build('gmail', 'v1', credentials=creds)
        except Exception as e:
            print(json.dumps({"error": f"Failed to initialize services with token: {str(e)}"}))
            return

    try:
        profile = fetch_user_profile(
            people_service,
            fallback_data.get('firstName', ''),
            fallback_data.get('lastName', ''),
            fallback_data.get('dateOfBirth', ''),
            fallback_data.get('gender', ''),
            fallback_data.get('mobileNumber', '')
        )
    except Exception as e:
        err_msg = str(e)
        if "refresh" in err_msg.lower() or "invalid_grant" in err_msg.lower() or "credentials" in err_msg.lower() or "401" in err_msg:
            print(json.dumps({"error": "AUTH_EXPIRED", "details": err_msg}))
        else:
            print(json.dumps({"error": f"Failed to fetch profile: {err_msg}"}))
        return

    try:
        # Use our integrated broad financial scanner!
        transactions = execute_financial_scanner(gmail_service)
    except Exception as e:
        err_msg = str(e)
        if "refresh" in err_msg.lower() or "invalid_grant" in err_msg.lower() or "credentials" in err_msg.lower() or "401" in err_msg:
            print(json.dumps({"error": "AUTH_EXPIRED", "details": err_msg}))
        else:
            print(json.dumps({"error": f"Failed to scan emails: {err_msg}"}))
        return
    
    output = {
        "profile": profile,
        "transactions": transactions
    }
    
    print(json.dumps(output))

if __name__ == "__main__":
    main()
