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

/** FinancialProduct (not generic Product) is the correct schema.org type for
 *  a credit card. Deliberately omits AggregateRating/Review — Google's
 *  structured-data guidelines require genuine review counts, and we don't
 *  have a verified per-card review aggregate wired up yet. */
export function financialProductSchema(card: {
  name: string;
  bank: string;
  slug?: string;
  image?: string;
  description?: string;
  annualFee?: string;
  joiningFee?: string;
}) {
  const fees: string[] = [];
  if (card.joiningFee) fees.push(`Joining Fee: ${card.joiningFee}`);
  if (card.annualFee) fees.push(`Annual Fee: ${card.annualFee}`);

  return {
    '@context': 'https://schema.org',
    '@type': 'FinancialProduct',
    name: card.name,
    category: 'Credit Card',
    provider: { '@type': 'BankOrCreditUnion', name: card.bank },
    url: card.slug ? `${SITE_URL}/cards/${card.slug}` : undefined,
    image: card.image,
    description: card.description || `${card.name} by ${card.bank} — fees, rewards, and eligibility on Yureka Money.`,
    feesAndCommissionsSpecification: fees.length ? fees.join('; ') : undefined,
  };
}

export function blogPostingSchema(blog: { title: string; image?: string; createdAt?: string; updatedAt?: string; author?: string; slug?: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    image: blog.image ? [blog.image] : undefined,
    datePublished: blog.createdAt,
    dateModified: blog.updatedAt || blog.createdAt,
    author: [{ '@type': 'Person', name: blog.author || SITE_NAME }],
    publisher: { '@type': 'Organization', name: SITE_NAME, logo: { '@type': 'ImageObject', url: `${SITE_URL}/logos/yureka-logo.png` } },
    mainEntityOfPage: blog.slug ? `${SITE_URL}/blogs/${blog.slug}` : undefined,
  };
}
