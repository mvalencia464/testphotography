
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SiteConfig, SiteContent, ThemeColor } from '../types';

interface SiteConfigContextType {
  config: SiteConfig;
  updateTheme: (color: ThemeColor) => void;
  updateContent: (content: Partial<SiteContent>) => void;
}

const DEFAULT_CONTENT: SiteContent = {
  heroHeadline: "Capturing Awe-Inspiring Moments",
  heroSubheadline: "You do life. We'll capture the memory.",
  aboutHeadline: "Capturing God's Creation & Life's Precious Moments",
  aboutText: "My journey from amateur to professional photographer has been guided by a simple belief: life flows like a stream, but some moments deserve to be stopped and cherished forever."
};

const SiteConfigContext = createContext<SiteConfigContextType | undefined>(undefined);

export const SiteConfigProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<SiteConfig>(() => {
    const saved = localStorage.getItem('mb_site_config');
    return saved ? JSON.parse(saved) : {
      themeColor: 'amber',
      content: DEFAULT_CONTENT
    };
  });

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

  return (
    <SiteConfigContext.Provider value={{ config, updateTheme, updateContent }}>
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
