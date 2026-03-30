export interface Blog {
  id?: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  image: string;
  date?: string;
  featured?: boolean;
  slug?: string;
  created_at?: string;
  updated_at?: string;
  readTime?: string;
  status?: 'draft' | 'published';
}

export interface Card {
  id?: string;
  name: string;
  bank: string;
  issuer?: string;
  type: string;
  image: string;
  rating: number;
  benefits: string[];
  annualFee: string;
  joiningFee: string;
  bestFor: string;
  color: string;
  rewardsRate?: string;
  category?: string;
  projectedSavings?: string;
  features?: string[];
  created_at?: string;
  updated_at?: string;
  status?: 'draft' | 'published';
}

export interface WaitlistEntry {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  role: 'user' | 'partner';
  category?: string;
  company?: string;
  joined_at?: string;
  created_at?: string;
}

export interface OSFeature {
  id: string;
  name: string;
  issuer: string;
  image: string;
  rewardsRate: string;
  annualFee: string;
  category: string;
  bestFor: string;
  projectedSavings?: string;
  features?: string[];
  status?: 'available' | 'coming_soon';
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface Testimonial {
  id: string;
  name: string;
  handle: string;
  content: string;
  avatar: string;
  image?: string;
  date: string;
  likes: number;
}

export interface NewsletterEntry {
  id?: string;
  email: string;
  status: 'active' | 'unsubscribed';
  subscribed_at?: string;
  created_at?: string;
}