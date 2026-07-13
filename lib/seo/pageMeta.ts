// Framework-agnostic SEO registry — imported by both the browser bundle
// (components/SEO.tsx, page components) and the Node production server
// (server.ts) so the server-rendered <head> and the client-side overrides
// always agree on the same title/description/image per route.

export const SITE_URL = 'https://yureka.one';
export const SITE_NAME = 'Yureka One';
export const TWITTER_HANDLE = '@yurekamoney';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`;
export const DEFAULT_DESCRIPTION =
  "Turn everyday spending into 24K digital gold. Yureka's AI concierge orders for you, earns Yureka Goldback rewards up to 16% ROI, and builds your credit profile automatically.";

export interface PageMeta {
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
  keywords?: string[];
  image?: string;
  robots?: string;
}

/** Appends the brand suffix unless the title already references it — kept as a
 *  shared function so the server-injected <title> and the client-side SEO.tsx
 *  mutation always produce byte-identical output (no hydration flicker). */
export function formatTitle(title: string): string {
  return title.includes('Yureka') || title.includes('|') ? title : `${title} | Yureka One`;
}

export const staticPageMeta: Record<string, PageMeta> = {
  '/': {
    title: "Yureka.One | India's AI Wealth OS — Spend, Earn Gold",
    description:
      "Turn everyday spending into 24K digital gold. Yureka's AI concierge orders for you, earns Yureka Goldback rewards up to 16% ROI, and builds your credit profile automatically.",
    ogTitle: "Yureka.One — Spend like always. Build wealth by default.",
    ogDescription:
      "India's first AI-native Wealth OS: an AI that shops for you, pays you in digital gold, and turns your transactions into a credit profile.",
    keywords: [
      'AI wealth app india', 'wealth operating system india', 'spend to earn gold',
      'AI money manager india', 'yureka one', 'goldback rewards', 'digital gold cashback',
      'earn gold on spending', 'agentic commerce app india', 'convert cashback to gold',
    ],
  },
  '/cards': {
    title: 'Credit Card Explorer | Compare 200+ Cards by Real Reward Yield',
    description:
      "Search and filter every major Indian credit card by reward yield, annual fee, lounge access, and lifestyle perks. Yureka ranks cards by systematic reward yield, not bank marketing.",
    keywords: [
      'compare credit cards india', 'best credit card for online spending india',
      'credit card rewards maximizer', 'credit card explorer', 'best rewards credit card india',
    ],
  },
  '/brands': {
    title: 'Brand Explorer | 80+ Partner Brands for Card Rewards | Yureka.One',
    description:
      "Browse Yureka's partner brand network across shopping, travel, food, and lifestyle. See exactly which credit cards maximize your cashback and Goldback at each brand.",
    keywords: [
      'credit card reward partners india', 'brand cashback offers india', 'pay with rewards india',
    ],
  },
  '/blogs': {
    title: 'Learn: Digital Gold, AI Shopping & Credit | Yureka.One',
    description:
      'Guides on earning Yureka Goldback from everyday spending, ordering food with AI, building credit without a credit card, and India\'s agentic commerce shift.',
    keywords: [
      'digital gold cashback guide', 'AI shopping assistant india guide', 'build credit without credit card',
      'SGB alternative 2026', 'agentic commerce india', 'credit card strategy blog india',
      'is cashback in gold better than cash', 'alternative credit score india',
    ],
  },
  '/by-everyone-for-everyone': {
    title: 'Community Intelligence | Crowd-Sourced Credit Card Data | Yureka.One',
    description:
      "Yureka's community-driven credit intelligence engine. Join power shoppers sharing real-world rewards data, hidden hacks, and verified card insights.",
    keywords: ['credit card community india', 'crowd-sourced credit card data india', 'reward hacks india'],
  },
  '/contribute': {
    title: "Contribute | Help Build Yureka's Card Database",
    description:
      "Suggest a missing card, report inaccurate fees or rewards, or request a removal. Help Yureka keep India's most accurate credit card database up to date.",
    keywords: ['submit credit card data india', 'report credit card details', 'yureka contribute'],
  },
  '/privacy-policy': {
    title: 'Privacy Policy | Yureka.One',
    description:
      'How Yureka.One collects, uses, and protects your personal and financial data — covering transaction intelligence, DPDP consent, data retention, and your rights as a user.',
    keywords: ['yureka privacy policy', 'fintech data privacy india', 'DPDP consent digital gold app'],
    robots: 'index, follow',
  },
  '/terms-of-service': {
    title: 'Terms of Service | Yureka.One',
    description:
      'The terms governing your use of Yureka.One, including account eligibility, Yureka Goldback rewards, AI concierge usage, and LSP data-sharing rules.',
    keywords: ['yureka terms of service', 'yureka one terms and conditions'],
  },
  '/security-protocol': {
    title: 'Security Protocol | Yureka.One Infrastructure',
    description:
      "Detailed technical documentation of Yureka's security architecture — AES-256 encryption, Account Aggregator consent framework, and zero-knowledge transaction analysis.",
    keywords: ['yureka security', 'fintech data security india', 'account aggregator security'],
  },
  '/community-guidelines': {
    title: 'Community Guidelines | Yureka.One',
    description:
      "The standards that keep Yureka's community of power shoppers trustworthy — covering accurate data sharing, respectful conduct, and prohibited behavior.",
    keywords: ['yureka community guidelines', 'yureka code of conduct'],
  },
  '/free-tools': {
    title: 'Free Tools | Rewards & Gold Calculator | Yureka.One',
    description:
      'Free calculators from Yureka.One — estimate cashback-to-gold growth, compare credit card reward yields, and plan your spending strategy without signing up.',
    keywords: [
      'cashback to gold calculator', 'rewards calculator india', 'digital gold SIP calculator',
      'credit card reward yield calculator', 'gold SIP from rupee 10',
    ],
  },
  '/manifesto': {
    title: 'The Yureka Manifesto | Spend. Accumulate. Evolve.',
    description:
      "Why Yureka.One exists: a Wealth OS built for India's power shoppers who treat every transaction as an opportunity to earn digital gold and build credit — not just collect dead points.",
    keywords: ['yureka manifesto', 'wealth operating system india', 'power shopper philosophy'],
  },
  '/jobs': {
    title: "Careers | Join Yureka.One — India's Wealth OS",
    description:
      "Help build India's first AI-native Wealth Operating System. Explore open roles at Yureka.One across engineering, AI, design, and growth.",
    keywords: ['yureka careers', 'fintech jobs india 2026', 'wealth OS startup hiring'],
  },
  '/yureka-ai': {
    title: 'Yureka AI: The Shopping Agent That Orders & Earns For You',
    description:
      "An AI concierge on Swiggy MCP that compares prices, picks the best-reward payment, places your food & grocery orders, and pays you in Yureka Goldback.",
    keywords: [
      'AI shopping agent india', 'order Swiggy through AI', 'how to order food using AI india',
      'agentic commerce app india', 'AI shopping assistant india', 'Swiggy MCP agent',
    ],
  },
  '/rewards-calculator': {
    title: 'Rewards Transfer Calculator | Yureka.One',
    description:
      'Optimize reward point transfers with precision. Calculate the real value of converting credit card points to airline miles, hotel loyalty programs, and digital gold.',
    keywords: [
      'reward points transfer calculator india', 'credit card points to gold', 'points to miles calculator india',
    ],
  },
  '/categories': {
    title: 'Card Categories | Browse by Lifestyle | Yureka.One',
    description:
      'Find the perfect credit card for your spending habits. Explore 20+ specialized categories — travel, dining, fuel, cashback, premium, and more — ranked by real reward yield.',
    keywords: [
      'credit card categories india', 'best card by lifestyle india',
      'travel credit cards india', 'cashback credit cards india',
    ],
  },
  '/compare': {
    title: 'Credit Card Comparisons | Side-by-Side Analysis | Yureka.One',
    description:
      'Compare up to 3 credit cards side-by-side. Deep-dive into fees, Goldback rewards, lounge access, and eligibility to find your perfect match.',
    keywords: [
      'compare credit cards india', 'credit card vs credit card india', 'card comparison tool india',
      'apps like CRED alternatives',
    ],
  },
  '/join-waitlist': {
    title: 'Join Yureka — Earn Gold on Every Order | Yureka.One',
    description:
      "Get early access to Yureka.One — India's AI Wealth OS. Earn Yureka Goldback on every transaction, order via AI concierge, and build credit automatically. Invite-gated access.",
    keywords: [
      'yureka waitlist', 'join yureka one', 'early access AI wealth app india',
      'earn gold on spending app india',
    ],
  },
  '/login': {
    title: 'Sign In | Yureka.One',
    description: 'Sign in to your Yureka.One account to track Goldback rewards, manage your AI concierge, and access your personalized dashboard.',
    robots: 'noindex, follow',
  },
  '/waiting': {
    title: 'Waitlist Status | Yureka.One',
    description: 'Check the status of your Yureka.One waitlist application.',
    robots: 'noindex, follow',
  },
  '/admin': {
    title: 'Admin | Yureka.One',
    description: 'Internal administration console.',
    robots: 'noindex, nofollow',
  },

  // --- Future pages (serve correct meta even before page components are built) ---
  '/goldback': {
    title: 'Yureka Goldback: Cashback That Becomes 24K Digital Gold',
    description:
      "Why settle for expiring points? Yureka converts rewards on every order into yield-generating 24K digital gold — up to 16% effective ROI. Unified, liquid, automatic.",
    ogTitle: 'Yureka Goldback — Cashback That Becomes Gold',
    ogDescription:
      'Every transaction earns Yureka Goldback: 24K digital gold that appreciates instead of expiring. Up to 16% effective returns on your everyday spending.',
    keywords: [
      'convert cashback to gold india', 'app that converts cashback to digital gold',
      'earn gold on spending india', 'gold rewards on UPI india', 'which app gives gold instead of cashback',
      'is cashback in gold better than cash cashback', 'best app to save gold automatically',
      'digital gold SIP from rupee 10', '16% ROI gold rewards', 'yureka goldback',
      'gold cashback india', 'pay with rewards india',
    ],
  },
  '/credit': {
    title: 'Build Credit From Your Spending | Yureka.One',
    description:
      "No credit history? Your UPI and shopping transactions can build it. Yureka creates RBI-compliant alternative credit profiles from consented data for thin-file users.",
    keywords: [
      'build credit from spending india', 'build credit without credit card india',
      'alternative credit score thin file', 'can UPI transactions improve credit score',
      'how to get credit score without credit card india', 'bina credit card ke CIBIL score',
      'rent payment to build credit india', 'LSP lending service provider india',
    ],
  },
  '/business': {
    title: 'Partner With Yureka | Smart Checkout, Ads & Credit Data',
    description:
      "Cut RTO and COD failures with smart checkout, run intent-based campaigns via Yureka AI, and access consent-first alternative credit signals for lending decisions.",
    keywords: [
      'smart checkout india reduce RTO', 'COD failure reduction', 'intent-based ads fintech india',
      'alternative credit data for lenders india', 'fintech B2B partnership india',
    ],
  },
  '/pricing': {
    title: 'Yureka Premium — ₹99/mo, 100% Reimbursed in Gold',
    description:
      "Yureka Premium costs ₹99/month or ₹1,199/year — and every rupee comes back to you as 24K digital gold. Membership that pays for itself, literally.",
    keywords: [
      'yureka premium pricing', 'subscription reimbursed as gold', 'fintech subscription india',
      'wealth app subscription india',
    ],
  },
};

/** Category metadata for /categories/:slug */
export const categoryMeta: Record<string, { name: string; description: string }> = {
  travel: { name: 'Travel', description: 'Compare the best travel credit cards in India for flight miles, hotel stays, airport lounge access, and free room upgrades. Ranked by real reward yield.' },
  shopping: { name: 'Shopping', description: 'Compare the best shopping credit cards in India for online cashback, retail discounts, and milestone vouchers. Maximize Yureka Goldback on every purchase.' },
  cashback: { name: 'Cashback', description: 'Compare the best cashback credit cards in India for direct statement credit and accelerated online earnings. Convert cashback into 24K digital gold with Yureka.' },
  fuel: { name: 'Fuel', description: 'Compare the best fuel credit cards in India for surcharge waivers, accelerated fuel points, and vehicle maintenance offers.' },
  'lifetime-free': { name: 'Lifetime Free', description: 'Compare the best lifetime-free credit cards in India with zero joining and annual fees, forever. Earn Yureka Goldback with no ongoing cost.' },
  'entry-level': { name: 'Entry Level', description: 'Compare the best entry-level credit cards in India — perfect first cards with easy approval. Start building credit and earning digital gold rewards.' },
  dining: { name: 'Dining', description: 'Compare the best dining credit cards in India for gourmet rewards and restaurant discounts. Order via Yureka AI and earn Goldback automatically.' },
  'co-branded': { name: 'Co-Branded', description: 'Compare the best co-branded credit cards in India for partner-specific benefits and accelerated rewards.' },
  grocery: { name: 'Grocery', description: 'Compare the best grocery credit cards in India. Order groceries via Swiggy Instamart through Yureka AI and earn 24K digital gold automatically.' },
  premium: { name: 'Premium', description: 'Compare the best premium credit cards in India with concierge service, elite hotel memberships, and the highest reward multipliers. Convert perks to Goldback.' },
  hotel: { name: 'Hotel', description: 'Compare the best hotel credit cards in India for stays, upgrades, and luxury hospitality perks.' },
  business: { name: 'Business', description: 'Compare the best business credit cards in India for corporate spends and rewards.' },
  'lounge-access': { name: 'Lounge Access', description: 'Compare the best credit cards in India for complimentary airport lounge access.' },
  student: { name: 'Student', description: 'Compare the best student credit cards in India to start your credit journey and build an alternative credit profile from day one.' },
  entertainment: { name: 'Entertainment', description: 'Compare the best entertainment credit cards in India for events, concerts, and streaming perks.' },
  'utility-bill': { name: 'Utility Bill', description: 'Compare the best credit cards in India for rewards on electricity, water, and gas bill payments.' },
  movie: { name: 'Movie', description: 'Compare the best credit cards in India for cinema and streaming perks.' },
  airlines: { name: 'Airlines', description: 'Compare the best airline credit cards in India for flight miles and aviation rewards.' },
  health: { name: 'Health', description: 'Compare the best credit cards in India for wellness and medical spend rewards.' },
  rent: { name: 'Rent', description: 'Compare the best credit cards in India for earning rewards on monthly rent payments — and using rent data to build your alternative credit profile.' },
  insurance: { name: 'Insurance', description: 'Compare the best credit cards in India for insurance premium payments and protection benefits.' },
  upi: { name: 'UPI', description: 'Compare the best credit cards in India that support rewards on UPI transactions. UPI data can also build your alternative credit score with Yureka.' },
  education: { name: 'Education', description: 'Compare the best credit cards in India for education fees and academic spends.' },
};

export function getCategoryPageMeta(slug: string): PageMeta {
  const cat = categoryMeta[slug];
  const name = cat?.name ?? slug.replace(/-/g, ' ');
  return {
    title: `Best ${name} Credit Cards in India ${new Date().getFullYear()} | Yureka.One`,
    description: cat?.description ?? `Compare the best ${name} credit cards in India. Maximize your ${slug} rewards and earn Yureka Goldback with our expert analysis.`,
    keywords: [
      `${name.toLowerCase()} credit cards india`, `best ${name.toLowerCase()} credit card 2026`,
      `earn gold on ${name.toLowerCase()} spending`, `yureka ${name.toLowerCase()}`,
    ],
  };
}
