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
  read_time?: string;
  status?: 'draft' | 'published';
  scheduled_at?: string;
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
  annual_fee: string;
  joining_fee: string;
  best_for: string;
  color: string;
  rewards_rate?: string;
  category?: string;
  projected_savings?: string;
  intro_offer?: string;
  tags?: string[];
  elite_rating?: number;
  benefit_items?: { heading: string; subheading: string }[];
  verdict?: string;
  slug?: string;
  categories?: string[];
  apply_link?: string;
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
  status: 'pending' | 'accepted' | 'rejected' | 'on_hold';
  joined_at?: string;
  created_at?: string;
}

export interface OSFeature {
  id: string;
  name: string;
  issuer: string;
  image: string;
  rewards_rate: string;
  annual_fee: string;
  category: string;
  best_for: string;
  projected_savings?: string;
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

export interface Review {
  id?: string;
  author: string;
  role: string;
  company: string;
  company_logo?: string;
  image: string;
  quote: string;
  rotation?: number;
  status?: 'draft' | 'published';
  created_at?: string;
  updated_at?: string;
}

export interface NewsletterEntry {
  id?: string;
  email: string;
  status: 'active' | 'unsubscribed';
  subscribed_at?: string;
  created_at?: string;
}