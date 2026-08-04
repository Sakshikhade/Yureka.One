import React, { useEffect, useState } from 'react';
import SEO from '@shared/SEO';
import { SITE_URL, staticPageMeta } from '@backend/lib/seo/pageMeta';
import { faqPageSchema } from '@backend/lib/seo/structuredData';
import { faqQuestions } from '@backend/lib/faq';

import Loader from '@landing/home-v2/Loader';
import Navbar from '@landing/home-v2/Navbar';
import HeroCinematic from '@landing/home-v2/HeroCinematic';
import ScrollDownCue from '@landing/home-v2/ScrollDownCue';
import BrandsSection from '@landing/home-v2/BrandsSection';
import MetricsTechnology from '@landing/home-v2/MetricsTechnology';
import Architecture from '@landing/home-v2/Architecture';
import FAQSection from '@landing/home-v2/FAQSection';
import YurekaCallout from '@landing/home-v2/YurekaCallout';
import Footer from '@landing/home-v2/Footer';

/**
 * Homepage composition matches the Yureka One landing reference:
 * Loader → gated Navbar → cinematic hero → sections → footer.
 * Own chrome (not the App shell navbar) so entrance can wait on fonts.
 */
const MainPage: React.FC = () => {
  const homeSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Yureka One',
    alternateName: 'Yureka',
    url: SITE_URL,
  };

  const [entranceComplete, setEntranceComplete] = useState(false);

  useEffect(() => {
    let cancelled = false;

    // Gate entrance on real font readiness so scramble/metrics don't reflow mid-animation.
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

      <div className="yureka-one-home bg-black min-h-screen text-white">
        <Loader show={!entranceComplete} />
        <Navbar entranceComplete={entranceComplete} />
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
