import { supabase } from '../supabase';

// Scopes required for the tool
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
  minimum_due: number;
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

export interface MailOwnedCard {
  bank_name: string;
  card_name: string;
  last_four: string;
  source_mail_id: string;
}

export interface MailCardApplication {
  bank_name: string;
  card_name: string;
  status: 'successful' | 'rejected' | 'pending';
  application_id: string;
  application_date: string;
  source_mail_id: string;
}

class GmailService {
  private accessToken: string | null = null;

  setToken(token: string) {
    this.accessToken = token;
  }

  private async fetchWithTimeout(url: string, options: any = {}, timeout = 10000) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      clearTimeout(id);
      return response;
    } catch (e) {
      clearTimeout(id);
      throw e;
    }
  }

  async fetchMessages(query: string, maxResults = 50) {
    if (!this.accessToken) throw new Error('Not authenticated with Google');

    const url = `https://gmail.googleapis.com/gmail/v1/users/me/messages?q=${encodeURIComponent(query)}&maxResults=${maxResults}`;
    const response = await this.fetchWithTimeout(url, {
      headers: { Authorization: `Bearer ${this.accessToken}` }
    });

    if (!response.ok) {
      if (response.status === 401) throw new Error('OAUTH_EXPIRED');
      throw new Error('Failed to fetch messages');
    }
    const data = await response.json();
    return data.messages || [];
  }

  async getMessageDetails(messageId: string) {
    if (!this.accessToken) throw new Error('Not authenticated with Google');

    const url = `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}`;
    const response = await this.fetchWithTimeout(url, {
      headers: { Authorization: `Bearer ${this.accessToken}` }
    });

    if (!response.ok) throw new Error('Failed to fetch message details');
    return await response.json();
  }

  // --- PARSING LOGIC ---

  parseTransaction(message: any): MailTransaction | null {
    if (!message || !message.payload) return null;
    const snippet = message.snippet || '';
    const subject = this.getHeader(message, 'Subject');
    const from = this.getHeader(message, 'From');
    const date = this.getHeader(message, 'Date');
    const content = this.getFullContent(message);

    // Ultra-Inclusive Amount Extraction
    const amountRegex = /(?:Rs\.?|INR|₹|Debited|Amount|Total|Paid|Spent|Withdrawal|Charged|Purchase|Cost)\s*(?::|for|of)?\s*(?:Rs\.?|INR|₹)?\s*([\d,]+\.?\d*)/i;
    const amountMatch = content.match(amountRegex) || snippet.match(amountRegex);
    if (!amountMatch) return null;

    const amount = parseFloat(amountMatch[1].replace(/,/g, ''));
    if (isNaN(amount) || amount === 0) return null;

    // Platform/Merchant Detection
    let merchant = this.extractPlatform(from, subject, content);
    
    if (merchant === 'Unknown') {
      const merchantKeywords = ['at', 'to', 'from', 'paid to', 'spent on', 'info:', 'merchant:', 'billed by', 'purchase at'];
      for (const kw of merchantKeywords) {
        const mRegex = new RegExp(`${kw}\\s+([^\\s.,\r\n]+(?:\\s+[^\\s.,\r\n]+){0,2})`, 'i');
        const mMatch = content.match(mRegex);
        if (mMatch && !/account|card|bank|statement|authorized/i.test(mMatch[1])) {
          merchant = mMatch[1].trim();
          break;
        }
      }
    }

    let category = 'Uncategorized';
    const normalizedText = (merchant + subject + content).toLowerCase();
    if (/amazon|flipkart|myntra|ajio|nykaa|shopping|meesho|tata cliq/i.test(normalizedText)) category = 'Shopping';
    else if (/zomato|swiggy|food|restaurant|dine|eat|rebel|magicpin/i.test(normalizedText)) category = 'Dining';
    else if (/uber|ola|rapido|fuel|petrol|shell|hpcl|bpcl|irctc|redbus|indigo/i.test(normalizedText)) category = 'Transport';
    else if (/netflix|hotstar|spotify|prime|youtube|apple.com|google play|pvr|inox|bookmyshow/i.test(normalizedText)) category = 'Entertainment';
    else if (/jio|airtel|vi |act |utility|bill|electricity|tata sky|dth|bescom|bsnl/i.test(normalizedText)) category = 'Bills';

    return {
      amount,
      currency: 'INR',
      merchant,
      date: new Date(date || Date.now()).toISOString().split('T')[0],
      category,
      source_mail_id: message.id,
      mail_subject: subject,
      mail_snippet: snippet
    };
  }

  parseBill(message: any): MailBill | null {
    if (!message || !message.payload) return null;
    const content = this.getFullContent(message);
    const subject = this.getHeader(message, 'Subject');
    
    if (!/bill|statement|due|outstanding|outstanding bill|amount due|minimum due/i.test(subject + content)) return null;

    const banks = ['HDFC', 'ICICI', 'SBI', 'AXIS', 'AMEX', 'ONECARD', 'HSBC', 'KOTAK', 'CITI', 'INDUSIND', 'IDFC', 'RBL', 'YES BANK', 'SCB', 'FEDERAL', 'DBS'];
    const bankName = banks.find(b => new RegExp(b, 'i').test(subject + content)) || 'Financial Institution';

    const totalAmountRegex = /(?:Total Amount Due|Outstanding|Amount Due|Total Payable|Current Outstanding|Total Bill)\s*(?::)?\s*(?:Rs\.?|INR|₹)?\s*([\d,]+\.?\d*)/i;
    const minAmountRegex = /(?:Minimum Amount Due|Min Due|Minimum Payable|Min Amount)\s*(?::)?\s*(?:Rs\.?|INR|₹)?\s*([\d,]+\.?\d*)/i;
    
    const totalMatch = content.match(totalAmountRegex);
    const minMatch = content.match(minAmountRegex);
    
    if (!totalMatch) return null;

    const dateRegex = /(?:Due Date|Payment Date|Pay By)\s*(?:is|on|by|:)?\s*(\d{1,2}[-/ ](?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|[\d]{1,2})[-/ ]\d{2,4})/i;
    const dateMatch = content.match(dateRegex);

    return {
      bank_name: bankName,
      amount_due: parseFloat(totalMatch[1].replace(/,/g, '')),
      minimum_due: minMatch ? parseFloat(minMatch[1].replace(/,/g, '')) : 0,
      due_date: dateMatch ? new Date(dateMatch[1]).toISOString().split('T')[0] : '',
      statement_date: new Date(this.getHeader(message, 'Date') || Date.now()).toISOString().split('T')[0],
      source_mail_id: message.id
    };
  }

  parseShoppingOrder(message: any): MailShoppingOrder | null {
    if (!message || !message.payload) return null;
    const content = this.getFullContent(message);
    const subject = this.getHeader(message, 'Subject');
    
    if (!/order|delivery|shipment|tracking|invoice|receipt|amazon|flipkart|myntra|ajio|meesho|order confirmation/i.test(subject + content)) return null;

    const merchant = this.extractPlatform(this.getHeader(message, 'From'), subject, content);

    const orderIdRegex = /(?:Order ID|Order #|Reference|Transaction ID|Invoice #|Receipt ID|Tracking #)\s*:?\s*([A-Z0-9-]+)/i;
    const orderIdMatch = content.match(orderIdRegex);

    const priceRegex = /(?:Total|Amount Paid|Order Total|Grand Total|Payable|Invoice Amount)\s*:?\s*(?:Rs\.?|INR|₹)?\s*([\d,]+\.?\d*)/i;
    const priceMatch = content.match(priceRegex);

    return {
      item_name: subject.replace(/Order confirmation:|Your order has shipped:|Thank you for your order|Order details:|Invoice for your order/gi, '').trim(),
      merchant,
      price: priceMatch ? parseFloat(priceMatch[1].replace(/,/g, '')) : 0,
      order_date: new Date(this.getHeader(message, 'Date') || Date.now()).toISOString().split('T')[0],
      order_id: orderIdMatch ? orderIdMatch[1] : 'N/A',
      source_mail_id: message.id
    };
  }

  parseOwnedCard(message: any): MailOwnedCard | null {
    if (!message || !message.payload) return null;
    const content = this.getFullContent(message);
    const subject = this.getHeader(message, 'Subject');
    
    if (!/welcome to|statement|credit card|your card|limit|card approved/i.test(subject + content)) return null;

    const banks = ['HDFC', 'ICICI', 'SBI', 'AXIS', 'AMEX', 'ONECARD', 'HSBC', 'KOTAK', 'CITI', 'INDUSIND', 'IDFC', 'RBL', 'YES BANK', 'FEDERAL'];
    const bankName = banks.find(b => new RegExp(b, 'i').test(subject + content));
    if (!bankName) return null;

    const cardNames = ['Millennia', 'Regalia', 'Infinia', 'Amazon Pay', 'Coral', 'Rubyx', 'Sapphiro', 'Elite', 'Prime', 'ACE', 'Flipkart', 'Airtel', 'Platinum', 'Vistara', 'InterMiles'];
    const cardName = cardNames.find(c => new RegExp(c, 'i').test(content + subject)) || 'Credit Card';

    const lastFourMatch = content.match(/(?:card ending in|card|x{4,}|[*]{4,})\s*(\d{4})/i);

    return {
      bank_name: bankName,
      card_name: cardName,
      last_four: lastFourMatch ? lastFourMatch[1] : 'XXXX',
      source_mail_id: message.id
    };
  }

  parseCardApplication(message: any): MailCardApplication | null {
    if (!message || !message.payload) return null;
    const content = this.getFullContent(message);
    const subject = this.getHeader(message, 'Subject');
    
    if (!/application|apply|request|status|rejection|accepted|rejected|declined/i.test(subject + content)) return null;

    const banks = ['HDFC', 'ICICI', 'SBI', 'AXIS', 'AMEX', 'ONECARD', 'HSBC', 'KOTAK', 'CITI', 'INDUSIND', 'IDFC', 'RBL', 'FEDERAL'];
    const bankName = banks.find(b => new RegExp(b, 'i').test(subject + content)) || 'Financial Institution';

    let status: 'successful' | 'rejected' | 'pending' = 'pending';
    const text = (subject + content).toLowerCase();
    
    if (/approved|congratulations|success|ready to use|welcome|accepted/i.test(text)) status = 'successful';
    else if (/regret|rejected|declined|not able to|unable to|rejection/i.test(text)) status = 'rejected';
    else if (/process|pending|received|verification|review|submitted/i.test(text)) status = 'pending';

    const appIdMatch = content.match(/(?:Application|Ref|Reference)\s*(?:ID|Number|#)?\s*:?\s*([A-Z0-9-]+)/i);

    return {
      bank_name: bankName,
      card_name: 'Credit Card',
      status,
      application_id: appIdMatch ? appIdMatch[1] : 'N/A',
      application_date: new Date(this.getHeader(message, 'Date') || Date.now()).toISOString().split('T')[0],
      source_mail_id: message.id
    };
  }

  // --- UTILS ---

  private extractPlatform(from: string, subject: string, content: string): string {
    const text = (from + subject + content).toLowerCase();
    const platforms = [
      'Amazon', 'Flipkart', 'Myntra', 'Ajio', 'Nykaa', 'Meesho', 'Apple', 'Blinkit', 'Zepto', 
      'Zomato', 'Swiggy', 'Uber', 'Ola', 'Netflix', 'Spotify', 'Airtel', 'Jio', 'BigBasket', 'Uber'
    ];
    
    const detected = platforms.find(p => new RegExp(p, 'i').test(text));
    if (detected) return detected;

    const fromMatch = from.match(/@([^.]+)\./);
    if (fromMatch) {
      const domain = fromMatch[1];
      if (domain && domain.length > 2) return domain.charAt(0).toUpperCase() + domain.slice(1);
    }
    
    return 'Unknown';
  }

  private getHeader(message: any, name: string) {
    if (!message || !message.payload || !message.payload.headers) return '';
    return message.payload.headers.find((h: any) => h.name === name)?.value || '';
  }

  private getFullContent(message: any) {
    if (!message || !message.payload) return '';
    let parts = [message.payload];
    let content = '';

    while (parts.length > 0) {
      const part = parts.shift();
      if (!part) continue;
      if (part.parts) parts.push(...part.parts);
      if (part.body && part.body.data) {
        content += this.decodeBase64(part.body.data);
      }
    }
    return content;
  }

  private decodeBase64(data: string) {
    if (!data) return '';
    const base64 = data.replace(/-/g, '+').replace(/_/g, '/');
    const pad = base64.length % 4;
    const padded = pad ? base64 + '='.repeat(4 - pad) : base64;
    try {
      const binString = atob(padded);
      const bytes = Uint8Array.from(binString, (m) => m.codePointAt(0)!);
      return new TextDecoder().decode(bytes);
    } catch (e) {
      try {
        return atob(padded);
      } catch (err) {
        return '';
      }
    }
  }
}

export const gmailService = new GmailService();
