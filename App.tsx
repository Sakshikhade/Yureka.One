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
import Neighborhoods from './components/Neighborhoods';
import Community from './components/Community';
import ComingSoon from './components/ComingSoon';
import SocialProof from './components/SocialProof';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import AllHomes from './components/AllHomes';
import OSPage from './components/OSPage';
import BFFPage from './components/BFFPage';
import OurStory from './components/OurStory';
import CareersPage from './components/CareersPage';
import BlogPage from './components/BlogPage';
import Security from './components/Security';
import WaitlistPage from './components/WaitlistPage';
import AdminDashboard from './components/AdminDashboard';
import { featuredCards } from './data';
import { Sparkles } from 'lucide-react';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

const MainPage = () => (
  <>
    <Hero />
    <TextReveal />
    <ShowcaseCarousel cards={featuredCards} />
    <Stats />
    <Marquee />
    <Security />
    <Neighborhoods />
    <Community />
    <ComingSoon />
    <SocialProof />
    <FAQ />
  </>
);

const AppContent: React.FC = () => {
  return (
    <div className="min-h-screen bg-cream font-sans text-ink relative pt-10">
      {/* Global Texture Overlays */}
      <div className="paper-texture" />
      <div className="vignette-overlay" />

      <ScrollToTop />
      <TopBanner />
      <Navbar />
      
      <main className="relative z-10">
        <Routes>
           <Route path="/" element={<MainPage />} />
           
           {/* New Slugs */}
           <Route path="/explorer" element={<AllHomes />} />
           <Route path="/ai" element={<OSPage />} />
           <Route path="/matrix" element={<BFFPage />} />
           <Route path="/story" element={<OurStory />} />
           <Route path="/jobs" element={<CareersPage />} />
           <Route path="/blogs" element={<BlogPage />} />
           <Route path="/vip" element={<WaitlistPage />} />
           <Route path="/admin" element={<AdminDashboard />} />

           {/* Redirects for old slugs */}
           <Route path="/cards" element={<Navigate to="/explorer" replace />} />
           <Route path="/ai-magic" element={<Navigate to="/ai" replace />} />
           <Route path="/rewards" element={<Navigate to="/matrix" replace />} />
           <Route path="/manifesto" element={<Navigate to="/story" replace />} />
           <Route path="/careers" element={<Navigate to="/jobs" replace />} />
           <Route path="/journal" element={<Navigate to="/blogs" replace />} />
           <Route path="/join-waitlist" element={<Navigate to="/vip" replace />} />

           <Route path="*" element={<MainPage />} />
        </Routes>
      </main>

      <Footer />
      <BottomBanner />

      {/* Floating AI Button */}
      <Link 
        to="/ai"
        className="fixed bottom-14 right-6 z-[70] bg-clay text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform cursor-pointer border border-white/20"
        aria-label="Chat with Jupyter AI"
      >
        <Sparkles size={28} />
      </Link>
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