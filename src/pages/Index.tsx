import React from 'react';
import { OrderbookVisualizer } from '../components/OrderbookVisualizer';

const Index = () => {
  return (
    <div className="h-screen w-full">
      <OrderbookVisualizer symbol="BTC/USD" />
    </div>
  );
};

export default Index;
