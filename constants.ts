import { Photo, ServicePackage } from './types';

export const BRAND = {
  name: "Mark Beecham Photography",
  slogan: "You do life. We'll capture the memory.",
  phone: "(865) 555-0123",
  email: "mark@markbeechamphotography.com",
  location: "Tennessee & Surrounding Areas"
};

export const INITIAL_PHOTOS: Photo[] = [
  {
    id: '1',
    url: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800&auto=format&fit=crop',
    title: 'The Sprint',
    category: 'Sports'
  },
  {
    id: '2',
    url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=800&auto=format&fit=crop',
    title: 'Morning Mist',
    category: 'Nature'
  },
  {
    id: '3',
    url: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=800&auto=format&fit=crop',
    title: 'Touchdown',
    category: 'Sports'
  },
  {
    id: '4',
    url: 'https://images.unsplash.com/photo-1611000377884-3c6608552735?q=80&w=800&auto=format&fit=crop',
    title: 'Eagle Watch',
    category: 'Wildlife'
  },
  {
    id: '5',
    url: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=800&auto=format&fit=crop',
    title: 'Grand Slam',
    category: 'Sports'
  },
  {
    id: '6',
    url: 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?q=80&w=800&auto=format&fit=crop',
    title: 'Luxury Estate',
    category: 'Real Estate'
  },
  {
    id: '7',
    url: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=800&auto=format&fit=crop',
    title: 'Family Bond',
    category: 'Family'
  },
  {
    id: '8',
    url: 'https://images.unsplash.com/photo-1533282243916-5bc77b78996e?q=80&w=800&auto=format&fit=crop',
    title: 'Elk in Meadow',
    category: 'Wildlife'
  },
  {
    id: '9',
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop',
    title: 'Smoky Mountains',
    category: 'Landscape'
  }
];

export const PACKAGES: ServicePackage[] = [
  {
    title: "The Game Day Package",
    price: 250,
    priceSuffix: "/ game",
    description: "Enjoy the game while we focus on capturing your child's key moments.",
    features: [
      "Professional-grade equipment",
      "Focus on your child throughout the game",
      "5 professionally edited photos",
      "High-resolution digital delivery",
      "Quick turnaround"
    ],
    cta: "Book Game Day",
    highlight: true
  },
  {
    title: "Family Portrait Session",
    price: 350,
    priceSuffix: "/ session",
    description: "Beautiful outdoor sessions that capture the genuine connection between family members.",
    features: [
      "1 hour on-location session",
      "Up to 6 family members",
      "20 professionally edited high-res images",
      "Private online gallery",
      "Print release included"
    ],
    cta: "Book Family Session",
    highlight: false
  },
  {
    title: "Wildlife Fine Art Prints",
    price: 45,
    pricePrefix: "From",
    priceSuffix: "",
    description: "Bring the majesty of Tennessee's wildlife into your home or office with museum-quality prints.",
    features: [
      "Premium archival paper",
      "Sizes from 8x10 to 40x60",
      "Optional custom framing",
      "Signed by Mark Beecham",
      "Certificate of Authenticity"
    ],
    cta: "View Print Shop",
    highlight: false
  },
  {
    title: "Real Estate Photography",
    price: 200,
    priceSuffix: "/ listing",
    description: "Professional photography to make your listings shine and attract potential buyers instantly.",
    features: [
      "Interior & Exterior coverage",
      "HDR processing for perfect lighting",
      "24-hour turnaround time",
      "Blue sky replacement",
      "MLS-ready & High-Res files"
    ],
    cta: "Book Listing",
    highlight: false
  }
];