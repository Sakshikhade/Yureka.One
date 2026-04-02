import React from 'react';

interface SEOProps {
  title: string;
  description?: string;
  image?: string;
}

const SEO: React.FC<SEOProps> = ({ 
  title, 
  description = "Find the perfect credit card from 200+ options. Maximize rewards and save on every spend with Yureka's AI engine.",
  image = "https://yureka.money/og-image.jpg"
}) => {
  React.useEffect(() => {
    document.title = `${title} | Yureka.money`;
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    }

    // Update OG tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', `${title} | Yureka.money`);

    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) ogDescription.setAttribute('content', description);

    const ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage) ogImage.setAttribute('content', image);

    // Update Twitter tags
    const twTitle = document.querySelector('meta[property="twitter:title"]');
    if (twTitle) twTitle.setAttribute('content', `${title} | Yureka.money`);

    const twDescription = document.querySelector('meta[property="twitter:description"]');
    if (twDescription) twDescription.setAttribute('content', description);

    const twImage = document.querySelector('meta[property="twitter:image"]');
    if (twImage) twImage.setAttribute('content', image);
  }, [title, description, image]);

  return null;
};

export default SEO;
