
import React, { useState, useEffect, useCallback } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { X, ChevronLeft, ChevronRight, Facebook, Twitter, Link as LinkIcon, Check } from 'lucide-react';
import { useSiteConfig } from '../context/SiteConfigContext';

export const Portfolio: React.FC = () => {
  const { photos } = usePortfolio();
  const { config } = useSiteConfig();
  const theme = config.themeColor;
  
  const [filter, setFilter] = useState<string>('All Work');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const categories = ['All Work', 'Wildlife', 'Nature', 'Sports', 'Real Estate', 'Family'];

  const filteredPhotos = filter === 'All Work' 
    ? photos 
    : photos.filter(photo => photo.category === filter || (filter === 'Wildlife' && photo.category === 'Uploads'));

  const handlePrev = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedIndex(current => {
      if (current === null) return null;
      setCopied(false);
      return current === 0 ? filteredPhotos.length - 1 : current - 1;
    });
  }, [filteredPhotos.length]);

  const handleNext = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedIndex(current => {
      if (current === null) return null;
      setCopied(false);
      return current === filteredPhotos.length - 1 ? 0 : current + 1;
    });
  }, [filteredPhotos.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      
      if (e.key === 'Escape') setSelectedIndex(null);
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, handleNext, handlePrev]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedIndex]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.origin);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform: 'facebook' | 'twitter') => {
    if (selectedIndex === null) return;
    const photo = filteredPhotos[selectedIndex];
    const url = encodeURIComponent(window.location.origin);
    const text = encodeURIComponent(`Check out "${photo.title}" by Mark Beecham Photography`);
    
    let shareUrl = '';
    if (platform === 'facebook') {
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    } else if (platform === 'twitter') {
        shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  return (
    <section id="portfolio" className="py-24 bg-stone-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif text-white font-bold mb-4">Selected Works</h2>
          <div className={`w-24 h-1 bg-${theme}-600 mx-auto mb-8`}></div>
          
          <blockquote className="text-stone-400 italic max-w-2xl mx-auto text-lg font-serif">
            "They speak of the glorious splendor of your majesty—and I will meditate on your wonderful works."
            <span className={`block text-${theme}-500 mt-2 text-sm not-italic uppercase tracking-widest font-bold`}>— Psalm 145:5</span>
          </blockquote>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => {
                setFilter(category);
                setSelectedIndex(null);
              }}
              className={`px-6 py-2 text-sm uppercase tracking-wider transition-all duration-300 ${
                filter === category
                  ? `text-${theme}-500 border-b-2 border-${theme}-500`
                  : 'text-stone-500 hover:text-stone-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPhotos.map((photo, index) => (
            <div 
              key={photo.id} 
              className="group relative aspect-[4/5] overflow-hidden cursor-pointer bg-stone-800"
              onClick={() => setSelectedIndex(index)}
            >
              <img
                src={photo.url}
                alt={photo.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <span className={`text-${theme}-500 text-xs uppercase tracking-widest mb-1`}>{photo.category}</span>
                <h3 className="text-white font-serif text-xl">{photo.title}</h3>
              </div>
            </div>
          ))}
        </div>

        {filteredPhotos.length === 0 && (
          <div className="text-center text-stone-500 py-12">
            No photos found in this category.
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedIndex !== null && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center animate-fade-in">
          
          {/* Close Button */}
          <button 
            onClick={() => setSelectedIndex(null)}
            className="absolute top-4 right-4 md:top-8 md:right-8 text-stone-400 hover:text-white transition-colors z-[110]"
          >
            <X size={32} />
          </button>

          {/* Prev Button */}
          <button 
            onClick={handlePrev}
            className="absolute left-2 md:left-8 text-stone-400 hover:text-white hover:scale-110 transition-all p-2 z-[110] bg-black/20 rounded-full backdrop-blur-sm"
          >
            <ChevronLeft size={40} />
          </button>

          {/* Main Image Container */}
          <div className="w-full h-full p-4 md:p-12 flex flex-col items-center justify-center">
             <div className="relative max-w-full max-h-[85vh] flex flex-col items-center">
                <img 
                  src={filteredPhotos[selectedIndex].url}
                  alt={filteredPhotos[selectedIndex].title}
                  className="max-w-full max-h-[75vh] md:max-h-[80vh] object-contain shadow-2xl"
                />
                
                {/* Caption & Share */}
                <div className="mt-6 text-center animate-fade-in-up">
                  <h3 className="text-2xl font-serif text-white">{filteredPhotos[selectedIndex].title}</h3>
                  <p className={`text-${theme}-500 uppercase tracking-widest text-sm mt-1 mb-3`}>{filteredPhotos[selectedIndex].category}</p>
                  
                  {/* Share Buttons */}
                  <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-stone-800/50">
                    <button 
                      onClick={() => handleShare('facebook')}
                      className="text-stone-500 hover:text-[#1877F2] transition-colors flex flex-col items-center gap-1 group"
                      title="Share on Facebook"
                    >
                      <Facebook size={20} />
                      <span className="text-[10px] uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity absolute -bottom-5 whitespace-nowrap">Facebook</span>
                    </button>
                    <button 
                      onClick={() => handleShare('twitter')}
                      className="text-stone-500 hover:text-[#1DA1F2] transition-colors flex flex-col items-center gap-1 group"
                      title="Share on X (Twitter)"
                    >
                      <Twitter size={20} />
                      <span className="text-[10px] uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity absolute -bottom-5 whitespace-nowrap">Twitter</span>
                    </button>
                    <button 
                      onClick={handleCopyLink}
                      className={`text-stone-500 hover:text-white transition-colors flex flex-col items-center gap-1 group ${copied ? 'text-green-500 hover:text-green-400' : ''}`}
                      title="Copy Link"
                    >
                      {copied ? <Check size={20} /> : <LinkIcon size={20} />}
                      <span className="text-[10px] uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity absolute -bottom-5 whitespace-nowrap">
                        {copied ? 'Copied!' : 'Copy Link'}
                      </span>
                    </button>
                  </div>
                </div>
             </div>
          </div>

          {/* Next Button */}
          <button 
            onClick={handleNext}
            className="absolute right-2 md:right-8 text-stone-400 hover:text-white hover:scale-110 transition-all p-2 z-[110] bg-black/20 rounded-full backdrop-blur-sm"
          >
            <ChevronRight size={40} />
          </button>

        </div>
      )}
    </section>
  );
};
