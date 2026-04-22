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
const Footer = lazy(() => import('./Footer'));

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
      
      <div className="bg-cream min-h-screen overflow-x-hidden selection:bg-clay/10">
        {/* EDITORIAL 5-COLUMN ARCHITECTURE */}
        <div className="grid grid-cols-1 lg:grid-cols-5 w-full relative">
            
            {/* COLUMN 1: LEFT MARGIN */}
            <div className="hidden lg:block border-r border-ink/5 bg-cream/30 h-full min-h-screen" />

            {/* COLUMNS 2, 3, 4: THE INTELLIGENCE CORE (60% WIDTH) */}
            <div className="col-span-1 lg:col-span-3 flex flex-col items-stretch relative z-10 min-w-0">
                
                <Suspense fallback={<SkeletonHero />}>
                    <Hero />
                </Suspense>
                
                <Suspense fallback={<div className="h-40" />}>
                    <TextReveal />
                </Suspense>

                <section id="showcase" className="scroll-mt-24">
                    <Suspense fallback={<div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6 py-10"><SkeletonCard /><SkeletonCard /><SkeletonCard /></div>}>
                        <ShowcaseCarousel cards={cards} />
                    </Suspense>
                </section>

                <div className="py-24 px-4 md:px-8">
                    <Suspense fallback={<div className="h-40 animate-pulse bg-paper/50" />}>
                        <CalculatorCTA />
                    </Suspense>
                </div>

                <section id="stats" className="scroll-mt-24">
                    <Suspense fallback={<div className="h-64 bg-slate-50/50 animate-pulse" />}>
                        <Stats />
                    </Suspense>
                </section>

                <div className="w-full relative py-20 border-y border-ink/5">
                    <Marquee />
                </div>

                <section id="security" className="scroll-mt-24">
                    <Suspense fallback={<div className="h-64 bg-[#242424] animate-pulse" />}>
                        <Security />
                    </Suspense>
                </section>

                <section id="reviews" className="scroll-mt-24 py-24">
                    <Suspense fallback={<div className="h-64" />}>
                        <Community />
                    </Suspense>
                </section>

                <div className="py-24">
                    <ComingSoon />
                </div>

                <section id="faq" className="scroll-mt-24 pb-48">
                    <Suspense fallback={<div className="h-64" />}>
                        <FAQ />
                    </Suspense>
                </section>
                
                {/* FOOTER ANCHORED TO CORE */}
                <Suspense fallback={<div className="h-40" />}>
                    <Footer />
                </Suspense>
            </div>

            {/* COLUMN 5: RIGHT MARGIN */}
            <div className="hidden lg:block border-l border-ink/5 bg-cream/30 h-full min-h-screen" />
        </div>
      </div>
    </>
  );
};

export default MainPage;
