import { Photo, ServicePackage } from './types';

export const BRAND = {
  name: "Mark Beecham Photography",
  slogan: "You do life. We'll capture the memory.",
  phone: "(865) 555-0123",
  email: "mark@markbeechamphotography.com",
  location: "Tennessee & Surrounding Areas"
};

export const INITIAL_PHOTOS: Photo[] = [];


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