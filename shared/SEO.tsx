import React from 'react';
import { DEFAULT_DESCRIPTION, DEFAULT_OG_IMAGE, formatTitle } from '@backend/lib/seo/pageMeta';
import { toGraph } from '@backend/lib/seo/structuredData';

interface SEOProps {
  title: string;
  description?: string;
  image?: string;
  canonical?: string;
  robots?: string;
  keywords?: string[];
  /** A single JSON-LD object, or several — multiple objects are combined into
   *  one @graph script so a page can emit e.g. BreadcrumbList + FinancialProduct. */
  schema?: object | object[];
}

const SEO: React.FC<SEOProps> = ({
  title,
  description = DEFAULT_DESCRIPTION,
  image = DEFAULT_OG_IMAGE,
  canonical,
  robots = 'index, follow',
  keywords,
  schema,
}) => {
  React.useEffect(() => {
    const fullTitle = formatTitle(title);
    document.title = fullTitle;

    // Update simple meta tags
    const updateMeta = (selector: string, content: string) => {
      const el = document.querySelector(selector);
      if (el) el.setAttribute('content', content);
    };

    updateMeta('meta[name="description"]', description);
    updateMeta('meta[name="robots"]', robots);
    if (keywords?.length) updateMeta('meta[name="keywords"]', keywords.join(', '));

    // Update OG tags
    updateMeta('meta[property="og:title"]', fullTitle);
    updateMeta('meta[property="og:description"]', description);
    updateMeta('meta[property="og:image"]', image);
    updateMeta('meta[property="og:url"]', window.location.href);

    // Update Twitter tags
    updateMeta('meta[property="twitter:title"]', fullTitle);
    updateMeta('meta[property="twitter:description"]', description);
    updateMeta('meta[property="twitter:image"]', image);
    updateMeta('meta[property="twitter:url"]', window.location.href);

    // Update Canonical
    const canonicalTag = document.querySelector('link[rel="canonical"]');
    if (canonicalTag) {
      canonicalTag.setAttribute('href', canonical || window.location.href);
    }

    // Update Schema
    if (schema) {
      const existingSchema = document.getElementById('seo-schema');
      if (existingSchema) existingSchema.remove();

      const payload = Array.isArray(schema) ? toGraph(...schema) : schema;
      const script = document.createElement('script');
      script.id = 'seo-schema';
      script.type = 'application/ld+json';
      script.innerHTML = JSON.stringify(payload);
      document.head.appendChild(script);
    }
  }, [title, description, image, canonical, robots, keywords, schema]);

  return null;
};

export default SEO;
