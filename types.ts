
export interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  beds: number;
  baths: number;
  sqft: number;
  image: string;
  description: string;
  amenities: string[];
  type: 'Residential' | 'Commercial' | 'Plot';
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface MarketData {
  month: string;
  averagePrice: number;
  volume: number;
}
