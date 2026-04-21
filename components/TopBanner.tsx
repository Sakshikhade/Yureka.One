import React from 'react';
import { Radio } from 'lucide-react';

const TopBanner: React.FC = () => {
  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-10 bg-black text-cream flex items-center overflow-hidden border-b border-cream/10 shadow-md">
      <div className="flex items-center h-full px-4 bg-[#047857] text-cream z-20 relative">
          <Radio size={14} className="animate-pulse mr-2" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] whitespace-nowrap">
              Live Wire
          </span>
      </div>
      <div className="flex whitespace-nowrap animate-marquee w-max" style={{ animationDuration: '60s' }}>
        {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center">
                <span className="text-[9px] font-bold uppercase tracking-[0.25em] px-5 border-r border-cream/20 h-full flex items-center opacity-50">
                    Latest
                </span>
                <span className="text-[11px] font-sans font-medium text-cream px-4">
                    "Stop letting banks hold your rewards. With Yureka, earn 15% more."
                </span>
                <span className="text-[10px] font-sans font-semibold text-cream/50 px-4 uppercase tracking-wider">
                    Market Update: Credit Spends ▲ 12.4%
                </span>
                <span className="text-[9px] text-cream/20 px-5">///</span>
            </div>
        ))}
      </div>
    </div>
  );
};

export default TopBanner;