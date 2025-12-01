
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SiteConfig, SiteContent, ThemeColor } from '../types';
import defaultContent from '../src/data/siteContent.json';
import { useGitHub } from '../hooks/useGitHub';

interface SiteConfigContextType {
  config: SiteConfig;
  updateTheme: (color: ThemeColor) => void;
  updateContent: (content: Partial<SiteContent>) => void;
  saveToGitHub: () => Promise<{ success: boolean; message: string }>;
  isSaving: boolean;
}

const DEFAULT_CONTENT: SiteContent = defaultContent as SiteContent;

const SiteConfigContext = createContext<SiteConfigContextType | undefined>(undefined);

export const SiteConfigProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<SiteConfig>(() => {
    const saved = localStorage.getItem('mb_site_config');
    return saved ? JSON.parse(saved) : {
      themeColor: 'amber',
      content: DEFAULT_CONTENT
    };
  });

  const { saveFile, loading: isSaving } = useGitHub();

  useEffect(() => {
    localStorage.setItem('mb_site_config', JSON.stringify(config));
  }, [config]);

  const updateTheme = (color: ThemeColor) => {
    setConfig(prev => ({ ...prev, themeColor: color }));
  };

  const updateContent = (newContent: Partial<SiteContent>) => {
    setConfig(prev => ({
      ...prev,
      content: { ...prev.content, ...newContent }
    }));
  };

  const saveToGitHub = async () => {
    return await saveFile(
      'src/data/siteContent.json',
      config.content,
      `Update site content via Admin Panel - ${new Date().toISOString()}`
    );
  };

  return (
    <SiteConfigContext.Provider value={{ config, updateTheme, updateContent, saveToGitHub, isSaving }}>
      {children}
    </SiteConfigContext.Provider>
  );
};

export const useSiteConfig = () => {
  const context = useContext(SiteConfigContext);
  if (context === undefined) {
    throw new Error('useSiteConfig must be used within a SiteConfigProvider');
  }
  return context;
};
