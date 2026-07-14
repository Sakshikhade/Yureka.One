import { useInView } from './useInView';
import GlassLayer from './GlassLayer';

const REWARDS_VIDEO_URL = '/rewards.mp4';
const GALAXY_VIDEO_URL = '/galaxy.mov';

export function PhoneBubbleMockup() {
  const { ref, inView } = useInView<HTMLDivElement>('600px');

  return (
    <div
      ref={ref}
      className="relative flex h-full min-h-[260px] items-center justify-center overflow-hidden rounded-2xl border border-white/20 bg-[#0a0a0a] shadow-2xl shadow-black/40 backdrop-blur-xl"
    >
      {inView && (
        <video
          src={REWARDS_VIDEO_URL}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      <GlassLayer />
    </div>
  );
}

export function PhoneVaultMockup() {
  const { ref, inView } = useInView<HTMLDivElement>('600px');

  return (
    <div
      ref={ref}
      className="relative flex h-full min-h-[260px] items-center justify-center overflow-hidden"
    >
      {inView && (
        <video
          src={GALAXY_VIDEO_URL}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-contain"
        />
      )}
    </div>
  );
}
