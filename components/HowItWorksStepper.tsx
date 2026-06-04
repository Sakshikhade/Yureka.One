import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { ArrowRight, Check, Instagram, Linkedin, Twitter } from 'lucide-react';
import Hls from 'hls.js';

// ==========================================
// ANIMATION & LAYOUT CONFIGURATION
// ==========================================

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' },
  transition: { duration: 0.6, delay, ease: 'easeOut' as const },
});

// ==========================================
// SCROLL-LINKED PARAGRAPH REVEAL COMPONENTS
// ==========================================

interface WordRevealProps {
  word: string;
  index: number;
  totalWords: number;
  scrollYProgress: MotionValue<number>;
  isHighlight: boolean;
}

const WordReveal: React.FC<WordRevealProps> = ({
  word,
  index,
  totalWords,
  scrollYProgress,
  isHighlight,
}) => {
  const progress = index / totalWords;
  // Trigger stagger window
  const start = Math.max(0, progress - 0.15);
  const end = Math.min(1, progress + 0.05);
  const adjustedEnd = end <= start ? start + 0.01 : end;

  // Transition opacity from 0.15 to 1 on scroll
  const opacity = useTransform(scrollYProgress, [start, adjustedEnd], [0.15, 1]);

  return (
    <motion.span
      style={{ opacity }}
      className={`inline-block mr-[0.25em] whitespace-nowrap ${
        isHighlight ? 'text-white font-semibold' : 'text-neutral-400 font-normal'
      }`}
    >
      {word}
    </motion.span>
  );
};

interface ParagraphRevealProps {
  text: string;
  highlightWords?: string[];
  className?: string;
}

const ParagraphReveal: React.FC<ParagraphRevealProps> = ({
  text,
  highlightWords = [],
  className = '',
}) => {
  const containerRef = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.9', 'end 0.4'],
  });

  const words = text.split(' ');
  const totalWords = words.length;

  return (
    <p ref={containerRef} className={`flex flex-wrap justify-center text-center ${className}`}>
      {words.map((word, i) => {
        // Strip punctuation for matching
        const cleanWord = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()—]/g, '').toLowerCase();
        const isHighlight = highlightWords.includes(cleanWord);

        return (
          <WordReveal
            key={i}
            word={word}
            index={i}
            totalWords={totalWords}
            scrollYProgress={scrollYProgress}
            isHighlight={isHighlight}
          />
        );
      })}
    </p>
  );
};

// ==========================================
// HLS PLAYER COMPONENT
// ==========================================

interface HlsPlayerProps {
  src: string;
  className?: string;
}

const HlsPlayer: React.FC<HlsPlayerProps> = ({ src, className = '' }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls: Hls | null = null;

    if (Hls.isSupported()) {
      hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch((err) => console.log('HLS Play error:', err));
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Fallback for Safari/iOS
      video.src = src;
      video.addEventListener('loadedmetadata', () => {
        video.play().catch((err) => console.log('Native HLS Play error:', err));
      });
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [src]);

  return <video ref={videoRef} muted loop playsInline className={className} />;
};

// ==========================================
// MAIN STEPPER REPLACEMENT
// ==========================================

const HowItWorksStepper: React.FC = () => {
  return (
    <div className="w-full bg-black text-white font-sans flex flex-col items-center">
      {/* SECTION 2: HERO */}
      <section className="relative w-full min-h-screen flex flex-col justify-center items-center overflow-hidden py-24 px-6">
        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-80"
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260325_120549_0cd82c36-56b3-4dd9-b190-069cfc3a623f.mp4"
        />

        {/* Bottom Fade to Black */}
        <div className="absolute bottom-0 inset-x-0 h-64 bg-gradient-to-t from-black to-transparent pointer-events-none z-10" />

        {/* Hero Content */}
        <div className="relative z-20 max-w-4xl mx-auto w-full flex flex-col items-center text-center mt-12 md:mt-16">
          {/* Avatar Row */}
          <motion.div
            {...fadeUp(0.1)}
            className="flex flex-col sm:flex-row items-center gap-4 mb-8"
          >
            <div className="flex -space-x-3">
              {[
                { name: 'avatar-1', unsplash: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80' },
                { name: 'avatar-2', unsplash: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80' },
                { name: 'avatar-3', unsplash: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80' },
              ].map((avatar, idx) => (
                <img
                  key={idx}
                  className="w-8 h-8 rounded-full border-2 border-black object-cover shrink-0"
                  src={`/${avatar.name}.png`}
                  onError={(e) => {
                    e.currentTarget.src = avatar.unsplash;
                  }}
                  alt={`User avatar ${idx + 1}`}
                />
              ))}
            </div>
            <span className="text-neutral-400 text-sm tracking-wide">
              7,000+ people already subscribed
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            {...fadeUp(0.3)}
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-medium tracking-[-2px] leading-none mb-6 max-w-3xl"
          >
            Get <span className="font-serif italic font-normal">Inspired</span> with Us
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            {...fadeUp(0.5)}
            className="text-neutral-200 text-base sm:text-lg max-w-xl mb-12 leading-relaxed"
          >
            Join our feed for meaningful updates, news around technology and a shared journey
            toward depth and direction.
          </motion.p>

          {/* Email Subscription Box */}
          <motion.div {...fadeUp(0.6)} className="w-full max-w-md">
            <form
              onSubmit={(e) => e.preventDefault()}
              className="liquid-glass rounded-full p-1.5 flex items-center justify-between shadow-2xl border border-white/5"
            >
              <input
                type="email"
                placeholder="Enter your email"
                required
                className="bg-transparent border-none outline-none text-white text-sm px-6 py-2 flex-1 w-full focus:ring-0 placeholder:text-neutral-500"
              />
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="bg-white text-black font-semibold text-xs rounded-full px-8 py-3.5 tracking-wider uppercase select-none transition-shadow hover:shadow-[0_0_20px_rgba(255,255,255,0.25)]"
              >
                SUBSCRIBE
              </motion.button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* SECTION 3: "SEARCH HAS CHANGED" */}
      <section className="bg-black w-full py-32 px-6">
        <div className="max-w-6xl mx-auto w-full flex flex-col items-center">
          <motion.h2
            {...fadeUp(0.1)}
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-medium tracking-tight text-center leading-none mb-6"
          >
            Search has <span className="font-serif italic font-normal">changed.</span> Have you?
          </motion.h2>

          <motion.p
            {...fadeUp(0.2)}
            className="text-neutral-400 text-base sm:text-lg text-center max-w-2xl mb-24 leading-relaxed"
          >
            Traditional search queries are shifting toward contextual dialogs. Our ecosystem bridges
            intelligent AI platform assistants with your personal discovery layers.
          </motion.p>

          {/* Platform Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 w-full mb-24">
            {[
              {
                title: 'ChatGPT',
                desc: 'Optimize custom instructions, direct routing, and structured summaries.',
                asset: 'icon-chatgpt',
                svg: (
                  <svg className="w-16 h-16 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                ),
              },
              {
                title: 'Perplexity',
                desc: 'Generate immediate inline citations, detailed sources, and query synthesis.',
                asset: 'icon-perplexity',
                svg: (
                  <svg className="w-16 h-16 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="10" />
                    <path d="m8 12 4-4 4 4M12 8v8" />
                  </svg>
                ),
              },
              {
                title: 'Google AI',
                desc: 'Harness multimodal context, Gemini workflows, and integrated web lookups.',
                asset: 'icon-google',
                svg: (
                  <svg className="w-16 h-16 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 3v18M3 12h18" />
                  </svg>
                ),
              },
            ].map((card, idx) => (
              <motion.div
                key={idx}
                {...fadeUp(idx * 0.15)}
                className="liquid-glass border border-white/5 rounded-3xl p-8 flex flex-col items-center text-center hover:bg-neutral-900/10 transition-colors duration-300"
              >
                {/* 200x200 Image container */}
                <div className="w-52 h-52 flex items-center justify-center rounded-2xl bg-neutral-950 border border-white/5 mb-8 relative overflow-hidden">
                  {/* Default decorative vector */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-30">
                    {card.svg}
                  </div>
                  {/* Local asset file with unsplash fallback */}
                  <img
                    className="absolute inset-0 w-full h-full object-contain p-6"
                    src={`/${card.asset}.png`}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'; // Hide if file missing so vector is clean
                    }}
                    alt={`${card.title} icon`}
                  />
                </div>

                <h3 className="font-semibold text-lg text-white mb-3 tracking-tight">
                  {card.title}
                </h3>
                <p className="text-neutral-400 text-sm leading-relaxed max-w-xs">
                  {card.desc}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Tagline */}
          <motion.div {...fadeUp(0.4)} className="w-full text-center">
            <span className="text-neutral-500 text-xs sm:text-sm tracking-wider">
              "If you don't answer the questions, someone else will."
            </span>
          </motion.div>
        </div>
      </section>

      {/* SECTION 4: MISSION */}
      <section className="bg-black w-full pb-32 px-6">
        <div className="max-w-4xl mx-auto w-full flex flex-col items-center">
          {/* Loop Video */}
          <motion.div
            {...fadeUp(0.1)}
            className="w-full max-w-md aspect-square rounded-[2.5rem] overflow-hidden mb-20 bg-neutral-950 border border-white/5"
          >
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
              src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260325_132944_a0d124bb-eaa1-4082-aa30-2310efb42b4b.mp4"
            />
          </motion.div>

          {/* Scroll-driven Opacity Paragraphs */}
          <div className="space-y-16">
            <ParagraphReveal
              text="We're building a space where curiosity meets clarity — where readers find depth, writers find reach, and every newsletter becomes a conversation worth having."
              highlightWords={['curiosity', 'meets', 'clarity']}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight text-center"
            />

            <ParagraphReveal
              text="A platform where content, community, and insight flow together — with less noise, less friction, and more meaning for everyone involved."
              className="text-xl sm:text-2xl lg:text-3xl font-medium text-center"
            />
          </div>
        </div>
      </section>

      {/* SECTION 5: SOLUTION */}
      <section className="bg-black w-full py-32 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto w-full flex flex-col">
          <motion.span
            {...fadeUp(0.1)}
            className="text-neutral-500 text-[10px] sm:text-xs tracking-[3px] uppercase mb-4"
          >
            SOLUTION
          </motion.span>

          <motion.h2
            {...fadeUp(0.2)}
            className="text-3xl sm:text-5xl md:text-6xl font-medium tracking-tight mb-16 max-w-2xl leading-none"
          >
            The platform for <span className="font-serif italic font-normal">meaningful</span> content
          </motion.h2>

          {/* aspect-[3/1] Video */}
          <motion.div
            {...fadeUp(0.35)}
            className="w-full aspect-[2/1] md:aspect-[3/1] rounded-2xl md:rounded-3xl overflow-hidden mb-20 bg-neutral-950 border border-white/5"
          >
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
              src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260325_125119_8e5ae31c-0021-4396-bc08-f7aebeb877a2.mp4"
            />
          </motion.div>

          {/* 4-Column Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-8">
            {[
              {
                title: 'Curated Feed',
                desc: 'Ditch the algos. Read hand-picked selections of premium insights from independent writers.',
              },
              {
                title: 'Writer Tools',
                desc: 'Minimalist editing interface, direct newsletter layouts, and built-in member analytics.',
              },
              {
                title: 'Community',
                desc: 'Deep discussions within comments, threads, and peer circles of similar domains.',
              },
              {
                title: 'Distribution',
                desc: 'Optimized delivery mechanisms ensuring your content meets inbox endpoints cleanly.',
              },
            ].map((feat, idx) => (
              <motion.div key={idx} {...fadeUp(idx * 0.1)} className="flex flex-col items-start">
                <h3 className="font-semibold text-base text-white mb-3 tracking-tight">
                  {feat.title}
                </h3>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  {feat.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6: CTA SECTION */}
      <section className="relative bg-black w-full py-40 px-6 border-t border-white/10 overflow-hidden flex items-center justify-center">
        {/* Background HLS Video */}
        <HlsPlayer
          src="https://stream.mux.com/8wrHPCX2dC3msyYU9ObwqNdm00u3ViXvOSHUMRYSEe5Q.m3u8"
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-60"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/55 z-10 pointer-events-none" />

        {/* Content */}
        <div className="relative z-20 max-w-xl mx-auto w-full flex flex-col items-center text-center">
          {/* Concentric Circles Logo */}
          <motion.div
            {...fadeUp(0.1)}
            className="w-10 h-10 rounded-full border-2 border-white/60 flex items-center justify-center mb-8 relative"
          >
            <div className="w-5 h-5 rounded-full border border-white/60" />
          </motion.div>

          {/* Heading */}
          <motion.h2
            {...fadeUp(0.2)}
            className="text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight mb-4 leading-none"
          >
            Start Your <span className="font-serif italic font-normal">Journey</span>
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            {...fadeUp(0.3)}
            className="text-neutral-400 text-sm sm:text-base mb-12 max-w-sm leading-relaxed"
          >
            Explore clean newsletter insights, connect with like-minded creators, or launch your own publication today.
          </motion.p>

          {/* Buttons Row */}
          <motion.div
            {...fadeUp(0.4)}
            className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white text-black font-semibold text-sm rounded-lg px-8 py-3.5 tracking-tight w-full sm:w-auto shadow-lg"
            >
              Subscribe Now
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="liquid-glass text-white border border-white/10 font-semibold text-sm rounded-lg px-8 py-3.5 tracking-tight w-full sm:w-auto hover:bg-neutral-900/35 transition-colors"
            >
              Start Writing
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* SECTION 7: FOOTER */}
      <footer className="w-full bg-black py-16 px-6 sm:px-12 md:px-28 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
        <span className="text-neutral-500 text-sm">
          &copy; 2026 Mindloop. All rights reserved.
        </span>

        <div className="flex items-center gap-8">
          {['Privacy', 'Terms', 'Contact'].map((link) => (
            <a
              key={link}
              href="#"
              className="text-neutral-500 hover:text-white transition-colors duration-200 text-sm"
            >
              {link}
            </a>
          ))}
        </div>
      </footer>
    </div>
  );
};

export default HowItWorksStepper;
