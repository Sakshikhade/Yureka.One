import React, { useRef, useEffect, useState } from 'react';

interface LazyVideoProps {
  src: string;
  /** Applied to the <video> element itself (e.g. object-cover/object-contain, positioning) */
  className?: string;
}

/**
 * Autoplaying background video that defers loading until it's near the
 * viewport (rootMargin: 300px), via preload="none" + IntersectionObserver.
 * Renders a same-sized placeholder div so layout doesn't shift once the
 * video mounts.
 */
const LazyVideo: React.FC<LazyVideoProps> = ({ src, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          io.disconnect();
        }
      },
      { rootMargin: '300px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full">
      {shouldLoad && (
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="none"
          className={className}
          src={src}
        />
      )}
    </div>
  );
};

export default LazyVideo;
