
import { Property, MarketData } from './types';

export const PROPERTIES: Property[] = [
  {
    id: '1',
    title: 'The Obsidian Villa',
    price: 4500000,
    location: 'Beverly Hills, CA',
    beds: 5,
    baths: 6,
    sqft: 8200,
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=1200',
    description: 'A modern architectural masterpiece featuring floor-to-ceiling glass walls, an infinity pool overlooking the canyon, and a custom Italian kitchen.',
    amenities: ['Pool', 'Gym', 'Wine Cellar', 'Smart Home'],
    type: 'Residential'
  },
  {
    id: '2',
    title: 'Azure Penthouse',
    price: 2800000,
    location: 'Miami Beach, FL',
    beds: 3,
    baths: 3.5,
    sqft: 3400,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200',
    description: 'Breathtaking ocean views from every room. This penthouse features a private rooftop terrace with a spa and summer kitchen.',
    amenities: ['Beach Access', 'Concierge', 'Rooftop Pool'],
    type: 'Residential'
  },
  {
    id: '3',
    title: 'Summit Lodge',
    price: 1200000,
    location: 'Aspen, CO',
    beds: 4,
    baths: 4,
    sqft: 4500,
    image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=1200',
    description: 'Experience true alpine luxury. Hand-hewn logs, massive stone fireplaces, and direct ski-in/ski-out access.',
    amenities: ['Fireplace', 'Ski Access', 'Hot Tub'],
    type: 'Residential'
  },
  {
    id: '4',
    title: 'Lumina Corporate Center',
    price: 12500000,
    location: 'New York, NY',
    beds: 0,
    baths: 12,
    sqft: 25000,
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200',
    description: 'Prime commercial real estate in the heart of Manhattan. Fully leased with high-profile tenants.',
    amenities: ['Parking', 'Security', 'Fibre Optic'],
    type: 'Commercial'
  }
];

export const MARKET_TRENDS: MarketData[] = [
  { month: 'Jan', averagePrice: 950000, volume: 45 },
  { month: 'Feb', averagePrice: 980000, volume: 52 },
  { month: 'Mar', averagePrice: 1020000, volume: 48 },
  { month: 'Apr', averagePrice: 1050000, volume: 61 },
  { month: 'May', averagePrice: 1100000, volume: 75 },
  { month: 'Jun', averagePrice: 1080000, volume: 68 },
];
