// Server-only: given a request pathname, resolves which PageMeta + JSON-LD
// schemas to inject. Static routes are a pure lookup; dynamic routes
// (/cards/:slug, /blogs/:slug, /compare/:slug) do a best-effort, short-timeout
// Supabase lookup so crawlers see the real card/blog title — falling back to
// a generic (and, for genuinely missing slugs, 404) response if the DB is
// slow or the row doesn't exist.

import { DEFAULT_DESCRIPTION, formatTitle, SITE_URL, staticPageMeta, type PageMeta } from './pageMeta';
import { faqPageSchema } from './structuredData';
import { faqQuestions } from '../faq';

export const REDIRECTS: Record<string, string> = {
  '/ai-magic': '/yureka-ai',
  '/ai': '/yureka-ai',
  '/yureka-os': '/',
};

export interface ResolvedRoute {
  status: 200 | 404;
  meta: PageMeta;
  schemas?: object[];
  redirect?: string;
}

const NOT_FOUND_META: PageMeta = {
  title: formatTitle('Page Not Found | Yureka One'),
  description: 'The page you are looking for does not exist or may have moved.',
  robots: 'noindex, follow',
};

const cache = new Map<string, { value: ResolvedRoute; expires: number }>();
const TTL_MS = 10 * 60 * 1000;

function getCached(key: string): ResolvedRoute | undefined {
  const hit = cache.get(key);
  if (hit && hit.expires > Date.now()) return hit.value;
  return undefined;
}

function setCached(key: string, value: ResolvedRoute) {
  cache.set(key, { value, expires: Date.now() + TTL_MS });
}

/** Distinguishes "query timed out / errored" (inconclusive — never 404 on
 *  this) from "query completed and confirmed no row" (genuinely 404-able). */
function withTimeout<T>(promise: PromiseLike<T>, ms: number): Promise<{ timedOut: boolean; value: T | undefined }> {
  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve({ timedOut: true, value: undefined }), ms);
    Promise.resolve(promise).then(
      (v) => { clearTimeout(timer); resolve({ timedOut: false, value: v }); },
      () => { clearTimeout(timer); resolve({ timedOut: true, value: undefined }); }
    );
  });
}

export async function resolveRouteMeta(pathname: string): Promise<ResolvedRoute> {
  const path = pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;

  if (REDIRECTS[path]) {
    return { status: 200, meta: staticPageMeta['/'], redirect: REDIRECTS[path] };
  }

  if (path.startsWith('/dashboard')) {
    return {
      status: 200,
      meta: { title: formatTitle('Dashboard | Yureka One'), description: 'Your personal Yureka One dashboard.', robots: 'noindex, follow' },
    };
  }

  if (staticPageMeta[path]) {
    if (path === '/') {
      const homeSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Yureka One',
        alternateName: 'Yureka',
        url: SITE_URL,
      };
      return { status: 200, meta: staticPageMeta['/'], schemas: [homeSchema, faqPageSchema(faqQuestions)] };
    }
    return { status: 200, meta: staticPageMeta[path] };
  }

  const m = path.match(/^\/blogs\/([^/]+)$/);
  if (m) return resolveBlog(m[1]);

  return { status: 404, meta: NOT_FOUND_META };
}

const CARD_FETCH_TIMEOUT_MS = 2000;
const BLOG_TIMEOUT_FALLBACK: ResolvedRoute = {
  status: 200,
  meta: { title: formatTitle('Pulse | Yureka Journal'), description: DEFAULT_DESCRIPTION },
};

async function resolveBlog(_slug: string): Promise<ResolvedRoute> {
  // Dynamic blog SEO previously read from Supabase; with it removed, crawlers
  // get the generic Journal meta (blog pages still render client-side).
  return BLOG_TIMEOUT_FALLBACK;
}
