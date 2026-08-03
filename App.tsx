import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

import Navbar from '@landing/home-v2/Navbar';
import Footer from '@shared/Footer';
import SEO from '@shared/SEO';
import { SupabaseProvider, useSupabase } from '@shared/SupabaseProvider';
import { SkeletonCard } from '@shared/SkeletonLoaders';
import { ErrorBoundary } from '@shared/ErrorBoundary';
import { staticPageMeta } from '@backend/lib/seo/pageMeta';

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
        console.warn('Chunk loading failed. Forcing refresh to sync hashes.', error);
        window.sessionStorage.setItem('page-has-been-force-refreshed', 'true');
        window.location.reload();
        return { default: () => null };
      }
      throw error;
    }
  });

// Landing
const MainPage = lazyWithRetry(() => import('@landing/MainPage'));
const BrandExplorer = lazyWithRetry(() => import('@landing/BrandExplorer'));
const OurStory = lazyWithRetry(() => import('@landing/OurStory'));
const JournalPage = lazyWithRetry(() => import('@landing/JournalPage'));
const BlogDetail = lazyWithRetry(() => import('@landing/BlogDetail'));
const PrivacyPolicy = lazyWithRetry(() => import('@landing/PrivacyPolicy'));
const TermsOfService = lazyWithRetry(() => import('@landing/TermsOfService'));
const SecurityProtocolPage = lazyWithRetry(() => import('@landing/SecurityProtocolPage'));
const CommunityGuidelines = lazyWithRetry(() => import('@landing/CommunityGuidelines'));
const YurekaAIPage = lazyWithRetry(() => import('@landing/YurekaAIPage'));
const CareersPage = lazyWithRetry(() => import('@landing/CareersPage'));
const ForBrands = lazyWithRetry(() => import('@landing/ForBrands'));
const NotFoundPage = lazyWithRetry(() => import('@landing/NotFoundPage'));

// App (product)
const AdminDashboard = lazyWithRetry(() => import('@app/AdminDashboard'));
const WaitlistPage = lazyWithRetry(() => import('@app/WaitlistPage'));
const WaitingPage = lazyWithRetry(() => import('@app/WaitingPage'));
const DashboardLayout = lazyWithRetry(() => import('@app/Dashboard/DashboardLayout'));

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

const AppContent: React.FC = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isDashboardRoute = location.pathname.startsWith('/dashboard');
  const isHomeRoute = location.pathname === '/';
  // /for-brands is the standalone full-screen Partnership Deck (rendered as an
  // isolated iframe in ForBrands) — it owns the whole viewport, so it opts out
  // of the sitewide navbar, footer, editorial grid, and top padding.
  const isForBrandsRoute = location.pathname === '/for-brands';
  const isSpecialRoute = isAdminRoute || isDashboardRoute || isForBrandsRoute;
  // Home page implements its own editorial 5-column grid (incl. its own Footer) — every
  // other non-special route is wrapped in the same grid here so content stays within
  // columns 2-4 (the 60%-width "Intelligence Core") with empty margin columns 1 & 5.
  const applyEditorialGrid = !isSpecialRoute && !isHomeRoute;
  // Home renders its own footer inside MainPage and its cinematic hero
  // already reserves space for the fixed navbar internally, so it (like
  // admin/dashboard) opts out of the sitewide pt-24 offset — otherwise
  // it'd leave a gap above the hero video. The navbar itself still renders
  // on home now that it's the shared site-wide navbar, not a homepage-only one.
  const noTopPadding = isSpecialRoute || isHomeRoute;

  const appRoutes = (
              <Routes>
              <Route path="/" element={<MainPage />} />

              <Route path="/brands" element={
                <>
                  <SEO {...staticPageMeta['/brands']} />
                  <BrandExplorer />
                </>
              } />

              <Route path="/for-brands" element={<ForBrands />} />

              <Route path="/blogs" element={
                <>
                  <SEO {...staticPageMeta['/blogs']} />
                  <JournalPage />
                </>
              } />

              <Route path="/blogs/:slug" element={<BlogDetail />} />

              <Route path="/admin" element={
                <>
                  <SEO {...staticPageMeta['/admin']} />
                  <AdminDashboard />
                </>
              } />
              <Route path="/login" element={
                <>
                  <SEO {...staticPageMeta['/login']} />
                  <WaitlistPage />
                </>
              } />
              <Route path="/join-waitlist" element={
                <>
                  <SEO {...staticPageMeta['/join-waitlist']} />
                  <WaitlistPage />
                </>
              } />
              <Route path="/waiting" element={
                <>
                  <SEO {...staticPageMeta['/waiting']} />
                  <WaitingPage />
                </>
              } />
              <Route path="/dashboard/*" element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              } />

              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/security-protocol" element={<SecurityProtocolPage />} />
              <Route path="/community-guidelines" element={<CommunityGuidelines />} />
              <Route path="/yureka-os" element={<Navigate to="/" replace />} />
              <Route path="/manifesto" element={<OurStory />} />
              <Route path="/jobs" element={<CareersPage />} />

              <Route path="/yureka-ai" element={
                <>
                  <SEO {...staticPageMeta['/yureka-ai']} />
                  <YurekaAIPage />
                </>
              } />
              <Route path="/ai-magic" element={<Navigate to="/yureka-ai" replace />} />
              <Route path="/ai" element={<Navigate to="/yureka-ai" replace />} />

              <Route path="*" element={<NotFoundPage />} />
            </Routes>
  );

  return (
    <div className={`min-h-screen bg-cream font-sans text-white relative ${noTopPadding ? 'pt-0' : 'pt-24 md:pt-28'}`}>

      <ScrollToTop />
      {(!isSpecialRoute || isForBrandsRoute) && <Navbar />}

      <main className={`relative z-10 ${noTopPadding ? 'pt-0' : ''}`}>
        <Suspense fallback={<div className="fixed inset-0 bg-cream" style={{ zIndex: 100 }} />}>
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