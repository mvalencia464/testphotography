
export interface Photo {
  id: string;
  url: string;
  title: string;
  category: 'Wildlife' | 'Sports' | 'Real Estate' | 'Family' | 'Nature' | 'Landscape' | 'Uploads';
  width?: number;
  height?: number;
}

export interface ServicePackage {
  title: string;
  price?: number;
  pricePrefix?: string;
  priceSuffix?: string;
  description: string;
  features?: string[];
  cta: string;
  highlight?: boolean;
}

export interface Testimonial {
  text: string;
  author: string;
  role?: string;
}

export type ThemeColor = 'amber' | 'sky' | 'rose' | 'emerald' | 'violet';

export interface SiteContent {
  heroHeadline: string;
  heroSubheadline: string;
  aboutHeadline: string;
  aboutText: string;
}

export interface SiteConfig {
  themeColor: ThemeColor;
  content: SiteContent;
}
