import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Link, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import TopBanner from './components/TopBanner';
import BottomBanner from './components/BottomBanner';
import Footer from './components/Footer';
import SEO from './components/SEO';
import { Sparkles, Loader2 } from 'lucide-react';
import { SupabaseProvider, useSupabase } from './components/SupabaseProvider';
import { SkeletonHero, SkeletonCard } from './components/SkeletonLoaders';

// Lazy Loaded Pages
const Hero = lazy(() => import('./components/Hero'));
const TextReveal = lazy(() => import('./components/TextReveal'));
const ShowcaseCarousel = lazy(() => import('./components/ShowcaseCarousel'));
const Stats = lazy(() => import('./components/Stats'));
const Marquee = lazy(() => import('./components/Marquee'));
const Community = lazy(() => import('./components/Community'));
const ComingSoon = lazy(() => import('./components/ComingSoon'));
const SocialProof = lazy(() => import('./components/SocialProof'));
const FAQ = lazy(() => import('./components/FAQ'));
const CardExplorer = lazy(() => import('./components/CardExplorer'));
const OurStory = lazy(() => import('./components/OurStory'));
const CareersPage = lazy(() => import('./components/CareersPage'));
const BlogPage = lazy(() => import('./components/JournalPage'));
const Security = lazy(() => import('./components/Security'));
const WaitlistPage = lazy(() => import('./components/WaitlistPage'));
const YurekaOsPage = lazy(() => import('./components/YurekaOsPage'));
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));
const CardDetail = lazy(() => import('./components/CardDetail'));
const BlogDetail = lazy(() => import('./components/BlogDetail'));
const PrivacyPolicy = lazy(() => import('./components/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./components/TermsOfService'));
const CommunityGuidelines = lazy(() => import('./components/CommunityGuidelines'));
const SecurityProtocolPage = lazy(() => import('./components/SecurityProtocolPage'));
const RewardsTransferCalculator = lazy(() => import('./components/RewardsTransferCalculator'));
const AIMagicPage = lazy(() => import('./components/AIMagicPage'));


const ScrollToTop = () => {
  const { pathname, hash } = useLocation();
  
  React.useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
    } else {
      const id = hash.replace('#', '');
      const scrollWithRetry = (retryCount = 0) => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        } else if (retryCount < 20) {
          setTimeout(() => scrollWithRetry(retryCount + 1), 100);
        }
      };
      scrollWithRetry();
    }
  }, [pathname, hash]);
  
  return null;
}

const MainPage = () => {
  const { cards } = useSupabase();
  return (
    <>
      <SEO 
        title="Yureka | AI-Driven Credit Card Intelligence" 
        description="Maximize every spend with India's most advanced AI credit card optimizer. Match with 200+ cards and unlock elite rewards instantly."
      />
      <Suspense fallback={<SkeletonHero />}>
        <Hero />
      </Suspense>
      
      <Suspense fallback={<div className="h-40" />}>
        <TextReveal />
      </Suspense>

      <div id="showcase" className="scroll-mt-24">
        <Suspense fallback={<div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6 py-20"><SkeletonCard /><SkeletonCard /><SkeletonCard /></div>}>
          <ShowcaseCarousel cards={cards} />
        </Suspense>
      </div>

      <div id="stats" className="scroll-mt-24">
        <Suspense fallback={<div className="h-96 bg-slate-50/50 animate-pulse" />}>
          <Stats />
        </Suspense>
      </div>

      <Marquee />

      <div id="security" className="scroll-mt-24">
        <Suspense fallback={<div className="h-96 bg-slate-900 animate-pulse" />}>
          <Security />
        </Suspense>
      </div>

      <div id="reviews" className="scroll-mt-24">
        <Suspense fallback={<div className="h-96" />}>
          <Community />
        </Suspense>
      </div>

      <ComingSoon />
      <SocialProof />
      <div id="faq" className="scroll-mt-24">
        <Suspense fallback={<div className="h-96" />}>
          <FAQ />
        </Suspense>
      </div>
    </>
  );
};

const AppContent: React.FC = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className={`min-h-screen bg-cream font-sans text-ink relative ${isAdminRoute ? 'pt-0' : 'pt-32 md:pt-40'}`}>

      <div className="paper-texture" />
      <div className="vignette-overlay" />

      <ScrollToTop />
      {!isAdminRoute && <TopBanner />}
      {!isAdminRoute && <Navbar />}
      
      <main className={`relative z-10 ${isAdminRoute ? 'pt-0' : ''}`}>
        <Routes>
           <Route path="/" element={<MainPage />} />
           
           <Route path="/cards" element={
              <>
                <SEO 
                  title="Card Explorer | Precision Matching Engine" 
                  description="Deep-dive into 200+ credit cards. Filter by rewards, lounge access, and lifestyle perks to find your high-performance financial partner."
                />
                <Suspense fallback={<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6"><SkeletonCard /><SkeletonCard /><SkeletonCard /></div>}>
                  <CardExplorer />
                </Suspense>
             </>
           } />
           
           <Route path="/cards/:slug" element={
              <>
                <SEO 
                  title="Instrument Specification" 
                  description="Detailed rewards analysis, annual fee breakdowns, and elite perk evaluations for your next credit instrument."
                />
                <Suspense fallback={<div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-clay" size={40} /></div>}>
                  <CardDetail />
                </Suspense>
             </>
           } />
           
           <Route path="/blogs" element={
              <>
                <SEO 
                  title="The Journal | Financial Strategy & Lore" 
                  description="Expert dispatches on credit policy, reward loopholes, and the strategy of high-end financial management."
                />
                <Suspense fallback={<div className="h-screen" />}>
                  <BlogPage />
                </Suspense>
             </>
           } />
           
           <Route path="/blogs/:slug" element={
              <>
                <SEO 
                  title="Registry Entry | Financial Insight" 
                  description="Detailed deep-dives into credit strategy and editorial analysis from the Yureka investigative team."
                />
                <Suspense fallback={<div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-clay" size={40} /></div>}>
                  <BlogDetail />
                </Suspense>
             </>
           } />
           
           <Route path="/join-waitlist" element={
              <>
                <SEO 
                  title="The Registry | Secure Your Access" 
                  description="Join the elite waitlist for early access to the Yureka Neural Engine and exclusive reward strategies."
                />
                <Suspense fallback={<div className="h-screen" />}>
                  <WaitlistPage />
                </Suspense>
             </>
           } />
           
           <Route path="/admin" element={<Suspense fallback={<div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-clay" size={40} /></div>}><AdminDashboard /></Suspense>} />
           
           {/* Catch-all Routes */}
           <Route path="/privacy-policy" element={<Suspense fallback={<div />}><PrivacyPolicy /></Suspense>} />
           <Route path="/terms-of-service" element={<Suspense fallback={<div />}><TermsOfService /></Suspense>} />
           <Route path="/security-protocol" element={<Suspense fallback={<div />}><SecurityProtocolPage /></Suspense>} />
           <Route path="/community-guidelines" element={<Suspense fallback={<div />}><CommunityGuidelines /></Suspense>} />
           <Route path="/yureka-os" element={<Suspense fallback={<div />}><YurekaOsPage /></Suspense>} />
           <Route path="/manifesto" element={<Suspense fallback={<div />}><OurStory /></Suspense>} />
           <Route path="/jobs" element={<Suspense fallback={<div />}><CareersPage /></Suspense>} />

           <Route path="/ai-magic" element={
              <>
                <SEO 
                  title="Yureka AI Magic | Your AI Financial Co-Pilot" 
                  description="From picking the perfect credit card to maximising every reward point — Yureka AI is your always-on, personalised financial intelligence layer."
                />
                <Suspense fallback={<div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-clay" size={40} /></div>}>
                  <AIMagicPage />
                </Suspense>
              </>
           } />
           <Route path="/explorer" element={<Navigate to="/cards" replace />} />
           <Route path="/ai" element={<Navigate to="/ai-magic" replace />} />
           <Route path="/matrix" element={<Navigate to="/rewards-calculator" replace />} />
           <Route path="/journal" element={<Navigate to="/blogs" replace />} />
           <Route path="/rewards-calculator" element={
              <Suspense fallback={<div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-clay" size={40} /></div>}>
                <RewardsTransferCalculator />
              </Suspense>
           } />

           
           <Route path="*" element={<MainPage />} />
        </Routes>
      </main>

      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <BottomBanner />}

      {!isAdminRoute && (
        <Link 
          to="/join-waitlist"
          className="fixed bottom-14 right-6 z-[70] bg-clay text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform cursor-pointer border border-white/20"
          aria-label="Join VIP Waitlist"
        >
          <button className="cursor-pointer">
            <Sparkles size={28} />
          </button>
        </Link>
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <SupabaseProvider>
        <AppContent />
      </SupabaseProvider>
    </BrowserRouter>
  );
};

export default App;