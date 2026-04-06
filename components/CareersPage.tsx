import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowUpRight, Briefcase } from 'lucide-react';
import ImageWithLoader from './ImageWithLoader';

interface FadeInSectionProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

const FadeInSection: React.FC<FadeInSectionProps> = ({ children, delay = 0, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) setIsVisible(true);
      });
    }, { threshold: 0.1 });
    const current = domRef.current;
    if (current) observer.observe(current);
    return () => {
        if(current) observer.unobserve(current);
    }
  }, []);

  return (
    <div
      ref={domRef}
      className={`transition-all duration-1000 ease-[cubic-bezier(0.25,0.8,0.25,1)] transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const roles = [
    { title: "Founding AI Engineer", type: "Full-time", location: "Bengaluru", dept: "Engineering", id: "ENG-001" },
    { title: "Credit Risk Analyst", type: "Full-time", location: "Bengaluru", dept: "Risk", id: "RSK-004" },
    { title: "Product Designer", type: "Full-time", location: "Bengaluru", dept: "Design", id: "DES-012" },
    { title: "Growth Lead", type: "Full-time", location: "Bengaluru", dept: "Marketing", id: "MKT-003" },
    { title: "Fintech Partnerships", type: "Full-time", location: "Bengaluru", dept: "Business", id: "BIZ-008" }
];

const CareersPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-cream pt-4 md:pt-8 pb-20 font-sans text-black overflow-x-hidden">
      
      <div className="max-w-[1440px] mx-auto px-6 relative z-10">
        
        {/* Header - Classifieds Style */}
        <section className="mb-20 text-center border-b-4 border-black pb-8">
            <FadeInSection>
                <h1 className="text-4xl md:text-6xl font-serif uppercase tracking-tight mb-2 text-black">Help Wanted</h1>
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-black/50 border-t border-black/20 pt-4 mt-4">
                    <span>Section D: Employment</span>
                    <span>Bengaluru HQ</span>
                    <span>Equal Opportunity</span>
                </div>
            </FadeInSection>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Sidebar - Context */}
            <div className="lg:col-span-4">
                <FadeInSection>
                    <div className="bg-white border border-black/10 p-8 mb-8 shadow-sm">
                        <h3 className="text-2xl font-serif mb-4 text-black">Why join?</h3>
                        <p className="text-black/60 leading-relaxed mb-6">
                            We are a team of misfits building the future of credit. If you think the banking system is broken, come help us fix it with AI.
                        </p>
                        <ul className="space-y-3 text-sm font-mono text-black/80">
                            <li className="flex items-center gap-2"><div className="w-1 h-1 bg-teal"></div> High Autonomy</li>
                            <li className="flex items-center gap-2"><div className="w-1 h-1 bg-teal"></div> Competitive Equity</li>
                            <li className="flex items-center gap-2"><div className="w-1 h-1 bg-teal"></div> Beautiful Office</li>
                        </ul>
                    </div>
                    
                    <div className="p-2 border border-black/10 bg-white rotate-1 w-full max-w-[300px] mx-auto lg:mx-0 shadow-lg">
                         <div className="aspect-square bg-gray-200 grayscale">
                            <ImageWithLoader src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=800" alt="Office" className="w-full h-full object-cover" />
                         </div>
                         <p className="text-black text-center font-serif text-sm mt-2">Fig 1: The HQ</p>
                    </div>
                </FadeInSection>
            </div>

            {/* Job List - Table Style */}
            <div className="lg:col-span-8">
                <div className="border border-black/10 bg-white shadow-sm">
                    <div className="grid grid-cols-12 border-b border-black/10 bg-black/5 text-[10px] font-bold uppercase tracking-widest py-3 px-4 text-black/50">
                        <div className="col-span-2">Ref ID</div>
                        <div className="col-span-5">Position</div>
                        <div className="col-span-3">Department</div>
                        <div className="col-span-2 text-right">Action</div>
                    </div>
                    
                    {roles.map((role, idx) => (
                        <FadeInSection key={idx} delay={idx * 50}>
                            <div className="grid grid-cols-12 border-b border-black/10 hover:bg-black hover:text-white transition-colors py-6 px-4 items-center group cursor-pointer text-black">
                                <div className="col-span-2 font-mono text-xs opacity-50">{role.id}</div>
                                <div className="col-span-5">
                                    <h3 className="text-xl font-bold font-serif">{role.title}</h3>
                                    <span className="text-xs uppercase tracking-wider opacity-60">{role.location} • {role.type}</span>
                                </div>
                                <div className="col-span-3 text-sm font-medium opacity-80">{role.dept}</div>
                                <div className="col-span-2 text-right">
                                    <button className="w-8 h-8 border border-current rounded-full flex items-center justify-center ml-auto group-hover:rotate-45 transition-transform">
                                        <ArrowUpRight size={14} />
                                    </button>
                                </div>
                            </div>
                        </FadeInSection>
                    ))}
                </div>
                
                <div className="mt-12 text-center p-8 border border-dashed border-black/20">
                    <p className="text-black/60 mb-4">Don't see your role?</p>
                    <a href="mailto:careers@yureka.money" className="text-teal font-serif italic text-xl underline">Email the Editor</a>
                </div>
            </div>

        </div>

      </div>
    </div>
  );
};

export default CareersPage;