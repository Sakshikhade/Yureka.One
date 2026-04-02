import React from 'react';
import { BrowserRouter, Routes, Route, useLocation, Link, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import TopBanner from './components/TopBanner';
import BottomBanner from './components/BottomBanner';
import Hero from './components/Hero';
import ShowcaseCarousel from './components/ShowcaseCarousel';
import TextReveal from './components/TextReveal';
import Stats from './components/Stats';
import Marquee from './components/Marquee';
import Community from './components/Community';
import ComingSoon from './components/ComingSoon';
import SocialProof from './components/SocialProof';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import AllHomes from './components/AllHomes';
import OSPage from './components/OSPage';
import OurStory from './components/OurStory';
import CareersPage from './components/CareersPage';
import BlogPage from './components/BlogPage';
import Security from './components/Security';
import WaitlistPage from './components/WaitlistPage';
import RewardsPage from './components/RewardsPage';
import AdminDashboard from './components/AdminDashboard';
import { getCards } from './services/supabaseService';
import { Card } from './types';
import { featuredCards } from './data';
import { Sparkles } from 'lucide-react';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

const MainPage = ({ cards }: { cards: Card[] }) => (
  <>
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
      {/* Global Texture Overlays */}
      <div className="paper-texture" />
      <div className="vignette-overlay" />

      <ScrollToTop />
      {!isAdminRoute && <TopBanner />}
      {!isAdminRoute && <Navbar />}
      
      <main className={`relative z-10 ${isAdminRoute ? 'pt-0' : ''}`}>
        <Routes>
           <Route path="/" element={<MainPage cards={cards} />} />
           
           {/* New Slugs matching Header */}
           <Route path="/cards" element={<AllHomes />} />
           <Route path="/ai-magic" element={<OSPage />} />
           <Route path="/rewards" element={<RewardsPage />} />
           <Route path="/manifesto" element={<OurStory />} />
           <Route path="/jobs" element={<CareersPage />} />
           <Route path="/blogs" element={<BlogPage />} />
           <Route path="/join-waitlist" element={<WaitlistPage />} />
           <Route path="/admin" element={<AdminDashboard />} />

           {/* Redirects for old slugs */}
           <Route path="/explorer" element={<Navigate to="/cards" replace />} />
           <Route path="/ai" element={<Navigate to="/ai-magic" replace />} />
           <Route path="/matrix" element={<Navigate to="/rewards" replace />} />
           <Route path="/story" element={<Navigate to="/manifesto" replace />} />
           <Route path="/jobs-old" element={<Navigate to="/jobs" replace />} />
           <Route path="/journal" element={<Navigate to="/blogs" replace />} />
           <Route path="/vip" element={<Navigate to="/join-waitlist" replace />} />

           <Route path="*" element={<MainPage cards={cards} />} />
        </Routes>
      </main>

      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <BottomBanner />}

      {/* Floating AI Button */}
      {!isAdminRoute && (
        <Link 
          to="/ai-magic"
          className="fixed bottom-14 right-6 z-[70] bg-clay text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform cursor-pointer border border-white/20"
          aria-label="Chat with Yureka AI"
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