import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Photo } from '../types';
import { INITIAL_PHOTOS } from '../constants';

interface PortfolioContextType {
  photos: Photo[];
  addPhoto: (photo: Photo) => void;
  deletePhoto: (id: string) => void;
  updatePhoto: (photo: Photo) => void;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [photos, setPhotos] = useState<Photo[]>(() => {
    // Try to load from local storage to simulate persistence
    const saved = localStorage.getItem('mb_portfolio_photos');
    return saved ? JSON.parse(saved) : INITIAL_PHOTOS;
  });

  useEffect(() => {
    localStorage.setItem('mb_portfolio_photos', JSON.stringify(photos));
  }, [photos]);

  const addPhoto = (photo: Photo) => {
    setPhotos(prev => [photo, ...prev]);
  };

  const deletePhoto = (id: string) => {
    setPhotos(prev => prev.filter(p => p.id !== id));
  };

  const updatePhoto = (updatedPhoto: Photo) => {
    setPhotos(prev => prev.map(p => p.id === updatedPhoto.id ? updatedPhoto : p));
  };

  return (
    <PortfolioContext.Provider value={{ photos, addPhoto, deletePhoto, updatePhoto }}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};