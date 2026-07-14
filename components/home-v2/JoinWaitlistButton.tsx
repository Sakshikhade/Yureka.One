import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ScrambleText from './ScrambleText';

// The site-wide "Join Waitlist" CTA, styled identically to the navbar button:
// a white pill with black text, framer-motion hover/tap feedback, and the
// scramble-on-hover text effect. Always routes to the waitlist page.
export default function JoinWaitlistButton({ className = '' }: { className?: string }) {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);

  return (
    <motion.button
      type="button"
      onClick={() => navigate('/join-waitlist')}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ scale: 1.03, backgroundColor: '#e2e2e6' }}
      whileTap={{ scale: 0.97 }}
      className={`inline-flex h-12 w-fit items-center rounded-full bg-white px-6 font-overpass-mono text-black ${className}`}
    >
      <ScrambleText text="Join Waitlist" isHovered={hovered} className="text-[16px]" />
    </motion.button>
  );
}
