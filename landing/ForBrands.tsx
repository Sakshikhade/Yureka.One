import React from 'react';
import SEO from '@shared/SEO';

/**
 * The "For Brands" page is the standalone Yureka Partnership Deck — a
 * self-contained, full-screen slide presentation that ships with its own
 * global styles, fonts, and slide-navigation scripts. It lives as a static
 * asset in /public and is rendered full-viewport inside an iframe so its
 * global CSS (`* { … }`, `body { overflow:hidden }`) and its scripts stay
 * fully isolated from the rest of the app. The fixed, top-layer iframe
 * covers the sitewide navbar/footer so the route renders as the deck alone.
 */
const ForBrands: React.FC = () => {
  return (
    <>
      <SEO
        title="Partner With Yureka | Smart Checkout, AI Ads & Credit Data"
        description="Cut RTO and COD failures with Yureka smart checkout, run intent-based campaigns via Yureka AI, and access consent-first alternative credit signals for lending decisions."
      />
      <iframe
        src="/yureka-partnership-deck.html"
        title="Yureka — Partnership Deck"
        className="fixed inset-0 z-[9999] border-0 bg-[#080B0A]"
        style={{ width: '100vw', height: '100vh' }}
        allow="fullscreen"
      />
    </>
  );
};

export default ForBrands;
