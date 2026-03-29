import { CreditCard } from './types';

export const featuredCards: CreditCard[] = [
  {
    id: '1',
    name: 'Cashback Credit Card',
    issuer: 'SBI Card',
    image: 'https://images.unsplash.com/photo-1589750670744-dc9633e0f9c7?auto=format&fit=crop&q=80&w=800',
    rewardsRate: '5%',
    annualFee: '₹999 (Waived on ₹2L spend)',
    category: 'Cashback',
    bestFor: 'Online Spends & Swiggy',
    projectedSavings: '₹12,000/yr',
    features: ['5% Unlimited Cashback', '1% Offline Cashback']
  },
  {
    id: '2',
    name: 'Magnus Burgundy',
    issuer: 'Axis Bank',
    image: 'https://images.unsplash.com/photo-1613243555988-441166d4d6fd?auto=format&fit=crop&q=80&w=800',
    rewardsRate: '12%',
    annualFee: '₹30,000 (Elite)',
    category: 'Luxury Travel',
    bestFor: 'High Spenders & Flights',
    projectedSavings: '₹45,000/yr',
    features: ['Unlimited Lounge Access', '24/7 Concierge']
  },
  {
    id: '3',
    name: 'Swiggy HDFC Card',
    issuer: 'HDFC Bank',
    image: 'https://images.unsplash.com/photo-1556742049-02e49f9d2a10?auto=format&fit=crop&q=80&w=800',
    rewardsRate: '10%',
    annualFee: '₹500 (Lifetime Free for some)',
    category: 'Food & Dining',
    bestFor: 'Foodies & Dineout',
    projectedSavings: '₹8,400/yr',
    features: ['10% Swiggy Cashback', '5% Online Shopping']
  },
  {
    id: '4',
    name: 'Amazon Pay ICICI',
    issuer: 'ICICI Bank',
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&q=80&w=800',
    rewardsRate: '5%',
    annualFee: 'Lifetime Free',
    category: 'Shopping',
    bestFor: 'Amazon Prime Members',
    projectedSavings: '₹6,000/yr',
    features: ['5% Amazon Cashback', '2% Partner Spends']
  }
];