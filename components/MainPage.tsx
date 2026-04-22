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
const FAQ = lazy(() => import('./FAQ'));
const CalculatorCTA = lazy(() => import('./CalculatorCTA'));

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
      
      <div className="flex flex-col bg-cream overflow-x-hidden">
        {/* Core Layout Wrapper with Buffer Margins */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_minmax(320px,1400px)_1fr] w-full">
            
            {/* Left Gutter */}
            <div className="hidden lg:block border-r border-black/[0.03] bg-cream/50" />

            {/* Central Intelligence Core */}
            <div className="px-4 md:px-8 lg:px-12 flex flex-col gap-0 border-x border-black/[0.01]">
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

                <div className="py-12">
                    <Suspense fallback={<div className="h-40 animate-pulse bg-paper/50" />}>
                        <CalculatorCTA />
                    </Suspense>
                </div>

                <section id="stats" className="scroll-mt-24">
                    <Suspense fallback={<div className="h-64 bg-slate-50/50 animate-pulse" />}>
                        <Stats />
                    </Suspense>
                </section>

                <div className="w-full relative py-12">
                    <Marquee />
                </div>

                <section id="security" className="scroll-mt-24">
                    <Suspense fallback={<div className="h-64 bg-slate-900 animate-pulse" />}>
                        <Security />
                    </Suspense>
                </section>

                <section id="reviews" className="scroll-mt-24 py-12">
                    <Suspense fallback={<div className="h-64" />}>
                        <Community />
                    </Suspense>
                </section>

                <div className="py-12">
                    <ComingSoon />
                </div>

                <section id="faq" className="scroll-mt-24 pb-32">
                    <Suspense fallback={<div className="h-64" />}>
                        <FAQ />
                    </Suspense>
                </section>
            </div>

            {/* Right Gutter */}
            <div className="hidden lg:block border-l border-black/[0.03] bg-cream/50" />
        </div>
      </div>
    </>
  );
};

export default MainPage;
