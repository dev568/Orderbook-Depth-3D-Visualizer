import { useState, useEffect, useRef } from 'react';
import { OrderbookData, Venue, OrderLevel } from '../types/orderbook';

// Mock data generator for realistic orderbook simulation
const generateMockOrderbook = (symbol: string, venues: Venue[]): OrderbookData => {
  const basePrice = 65000; // BTC base price
  const spread = 50;
  
  const generateOrders = (isAsk: boolean, venue: Venue): OrderLevel[] => {
    const orders: OrderLevel[] = [];
    const priceDirection = isAsk ? 1 : -1;
    
    for (let i = 0; i < 25; i++) {
      const priceOffset = (i * 10 + Math.random() * 5) * priceDirection;
      const price = basePrice + (isAsk ? spread/2 : -spread/2) + priceOffset;
      
      // More realistic quantity distribution
      const quantity = Math.random() * 5 + 0.1 + (25 - i) * 0.1;
      
      orders.push({
        price: Math.round(price * 100) / 100,
        quantity: Math.round(quantity * 10000) / 10000,
        venue,
        timestamp: Date.now() - i * 1000
      });
    }
    
    return orders.sort((a, b) => isAsk ? a.price - b.price : b.price - a.price);
  };

  // Generate orders for each venue
  const allBids: OrderLevel[] = [];
  const allAsks: OrderLevel[] = [];
  
  venues.forEach(venue => {
    allBids.push(...generateOrders(false, venue));
    allAsks.push(...generateOrders(true, venue));
  });

  // Sort and limit orders
  allBids.sort((a, b) => b.price - a.price);
  allAsks.sort((a, b) => a.price - b.price);

  const bestBid = allBids[0]?.price || basePrice - spread/2;
  const bestAsk = allAsks[0]?.price || basePrice + spread/2;

  return {
    symbol,
    timestamp: Date.now(),
    bids: allBids.slice(0, 50),
    asks: allAsks.slice(0, 50),
    currentPrice: (bestBid + bestAsk) / 2,
    spread: bestAsk - bestBid
  };
};

export const useOrderbookData = (symbol: string, venues: Venue[], timeRange: string) => {
  const [data, setData] = useState<OrderbookData | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Simulate connection
    setIsConnected(true);
    
    // Generate initial data
    const initialData = generateMockOrderbook(symbol, venues);
    setData(initialData);

    // Set up real-time updates
    const updateInterval = timeRange === '1m' ? 1000 : 
                          timeRange === '5m' ? 5000 : 
                          timeRange === '15m' ? 15000 : 30000;

    intervalRef.current = setInterval(() => {
      const newData = generateMockOrderbook(symbol, venues);
      setData(newData);
    }, updateInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [symbol, venues, timeRange]);

  // Simulate connection loss occasionally
  useEffect(() => {
    const connectionInterval = setInterval(() => {
      // 5% chance of temporary disconnection
      if (Math.random() < 0.05) {
        setIsConnected(false);
        setTimeout(() => setIsConnected(true), 2000);
      }
    }, 10000);

    return () => clearInterval(connectionInterval);
  }, []);

  return { data, isConnected };
};