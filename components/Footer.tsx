
import React from 'react';
import { Camera } from 'lucide-react';
import { BRAND } from '../constants';
import { Link } from 'react-router-dom';
import { useSiteConfig } from '../context/SiteConfigContext';

export const Footer: React.FC = () => {
  const { config } = useSiteConfig();
  const theme = config.themeColor;

  return (
    <footer className="bg-black text-stone-500 py-16 border-t border-stone-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <Camera className={`h-6 w-6 text-${theme}-600`} />
              <span className="text-white font-serif text-xl tracking-wider uppercase font-bold">
                Mark Beecham
              </span>
            </div>
            <p className="mb-6 max-w-sm">
              Professional photography services specializing in sports, wildlife, and family portraits throughout Tennessee.
            </p>
            <p className={`text-${theme}-500 italic font-serif`}>
              "{BRAND.slogan}"
            </p>
          </div>

          <div>
            <h4 className="text-white uppercase tracking-widest text-sm font-bold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {['Home', 'Portfolio', 'Services', 'About', 'Contact'].map((item) => (
                <li key={item}>
                  <a href={`#${item.toLowerCase()}`} className={`hover:text-${theme}-500 transition-colors`}>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white uppercase tracking-widest text-sm font-bold mb-6">Contact</h4>
            <ul className="space-y-3">
              <li>{BRAND.phone}</li>
              <li>{BRAND.email}</li>
              <li>{BRAND.location}</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-stone-900 pt-8 text-center md:text-left flex flex-col md:flex-row justify-between items-center text-sm">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <p>&copy; {new Date().getFullYear()} Mark Beecham Photography. All rights reserved.</p>
            <Link to="/admin" className="text-stone-800 hover:text-stone-600 transition-colors text-xs hidden md:inline-block">Admin</Link>
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-4 mt-4 md:mt-0">
             <Link to="/admin" className="text-stone-800 hover:text-stone-600 transition-colors text-xs md:hidden">Admin Login</Link>
             <p className="italic font-serif text-stone-600">Psalm 145:5</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
