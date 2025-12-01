import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Photo } from '../types';
import { INITIAL_PHOTOS } from '../constants';
import { useHighLevel } from '../hooks/useHighLevel';

interface PortfolioContextType {
  photos: Photo[];
  addPhoto: (photo: Photo) => void;
  deletePhoto: (id: string) => Promise<void>;
  updatePhoto: (photo: Photo) => void;
  isLoading: boolean;
  refreshGallery: () => Promise<void>;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [photos, setPhotos] = useState<Photo[]>(INITIAL_PHOTOS);
  const [isLoading, setIsLoading] = useState(true);
  const { fetchFiles, deleteFile } = useHighLevel();

  const refreshGallery = useCallback(async () => {
    setIsLoading(true);
    try {
      const ghlFiles = await fetchFiles();
      if (ghlFiles) {
        const mappedPhotos: Photo[] = ghlFiles.map(file => ({
          id: file._id,
          url: file.url,
          title: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
          category: 'Uploads'
        }));
        
        // Combine static initial photos with dynamic GHL photos
        // We use a Map to ensure uniqueness if needed, but simple concatenation is fine usually
        setPhotos([...INITIAL_PHOTOS, ...mappedPhotos]);
      }
    } catch (error) {
      console.error("Failed to fetch gallery:", error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchFiles]);

  useEffect(() => {
    refreshGallery();
  }, [refreshGallery]);

  const addPhoto = (photo: Photo) => {
    // Optimistic update
    setPhotos(prev => [photo, ...prev]);
  };

  const deletePhoto = async (id: string) => {
    // Check if it's a static photo (from INITIAL_PHOTOS)
    const isStatic = INITIAL_PHOTOS.some(p => p.id === id);
    if (isStatic) {
      console.warn("Cannot delete static portfolio items via API");
      // Just remove from local view if desired, or prevent action
      setPhotos(prev => prev.filter(p => p.id !== id));
      return;
    }

    try {
      await deleteFile(id);
      setPhotos(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error("Failed to delete photo:", error);
      // Revert if needed, or show error
      throw error;
    }
  };

  const updatePhoto = (updatedPhoto: Photo) => {
    // GHL File API doesn't support "update metadata" easily without Custom Values workaround.
    // For now, we update local state only. 
    // Changes won't persist to GHL unless we implement a metadata store.
    setPhotos(prev => prev.map(p => p.id === updatedPhoto.id ? updatedPhoto : p));
  };

  return (
    <PortfolioContext.Provider value={{ photos, addPhoto, deletePhoto, updatePhoto, isLoading, refreshGallery }}>
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