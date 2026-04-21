import React, { Suspense, lazy } from 'react';
import SEO from './SEO';
import { SupabaseProvider, useSupabase } from './SupabaseProvider';
import { SkeletonCard, SkeletonHero } from './SkeletonLoaders';

// Lazy load non-critical sections for performance
const Hero = lazy(() => import('./Hero'));
const TextReveal = lazy(() => import('./TextReveal'));
const ShowcaseCarousel = lazy(() => import('./ShowcaseCarousel'));
const Stats = lazy(() => import('./Stats'));
const Marquee = lazy(() => import('./Marquee'));
const Security = lazy(() => import('./Security'));
const Community = lazy(() => import('./Community'));
const ComingSoon = lazy(() => import('./ComingSoon'));
const SocialProof = lazy(() => import('./SocialProof'));
const FAQ = lazy(() => import('./FAQ'));

const MainPage: React.FC = () => {
  const { cards } = useSupabase();

  // JSON-LD Structured Data for the Homepage
  const homeSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Yureka Money",
    "alternateName": "Yureka",
    "url": "https://yureka.money",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://yureka.money/cards?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <>
      <SEO 
        title="Yureka | AI-Driven Credit Card Intelligence" 
        description="Maximize every spend with India's most advanced AI credit card optimizer. Match with 200+ cards and unlock elite rewards instantly."
        schema={homeSchema}
      />
      
      <Suspense fallback={<div className="h-20" />}>
        <Hero />
      </Suspense>
      
      <Suspense fallback={<div className="h-20" />}>
        <TextReveal />
      </Suspense>

      <section id="showcase" className="scroll-mt-24">
        <Suspense fallback={<div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6 py-10"><SkeletonCard /><SkeletonCard /><SkeletonCard /></div>}>
          <ShowcaseCarousel cards={cards} />
        </Suspense>
      </section>

      <section id="stats" className="scroll-mt-24">
        <Suspense fallback={<div className="h-64 bg-slate-50/50 animate-pulse" />}>
          <Stats />
        </Suspense>
      </section>

      <Marquee />

      <section id="security" className="scroll-mt-24">
        <Suspense fallback={<div className="h-64 bg-slate-900 animate-pulse" />}>
          <Security />
        </Suspense>
      </section>

      <section id="reviews" className="scroll-mt-24">
        <Suspense fallback={<div className="h-64" />}>
          <Community />
        </Suspense>
      </section>

      <ComingSoon />
      <SocialProof />

      <section id="faq" className="scroll-mt-24">
        <Suspense fallback={<div className="h-64" />}>
          <FAQ />
        </Suspense>
      </section>
    </>
  );
};

export default MainPage;
