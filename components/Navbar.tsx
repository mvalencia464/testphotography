
import React, { useState, useEffect } from 'react';
import { Menu, X, Camera, Lock, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useSiteConfig } from '../context/SiteConfigContext';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { config } = useSiteConfig();
  const { isAuthenticated, logout } = useAuth();
  const theme = config.themeColor;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'Home', href: '/#home' },
    { name: 'Portfolio', href: '/#portfolio' },
    { name: 'Services', href: '/#services' },
    { name: 'About', href: '/#about' },
    { name: 'Contact', href: '/#contact' },
  ];

  const isHome = location.pathname === '/';

  return (
    <nav 
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled || !isHome ? 'bg-stone-900/95 backdrop-blur-sm shadow-lg py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <Camera className={`h-8 w-8 text-${theme}-500 group-hover:text-${theme}-400 transition-colors`} />
              <div className="flex flex-col">
                <span className="text-white font-serif text-xl tracking-wider uppercase font-bold">
                  Mark Beecham
                </span>
                <span className="text-stone-400 text-xs tracking-[0.2em] uppercase">Photography</span>
              </div>
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`text-stone-300 hover:text-${theme}-400 px-3 py-2 text-sm font-medium tracking-wide transition-colors`}
              >
                {link.name}
              </a>
            ))}
            <a 
              href="#contact"
              className={`bg-${theme}-600 hover:bg-${theme}-500 text-white px-5 py-2 rounded-none text-sm font-medium tracking-wide transition-colors uppercase`}
            >
              Book Session
            </a>
            
            {/* Admin Link Icon */}
            {isAuthenticated ? (
               <button onClick={logout} className="text-red-400 hover:text-red-300 ml-4 flex items-center gap-1 text-xs uppercase font-bold" title="Logout">
                  <LogOut size={16} /> Exit Edit Mode
               </button>
            ) : (
               <Link to="/admin" className="text-stone-500 hover:text-stone-300 ml-4" title="Admin Access">
                  <Lock size={16} />
               </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-stone-300 hover:text-white p-2"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-stone-900 border-t border-stone-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`text-stone-300 hover:text-${theme}-400 block px-3 py-2 text-base font-medium`}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </a>
            ))}
            {isAuthenticated ? (
               <button 
                onClick={() => { logout(); setIsOpen(false); }}
                className="text-red-400 hover:text-red-300 block w-full text-left px-3 py-2 text-sm font-medium"
               >
                 Logout
               </button>
            ) : (
              <Link 
                to="/admin"
                className="text-stone-500 hover:text-stone-300 block px-3 py-2 text-sm font-medium"
              >
                Admin Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
