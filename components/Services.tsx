
import React from 'react';
import { PACKAGES } from '../constants';
import { Check } from 'lucide-react';
import { useSiteConfig } from '../context/SiteConfigContext';

export const Services: React.FC = () => {
  const { config } = useSiteConfig();
  const theme = config.themeColor;

  return (
    <section id="services" className="py-24 bg-stone-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className={`text-${theme}-500 font-medium tracking-[0.2em] uppercase mb-4`}>Investment</h2>
          <h2 className="text-3xl md:text-5xl font-serif text-white font-bold mb-6">Services & Packages</h2>
          <p className="text-stone-400 max-w-2xl mx-auto">
            Professional photography services designed to capture life's most precious moments with artistry and care.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {PACKAGES.map((pkg, index) => (
            <div 
              key={index}
              className={`relative flex flex-col p-8 ${
                pkg.highlight 
                  ? `bg-stone-900 ring-2 ring-${theme}-500 transform lg:-translate-y-4 shadow-2xl shadow-${theme}-900/20` 
                  : 'bg-stone-900 border border-stone-800 hover:border-stone-700'
              } transition-all duration-300`}
            >
              {pkg.highlight && (
                <div className={`absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-${theme}-600 text-white text-xs font-bold uppercase tracking-widest px-4 py-1`}>
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-serif text-white font-bold mb-2">{pkg.title}</h3>
                <p className="text-stone-400 text-sm leading-relaxed mb-4 min-h-[60px]">{pkg.description}</p>
                {pkg.price && (
                  <div className="flex items-baseline gap-1">
                    {pkg.pricePrefix && <span className="text-stone-500 text-sm font-medium">{pkg.pricePrefix}</span>}
                    <span className={`text-3xl font-bold text-${theme}-500`}>${pkg.price}</span>
                    {pkg.priceSuffix && <span className="text-stone-500">{pkg.priceSuffix}</span>}
                  </div>
                )}
              </div>

              {pkg.features && (
                <ul className="space-y-3 mb-8 flex-1">
                  {pkg.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-stone-300">
                      <Check className={`w-5 h-5 text-${theme}-600 flex-shrink-0`} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              )}

              <a 
                href="#contact"
                className={`block w-full text-center py-3 text-sm uppercase tracking-widest font-bold transition-colors ${
                  pkg.highlight
                    ? `bg-${theme}-600 hover:bg-${theme}-500 text-white`
                    : 'bg-stone-800 hover:bg-stone-700 text-stone-300'
                }`}
              >
                {pkg.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
