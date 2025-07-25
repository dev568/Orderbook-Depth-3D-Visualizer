export type Venue = 'binance' | 'okx' | 'bybit' | 'deribit';

export interface OrderLevel {
  price: number;
  quantity: number;
  venue: Venue;
  timestamp: number;
}

export interface OrderbookData {
  symbol: string;
  timestamp: number;
  bids: OrderLevel[];
  asks: OrderLevel[];
  currentPrice?: number;
  spread?: number;
}

export interface PressureZone {
  priceLevel: number;
  intensity: 'high' | 'medium' | 'low';
  totalVolume: number;
  venues: Venue[];
  type: 'bid' | 'ask';
}

export interface PressureZoneData {
  high: PressureZone[];
  medium: PressureZone[];
  low: PressureZone[];
}

export interface VenueConfig {
  name: string;
  color: string;
  enabled: boolean;
  endpoint?: string;
}

export interface VisualizationSettings {
  timeRange: string;
  priceRange: [number, number];
  quantityThreshold: number;
  showPressureZones: boolean;
  visualizationMode: 'realtime' | 'historical';
  autoRotate: boolean;
}