import { useMemo } from 'react';
import { OrderbookData, Venue, PressureZone, PressureZoneData } from '../types/orderbook';

export const usePressureZones = (data: OrderbookData | null, venues: Venue[]): PressureZoneData | null => {
  return useMemo(() => {
    if (!data) return null;

    // Analyze orderbook for pressure zones
    const analyzePressureZones = (orders: any[], type: 'bid' | 'ask'): PressureZone[] => {
      const zones: PressureZone[] = [];
      const priceGroups = new Map<number, { totalVolume: number; venues: Set<Venue> }>();

      // Group orders by price levels (rounded to nearest 100)
      orders.forEach(order => {
        if (!venues.includes(order.venue)) return;
        
        const priceLevel = Math.round(order.price / 100) * 100;
        
        if (!priceGroups.has(priceLevel)) {
          priceGroups.set(priceLevel, { totalVolume: 0, venues: new Set() });
        }
        
        const group = priceGroups.get(priceLevel)!;
        group.totalVolume += order.quantity;
        group.venues.add(order.venue);
      });

      // Convert to pressure zones with intensity classification
      priceGroups.forEach((group, priceLevel) => {
        let intensity: 'high' | 'medium' | 'low';
        
        if (group.totalVolume > 5 && group.venues.size >= 3) {
          intensity = 'high';
        } else if (group.totalVolume > 2 && group.venues.size >= 2) {
          intensity = 'medium';
        } else {
          intensity = 'low';
        }

        zones.push({
          priceLevel,
          intensity,
          totalVolume: group.totalVolume,
          venues: Array.from(group.venues),
          type
        });
      });

      return zones.sort((a, b) => b.totalVolume - a.totalVolume);
    };

    // Analyze both bid and ask sides
    const bidZones = analyzePressureZones(data.bids, 'bid');
    const askZones = analyzePressureZones(data.asks, 'ask');
    
    // Combine and categorize zones
    const allZones = [...bidZones, ...askZones];
    
    return {
      high: allZones.filter(zone => zone.intensity === 'high'),
      medium: allZones.filter(zone => zone.intensity === 'medium'),
      low: allZones.filter(zone => zone.intensity === 'low')
    };
  }, [data, venues]);
};