import React from 'react';

interface SEOProps {
  title: string;
  description?: string;
  image?: string;
  canonical?: string;
  robots?: string;
}

const SEO: React.FC<SEOProps> = ({ 
  title, 
  description = "Find the perfect credit card from 200+ options. Maximize rewards and save on every spend with Yureka's AI engine.",
  image = "https://yureka.money/og-image.jpg",
  canonical,
  robots = "index, follow"
}) => {
  React.useEffect(() => {
    const fullTitle = `${title} | Yureka.money`;
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
  }, [title, description, image, canonical, robots]);

  return null;
};

export default SEO;
