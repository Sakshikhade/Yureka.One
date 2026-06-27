import React, { Suspense, lazy, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate, Link } from 'react-router-dom';
import { Loader2, Sparkles } from 'lucide-react';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SEO from './components/SEO';
import SocialProof from './components/SocialProof';
import { SupabaseProvider, useSupabase } from './components/SupabaseProvider';
import { SkeletonCard } from './components/SkeletonLoaders';
import { ErrorBoundary } from './components/ErrorBoundary';

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
const BrandExplorer = lazyWithRetry(() => import('./components/BrandExplorer'));
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
const WaitlistPage = lazyWithRetry(() => import('./components/WaitlistPage'));
const WaitingPage = lazyWithRetry(() => import('./components/WaitingPage'));
const DashboardLayout = lazyWithRetry(() => import('./components/Dashboard/DashboardLayout'));
const ByEveryone = lazyWithRetry(() => import('./components/ByEveryone'));

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

  if (isLoading || currentUserStatus === 'loading') {
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

// Full-bleed branded loader — used for both the initial app splash and the
// route-transition Suspense fallback so every loading state looks the same.
const LoaderScreen: React.FC<{ zIndex: number }> = ({ zIndex }) => (
  <div
    className="fixed inset-0 bg-cream flex flex-col items-center justify-center gap-6 overflow-hidden"
    style={{ zIndex }}
  >
    <div className="w-20 h-20 md:w-24 md:h-24 rounded-3xl overflow-hidden shadow-2xl loader-logo-pulse">
      <img src="/logos/yureka-logo-512.png" alt="Yureka" className="w-full h-full object-cover" />
    </div>
    <p className="font-cirka text-white text-base md:text-lg tracking-[0.2em] uppercase">Yureka.Money</p>
    <div className="relative w-40 md:w-56 h-1 bg-white/10 rounded-full overflow-hidden">
      <div className="absolute inset-y-0 left-0 w-1/3 bg-clay rounded-full loader-bar-sweep" />
    </div>
  </div>
);

const AppContent: React.FC = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isDashboardRoute = location.pathname.startsWith('/dashboard');
  const isSpecialRoute = isAdminRoute || isDashboardRoute;
  // Home page implements its own editorial 5-column grid (incl. its own Footer) — every
  // other non-special route is wrapped in the same grid here so content stays within
  // columns 2-4 (the 60%-width "Intelligence Core") with empty margin columns 1 & 5.
  const applyEditorialGrid = !isSpecialRoute && location.pathname !== '/';

  const appRoutes = (
              <Routes>
              <Route path="/" element={<MainPage />} />

              <Route path="/cards" element={
                <>
                  <SEO
                    title="Card Explorer | Professional Reward Analytics & Search"
                    description="Expert analysis on 200+ credit cards. Filter by systematic reward yield, lounge access, and elite lifestyle perks. Match with your perfect portfolio."
                  />
                  <CardExplorer />
                </>
              } />

              <Route path="/cards/:slug" element={<CardDetail />} />

              <Route path="/brands" element={
                <>
                  <SEO
                    title="Brand Explorer | Discover Reward Partners"
                    description="Browse 80+ partner brands across shopping, travel, food, and lifestyle to maximize your card rewards and cashback."
                  />
                  <BrandExplorer />
                </>
              } />

              <Route path="/blogs" element={
                <>
                  <SEO
                    title="Pulse | Strategic Financial Journal"
                    description="Expert analysis on credit arbitrage, reward point devaluation, and high-performance spending strategies in the Indian credit landscape."
                  />
                  <JournalPage />
                </>
              } />

              <Route path="/blogs/:slug" element={<BlogDetail />} />

              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/login" element={<WaitlistPage />} />
              <Route path="/join-waitlist" element={<WaitlistPage />} />
              <Route path="/waiting" element={<WaitingPage />} />
              <Route path="/by-everyone-for-everyone" element={<ByEveryone />} />

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
                    title="Assistant | Your Personal Credit Portfolio Co-Pilot"
                    description="From picking the perfect financial instrument to maximizing every systematic reward point. Your research assistant for elite credit."
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
  );

  return (
    <div className={`min-h-screen bg-cream font-sans text-white relative ${isSpecialRoute ? 'pt-0' : 'pt-24 md:pt-28'}`}>

      <ScrollToTop />
      {!isSpecialRoute && <Navbar />}

      <main className={`relative z-10 ${isSpecialRoute ? 'pt-0' : ''}`}>
        <Suspense fallback={<LoaderScreen zIndex={100} />}>
          <ErrorBoundary>
            {applyEditorialGrid ? (
              <div className="grid grid-cols-1 lg:grid-cols-5 w-full relative">
                {/* COLUMN 1: LEFT MARGIN */}
                <div className="hidden lg:block border-r border-white/5 bg-white/[0.02] h-full min-h-screen" />

                {/* COLUMNS 2-4: INTELLIGENCE CORE (60% WIDTH) */}
                <div className="col-span-1 lg:col-span-3 flex flex-col items-stretch relative z-10 min-w-0">
                  {appRoutes}
                  <Footer />
                </div>

                {/* COLUMN 5: RIGHT MARGIN */}
                <div className="hidden lg:block border-l border-white/5 bg-white/[0.02] h-full min-h-screen" />
              </div>
            ) : (
              appRoutes
            )}
          </ErrorBoundary>
        </Suspense>
      </main>

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
  // Initial branded splash — shows for a fixed window on first load while the
  // real app mounts behind it, then reveals it. Not shown again on in-app route changes.
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 4500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {showSplash && <LoaderScreen zIndex={200} />}
      <BrowserRouter>
        <SupabaseProvider>
          <AppContent />
        </SupabaseProvider>
      </BrowserRouter>
    </>
  );
};

export default App;