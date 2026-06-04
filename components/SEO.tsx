import React from 'react';

interface SEOProps {
  title: string;
  description?: string;
  image?: string;
  canonical?: string;
  robots?: string;
  schema?: object;
}

const SEO: React.FC<SEOProps> = ({ 
  title, 
  description = "Maximize every systematic reward, deployment with precision & unlock elite financial yield. India's premier institutional-grade credit intelligence engine.",
  image = "https://yureka.money/favicon.png",
  canonical,
  robots = "index, follow",
  schema
}) => {
  React.useEffect(() => {
    const fullTitle = title === "Jack -- 3D Creator" || title.includes('|') ? title : `${title} | Yureka.money`;
    document.title = fullTitle;
    
    // Update simple meta tags
    const updateMeta = (selector: string, content: string) => {
      const el = document.querySelector(selector);
      if (el) el.setAttribute('content', content);
    };

    updateMeta('meta[name="description"]', description);
    updateMeta('meta[name="robots"]', robots);

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
    let canonicalTag = document.querySelector('link[rel="canonical"]');
    if (canonicalTag) {
      canonicalTag.setAttribute('href', canonical || window.location.href);
    }

    // Update Schema
    if (schema) {
      const existingSchema = document.getElementById('seo-schema');
      if (existingSchema) existingSchema.remove();

      const script = document.createElement('script');
      script.id = 'seo-schema';
      script.type = 'application/ld+json';
      script.innerHTML = JSON.stringify(schema);
      document.head.appendChild(script);
    }
  }, [title, description, image, canonical, robots, schema]);

  return null;
};


export default SEO;
