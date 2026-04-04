import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Link, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import TopBanner from './components/TopBanner';
import BottomBanner from './components/BottomBanner';
import Footer from './components/Footer';
import SEO from './components/SEO';
import { getCards } from './services/supabaseService';
import { Card } from './types';
import { featuredCards } from './data';
import { Sparkles, Loader2 } from 'lucide-react';

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
const RewardsPage = lazy(() => import('./components/RewardsPage'));
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));
const CardDetail = lazy(() => import('./components/CardDetail'));
const BlogDetail = lazy(() => import('./components/BlogDetail'));
const PrivacyPolicy = lazy(() => import('./components/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./components/TermsOfService'));
const CommunityGuidelines = lazy(() => import('./components/CommunityGuidelines'));
const SecurityProtocolPage = lazy(() => import('./components/SecurityProtocolPage'));

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
        } else if (retryCount < 20) { // Try for 2 seconds (20 * 100ms)
          setTimeout(() => scrollWithRetry(retryCount + 1), 100);
        }
      };
      scrollWithRetry();
    }
  }, [pathname, hash]);
  
  return null;
}

const LoadingScreen = () => (
    <div className="fixed inset-0 z-[100] bg-cream flex flex-col items-center justify-center font-serif italic text-ink animate-fade-in">
        <div className="flex items-center gap-4 mb-4">
            <Loader2 className="animate-spin text-clay" size={32} />
            <span className="text-2xl tracking-tighter">Yureka.money</span>
        </div>
        <p className="text-ink/40 text-xs font-bold uppercase tracking-[0.4em]">Optimizing your experience</p>
    </div>
);

const MainPage = ({ cards }: { cards: Card[] }) => (
  <>
    <SEO 
      title="Yureka | AI-Driven Credit Card Intelligence" 
      description="Maximize every spend with India's most advanced AI credit card optimizer. Match with 200+ cards and unlock elite rewards instantly."
    />
    <Hero />
    <TextReveal />
    <div id="showcase" className="scroll-mt-24"><ShowcaseCarousel cards={cards} /></div>
    <div id="stats" className="scroll-mt-24"><Stats /></div>
    <Marquee />
    <div id="security" className="scroll-mt-24"><Security /></div>
    <div id="reviews" className="scroll-mt-24"><Community /></div>
    <ComingSoon />
    <SocialProof />
    <div id="faq" className="scroll-mt-24"><FAQ /></div>
  </>
);

const AppContent: React.FC = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const [cards, setCards] = React.useState<Card[]>(featuredCards);

  React.useEffect(() => {
    const unsubscribe = getCards((fetchedCards) => {
      setCards(fetchedCards.length > 0 ? fetchedCards : featuredCards);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className={`min-h-screen bg-cream font-sans text-ink relative ${isAdminRoute ? 'pt-0' : 'pt-10'}`}>
      <div className="paper-texture" />
      <div className="vignette-overlay" />

      <ScrollToTop />
      {!isAdminRoute && <TopBanner />}
      {!isAdminRoute && <Navbar />}
      
      <main className={`relative z-10 ${isAdminRoute ? 'pt-0' : ''}`}>
        <Suspense fallback={<LoadingScreen />}>
            <Routes>
               <Route path="/" element={<MainPage cards={cards} />} />
               
               <Route path="/cards" element={
                  <>
                    <SEO 
                      title="Card Explorer | Precision Matching Engine" 
                      description="Deep-dive into 200+ credit cards. Filter by rewards, lounge access, and lifestyle perks to find your high-performance financial partner."
                    />
                   <CardExplorer />
                 </>
               } />
               
               <Route path="/cards/:slug" element={
                  <>
                    <SEO 
                      title="Instrument Specification" 
                      description="Detailed rewards analysis, annual fee breakdowns, and elite perk evaluations for your next credit instrument."
                    />
                   <CardDetail />
                 </>
               } />
               
               <Route path="/ai-magic" element={
                  <>
                    <SEO 
                      title="AI Neural Core | Financial Optimization" 
                      description="The future of conversational finance. Harness our neural engine to architect your perfect reward ecosystem."
                    />
                   <ComingSoon />
                 </>
               } />
               
               <Route path="/rewards" element={
                  <>
                    <SEO 
                      title="The Reward Matrix | Network Analysis" 
                      description="Visualize your earnings potential. Map your spending habits across India's top reward networks with precision."
                    />
                   <RewardsPage />
                 </>
               } />
               
               <Route path="/manifesto" element={
                  <>
                    <SEO 
                      title="The Yureka Manifesto | Our Vision" 
                      description="Why transparency matters. Join us in building a future where financial data serves the individual first."
                    />
                   <OurStory />
                 </>
               } />
               
               <Route path="/privacy-policy" element={
                  <>
                    <SEO 
                      title="Privacy Policy | Yureka.Money" 
                      description="How we protect your financial data and comply with DPDP regulations."
                    />
                   <PrivacyPolicy />
                 </>
               } />

               <Route path="/terms-of-service" element={
                  <>
                    <SEO 
                      title="Terms of Service | Yureka.Money" 
                      description="Legal agreements and terms of usage for the Yureka.Money platform."
                    />
                   <TermsOfService />
                 </>
               } />

               <Route path="/community-guidelines" element={
                  <>
                    <SEO 
                      title="Community Guidelines | Yureka.Money" 
                      description="Rules of engagement for the highest quality financial club."
                    />
                   <CommunityGuidelines />
                 </>
               } />

               <Route path="/security-protocol" element={
                  <>
                    <SEO 
                      title="Security Protocol | Yureka.Money" 
                      description="Bank-grade encryption and architectural security measures."
                    />
                   <SecurityProtocolPage />
                 </>
               } />
               
               <Route path="/jobs" element={<CareersPage />} />
               
               <Route path="/blogs" element={
                  <>
                    <SEO 
                      title="The Journal | Financial Strategy & Lore" 
                      description="Expert dispatches on credit policy, reward loopholes, and the strategy of high-end financial management."
                    />
                   <BlogPage />
                 </>
               } />
               
               <Route path="/blogs/:slug" element={
                  <>
                    <SEO 
                      title="Registry Entry | Financial Insight" 
                      description="Detailed deep-dives into credit strategy and editorial analysis from the Yureka investigative team."
                    />
                   <BlogDetail />
                 </>
               } />
               
               <Route path="/join-waitlist" element={
                  <>
                    <SEO 
                      title="The Registry | Secure Your Access" 
                      description="Join the elite waitlist for early access to the Yureka Neural Engine and exclusive reward strategies."
                    />
                   <WaitlistPage />
                 </>
               } />
               
               <Route path="/admin" element={<AdminDashboard />} />

               {/* Redirects */}
               <Route path="/explorer" element={<Navigate to="/cards" replace />} />
               <Route path="/ai" element={<Navigate to="/ai-magic" replace />} />
               <Route path="/matrix" element={<Navigate to="/rewards" replace />} />
               <Route path="/story" element={<Navigate to="/manifesto" replace />} />
               <Route path="/jobs-old" element={<Navigate to="/jobs" replace />} />
               <Route path="/journal" element={<Navigate to="/blogs" replace />} />
               <Route path="/vip" element={<Navigate to="/join-waitlist" replace />} />

               <Route path="*" element={<MainPage cards={cards} />} />
            </Routes>
        </Suspense>
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
      <AppContent />
    </BrowserRouter>
  );
};

export default App;