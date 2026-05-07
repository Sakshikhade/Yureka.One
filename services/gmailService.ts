import { supabase } from '../supabase';

// Scopes required for the tool
// 1. gmail.readonly: To scan and pull transaction details
// 2. userinfo.email: To verify the linked account
export const GMAIL_SCOPES = [
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/userinfo.email'
];

export interface MailTransaction {
  amount: number;
  currency: string;
  merchant: string;
  date: string;
  category: string;
  source_mail_id: string;
  mail_subject: string;
  mail_snippet: string;
}

export interface MailBill {
  bank_name: string;
  amount_due: number;
  due_date: string;
  statement_date: string;
  source_mail_id: string;
}

export interface MailShoppingOrder {
  item_name: string;
  merchant: string;
  price: number;
  order_date: string;
  order_id: string;
  source_mail_id: string;
}

class GmailService {
  private accessToken: string | null = null;

  setToken(token: string) {
    this.accessToken = token;
  }

  async fetchMessages(query: string, maxResults = 50) {
    if (!this.accessToken) throw new Error('Not authenticated with Google');

    const url = `https://gmail.googleapis.com/gmail/v1/users/me/messages?q=${encodeURIComponent(query)}&maxResults=${maxResults}`;
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${this.accessToken}` }
    });

    if (!response.ok) throw new Error('Failed to fetch messages');
    const data = await response.json();
    return data.messages || [];
  }

  async getMessageDetails(messageId: string) {
    if (!this.accessToken) throw new Error('Not authenticated with Google');

    const url = `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}`;
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${this.accessToken}` }
    });

    if (!response.ok) throw new Error('Failed to fetch message details');
    return await response.json();
  }

  // --- PARSING LOGIC ---

  parseTransaction(message: any): MailTransaction | null {
    const snippet = message.snippet || '';
    const subject = this.getHeader(message, 'Subject');
    const date = this.getHeader(message, 'Date');
    const content = this.getFullContent(message);

    // 1. Amount Extraction (Currency + Number)
    // Supports formats like Rs. 500, INR 500, ₹500, 500.00, Debited for 500
    const amountRegex = /(?:Rs\.?|INR|₹|Debited for|Amount:?)\s*([\d,]+\.?\d*)/i;
    const amountMatch = content.match(amountRegex) || snippet.match(amountRegex);
    if (!amountMatch) return null;

    const amount = parseFloat(amountMatch[1].replace(/,/g, ''));

    // 2. Merchant Extraction
    // Logic: Look for "at [Merchant]", "to [Merchant]", "from [Merchant]"
    const merchantKeywords = ['at', 'to', 'from', 'paid to', 'spent on', 'info:'];
    let merchant = 'Unknown Merchant';
    
    for (const kw of merchantKeywords) {
      const mRegex = new RegExp(`${kw}\\s+([^\\s.,\r\n]+(?:\\s+[^\\s.,\r\n]+){0,2})`, 'i');
      const mMatch = content.match(mRegex);
      if (mMatch && !mMatch[1].toLowerCase().includes('account') && !mMatch[1].toLowerCase().includes('card')) {
        merchant = mMatch[1].trim();
        break;
      }
    }

    // 3. Category Heuristics
    let category = 'Uncategorized';
    const normalizedMerchant = (merchant + subject).toLowerCase();
    if (/amazon|flipkart|myntra|ajio|nykaa|shopping/i.test(normalizedMerchant)) category = 'Shopping';
    else if (/zomato|swiggy|food|restaurant|dine|eat/i.test(normalizedMerchant)) category = 'Dining';
    else if (/uber|ola|rapido|fuel|petrol|shell|hpcl|bpcl/i.test(normalizedMerchant)) category = 'Transport';
    else if (/netflix|hotstar|spotify|prime|youtube|apple.com|google play/i.test(normalizedMerchant)) category = 'Entertainment';
    else if (/jio|airtel|vi |act |utility|bill|electricity/i.test(normalizedMerchant)) category = 'Bills';

    return {
      amount,
      currency: 'INR',
      merchant,
      date: new Date(date).toISOString().split('T')[0],
      category,
      source_mail_id: message.id,
      mail_subject: subject,
      mail_snippet: snippet
    };
  }

  parseBill(message: any): MailBill | null {
    const content = this.getFullContent(message);
    const subject = this.getHeader(message, 'Subject');
    
    // Broad check for credit card statements
    if (!/bill|statement|due|outstanding|card/i.test(subject + content)) return null;

    // Bank Extraction
    const banks = ['HDFC', 'ICICI', 'SBI', 'AXIS', 'AMEX', 'ONECARD', 'HSBC', 'KOTAK', 'CITI', 'INDUSIND', 'IDFC', 'RBL'];
    const bankName = banks.find(b => new RegExp(b, 'i').test(subject + content)) || 'Other Bank';

    // Amount Due (Total and Minimum)
    const totalAmountRegex = /(?:Total Amount Due|Outstanding|Amount Due|Total Payable)\s*(?:Rs\.?|INR|₹)?\s*([\d,]+\.?\d*)/i;
    const minAmountRegex = /(?:Minimum Amount Due|Min Due|Minimum Payable)\s*(?:Rs\.?|INR|₹)?\s*([\d,]+\.?\d*)/i;
    
    const totalMatch = content.match(totalAmountRegex);
    const minMatch = content.match(minAmountRegex);
    
    if (!totalMatch) return null;

    // Due Date - Handling various formats (DD-MMM-YYYY, DD/MM/YY, etc.)
    const dateRegex = /(?:Due Date|Payment Date)\s*(?:is|on|by)?\s*(\d{1,2}[-/ ](?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|[\d]{1,2})[-/ ]\d{2,4})/i;
    const dateMatch = content.match(dateRegex);

    return {
      bank_name: bankName,
      amount_due: parseFloat(totalMatch[1].replace(/,/g, '')),
      minimum_due: minMatch ? parseFloat(minMatch[1].replace(/,/g, '')) : 0,
      due_date: dateMatch ? new Date(dateMatch[1]).toISOString().split('T')[0] : '',
      statement_date: new Date(this.getHeader(message, 'Date')).toISOString().split('T')[0],
      source_mail_id: message.id
    };
  }

  parseShoppingOrder(message: any): MailShoppingOrder | null {
    const content = this.getFullContent(message);
    const subject = this.getHeader(message, 'Subject');
    
    if (!/order|delivery|shipment|amazon|flipkart|myntra/i.test(subject + content)) return null;

    // Merchant
    const merchants = ['Amazon', 'Flipkart', 'Myntra', 'Ajio', 'Nykaa'];
    const merchant = merchants.find(m => new RegExp(m, 'i').test(subject + content)) || 'Other Merchant';

    // Order ID
    const orderIdRegex = /(?:Order ID|Order #|Reference)\s*:?\s*([A-Z0-9-]+)/i;
    const orderIdMatch = content.match(orderIdRegex);

    // Price
    const priceRegex = /(?:Total|Amount Paid|Order Total)\s*:?\s*(?:Rs\.?|INR|₹)?\s*([\d,]+\.?\d*)/i;
    const priceMatch = content.match(priceRegex);

    return {
      item_name: subject.replace(/Order confirmation:|Your order has shipped:|Thank you for your order/gi, '').trim(),
      merchant,
      price: priceMatch ? parseFloat(priceMatch[1].replace(/,/g, '')) : 0,
      order_date: new Date(this.getHeader(message, 'Date')).toISOString().split('T')[0],
      order_id: orderIdMatch ? orderIdMatch[1] : 'N/A',
      source_mail_id: message.id
    };
  }

  // --- UTILS ---

  private getHeader(message: any, name: string) {
    return message.payload.headers.find((h: any) => h.name === name)?.value || '';
  }

  private getFullContent(message: any) {
    let parts = [message.payload];
    let content = '';

    while (parts.length > 0) {
      const part = parts.shift();
      if (part.parts) parts.push(...part.parts);
      if (part.body && part.body.data) {
        content += atob(part.body.data.replace(/-/g, '+').replace(/_/g, '/'));
      }
    }
    return content;
  }
}

export const gmailService = new GmailService();
