import React, { useEffect, useState } from 'react';
import SEO from './SEO';
import { SITE_URL, staticPageMeta } from '../lib/seo/pageMeta';
import { faqPageSchema } from '../lib/seo/structuredData';
import { faqQuestions } from '../lib/faq';

import Navbar from './home-v2/Navbar';
import HeroCinematic from './home-v2/HeroCinematic';
import BrandsSection from './home-v2/BrandsSection';
import MetricsTechnology from './home-v2/MetricsTechnology';
import Architecture from './home-v2/Architecture';
import FAQSection from './home-v2/FAQSection';
import YurekaCallout from './home-v2/YurekaCallout';
import Footer from './home-v2/Footer';
import Loader from './home-v2/Loader';

const MainPage: React.FC = () => {
  // JSON-LD Structured Data for the Homepage
  const homeSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Yureka Money",
    "alternateName": "Yureka",
    "url": SITE_URL,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${SITE_URL}/cards?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };

  const [entranceComplete, setEntranceComplete] = useState(false);

  useEffect(() => {
    let cancelled = false;

    // The entrance (nav fade, headline scramble) uses "Anton SC" / "Space
    // Mono" -- if it starts before those fonts are actually loaded, the
    // headline scrambles in with fallback-font metrics and then reflows
    // mid-animation once the real font swaps in. Gate on real readiness
    // instead of a blind delay, with a max wait so a slow connection still
    // reveals the page rather than hanging on a black screen.
    const fontsReady =
      typeof document !== 'undefined' && 'fonts' in document
        ? document.fonts.ready
        : Promise.resolve();
    const minDelay = new Promise((resolve) => setTimeout(resolve, 400));
    const maxWait = new Promise((resolve) => setTimeout(resolve, 3000));

    Promise.race([fontsReady, maxWait]).then(() =>
      minDelay.then(() => {
        if (!cancelled) setEntranceComplete(true);
      }),
    );

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <SEO {...staticPageMeta['/']} schema={[homeSchema, faqPageSchema(faqQuestions)]} />

      <div className="yureka-one-home bg-black min-h-screen">
        <Loader show={!entranceComplete} />
        <Navbar entranceComplete={entranceComplete} />
        <HeroCinematic entranceComplete={entranceComplete} />
        <BrandsSection />
        <MetricsTechnology />
        <Architecture />
        <FAQSection />
        <YurekaCallout />
        <Footer />
      </div>
    </>
  );
};

export default MainPage;
