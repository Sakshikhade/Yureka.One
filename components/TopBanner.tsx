import React from 'react';
import { Radio } from 'lucide-react';

const TopBanner: React.FC = () => {
  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-10 bg-black text-white flex items-center overflow-hidden border-b border-white/10 shadow-md">
      <div className="flex items-center h-full px-4 bg-clay text-white z-20 relative">
          <Radio size={14} className="animate-pulse mr-2" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] whitespace-nowrap">
              Live Wire
          </span>
      </div>
      <div className="flex whitespace-nowrap animate-marquee w-max" style={{ animationDuration: '60s' }}>
        {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] px-6 border-r border-white/20 h-full flex items-center opacity-60">
                    Latest
                </span>
                <span className="text-sm font-serif italic text-white px-4">
                    "Stop letting banks hold your rewards. With Jupyter, earn 15% more."
                </span>
                <span className="text-xs font-medium text-white/60 px-4 uppercase tracking-wider">
                    Market Update: Credit Spends ▲ 12.4%
                </span>
                <span className="text-[10px] text-white/30 px-6">///</span>
            </div>
        ))}
      </div>
    </div>
  );
};

export default TopBanner;