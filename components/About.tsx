
import React from 'react';
import { useSiteConfig } from '../context/SiteConfigContext';
import { EditableText } from './EditableText';

export const About: React.FC = () => {
  const { config } = useSiteConfig();
  const { themeColor } = config;

  return (
    <section id="about" className="py-24 bg-stone-900 relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-stone-800/20 skew-x-12 transform translate-x-20 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div className="order-2 lg:order-1">
            <h2 className={`text-${themeColor}-500 font-medium tracking-[0.2em] uppercase mb-4`}>About Mark</h2>
            
            <EditableText 
              contentKey="aboutHeadline" 
              as="h3" 
              className="text-3xl md:text-5xl font-serif text-white font-bold mb-8 leading-tight"
            />
            
            <div className="space-y-6 text-stone-300 leading-relaxed">
              <EditableText 
                contentKey="aboutText" 
                as="p" 
                multiline={true} 
              />
              <p>
                As a pastor and photographer, I see my work as more than just taking pictures. It's about helping families preserve the memories that matter most, whether it's a child's first home run, a majestic eagle in flight, or a quiet family moment.
              </p>
              <p>
                Using professional-grade cameras and lenses, I ensure every shot captures not just the image, but the emotion and story behind it. My goal is to give you the gift of being fully present in the moment.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-6">
                {[
                    { label: "Passion", sub: "Driven" },
                    { label: "Professional", sub: "Gear" },
                    { label: "Experienced", sub: "Eye" }
                ].map((item, idx) => (
                    <div key={idx} className={`border-l border-${themeColor}-600 pl-4`}>
                        <div className="text-xl text-white font-serif font-bold">{item.label}</div>
                        <div className="text-sm text-stone-500 uppercase tracking-wider">{item.sub}</div>
                    </div>
                ))}
            </div>
          </div>

          <div className="order-1 lg:order-2 relative">
            <div className="relative">
                <div className={`absolute -inset-4 border-2 border-${themeColor}-600/30 transform translate-x-4 translate-y-4`}></div>
                <img 
                    src="https://images.unsplash.com/photo-1552168324-d612d77725e3?q=80&w=800&auto=format&fit=crop" 
                    alt="Photographer with Camera" 
                    className="relative w-full aspect-[4/5] object-cover shadow-2xl grayscale hover:grayscale-0 transition-all duration-700"
                />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
