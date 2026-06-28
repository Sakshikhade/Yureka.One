// Framework-agnostic SEO registry — imported by both the browser bundle
// (components/SEO.tsx, page components) and the Node production server
// (server.ts) so the server-rendered <head> and the client-side overrides
// always agree on the same title/description/image per route.

export const SITE_URL = 'https://yureka.money';
export const SITE_NAME = 'Yureka Money';
export const TWITTER_HANDLE = '@yurekamoney';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`;
export const DEFAULT_DESCRIPTION =
  "Yureka Money is India's AI-native wealth operating system — compare 200+ credit cards, earn assured Goldback on every spend, and grow your rewards in a high-yield Vault.";

export interface PageMeta {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  robots?: string;
}

/** Appends the brand suffix unless the title already references it — kept as a
 *  shared function so the server-injected <title> and the client-side SEO.tsx
 *  mutation always produce byte-identical output (no hydration flicker). */
export function formatTitle(title: string): string {
  return title.includes('Yureka') || title.includes('|') ? title : `${title} | Yureka Money`;
}

export const staticPageMeta: Record<string, PageMeta> = {
  '/': {
    title: formatTitle("Yureka Money | India's AI-Native Wealth Operating System"),
    description:
      'Yureka Money turns everyday spending into a wealth-building engine. Compare 200+ Indian credit cards, earn assured Goldback on every purchase, and grow your rewards at up to 16% annual yield in the Yureka Vault.',
    keywords: ['credit card comparison india', 'best credit cards india', 'goldback rewards', 'credit card rewards optimizer', 'AI credit card advisor', 'yureka money', 'wealth operating system'],
  },
  '/cards': {
    title: formatTitle('Card Explorer | Compare 200+ Credit Cards in India'),
    description:
      "Search and filter every major credit card in India by reward yield, annual fee, lounge access, and lifestyle perks. Yureka's AI engine ranks each card by real systematic reward yield, not bank marketing.",
    keywords: ['compare credit cards india', 'credit card explorer', 'best rewards credit card', 'credit card fees comparison'],
  },
  '/brands': {
    title: formatTitle('Brand Explorer | 80+ Partner Brands for Card Rewards'),
    description:
      "Browse Yureka's partner brand network across shopping, travel, food, and lifestyle. See exactly which credit cards and offers maximize your cashback and reward points at each brand.",
    keywords: ['credit card reward partners', 'brand cashback offers india', 'card reward partner brands'],
  },
  '/blogs': {
    title: formatTitle('Pulse | The Yureka Journal — Credit Card Strategy & Rewards Insights'),
    description:
      'In-depth analysis on credit card arbitrage, reward point devaluation, and high-performance spending strategies in the Indian credit landscape — written for serious power shoppers.',
    keywords: ['credit card strategy blog', 'reward points india', 'credit card arbitrage', 'personal finance india'],
  },
  '/by-everyone-for-everyone': {
    title: formatTitle('Community Intelligence | Crowd-Sourced Credit Card Data'),
    description:
      "Yureka's community-driven credit intelligence engine. Join thousands of power shoppers sharing real-world rewards data, hidden hacks, and verified card insights.",
    keywords: ['credit card community india', 'crowd-sourced credit card data', 'reward hacks india'],
  },
  '/contribute': {
    title: formatTitle("Contribute | Help Build Yureka's Card Database"),
    description:
      "Suggest a missing card, report inaccurate fees or rewards, or request a card removal. Help Yureka keep India's most accurate credit card database up to date.",
    keywords: ['submit credit card data', 'report credit card details', 'yureka contribute'],
  },
  '/privacy-policy': {
    title: formatTitle('Privacy Policy | Yureka Money'),
    description:
      'How Yureka Money collects, uses, and protects your personal and financial data — covering Gmail transaction intelligence, data retention, and your rights as a user.',
    keywords: ['yureka privacy policy', 'data privacy credit card app', 'gmail intelligence privacy'],
    robots: 'index, follow',
  },
  '/terms-of-service': {
    title: formatTitle('Terms of Service | Yureka Money'),
    description:
      'The terms and conditions governing your use of Yureka Money, including account eligibility, the Vault, Goldback rewards, and platform usage rules.',
    keywords: ['yureka terms of service', 'yureka money terms and conditions'],
  },
  '/security-protocol': {
    title: formatTitle('Security Protocol | Yureka Infrastructure'),
    description:
      "Detailed technical documentation of Yureka's security architecture, cryptographic standards, and data privacy protocols — including AES-256 encryption and zero-knowledge design.",
    keywords: ['yureka security', 'fintech data security india', 'credit card app encryption'],
  },
  '/community-guidelines': {
    title: formatTitle('Community Guidelines | Yureka Money'),
    description:
      "The standards that keep Yureka's community of power shoppers trustworthy — covering accurate data sharing, respectful conduct, and prohibited behavior.",
    keywords: ['yureka community guidelines', 'yureka code of conduct'],
  },
  '/free-tools': {
    title: formatTitle('Free Tools | Yureka OS'),
    description:
      'Free calculators and utilities from Yureka Money — estimate rewards, compare transfer ratios, and plan your credit card strategy without signing up.',
    keywords: ['free credit card tools', 'rewards calculator india', 'yureka os'],
  },
  '/manifesto': {
    title: formatTitle('The Yureka Manifesto | Spend. Accumulate. Evolve.'),
    description:
      "Why Yureka Money exists: a financial operating system built for power shoppers who treat every transaction as an opportunity to build wealth, not just earn points.",
    keywords: ['yureka manifesto', 'financial operating system', 'power shopper philosophy'],
  },
  '/jobs': {
    title: formatTitle('Careers | Join the Yureka Money Team'),
    description:
      "Help build India's AI-native wealth operating system. Explore open roles at Yureka Money across engineering, design, and growth.",
    keywords: ['yureka careers', 'fintech jobs india', 'yureka money hiring'],
  },
  '/yureka-ai': {
    title: formatTitle('Yureka AI | Your Personal Credit Portfolio Co-Pilot'),
    description:
      'From picking the perfect financial instrument to maximizing every systematic reward point — Yureka AI is your research assistant for elite credit decisions.',
    keywords: ['credit card AI assistant', 'yureka ai', 'credit card chatbot india'],
  },
  '/rewards-calculator': {
    title: formatTitle('Rewards Transfer Calculator | Yureka Money'),
    description:
      'Optimize your reward point transfers with precision. Calculate the real value of converting credit card points to airline miles and hotel loyalty programs.',
    keywords: ['reward points transfer calculator', 'credit card points value calculator india'],
  },
  '/categories': {
    title: formatTitle('Card Categories | Browse by Lifestyle'),
    description:
      'Find the perfect credit card tailored to your spending habits. Explore 20+ specialized categories — travel, dining, fuel, shopping, premium, and more.',
    keywords: ['credit card categories india', 'best card by category', 'travel credit cards', 'cashback credit cards'],
  },
  '/compare': {
    title: formatTitle('Credit Card Comparisons | Side-by-Side Analysis'),
    description:
      'Compare up to 3 credit cards side-by-side. Deep-dive into fees, rewards, and eligibility to find your perfect match.',
    keywords: ['compare credit cards', 'credit card vs credit card india', 'card comparison tool'],
  },
  '/join-waitlist': {
    title: formatTitle('Join the Waitlist | Yureka Money'),
    description:
      'Get early access to Yureka Money — the AI-native wealth operating system that turns your spending into assured Goldback, optimized rewards, and high-yield Vault returns.',
    keywords: ['yureka waitlist', 'join yureka money', 'early access fintech india'],
  },
  '/login': {
    title: formatTitle('Sign In | Yureka Money'),
    description: 'Sign in to your Yureka Money account to track rewards, manage your Vault, and access your personalized dashboard.',
    robots: 'noindex, follow',
  },
  '/waiting': {
    title: formatTitle('Waitlist Status | Yureka Money'),
    description: 'Check the status of your Yureka Money waitlist application.',
    robots: 'noindex, follow',
  },
  '/admin': {
    title: formatTitle('Admin | Yureka Money'),
    description: 'Internal administration console.',
    robots: 'noindex, nofollow',
  },
};

/** Category metadata for /categories/:slug — mirrors the static CATEGORIES list
 *  rendered by CategoriesPage.tsx, kept here so server.ts can build per-route
 *  meta without needing a DB round-trip for purely static category pages. */
export const categoryMeta: Record<string, { name: string; description: string }> = {
  travel: { name: 'Travel', description: 'Compare the best travel credit cards in India for flight miles, hotel stays, airport lounge access, and free room upgrades.' },
  shopping: { name: 'Shopping', description: 'Compare the best shopping credit cards in India for online cashback, retail discounts, and milestone vouchers.' },
  cashback: { name: 'Cashback', description: 'Compare the best cashback credit cards in India for direct statement credit and accelerated online earnings.' },
  fuel: { name: 'Fuel', description: 'Compare the best fuel credit cards in India for surcharge waivers, accelerated fuel points, and vehicle maintenance offers.' },
  'lifetime-free': { name: 'Lifetime Free', description: 'Compare the best lifetime-free credit cards in India with zero joining and annual fees, forever.' },
  'entry-level': { name: 'Entry Level', description: 'Compare the best entry-level credit cards in India — perfect first cards with easy approval and standard rewards.' },
  dining: { name: 'Dining', description: 'Compare the best dining credit cards in India for gourmet rewards and restaurant discounts.' },
  'co-branded': { name: 'Co-Branded', description: 'Compare the best co-branded credit cards in India for partner-specific benefits and accelerated rewards.' },
  grocery: { name: 'Grocery', description: 'Compare the best grocery credit cards in India for savings on daily essentials.' },
  premium: { name: 'Premium', description: 'Compare the best premium credit cards in India with concierge service, elite hotel memberships, and the highest reward multipliers.' },
  hotel: { name: 'Hotel', description: 'Compare the best hotel credit cards in India for stays, upgrades, and luxury hospitality perks.' },
  business: { name: 'Business', description: 'Compare the best business credit cards in India for corporate spends and rewards.' },
  'lounge-access': { name: 'Lounge Access', description: 'Compare the best credit cards in India for complimentary airport lounge access.' },
  student: { name: 'Student', description: 'Compare the best student credit cards in India to start your credit journey.' },
  entertainment: { name: 'Entertainment', description: 'Compare the best entertainment credit cards in India for events, concerts, and streaming perks.' },
  'utility-bill': { name: 'Utility Bill', description: 'Compare the best credit cards in India for rewards on electricity, water, and gas bill payments.' },
  movie: { name: 'Movie', description: 'Compare the best credit cards in India for cinema and streaming perks.' },
  airlines: { name: 'Airlines', description: 'Compare the best airline credit cards in India for flight miles and aviation rewards.' },
  health: { name: 'Health', description: 'Compare the best credit cards in India for wellness and medical spend rewards.' },
  rent: { name: 'Rent', description: 'Compare the best credit cards in India for earning rewards on monthly rent payments.' },
  insurance: { name: 'Insurance', description: 'Compare the best credit cards in India for insurance premium payments and protection benefits.' },
  upi: { name: 'UPI', description: 'Compare the best credit cards in India that support rewards on UPI transactions.' },
  education: { name: 'Education', description: 'Compare the best credit cards in India for education fees and academic spends.' },
};

export function getCategoryPageMeta(slug: string): PageMeta {
  const cat = categoryMeta[slug];
  const name = cat?.name ?? slug.replace(/-/g, ' ');
  return {
    title: formatTitle(`${name} Credit Cards | Best of ${new Date().getFullYear()}`),
    description: cat?.description ?? `Compare the best ${name} credit cards in India. Maximize your ${slug} rewards with our expert analysis.`,
    keywords: [`${name.toLowerCase()} credit cards india`, `best ${name.toLowerCase()} credit card`],
  };
}
