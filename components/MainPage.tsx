import React, { Suspense, lazy } from 'react';
import HowItWorksStepper from './HowItWorksStepper';
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
const HowYurekaHelps = lazy(() => import('./HowYurekaHelps'));
const Footer = lazy(() => import('./Footer'));
const PartnerLogos = lazy(() => import('./PartnerLogos'));

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
      
      <div className="bg-[#0a0a0a] min-h-screen selection:bg-clay/30">
        {/* EDITORIAL 5-COLUMN ARCHITECTURE */}
        <div className="grid grid-cols-1 lg:grid-cols-5 w-full relative">
            
            {/* COLUMN 1: LEFT MARGIN */}
            <div className="hidden lg:block border-r border-white/5 bg-white/[0.02] h-full min-h-screen" />

            {/* COLUMNS 2, 3, 4: THE INTELLIGENCE CORE (60% WIDTH) */}
            <div className="col-span-1 lg:col-span-3 flex flex-col items-stretch relative z-10 min-w-0">
                
                <Suspense fallback={<SkeletonHero />}>
                    <Hero />
                </Suspense>

                {/* Blue partner logo strip — immediately after hero headline */}
                <Suspense fallback={<div className="h-16 bg-[#1a3fcb] animate-pulse" />}>
                    <PartnerLogos />
                </Suspense>

                {/* How Yureka Helps — 6 feature cards grid, right below logo strip */}
                <Suspense fallback={<div className="h-[600px] animate-pulse bg-white/5" />}>
                    <HowYurekaHelps />
                </Suspense>

                
                <Suspense fallback={<div className="h-40" />}>
                    <div className="content-auto">
                        <TextReveal />
                    </div>
                </Suspense>

                <section id="showcase" className="scroll-mt-24 content-auto">
                    <Suspense fallback={<div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6 py-6"><SkeletonCard /><SkeletonCard /><SkeletonCard /></div>}>
                        <ShowcaseCarousel cards={cards} />
                    </Suspense>
                </section>

                <div className="content-auto">
                    <HowItWorksStepper />
                </div>

                <section id="secured" className="scroll-mt-24 content-auto">
                    <Suspense fallback={<div className="h-48" />}>
                        <RentalProtection cards={cards} />
                    </Suspense>
                </section>


                <Suspense fallback={<div className="h-32 animate-pulse bg-white/5" />}>
                    <div className="content-auto">
                        <CalculatorCTA />
                    </div>
                </Suspense>

                <section id="stats" className="scroll-mt-24 content-auto">
                    <Suspense fallback={<div className="h-48 bg-white/5 animate-pulse" />}>
                        <Stats />
                    </Suspense>
                </section>

                <div className="w-full relative border-y border-white/5 content-auto">
                    <Marquee />
                </div>

                <div className="content-auto">
                    <Suspense fallback={<div className="h-48" />}>
                        <ComingSoon />
                    </Suspense>
                </div>

                <section id="security" className="scroll-mt-24 content-auto">
                    <Suspense fallback={<div className="h-48 bg-[#1A2F2F] animate-pulse" />}>
                        <Security />
                    </Suspense>
                </section>

                <section id="reviews" className="scroll-mt-24 content-auto">
                    <Suspense fallback={<div className="h-48" />}>
                        <Community />
                    </Suspense>
                </section>

                <section id="faq" className="scroll-mt-24 content-auto">
                    <Suspense fallback={<div className="h-48" />}>
                        <FAQ />
                    </Suspense>
                </section>
                
                {/* FOOTER ANCHORED TO CORE */}
                <Suspense fallback={<div className="h-40" />}>
                    <div className="content-auto">
                        <Footer />
                    </div>
                </Suspense>
            </div>

            {/* COLUMN 5: RIGHT MARGIN */}
            <div className="hidden lg:block border-l border-white/5 bg-white/[0.02] h-full min-h-screen" />
        </div>
      </div>
    </>
  );
};

export default MainPage;
