import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Photo } from '../types';
import { INITIAL_PHOTOS } from '../constants';
import { useHighLevel } from '../hooks/useHighLevel';
import { useGitHub } from '../hooks/useGitHub';
import initialMetadata from '../src/data/photoMetadata.json';

interface PortfolioContextType {
  photos: Photo[];
  addPhoto: (photo: Photo) => void;
  deletePhoto: (id: string) => Promise<void>;
  updatePhoto: (photo: Photo) => void;
  isLoading: boolean;
  refreshGallery: () => Promise<void>;
  saveMetadataToGitHub: () => Promise<{ success: boolean; message: string }>;
  isSaving: boolean;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [photos, setPhotos] = useState<Photo[]>(INITIAL_PHOTOS);
  const [metadata, setMetadata] = useState<Record<string, Partial<Photo>>>(initialMetadata);
  const [isLoading, setIsLoading] = useState(true);
  const { fetchFiles, deleteFile } = useHighLevel();
  const { saveFile, loading: isSaving } = useGitHub();

  const applyMetadata = useCallback((basePhotos: Photo[], currentMetadata: Record<string, Partial<Photo>>) => {
    return basePhotos.map(p => {
      const meta = currentMetadata[p.id];
      if (meta) {
        return { ...p, ...meta };
      }
      return p;
    });
  }, []);

  const refreshGallery = useCallback(async () => {
    setIsLoading(true);
    try {
      const ghlFiles = await fetchFiles();
      let allPhotos = [...INITIAL_PHOTOS];
      
      if (ghlFiles) {
        const mappedPhotos: Photo[] = ghlFiles.map(file => ({
          id: file._id,
          url: file.url,
          title: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
          category: 'Uploads'
        }));
        allPhotos = [...allPhotos, ...mappedPhotos];
      }
      
      // Apply metadata overrides
      setPhotos(applyMetadata(allPhotos, metadata));
      
    } catch (error) {
      console.error("Failed to fetch gallery:", error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchFiles, metadata, applyMetadata]);

  // Initial load
  useEffect(() => {
    // We only want to fetch once on mount or when dependencies change significantly
    // But since metadata is a dependency of refreshGallery, we need to be careful to avoid loops.
    // However, applyMetadata is memoized, and fetchFiles is stable.
    // Actually, we can just run the GHL fetch once, and then apply metadata locally.
    // But for now, sticking to the existing pattern but ensuring metadata is applied.
    
    // We need to fetch GHL files first.
    const load = async () => {
        setIsLoading(true);
        try {
            const ghlFiles = await fetchFiles();
            let allPhotos = [...INITIAL_PHOTOS];
            if (ghlFiles) {
                 const mappedPhotos: Photo[] = ghlFiles.map(file => ({
                  id: file._id,
                  url: file.url,
                  title: file.name.replace(/\.[^/.]+$/, ""),
                  category: 'Uploads'
                }));
                allPhotos = [...allPhotos, ...mappedPhotos];
            }
            setPhotos(applyMetadata(allPhotos, metadata));
        } catch(e) { console.error(e); }
        finally { setIsLoading(false); }
    };
    load();
  }, [fetchFiles]); // Remove metadata from dep array to avoid loops, as we update it locally

  // Re-apply metadata when metadata state changes (e.g. after edit)
  useEffect(() => {
      setPhotos(prev => applyMetadata(prev, metadata));
  }, [metadata, applyMetadata]);

  const addPhoto = (photo: Photo) => {
    setPhotos(prev => [photo, ...prev]);
  };

  const deletePhoto = async (id: string) => {
    const isStatic = INITIAL_PHOTOS.some(p => p.id === id);
    if (isStatic) {
      console.warn("Cannot delete static portfolio items via API");
      setPhotos(prev => prev.filter(p => p.id !== id));
      return;
    }

    try {
      await deleteFile(id);
      setPhotos(prev => prev.filter(p => p.id !== id));
      // Also remove from metadata
      const newMeta = { ...metadata };
      delete newMeta[id];
      setMetadata(newMeta);
    } catch (error) {
      console.error("Failed to delete photo:", error);
      throw error;
    }
  };

  const updatePhoto = (updatedPhoto: Photo) => {
    setPhotos(prev => prev.map(p => p.id === updatedPhoto.id ? updatedPhoto : p));
    
    // Update metadata
    setMetadata(prev => ({
        ...prev,
        [updatedPhoto.id]: {
            title: updatedPhoto.title,
            category: updatedPhoto.category
        }
    }));
  };

  const saveMetadataToGitHub = async () => {
    return await saveFile(
      'src/data/photoMetadata.json',
      metadata,
      `Update photo metadata via Admin Panel - ${new Date().toISOString()}`
    );
  };

  return (
    <PortfolioContext.Provider value={{ photos, addPhoto, deletePhoto, updatePhoto, isLoading, refreshGallery, saveMetadataToGitHub, isSaving }}>
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