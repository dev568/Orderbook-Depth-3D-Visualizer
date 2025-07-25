import React, { useMemo } from 'react';
import { Box } from '@react-three/drei';
import { OrderbookData, Venue } from '../types/orderbook';

interface OrderbookBarsProps {
  data: OrderbookData;
  venues: Venue[];
  timeRange: string;
}

const venueColors = {
  binance: '#F0B90B',
  okx: '#0052FF', 
  bybit: '#F7931A',
  deribit: '#FF6B35'
};

export const OrderbookBars: React.FC<OrderbookBarsProps> = ({ data, venues, timeRange }) => {
  // Safety check - don't render anything if data is invalid
  if (!data || !venues || !Array.isArray(venues)) {
    return null;
  }

  // Prepare bid bars with comprehensive safety checks
  const bidBars = useMemo(() => {
    if (!data?.bids || !Array.isArray(data.bids) || data.bids.length === 0) return [];
    
    return data.bids.slice(0, 10).map((bid, index) => {
      // Comprehensive validation
      if (!bid || typeof bid !== 'object') return null;
      
      const quantity = (typeof bid.quantity === 'number' && !isNaN(bid.quantity) && bid.quantity > 0) ? bid.quantity : 1;
      const price = (typeof bid.price === 'number' && !isNaN(bid.price) && bid.price > 0) ? bid.price : 50000;
      const venue = bid.venue || 'binance';
      
      const height = Math.max(0.1, Math.min(10, Math.log(quantity + 1) * 1.5)); // Clamp height
      const x = Math.max(-25, Math.min(25, (price - 50000) / 2000)); // Clamp position
      const z = -index * 0.5; // Time depth
      
      return {
        position: [x, height / 2, z] as [number, number, number],
        scale: [0.4, height, 0.2] as [number, number, number],
        color: venues.includes(venue) ? (venueColors[venue] || '#22c55e') : '#22c55e',
        opacity: venues.includes(venue) ? 0.8 : 0.4,
        key: `bid-${index}-${price}`
      };
    }).filter(Boolean); // Remove null entries
  }, [data?.bids, venues]);

  // Prepare ask bars with comprehensive safety checks
  const askBars = useMemo(() => {
    if (!data?.asks || !Array.isArray(data.asks) || data.asks.length === 0) return [];
    
    return data.asks.slice(0, 10).map((ask, index) => {
      // Comprehensive validation
      if (!ask || typeof ask !== 'object') return null;
      
      const quantity = (typeof ask.quantity === 'number' && !isNaN(ask.quantity) && ask.quantity > 0) ? ask.quantity : 1;
      const price = (typeof ask.price === 'number' && !isNaN(ask.price) && ask.price > 0) ? ask.price : 70000;
      const venue = ask.venue || 'binance';
      
      const height = Math.max(0.1, Math.min(10, Math.log(quantity + 1) * 1.5)); // Clamp height
      const x = Math.max(-25, Math.min(25, (price - 50000) / 2000)); // Clamp position
      const z = -index * 0.5; // Time depth
      
      return {
        position: [x, height / 2, z] as [number, number, number],
        scale: [0.4, height, 0.2] as [number, number, number],
        color: venues.includes(venue) ? (venueColors[venue] || '#ef4444') : '#ef4444',
        opacity: venues.includes(venue) ? 0.8 : 0.4,
        key: `ask-${index}-${price}`
      };
    }).filter(Boolean); // Remove null entries
  }, [data?.asks, venues]);

  return (
    <group>
      {/* Bid Bars (Buy Orders - Green side) */}
      {Array.isArray(bidBars) && bidBars.map((bar) => {
        if (!bar || !bar.position || !bar.scale || !bar.color) return null;
        
        return (
          <mesh
            key={bar.key}
            position={bar.position}
            scale={bar.scale}
          >
            <boxGeometry args={[1, 1, 1]} />
            <meshPhongMaterial 
              color={bar.color}
              transparent
              opacity={bar.opacity}
            />
          </mesh>
        );
      })}

      {/* Ask Bars (Sell Orders - Red side) */}
      {Array.isArray(askBars) && askBars.map((bar) => {
        if (!bar || !bar.position || !bar.scale || !bar.color) return null;
        
        return (
          <mesh
            key={bar.key}
            position={bar.position}
            scale={bar.scale}
          >
            <boxGeometry args={[1, 1, 1]} />
            <meshPhongMaterial 
              color={bar.color}
              transparent
              opacity={bar.opacity}
            />
          </mesh>
        );
      })}
    </group>
  );
};