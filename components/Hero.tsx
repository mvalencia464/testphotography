
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useSiteConfig } from '../context/SiteConfigContext';
import { EditableText } from './EditableText';

export const Hero: React.FC = () => {
  const { config } = useSiteConfig();
  const { themeColor } = config;

  return (
    <div id="home" className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000&auto=format&fit=crop"
          alt="Tennessee Landscape"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-stone-900/70 via-stone-900/50 to-stone-900"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className={`text-${themeColor}-500 font-medium tracking-[0.2em] uppercase mb-4 animate-fade-in-up`}>
          Tennessee • Wildlife • Sports
        </h2>
        
        <EditableText 
          contentKey="heroHeadline" 
          as="h1" 
          className="text-5xl md:text-7xl font-serif text-white font-bold mb-6 leading-tight tracking-tight shadow-sm"
        />
        
        <div className="text-xl md:text-2xl text-stone-300 mb-10 max-w-2xl mx-auto font-light">
          "<EditableText contentKey="heroSubheadline" as="span" />"
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href="#contact"
            className={`group bg-${themeColor}-600 hover:bg-${themeColor}-500 text-white px-8 py-4 text-sm tracking-widest uppercase font-bold transition-all duration-300 flex items-center gap-2`}
          >
            Capture Your Memory
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href="#portfolio"
            className="px-8 py-4 border border-stone-400 text-stone-300 hover:text-white hover:border-white text-sm tracking-widest uppercase font-bold transition-all duration-300 backdrop-blur-sm"
          >
            View Portfolio
          </a>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className={`w-[1px] h-16 bg-gradient-to-b from-${themeColor}-500 to-transparent`}></div>
      </div>
    </div>
  );
};
