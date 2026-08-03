// JSON-LD builders shared between client components (via SEO.tsx's `schema`
// prop) and the server-side meta injector in server.ts.

import { SITE_NAME, SITE_URL } from './pageMeta';

/** Wraps multiple schema objects into a single @graph script so a page can
 *  emit several distinct types (e.g. BreadcrumbList + FinancialProduct)
 *  without needing more than one <script type="application/ld+json"> tag. */
export function toGraph(...schemas: (object | undefined)[]): object {
  const nodes = schemas.filter(Boolean).map((s) => {
    const { '@context': _ctx, ...rest } = s as Record<string, unknown>;
    return rest;
  });
  return { '@context': 'https://schema.org', '@graph': nodes };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

export function faqPageSchema(faqs: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

export function blogPostingSchema(blog: {
  title: string;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
  author?: string;
  slug?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    image: blog.image ? [blog.image] : undefined,
    datePublished: blog.createdAt,
    dateModified: blog.updatedAt || blog.createdAt,
    author: [{ '@type': 'Person', name: blog.author || SITE_NAME }],
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/logos/yureka-logo.png` },
    },
    mainEntityOfPage: blog.slug ? `${SITE_URL}/blogs/${blog.slug}` : undefined,
  };
}

/** Organization schema — emit on every page via index.html inline script. */
export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Yureka.One',
    alternateName: ['Yureka One', 'Yureka'],
    url: SITE_URL,
    logo: `${SITE_URL}/logos/yureka-logo.png`,
    foundingDate: '2026',
    founder: { '@type': 'Person', name: 'Anwesh Biswas' },
    description:
      "Yureka.One is India's first AI-native Wealth Operating System, converting everyday transactions into 24K digital gold rewards (Yureka Goldback) and RBI-compliant alternative credit profiles.",
    areaServed: 'IN',
    sameAs: [
      'https://twitter.com/yurekamoney',
      'https://www.linkedin.com/company/yurekamoney',
      'https://www.instagram.com/yurekamoney',
    ],
    knowsAbout: [
      'Wealth Operating System',
      'Digital Gold Rewards',
      'Agentic Commerce',
      'Model Context Protocol',
      'Alternative Credit Scoring',
      'Lending Service Provider',
      'Credit Card Rewards Optimization',
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Yureka.One Products',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Yureka Goldback',
            description:
              'A reward asset that converts every transaction into yield-generating 24K digital gold — up to 16% effective ROI — instead of expiring loyalty points.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Yureka AI Concierge',
            description:
              "An agentic AI shopping assistant integrated with Swiggy's Model Context Protocol (Food, Instamart, Dineout) that compares prices, applies the best-reward payment, and places orders autonomously.",
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Yureka Credit',
            description:
              'An RBI-compliant Lending Service Provider (LSP) that builds alternative credit profiles for thin-file users from consented transaction data under the Account Aggregator framework.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Product',
            name: 'Yureka Premium',
            description: 'Subscription at ₹99/month or ₹1,199/year — 100% reimbursed as 24K digital gold.',
            offers: {
              '@type': 'Offer',
              price: '99',
              priceCurrency: 'INR',
              priceSpecification: {
                '@type': 'UnitPriceSpecification',
                price: '99',
                priceCurrency: 'INR',
                billingDuration: 'P1M',
              },
            },
          },
        },
      ],
    },
  };
}

/** SoftwareApplication schema for the Yureka AI concierge / mobile app. */
export function softwareApplicationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Yureka AI',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web, iOS, Android',
    url: `${SITE_URL}/yureka-ai`,
    description:
      "India's first AI shopping concierge integrated with Swiggy MCP — compares prices, places food and grocery orders, applies the best-reward payment, and converts earnings into Yureka Goldback (24K digital gold).",
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
    },
    featureList: [
      'Swiggy MCP (Food, Instamart, Dineout) integration',
      'Cross-engine price comparison',
      'Best-reward payment method selection',
      'Automatic Yureka Goldback earning',
      'Alternative credit profile building',
    ],
    publisher: { '@type': 'Organization', name: 'Yureka.One', url: SITE_URL },
  };
}
