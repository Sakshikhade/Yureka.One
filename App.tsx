import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate, Link } from 'react-router-dom';
import { Loader2, Sparkles } from 'lucide-react';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SEO from './components/SEO';
import SocialProof from './components/SocialProof';
import BottomBanner from './components/BottomBanner';
import TopBanner from './components/TopBanner';
import { SupabaseProvider } from './components/SupabaseProvider';
import { SkeletonCard } from './components/SkeletonLoaders';

// Lazy Loaded Pages
const MainPage = lazy(() => import('./components/MainPage'));
const CardExplorer = lazy(() => import('./components/CardExplorer'));
const CardDetail = lazy(() => import('./components/CardDetail'));
const OurStory = lazy(() => import('./components/OurStory'));
const JournalPage = lazy(() => import('./components/JournalPage'));
const BlogDetail = lazy(() => import('./components/BlogDetail'));
const PrivacyPolicy = lazy(() => import('./components/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./components/TermsOfService'));
const SecurityProtocolPage = lazy(() => import('./components/SecurityProtocolPage'));
const CommunityGuidelines = lazy(() => import('./components/CommunityGuidelines'));
const YurekaOsPage = lazy(() => import('./components/YurekaOsPage'));
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));
const WaitlistPage = lazy(() => import('./components/WaitlistPage'));
const AIMagicPage = lazy(() => import('./components/AIMagicPage'));
const CareersPage = lazy(() => import('./components/CareersPage'));
const RewardsTransferCalculator = lazy(() => import('./components/RewardsTransferCalculator'));

import { motion, AnimatePresence } from 'motion/react';

// Optimized Scroll Management
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();
  
  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
    } else {
      const id = hash.replace('#', '');
      const scrollWithRetry = (retryCount = 0) => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        } else if (retryCount < 15) {
          setTimeout(() => scrollWithRetry(retryCount + 1), 100);
        }
      };
      scrollWithRetry();
    }
  }, [pathname, hash]);
  
  return null;
}

const Preloader = () => {
  const [isVisible, setIsVisible] = React.useState(true);
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  // Disable loader for Admin to keep it fast
  useEffect(() => {
    if (isAdmin) {
      setIsVisible(false);
      return;
    }
    const timer = setTimeout(() => setIsVisible(false), 2500);
    return () => clearTimeout(timer);
  }, [isAdmin]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            transition: { duration: 0.8, ease: [0.65, 0, 0.35, 1] }
          }}
          className="fixed inset-0 z-[100] bg-cream flex items-center justify-center overflow-hidden"
        >
          <video 
            autoPlay 
            muted 
            playsInline
            loop={false}
            className="w-48 h-48 md:w-64 md:h-64 object-contain"
          >
            <source src="/yurekaloader.mov" type="video/quicktime" />
            <source src="/yurekaloader.mov" type="video/mp4" />
          </video>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const AppContent: React.FC = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className={`min-h-screen bg-cream font-sans text-ink relative ${isAdminRoute ? 'pt-0' : 'pt-32 md:pt-40'}`}>
      {!isAdminRoute && <Preloader />}

      <div className="paper-texture" />
      <div className="vignette-overlay" />

      <ScrollToTop />
      {!isAdminRoute && <TopBanner />}
      {!isAdminRoute && <Navbar />}
      
      <main className={`relative z-10 ${isAdminRoute ? 'pt-0' : ''}`}>
        <Suspense fallback={<div className="h-screen flex items-center justify-center bg-cream"><Loader2 className="animate-spin text-clay" size={40} /></div>}>
          <Routes>
            <Route path="/" element={<MainPage />} />
            
            <Route path="/cards" element={
              <>
                <SEO 
                  title="Card Explorer | Precision Matching Engine" 
                  description="Deep-dive into 200+ credit cards. Filter by rewards, lounge access, and lifestyle perks."
                />
                <CardExplorer />
              </>
            } />
            
            <Route path="/cards/:slug" element={<CardDetail />} />
            
            <Route path="/blogs" element={
              <>
                <SEO 
                  title="Pulse | Credit Intelligence Journal" 
                  description="Expert analysis on reward hacking, luxury travel, and the Indian credit landscape."
                />
                <JournalPage />
              </>
            } />
            
            <Route path="/blogs/:slug" element={<BlogDetail />} />
            
            <Route path="/join-waitlist" element={
               <>
                 <SEO 
                   title="The Registry | Secure Your Access" 
                   description="Join the elite waitlist for early access to the Yureka Neural Engine."
                 />
                 <WaitlistPage />
              </>
            } />
            
            <Route path="/admin" element={<AdminDashboard />} />
            
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/security-protocol" element={<SecurityProtocolPage />} />
            <Route path="/community-guidelines" element={<CommunityGuidelines />} />
            <Route path="/yureka-os" element={<YurekaOsPage />} />
            <Route path="/manifesto" element={<OurStory />} />
            <Route path="/jobs" element={<CareersPage />} />

            <Route path="/ai-magic" element={
               <>
                 <SEO 
                   title="Yureka AI Magic | Your AI Financial Co-Pilot" 
                   description="From picking the perfect credit card to maximising every reward point."
                 />
                 <AIMagicPage />
               </>
            } />
            <Route path="/explorer" element={<Navigate to="/cards" replace />} />
            <Route path="/ai" element={<Navigate to="/ai-magic" replace />} />
            <Route path="/matrix" element={<Navigate to="/rewards-calculator" replace />} />
            <Route path="/journal" element={<Navigate to="/blogs" replace />} />
            <Route path="/rewards-calculator" element={<RewardsTransferCalculator />} />

            <Route path="*" element={<MainPage />} />
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
      <SupabaseProvider>
        <AppContent />
      </SupabaseProvider>
    </BrowserRouter>
  );
};

export default App;