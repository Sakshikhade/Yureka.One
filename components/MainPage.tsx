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
const RentalProtection = lazy(() => import('./RentalProtection'));
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
                
                <section id="showcase" className="scroll-mt-24">
                    <Suspense fallback={<div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6 py-6"><SkeletonCard /><SkeletonCard /><SkeletonCard /></div>}>
                        <ShowcaseCarousel cards={cards} />
                    </Suspense>
                </section>

                <section id="secured" className="scroll-mt-24">
                    <Suspense fallback={<div className="h-48" />}>
                        <RentalProtection />
                    </Suspense>
                </section>

                <Suspense fallback={<div className="h-32 animate-pulse bg-paper/50" />}>
                    <CalculatorCTA />
                </Suspense>

                <section id="stats" className="scroll-mt-24">
                    <Suspense fallback={<div className="h-48 bg-slate-50/50 animate-pulse" />}>
                        <Stats />
                    </Suspense>
                </section>

                <div className="w-full relative border-y border-ink/5">
                    <Marquee />
                </div>

                <Suspense fallback={<div className="h-40" />}>
                    <TextReveal />
                </Suspense>

                <section id="security" className="scroll-mt-24">
                    <Suspense fallback={<div className="h-48 bg-[#1A2F2F] animate-pulse" />}>
                        <Security />
                    </Suspense>
                </section>

                <section id="reviews" className="scroll-mt-24">
                    <Suspense fallback={<div className="h-48" />}>
                        <Community />
                    </Suspense>
                </section>

                <Suspense fallback={<div className="h-48" />}>
                    <ComingSoon />
                </Suspense>

                <section id="faq" className="scroll-mt-24">
                    <Suspense fallback={<div className="h-48" />}>
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
