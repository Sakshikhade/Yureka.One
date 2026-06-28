import React, { Suspense, lazy } from 'react';
import HowItWorksStepper from './HowItWorksStepper';
import SEO from './SEO';
import { SupabaseProvider } from './SupabaseProvider';
import { SkeletonCard, SkeletonHero } from './SkeletonLoaders';
import { SITE_URL, staticPageMeta } from '../lib/seo/pageMeta';
import { faqPageSchema } from '../lib/seo/structuredData';
import { faqQuestions } from '../data/faq';
// Lazy load non-critical sections for performance
const Hero = lazy(() => import('./Hero'));
const YurekaInfoSection = lazy(() => import('./YurekaInfoSection'));
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
    "url": SITE_URL,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${SITE_URL}/cards?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <>
      <SEO {...staticPageMeta['/']} schema={[homeSchema, faqPageSchema(faqQuestions)]} />

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
                <section id="meet-yureka" className="scroll-mt-24">
                    <Suspense fallback={<div className="h-96 bg-white/5 animate-pulse rounded-3xl" />}>
                        <YurekaInfoSection />
                    </Suspense>
                </section>

                {/* Yureka Use Cases — Commerce video card */}
                <section id="use-cases" className="scroll-mt-24">
                    <Suspense fallback={<div className="h-96 bg-white/5 animate-pulse rounded-3xl" />}>
                        <YurekaUseCasesSection />
                    </Suspense>
                </section>

                {/* Yureka Portfolio */}
                <section id="portfolio" className="scroll-mt-24">
                    <Suspense fallback={<div className="h-[600px] bg-white/5 animate-pulse rounded-3xl" />}>
                        <YurekaPortfolio />
                    </Suspense>
                </section>

                {/* Blue partner logo strip — immediately after hero headline */}
                <section id="partners" className="scroll-mt-24">
                    <Suspense fallback={<div className="h-16 bg-[#1a3fcb] animate-pulse" />}>
                        <PartnerLogos />
                    </Suspense>
                </section>

                <section id="yureka-ai" className="scroll-mt-24">
                    <Suspense fallback={<div className="h-40" />}>
                        <TextReveal />
                    </Suspense>
                </section>

                <section id="how-it-works" className="scroll-mt-24 content-auto">
                    <HowItWorksStepper />
                </section>

                <section id="stats" className="scroll-mt-24 content-auto">
                    <Suspense fallback={<div className="h-48 bg-white/5 animate-pulse" />}>
                        <Stats />
                    </Suspense>
                </section>

                <section id="brands" className="w-full relative border-y border-white/5 content-auto scroll-mt-24">
                    <Marquee />
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
