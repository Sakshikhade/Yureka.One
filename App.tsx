import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate, Link } from 'react-router-dom';
import { Loader2, Sparkles } from 'lucide-react';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SEO from './components/SEO';
import SocialProof from './components/SocialProof';
import BottomBanner from './components/BottomBanner';
import TopBanner from './components/TopBanner';
import { SupabaseProvider, useSupabase } from './components/SupabaseProvider';
import { SkeletonCard } from './components/SkeletonLoaders';
import { ErrorBoundary } from './components/ErrorBoundary';
import ContributionModal from './components/ContributionModal';

// Robust Lazy Loader to handle chunk loading failures (common during new deploys)
const lazyWithRetry = (componentImport: () => Promise<any>) =>
  lazy(async () => {
    const pageHasAlreadyBeenForceRefreshed = JSON.parse(
      window.sessionStorage.getItem('page-has-been-force-refreshed') || 'false'
    );

    try {
      const component = await componentImport();
      window.sessionStorage.setItem('page-has-been-force-refreshed', 'false');
      return component;
    } catch (error) {
      if (!pageHasAlreadyBeenForceRefreshed) {
        // Logging for visibility
        console.warn('Chunk loading failed. Forcing refresh to sync hashes.', error);
        window.sessionStorage.setItem('page-has-been-force-refreshed', 'true');
        window.location.reload();
        return { default: () => null }; // Return empty component while reloading
      }

      // If it still fails after a refresh, throw the error to be caught by ErrorBoundary
      throw error;
    }
  });

// Lazy Loaded Pages
const MainPage = lazyWithRetry(() => import('./components/MainPage'));
const CardExplorer = lazyWithRetry(() => import('./components/CardExplorer'));
const CardDetail = lazyWithRetry(() => import('./components/CardDetail'));
const OurStory = lazyWithRetry(() => import('./components/OurStory'));
const JournalPage = lazyWithRetry(() => import('./components/JournalPage'));
const BlogDetail = lazyWithRetry(() => import('./components/BlogDetail'));
const PrivacyPolicy = lazyWithRetry(() => import('./components/PrivacyPolicy'));
const TermsOfService = lazyWithRetry(() => import('./components/TermsOfService'));
const SecurityProtocolPage = lazyWithRetry(() => import('./components/SecurityProtocolPage'));
const CommunityGuidelines = lazyWithRetry(() => import('./components/CommunityGuidelines'));
const YurekaOsPage = lazyWithRetry(() => import('./components/YurekaOsPage'));
const AdminDashboard = lazyWithRetry(() => import('./components/AdminDashboard'));
const YurekaAIPage = lazyWithRetry(() => import('./components/YurekaAIPage'));
const CareersPage = lazyWithRetry(() => import('./components/CareersPage'));
const RewardsTransferCalculator = lazyWithRetry(() => import('./components/RewardsTransferCalculator'));
const CategoriesPage = lazyWithRetry(() => import('./components/CategoriesPage'));
const CategoryDetailPage = lazyWithRetry(() => import('./components/CategoryDetailPage'));
const ComparePage = lazyWithRetry(() => import('./components/ComparePage'));
const ComparisonDetail = lazyWithRetry(() => import('./components/ComparisonDetail'));
const ContributePage = lazyWithRetry(() => import('./components/ContributePage'));
const LoginPage = lazyWithRetry(() => import('./components/LoginPage'));
const WaitlistPage = lazyWithRetry(() => import('./components/WaitlistPage'));
const WaitingPage = lazyWithRetry(() => import('./components/WaitingPage'));
const DashboardLayout = lazyWithRetry(() => import('./components/Dashboard/DashboardLayout'));

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


const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUserStatus, isLoading } = useSupabase();
  const location = useLocation();

  if (isLoading && currentUserStatus === 'loading') {
    return (
      <div className="fixed inset-0 bg-cream flex items-center justify-center">
        <Loader2 className="animate-spin text-clay" size={48} />
      </div>
    );
  }

  if (currentUserStatus === 'admin') return <>{children}</>;
  
  if (currentUserStatus === 'none' || !currentUserStatus) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (currentUserStatus === 'pending' || currentUserStatus === 'on-hold') {
    return <Navigate to="/waiting" replace />;
  }

  if (currentUserStatus === 'rejected') {
    return <Navigate to="/waiting" replace />; // Waiting page handles rejected state
  }

  return <>{children}</>;
};

const AppContent: React.FC = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isDashboardRoute = location.pathname.startsWith('/dashboard');
  const isSpecialRoute = isAdminRoute || isDashboardRoute;

  return (
    <div className={`min-h-screen bg-cream font-sans text-white relative ${isSpecialRoute ? 'pt-0' : 'pt-32 md:pt-36'}`}>

      <ScrollToTop />
      {!isSpecialRoute && <TopBanner />}
      {!isSpecialRoute && <Navbar />}
      
      {!isAdminRoute && <ContributionModal />}
      
      <main className={`relative z-10 ${isSpecialRoute ? 'pt-0' : ''}`}>
        <Suspense fallback={
          <div className="fixed inset-0 z-[100] bg-cream/80 backdrop-blur-xl flex items-center justify-center overflow-hidden">
            <motion.div 
               animate={{ scale: [0.95, 1, 0.95], opacity: [0.5, 1, 0.5] }}
               transition={{ duration: 2, repeat: Infinity }}
               className="w-40 h-40 bg-cream rounded-[2rem] shadow-2xl flex items-center justify-center border border-white/5"
            >
               <Sparkles className="text-clay" size={48} />
            </motion.div>
          </div>
        }>
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<MainPage />} />
              
              <Route path="/cards" element={
                <>
                  <SEO 
                    title="Card Explorer | Professional Credit Card Search" 
                    description="Expert analysis on 200+ credit cards. Filter by rewards, lounge access, and lifestyle perks."
                  />
                  <CardExplorer />
                </>
              } />
              
              <Route path="/cards/:slug" element={<CardDetail />} />
              
              <Route path="/blogs" element={
                <>
                  <SEO 
                    title="Pulse | Expert Credit Card Journal" 
                    description="Expert analysis on reward hacking, luxury travel, and the Indian credit landscape."
                  />
                  <JournalPage />
                </>
              } />
              
              <Route path="/blogs/:slug" element={<BlogDetail />} />
              
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/join-waitlist" element={<WaitlistPage />} />
              <Route path="/waiting" element={<WaitingPage />} />
              
              <Route path="/dashboard/*" element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              } />
              
              <Route path="/contribute" element={<ContributePage />} />
              <Route path="/coming-soon" element={<Navigate to="/contribute" replace />} />
              
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/security-protocol" element={<SecurityProtocolPage />} />
              <Route path="/community-guidelines" element={<CommunityGuidelines />} />
              <Route path="/free-tools" element={<YurekaOsPage />} />
              <Route path="/yureka-os" element={<Navigate to="/free-tools" replace />} />
              <Route path="/manifesto" element={<OurStory />} />
              <Route path="/jobs" element={<CareersPage />} />
   
              <Route path="/yureka-ai" element={
                 <>
                   <SEO 
                     title="Yureka AI | Your Credit Card Co-Pilot" 
                     description="From picking the perfect credit card to maximising every reward point."
                   />
                   <YurekaAIPage />
                 </>
              } />
              <Route path="/explorer" element={<Navigate to="/cards" replace />} />
              <Route path="/ai-magic" element={<Navigate to="/yureka-ai" replace />} />
              <Route path="/ai" element={<Navigate to="/yureka-ai" replace />} />
              <Route path="/matrix" element={<Navigate to="/rewards-calculator" replace />} />
              <Route path="/journal" element={<Navigate to="/blogs" replace />} />
              <Route path="/rewards-calculator" element={<RewardsTransferCalculator />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/categories/:slug" element={<CategoryDetailPage />} />
              <Route path="/compare" element={<ComparePage />} />
              <Route path="/compare/:slug" element={<ComparisonDetail />} />
   
              <Route path="*" element={<MainPage />} />
            </Routes>
          </ErrorBoundary>
        </Suspense>
      </main>

      {!isSpecialRoute && location.pathname !== '/' && <Footer />}
      {!isSpecialRoute && <BottomBanner />}

      {!isAdminRoute && (
        <Link 
          to="/contribute"
          className="fixed bottom-14 right-6 z-[100] bg-clay text-black p-4 rounded-full shadow-2xl hover:scale-110 transition-transform cursor-pointer border border-clay/20"
          aria-label="Submit a Contribution"
        >
          <button className="cursor-pointer" aria-hidden="true" tabIndex={-1}>
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