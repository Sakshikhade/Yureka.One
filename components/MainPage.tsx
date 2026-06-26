import React, { Suspense, lazy } from 'react';
import HowItWorksStepper from './HowItWorksStepper';
import SEO from './SEO';
import { SupabaseProvider } from './SupabaseProvider';
import { SkeletonCard, SkeletonHero } from './SkeletonLoaders';
// Lazy load non-critical sections for performance
const Hero = lazy(() => import('./Hero'));
const YurekaInfoSection = lazy(() => import('./YurekaInfoSection'));
const YurekaBackedBySection = lazy(() => import('./YurekaBackedBySection'));
const YurekaUseCasesSection = lazy(() => import('./YurekaUseCasesSection'));
const YurekaPortfolio = lazy(() => import('./YurekaPortfolio'));
const TextReveal = lazy(() => import('./TextReveal'));
const Stats = lazy(() => import('./Stats'));
const Marquee = lazy(() => import('./Marquee'));
const FAQ = lazy(() => import('./FAQ'));
const Footer = lazy(() => import('./Footer'));
const PartnerLogos = lazy(() => import('./PartnerLogos'));

const MainPage: React.FC = () => {
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
        title="Yureka Money -- Reward-Powered Digital Dollar" 
        description="An automated, reward-powered digital dollar built for native passive earnings and effortless connection into DeFi."
        schema={homeSchema}
      />
      
      <div className="bg-cream min-h-screen selection:bg-clay/30">
        {/* EDITORIAL 5-COLUMN ARCHITECTURE */}
        <div className="grid grid-cols-1 lg:grid-cols-5 w-full relative">
            
            {/* COLUMN 1: LEFT MARGIN */}
            <div className="hidden lg:block border-r border-white/5 bg-white/[0.02] h-full min-h-screen" />

            {/* COLUMNS 2, 3, 4: THE INTELLIGENCE CORE (60% WIDTH) */}
            <div className="col-span-1 lg:col-span-3 flex flex-col items-stretch relative z-10 min-w-0">
                
                <Suspense fallback={<SkeletonHero />}>
                    <Hero />
                </Suspense>

                {/* Yureka Info — Meet Yureka cards */}
                <Suspense fallback={<div className="h-96 bg-white/5 animate-pulse rounded-3xl" />}>
                    <YurekaInfoSection />
                </Suspense>
 
                {/* Yureka Backed By — partner marquee */}
                <Suspense fallback={<div className="h-64 bg-white/5 animate-pulse rounded-3xl" />}>
                    <YurekaBackedBySection />
                </Suspense>
 
                {/* Yureka Use Cases — Commerce video card */}
                <Suspense fallback={<div className="h-96 bg-white/5 animate-pulse rounded-3xl" />}>
                    <YurekaUseCasesSection />
                </Suspense>
 
                {/* Yureka Portfolio */}
                <Suspense fallback={<div className="h-[600px] bg-white/5 animate-pulse rounded-3xl" />}>
                    <YurekaPortfolio />
                </Suspense>

                {/* Blue partner logo strip — immediately after hero headline */}
                <Suspense fallback={<div className="h-16 bg-[#1a3fcb] animate-pulse" />}>
                    <PartnerLogos />
                </Suspense>



                
                <Suspense fallback={<div className="h-40" />}>
                    <TextReveal />
                </Suspense>

                <div className="content-auto">
                    <HowItWorksStepper />
                </div>

                <section id="stats" className="scroll-mt-24 content-auto">
                    <Suspense fallback={<div className="h-48 bg-white/5 animate-pulse" />}>
                        <Stats />
                    </Suspense>
                </section>

                <div className="w-full relative border-y border-white/5 content-auto">
                    <Marquee />
                </div>




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
