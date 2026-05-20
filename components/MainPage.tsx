import React, { Suspense, lazy } from 'react';
import HowItWorksStepper from './HowItWorksStepper';
import SEO from './SEO';
import { useSupabase } from './SupabaseProvider';
import { SkeletonHero } from './SkeletonLoaders';

// Lazy load non-critical sections for performance
const Hero = lazy(() => import('./Hero'));
const PartnerLogos = lazy(() => import('./PartnerLogos'));
const FAQ = lazy(() => import('./FAQ'));
const Footer = lazy(() => import('./Footer'));

// Import brand sections
import {
  WaitlistSection,
  RewardIQSection,
  ChromeExtensionSection,
  YurekaAISection,
  RewardXSection,
  StoreSection,
  RedemptionSection,
  CompareCardsSection,
  BestCardByCategorySection,
  PrivacySection,
  LifestyleValueSection,
  UPISDKSection,
  B2BStackSection,
  FinalCTASection
} from './HomepageSections';

const MainPage: React.FC = () => {
  // JSON-LD Structured Data for the Homepage
  const homeSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Yureka",
    "alternateName": "Yureka Money",
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
        title="Yureka | India's AI-driven Credit and Reward Optimization Platform" 
        description="Turn every swipe into your next big experience. Yureka helps you choose the best way to pay, save more on every purchase, and redeem rewards where they create the highest value."
        schema={homeSchema}
      />
      
      <div className="bg-cream min-h-screen selection:bg-clay/30">
        {/* EDITORIAL 5-COLUMN ARCHITECTURE */}
        <div className="grid grid-cols-1 lg:grid-cols-5 w-full relative">
            
            {/* COLUMN 1: LEFT MARGIN */}
            <div className="hidden lg:block border-r border-white/5 bg-white/[0.02] h-full min-h-screen" />

            {/* COLUMNS 2, 3, 4: THE INTELLIGENCE CORE (60% WIDTH) */}
            <div className="col-span-1 lg:col-span-3 flex flex-col items-stretch relative z-10 min-w-0">
                
                {/* 1. Header (Navbar is rendered globally in App.tsx) */}

                {/* 2. Hero */}
                <Suspense fallback={<SkeletonHero />}>
                    <Hero />
                </Suspense>

                {/* Blue partner logo strip */}
                <Suspense fallback={<div className="h-16 bg-[#1a3fcb] animate-pulse" />}>
                    <PartnerLogos />
                </Suspense>

                {/* 3. Waitlist */}
                <WaitlistSection />

                {/* 4. Reward IQ */}
                <RewardIQSection />

                {/* 5. How It Works */}
                <HowItWorksStepper />

                {/* 6. Chrome Extension */}
                <ChromeExtensionSection />

                {/* 7. Yureka AI */}
                <YurekaAISection />

                {/* 8. RewardX */}
                <RewardXSection />

                {/* 9. Store */}
                <StoreSection />

                {/* 10. Redemption */}
                <RedemptionSection />

                {/* 11. Compare Cards */}
                <CompareCardsSection />

                {/* 12. Best Card by Category */}
                <BestCardByCategorySection />

                {/* 13. Calculator */}
                <section id="calculator" className="bg-[#0c0c0c] py-16 md:py-24 border-b border-white/10 text-center relative overflow-hidden">
                  <div className="max-w-4xl mx-auto px-6 relative z-10">
                    <span className="text-clay text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">
                      Calculator
                    </span>
                    <h2 className="text-3xl md:text-5xl font-heading font-black text-white uppercase tracking-tighter leading-none mb-6">
                      See the real value of your points before you redeem.
                    </h2>
                    <p className="text-white/80 text-sm md:text-base max-w-xl mx-auto mb-8">
                      The Yureka calculator helps you compare cashback, vouchers, flights, hotels, products, and other redemption routes so you can choose the option that extracts the most value from every point.
                    </p>
                    <div className="flex justify-center gap-4">
                      <Link 
                        to="/rewards-calculator"
                        className="bg-clay text-cream text-[10px] font-black uppercase tracking-[0.2em] px-8 py-4 rounded-full shadow-lg hover:scale-105 transition-transform"
                      >
                        Use Calculator
                      </Link>
                    </div>
                  </div>
                </section>

                {/* 14. Privacy */}
                <PrivacySection />

                {/* 15. Lifestyle Value */}
                <LifestyleValueSection />

                {/* 16. Coming Soon / UPI SDK */}
                <UPISDKSection />

                {/* 17. Coming Soon / B2B Stack */}
                <B2BStackSection />

                {/* 18. FAQs */}
                <Suspense fallback={<div className="h-48" />}>
                    <FAQ />
                </Suspense>

                {/* 19. Final CTA */}
                <FinalCTASection />
                
                {/* 20. Footer */}
                <Suspense fallback={<div className="h-40" />}>
                    <Footer />
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
