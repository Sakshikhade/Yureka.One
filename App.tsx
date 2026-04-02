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

const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
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
    <SEO title="Home | AI-Driven Credit Card Matching" />
    <Hero />
    <TextReveal />
    <ShowcaseCarousel cards={cards} />
    <Stats />
    <Marquee />
    <Security />
    <Community />
    <ComingSoon />
    <SocialProof />
    <FAQ />
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
                   <SEO title="Card Explorer" description="Compare and match from 200+ credit cards in India with our AI engine." />
                   <CardExplorer />
                 </>
               } />
               
               <Route path="/cards/:id" element={
                 <>
                   <SEO title="Instrument Detail" description="Deep dive into reward structures and lifestyle perks." />
                   <CardDetail />
                 </>
               } />
               
               <Route path="/ai-magic" element={
                 <>
                   <SEO title="AI Magic" description="Unlock the power of conversational AI for your financial optimization." />
                   <ComingSoon />
                 </>
               } />
               
               <Route path="/rewards" element={
                 <>
                   <SEO title="Reward Matrix" description="Visualize and optimize your reward ecosystem." />
                   <RewardsPage />
                 </>
               } />
               
               <Route path="/manifesto" element={
                 <>
                   <SEO title="Our Manifesto" description="Why we are building a more transparent financial future." />
                   <OurStory />
                 </>
               } />
               
               <Route path="/jobs" element={<CareersPage />} />
               
               <Route path="/blogs" element={
                 <>
                   <SEO title="Journal" description="Expert insights on credit, finance, and optimization." />
                   <BlogPage />
                 </>
               } />
               
               <Route path="/blogs/:slug" element={
                 <>
                   <SEO title="Journal Detail" description="In-depth analysis of credit policy and financial strategy." />
                   <BlogDetail />
                 </>
               } />
               
               <Route path="/join-waitlist" element={
                 <>
                   <SEO title="VIP Waitlist" description="Secure your spot in the future of credit card mastery." />
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