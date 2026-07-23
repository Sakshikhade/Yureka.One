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
    'https://www.googleapis.com/auth/user.gender.read',
    'https://www.googleapis.com/auth/user.addresses.read'
]

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

def fetch_user_profile(people_service, first_name_fallback, last_name_fallback, dob_fallback, gender_fallback, phone_fallback, location_fallback=''):
    try:
        profile = people_service.people().get(
            resourceName='people/me',
            personFields='names,phoneNumbers,birthdays,genders,emailAddresses,addresses'
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
        
    email = None
    emails = profile.get('emailAddresses', [])
    for em in emails:
        val = em.get('value')
        if val:
            email = val
            break
        
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

    location = location_fallback
    addresses = profile.get('addresses', [])
    if addresses:
        addr = addresses[0]
        location = addr.get('formattedValue') or ", ".join(
            filter(None, [addr.get('city'), addr.get('region'), addr.get('country')])
        ) or location_fallback

    return {
        'name': f"{first_name} {last_name}".strip(),
        'email': email,
        'dob': dob_string,
        'age': age,
        'gender': gender,
        'phone': mobile_number,
        'location': location
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

def parse_transaction_data_expense(combined_text, sender, subject):
    sender_lower = sender.lower()
    subject_lower = subject.lower()
    brand_name = re.sub(r'\s*<.*?>', '', sender).replace('"', '').replace("'", "").strip()
    
    is_transit_status = any(k in subject_lower or k in combined_text.lower() for k in [
        "packed", "out for delivery", "reached your city", "arriving early", "has been delivered", "shipment"
    ])
    
    amount = "N/A"
    normalized_text = re.sub(r'\s+', ' ', combined_text)
    
    if "eatclub" in sender_lower:
        match = re.search(r'(?:Online Paid|Grand Total|Total|Sub Total)[:\s]*[₹Rs\.?]*\s*([\d,]+\.\d{2})', normalized_text, re.IGNORECASE)
        if match:
            amount = f"₹ {match.group(1)}"
            
    elif "namecheap" in sender_lower:
        match = re.search(r'(?:Total|Charged|Amount)[:\s]*(?:US\s*\||\$)\s*([\d,]+\.\d{2})', normalized_text, re.IGNORECASE)
        if match:
            amount = f"$ {match.group(1)}"

    elif "phonepe" in sender_lower:
        match = re.search(r'(?:Transaction Value|Amount|Paid)[:\s]*[₹Rs\.?]*\s*([\d,]+(?:\.\d{2})?)', normalized_text, re.IGNORECASE)
        if match:
            amount = f"₹ {match.group(1)}"

    elif "axis" in sender_lower:
        match = re.search(r'(?:debited for|spent|amount of|INR)[:\s]*INR\s*([\d,]+\.\d{2})', normalized_text, re.IGNORECASE)
        if match:
            amount = f"₹ {match.group(1)}"

    elif "shiprocket" in sender_lower:
        match = re.search(r'(?:Invoice Total|Amount Paid|Total Amount|Paid Total)[:\s]*[₹Rs\.?]*\s*\b(\d+(?:\.\d{2})?)\b', normalized_text, re.IGNORECASE)
        if match:
            amount = f"₹ {match.group(1)}"
        elif is_transit_status:
            return brand_name, "N/A", "N/A"

    if amount == "N/A" and not is_transit_status:
        global_patterns = [
            r'(?:debited|spent|withdrawn|charged|paid|amount of|value of|payment of)\s+(?:for|to|with)?\s*([₹$]|Rs\.?|INR)\s*([\d,]+\.?\d*)',
            r'([₹$]|Rs\.?|INR)\s*([\d,]+\.\d{2})',
            r'([₹$]|Rs\.?|INR)\s*([\d,]+)'
        ]
        for pattern in global_patterns:
            match = re.search(pattern, normalized_text, re.IGNORECASE)
            if match:
                val = match.group(2)
                sym = match.group(1)
                if val not in ["1", "2"]:
                    # standardise symbol
                    if sym.upper() == 'INR': sym = '₹'
                    elif sym.upper() == 'RS.': sym = '₹'
                    elif sym.upper() == 'RS': sym = '₹'
                    amount = f"{sym} {val}".strip()
                    break

    item_details = "N/A"
    if "eatclub" in sender_lower and "product details" in combined_text.lower():
        lines = combined_text.split('\n')
        captured = []
        start = False
        for line in lines:
            if any(k in line.lower() for k in ["product details", "item description"]):
                start = True
                continue
            if start:
                if any(k in line.lower() for k in ["sub total", "total", "customer details", "order information"]):
                    break
                cleaned = re.sub(r'\s+', ' ', line).strip()
                if cleaned and not cleaned.replace('.', '').isdigit() and len(cleaned) > 3:
                    if not any(x in cleaned.lower() for x in ["qty", "rate", "amount"]):
                        captured.append(cleaned)
        if captured:
            item_details = " | ".join(captured[:3])

    if item_details == "N/A":
        subject_cleaned = re.sub(r'(Order Confirmed:|Your order|Invoice for|Receipt for|Your delivery from|Your purchase|Confirmed|Booking|#\d+|\d+)', '', subject, flags=re.IGNORECASE).strip()
        if len(subject_cleaned) > 5 and not any(x in subject_cleaned.lower() for x in ['successful', 'payment', 'thank you', 'alert']):
            item_details = subject_cleaned
        else:
            item_details = subject.strip()

    return brand_name, amount, item_details

def extract_amount_bill(text):
    match = re.search(r'(?:rs\.?|inr|₹|amount|total)\s*[:\s]*([\d,]+\.?\d*)', text, re.IGNORECASE)
    if match:
        clean_val = match.group(1).replace(',', '')
        try:
            val = float(clean_val)
            return f"₹ {val:,.2f}"
        except:
            return "N/A"
    return "N/A"

def classify_type_bill(subject, snippet):
    text = (subject + snippet).lower()
    if any(k in text for k in ['statement', 'due', 'outstanding']): 
        return 'Credit Card Bill'
    if 'invoice' in text: 
        return 'Invoice'
    if 'bill' in text: 
        return 'Bill'
    return 'Bill Transaction'

def get_financial_score(subject, snippet):
    """Scores email relevance for bill detection using weighted keyword matching (Script 2 approach)."""
    patterns = {
        'bill': 5, 'statement': 5, 'debited': 5, 'credited': 5,
        'outstanding': 5, 'invoice': 5, 'due': 4, 'transaction': 4,
        'payment': 4, 'inr': 2
    }
    text = (subject + snippet).lower()
    return sum(weight for kw, weight in patterns.items() if kw in text)


def extract_amount_from_snippet(text):
    """Fast amount extraction from snippet/subject without full body parsing (Script 2 approach)."""
    match = re.search(r'(?:rs\.?|inr|₹|amount|total)\s*[:\s]*([\d,]+\.?\d*)', text, re.IGNORECASE)
    if match:
        clean_val = match.group(1).replace(',', '')
        try:
            val = float(clean_val)
            if val > 0:
                return f"₹ {val:,.2f}"
        except Exception:
            pass
    return "N/A"


def execute_expense_scanner(gmail_service):
    """
    Script 1: Full-body purchase/expense scanner.
    Targets category:purchases and known merchant senders.
    Output type: 'Transaction' → shown in Expenses tab.
    """
    emails_data = []
    query = (
        'category:purchases OR from:noreply@phonepe.com OR from:alerts@axis.bank.in '
        'OR from:info@net.shiprocket.in OR from:shiprocket.in OR from:eatclub.in '
        'OR from:swiggy.in OR from:zomato.com OR from:amazon.in OR from:flipkart.com '
        'OR from:uber.com OR from:olacabs.com OR from:makemytrip.com '
        'OR from:bookmyshow.com OR from:myntra.com OR from:nykaa.com '
        'OR from:blinkit.com OR from:zepto.co OR from:bigbasket.com'
    )

    try:
        sys.stderr.write("Expense Scanner: Fetching purchase emails...\n")
        response = gmail_service.users().messages().list(userId='me', q=query, maxResults=150).execute()
        messages = response.get('messages', [])
        sys.stderr.write(f"Expense Scanner: Found {len(messages)} emails. Batch fetching full bodies...\n")

        if not messages:
            return []

        messages_details = {}
        def expense_batch_callback(request_id, response, exception):
            if exception is None:
                messages_details[request_id] = response
            else:
                sys.stderr.write(f"Expense batch error for {request_id}: {str(exception)}\n")

        chunk_size = 50
        for i in range(0, len(messages), chunk_size):
            chunk = messages[i:i + chunk_size]
            batch = gmail_service.new_batch_http_request(callback=expense_batch_callback)
            for msg in chunk:
                batch.add(
                    gmail_service.users().messages().get(userId='me', id=msg['id'], format='full'),
                    request_id=msg['id']
                )
            batch.execute()

        sys.stderr.write(f"Expense Scanner: Processing {len(messages_details)} emails...\n")

        for msg in messages:
            msg_id = msg['id']
            if msg_id not in messages_details:
                continue
            m = messages_details[msg_id]
            try:
                payload = m.get('payload', {})
                headers = payload.get('headers', [])
                headers_dict = {h['name'].lower(): h['value'] for h in headers}
                snippet = m.get('snippet', '')

                subject = headers_dict.get('subject', '(No Subject)')
                sender = headers_dict.get('from', '(Unknown Sender)')
                date = headers_dict.get('date', '(Unknown Date)')

                # Full body extraction (Script 1 approach)
                html_content, pdf_content = extract_all_body_and_attachments(gmail_service, msg_id, payload)
                soup = BeautifulSoup(html_content, 'html.parser')
                clean_html_text = soup.get_text(separator=' ').strip()
                unified_corpus = f"{clean_html_text}\n{snippet}\n{pdf_content}"

                brand, amount, description = parse_transaction_data_expense(unified_corpus, sender, subject)

                if amount != "N/A":
                    clean_date = re.sub(r'([\+\s-]\d{4}.*)$', '', date).strip()
                    emails_data.append({
                        'brandName': brand,
                        'amount': amount,
                        'description': description,
                        'date': clean_date,
                        'sender': sender,
                        'type': 'Transaction'
                    })
            except Exception as e:
                sys.stderr.write(f"Expense Scanner: Failed parsing {msg_id}: {str(e)}\n")

    except Exception as e:
        sys.stderr.write(f"Expense Scanner: Query failed: {str(e)}\n")

    sys.stderr.write(f"Expense Scanner: Extracted {len(emails_data)} expense transactions.\n")
    return emails_data


def execute_bill_scanner(gmail_service):
    """
    Script 2: Fast metadata-only bill scanner using financial scoring.
    Only fetches message headers + snippet — no full body, very fast.
    Output types: Credit Card Bill / Invoice / Bill / Bill Transaction → shown in Bills tab.
    """
    emails_data = []
    query = 'subject:(bill OR statement OR debited OR credited OR outstanding OR invoice OR due) OR has:attachment'

    try:
        sys.stderr.write("Bill Scanner: Fetching bill candidate emails...\n")
        response = gmail_service.users().messages().list(userId='me', q=query, maxResults=500).execute()
        messages = response.get('messages', [])
        sys.stderr.write(f"Bill Scanner: Found {len(messages)} candidates. Scoring...\n")

        if not messages:
            return []

        seen_keys = set()

        for msg in messages:
            try:
                m = gmail_service.users().messages().get(
                    userId='me', id=msg['id'], format='metadata',
                    metadataHeaders=['From', 'Subject', 'Date']
                ).execute()

                headers = {h['name']: h['value'] for h in m['payload']['headers']}
                snippet = m.get('snippet', '')
                subject = headers.get('Subject', '(No Subject)')
                sender = headers.get('From', '(Unknown Sender)')
                date = headers.get('Date', '(Unknown Date)')

                # Apply financial scoring filter — must score >= 5
                score = get_financial_score(subject, snippet)
                if score < 5:
                    continue

                # Fast amount extraction from snippet/subject
                amount = extract_amount_from_snippet(snippet + " " + subject)
                if amount == "N/A":
                    continue

                # Classify bill type
                bill_type = classify_type_bill(subject, snippet)

                brand = re.sub(r'\s*<.*?>', '', sender).replace('"', '').replace("'", "").strip()
                description = subject[:80].strip()
                clean_date = re.sub(r'([\+\s-]\d{4}.*)$', '', date).strip()

                # Deduplicate by brand + date + amount
                dedup_key = f"{brand}|{clean_date}|{amount}"
                if dedup_key in seen_keys:
                    continue
                seen_keys.add(dedup_key)

                emails_data.append({
                    'brandName': brand,
                    'amount': amount,
                    'description': description,
                    'date': clean_date,
                    'sender': sender,
                    'type': bill_type
                })

            except Exception as e:
                sys.stderr.write(f"Bill Scanner: Failed parsing {msg['id']}: {str(e)}\n")

    except Exception as e:
        sys.stderr.write(f"Bill Scanner: Query failed: {str(e)}\n")

    sys.stderr.write(f"Bill Scanner: Extracted {len(emails_data)} bill records.\n")
    return emails_data


def execute_financial_scanner(gmail_service):
    """
    Orchestrator: Runs both Script 1 (expenses) and Script 2 (bills) scanners,
    then merges and deduplicates the results.
    - Expenses → type='Transaction' → shown in Expenses tab
    - Bills → type='Credit Card Bill'/'Invoice'/'Bill'/'Bill Transaction' → shown in Bills tab
    """
    sys.stderr.write("=== Starting Dual-Mode Financial Scanner ===\n")

    expense_data = execute_expense_scanner(gmail_service)
    bill_data = execute_bill_scanner(gmail_service)

    # Merge with deduplication by brand+date+amount
    seen = set()
    combined = []
    for item in expense_data + bill_data:
        key = f"{item['brandName']}|{item['date']}|{item['amount']}"
        if key not in seen:
            seen.add(key)
            combined.append(item)

    sys.stderr.write(f"=== Total unique financial records: {len(combined)} (expenses: {len(expense_data)}, bills: {len(bill_data)}) ===\n")
    return combined

def _parse_amount_value(amount_str):
    """'₹ 1,234.50' -> (1234.5, 'INR'); '$ 12.00' -> (12.0, 'USD')."""
    if not amount_str or amount_str == "N/A":
        return None, None
    currency = 'USD' if '$' in amount_str else 'INR'
    digits = re.sub(r'[^\d.]', '', amount_str)
    try:
        return float(digits), currency
    except Exception:
        return None, None


def _parse_date_iso(date_str):
    if not date_str:
        return ""
    try:
        return pd.to_datetime(date_str, errors='coerce', utc=True).date().isoformat()
    except Exception:
        return ""


def compute_yureka_score(transactions):
    """
    Ports credit_score.py's spend-tier scoring model to run directly off the
    transactions/bills this scanner already extracted, instead of the offline
    Yureka Mail JSON ledger files. Flags (failed payments / missed bills)
    aren't detected here, so reliability is scored as clean (no penalty).
    """
    from datetime import datetime
    from collections import Counter

    purchases = []
    bills = []
    for t in transactions:
        value, currency = _parse_amount_value(t.get('amount'))
        if value is None:
            continue
        date_iso = _parse_date_iso(t.get('date'))
        row = {
            'Brand': t.get('brandName', ''),
            'Value': value,
            'Currency': currency,
            'DateISO': date_iso,
            'Direction': 'Debit',
            'Method': 'Card' if currency == 'USD' else ('UPI' if 'upi' in (t.get('description', '') + t.get('sender', '')).lower() else 'Other'),
        }
        if t.get('type') == 'Transaction':
            purchases.append(row)
        else:
            bills.append({**row, 'DueISO': date_iso, 'Status': 'Paid'})

    inr_debits = [r for r in purchases if r['Currency'] == 'INR']
    spend_total = sum(r['Value'] for r in inr_debits)
    txn_count = len(inr_debits)
    merchants = len({r['Brand'] for r in inr_debits})
    active_months = len({r['DateISO'][:7] for r in inr_debits if r['DateISO']})
    denom = max(1, active_months)
    avg_monthly_spend = spend_total / denom
    avg_monthly_txns = txn_count / denom

    methods = Counter(r['Method'] for r in inr_debits)
    has_card = bool(bills) or methods.get('Card', 0) > 0

    def spend_tier_score(avg):
        if avg > 100000: return 100
        if avg > 90000:  return 90
        if avg > 80000:  return 80
        if avg > 70000:  return 70
        if avg > 60000:  return 60
        if avg > 50000:  return 50
        if avg > 40000:  return 40
        if avg > 30000:  return 30
        if avg >= 20000: return 20
        return max(0, round(20 * avg / 20000))

    total = spend_tier_score(avg_monthly_spend)
    decision = "Approved" if total >= 20 else "Rejected"

    return {
        "score": total,
        "decision": decision,
        "metrics": {
            "spend_total_inr": round(spend_total, 2),
            "avg_monthly_spend_inr": round(avg_monthly_spend, 2),
            "active_months": denom,
            "transactions": txn_count,
            "distinct_merchants": merchants,
            "avg_monthly_txns": round(avg_monthly_txns, 2),
            "has_credit_card": has_card,
            "payment_methods": dict(methods),
        }
    }


def main():
    fallback_data = {}
    if len(sys.argv) > 2:
        try:
            fallback_data = json.loads(sys.argv[2])
        except Exception:
            pass

    gmail_service = None
    people_service = None
    
    try:
        gmail_service = get_local_gmail_service()
        creds = gmail_service._http.credentials
        people_service = build('people', 'v1', credentials=creds)
        sys.stderr.write("Successfully initialized services using local Desktop OAuth.\n")
    except Exception as local_err:
        sys.stderr.write(f"Local Desktop OAuth unavailable: {str(local_err)}\n")

        access_token = sys.argv[1] if len(sys.argv) > 1 else ""
        if access_token and access_token.strip():
            sys.stderr.write("Using browser access token from argv[1]...\n")
            creds = Credentials(token=access_token)
            try:
                people_service = build('people', 'v1', credentials=creds)
                gmail_service = build('gmail', 'v1', credentials=creds)
                sys.stderr.write("Successfully initialized services using browser access token.\n")
            except Exception as e:
                print(json.dumps({"error": f"Failed to initialize with access token: {str(e)}"}))
                return
        else:
            refresh_token = os.environ.get("GOOGLE_REFRESH_TOKEN", "")
            client_id = os.environ.get("GOOGLE_CLIENT_ID", "")
            client_secret = os.environ.get("GOOGLE_CLIENT_SECRET", "")

            if refresh_token and client_id and client_secret:
                sys.stderr.write("Using refresh token from environment variables for background sync...\n")
                try:
                    from google.oauth2.credentials import Credentials as OAuth2Credentials
                    creds = OAuth2Credentials(
                        token=None,
                        refresh_token=refresh_token,
                        client_id=client_id,
                        client_secret=client_secret,
                        token_uri="https://oauth2.googleapis.com/token",
                        scopes=SCOPES
                    )
                    from google.auth.transport.requests import Request as GRequest
                    creds.refresh(GRequest())
                    people_service = build('people', 'v1', credentials=creds)
                    gmail_service = build('gmail', 'v1', credentials=creds)
                    sys.stderr.write("Successfully initialized services using env refresh token.\n")
                except Exception as e:
                    print(json.dumps({"error": f"Env refresh token auth failed: {str(e)}"}))
                    return
            else:
                print(json.dumps({"error": "AUTH_EXPIRED", "details": "No valid credentials found. Set GOOGLE_REFRESH_TOKEN, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET on Render."}))
                return

    try:
        profile = fetch_user_profile(
            people_service,
            fallback_data.get('firstName', ''),
            fallback_data.get('lastName', ''),
            fallback_data.get('dateOfBirth', ''),
            fallback_data.get('gender', ''),
            fallback_data.get('mobileNumber', ''),
            fallback_data.get('location', '')
        )
        
        # Try getting email from gmail service if not found
        if not profile.get('email') and gmail_service:
            try:
                gmail_profile = gmail_service.users().getProfile(userId='me').execute()
                profile['email'] = gmail_profile.get('emailAddress')
            except Exception:
                pass
                
        # If still not found, fall back to fallback_data email
        if not profile.get('email'):
            profile['email'] = fallback_data.get('email', '')

    except Exception as e:
        err_msg = str(e)
        if "refresh" in err_msg.lower() or "invalid_grant" in err_msg.lower() or "credentials" in err_msg.lower() or "401" in err_msg:
            print(json.dumps({"error": "AUTH_EXPIRED", "details": err_msg}))
        else:
            print(json.dumps({"error": f"Failed to fetch profile: {err_msg}"}))
        return

    # Fast path: basic profile fields only (name/phone/dob/age/gender/location),
    # skips the slow Gmail inbox scan + score computation entirely.
    mode = sys.argv[3] if len(sys.argv) > 3 else ""
    if mode == "profile_only":
        print(json.dumps({"profile": profile}))
        return

    try:
        transactions = execute_financial_scanner(gmail_service)
    except Exception as e:
        err_msg = str(e)
        if "refresh" in err_msg.lower() or "invalid_grant" in err_msg.lower() or "credentials" in err_msg.lower() or "401" in err_msg:
            print(json.dumps({"error": "AUTH_EXPIRED", "details": err_msg}))
        else:
            print(json.dumps({"error": f"Failed to scan emails: {err_msg}"}))
        return
    
    try:
        score = compute_yureka_score(transactions)
    except Exception as e:
        sys.stderr.write(f"Score computation failed: {str(e)}\n")
        score = None

    output = {
        "profile": profile,
        "transactions": transactions,
        "score": score
    }
    
    print(json.dumps(output))

if __name__ == "__main__":
    main()
