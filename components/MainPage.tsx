import React, { useEffect, useState } from 'react';
import SEO from './SEO';
import { SITE_URL, staticPageMeta } from '../lib/seo/pageMeta';
import { faqPageSchema } from '../lib/seo/structuredData';
import { faqQuestions } from '../lib/faq';

import HeroCinematic from './home-v2/HeroCinematic';
import ScrollDownCue from './home-v2/ScrollDownCue';
import BrandsSection from './home-v2/BrandsSection';
import MetricsTechnology from './home-v2/MetricsTechnology';
import Architecture from './home-v2/Architecture';
import FAQSection from './home-v2/FAQSection';
import YurekaCallout from './home-v2/YurekaCallout';
import Footer from './home-v2/Footer';

const MainPage: React.FC = () => {
  // JSON-LD Structured Data for the Homepage
  const homeSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Yureka One",
    "alternateName": "Yureka",
    "url": SITE_URL
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
        <ScrollDownCue />
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
