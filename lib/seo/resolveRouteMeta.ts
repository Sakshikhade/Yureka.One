// Server-only: given a request pathname, resolves which PageMeta + JSON-LD
// schemas to inject. Static routes are a pure lookup; dynamic routes
// (/cards/:slug, /blogs/:slug, /compare/:slug) do a best-effort, short-timeout
// Supabase lookup so crawlers see the real card/blog title — falling back to
// a generic (and, for genuinely missing slugs, 404) response if the DB is
// slow or the row doesn't exist.

import type { SupabaseClient } from '@supabase/supabase-js';
import { DEFAULT_DESCRIPTION, DEFAULT_OG_IMAGE, formatTitle, SITE_URL, staticPageMeta, type PageMeta } from './pageMeta';
import { blogPostingSchema, breadcrumbSchema, faqPageSchema } from './structuredData';
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

export async function resolveRouteMeta(pathname: string, supabase: SupabaseClient): Promise<ResolvedRoute> {
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
  if (m) return resolveBlog(m[1], supabase);

  return { status: 404, meta: NOT_FOUND_META };
}

const CARD_FETCH_TIMEOUT_MS = 2000;
const BLOG_TIMEOUT_FALLBACK: ResolvedRoute = {
  status: 200,
  meta: { title: formatTitle('Pulse | Yureka Journal'), description: DEFAULT_DESCRIPTION },
};

async function resolveBlog(slug: string, supabase: SupabaseClient): Promise<ResolvedRoute> {
  const cacheKey = `blog:${slug}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const { timedOut, value: row } = await withTimeout(
    supabase.from('blogs').select('title, excerpt, image, author, category, created_at, updated_at, slug').eq('slug', slug).maybeSingle().then((r) => r.data),
    CARD_FETCH_TIMEOUT_MS
  );

  if (timedOut) return BLOG_TIMEOUT_FALLBACK;

  let result: ResolvedRoute;
  if (!row) {
    result = {
      status: 404,
      meta: {
        title: formatTitle('Story Not Found | Yureka Journal'),
        description: 'The story you are looking for may have been archived or moved.',
        robots: 'noindex, follow',
      },
    };
  } else {
    result = {
      status: 200,
      meta: {
        title: formatTitle(`${row.title} | Yureka Journal`),
        description: row.excerpt || `Read the latest insights on ${row.category} from ${row.author}.`,
        image: row.image || DEFAULT_OG_IMAGE,
      },
      schemas: [
        breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Pulse', path: '/blogs' }, { name: row.title, path: `/blogs/${slug}` }]),
        blogPostingSchema({ title: row.title, image: row.image, createdAt: row.created_at, updatedAt: row.updated_at, author: row.author, slug: row.slug }),
      ],
    };
  }
  setCached(cacheKey, result);
  return result;
}
