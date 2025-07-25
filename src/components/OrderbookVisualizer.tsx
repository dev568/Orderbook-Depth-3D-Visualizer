import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Grid, Line } from '@react-three/drei';
import * as THREE from 'three';
import { OrderbookData, Venue, PressureZone } from '../types/orderbook';
import { ControlPanel } from './ControlPanel';
import { VenueFilter } from './VenueFilter';
import { PressureZoneOverlay } from './PressureZoneOverlay';
import { OrderbookBars } from './OrderbookBars';
import { useOrderbookData } from '../hooks/useOrderbookData';
import { usePressureZones } from '../hooks/usePressureZones';

interface OrderbookVisualizerProps {
  symbol: string;
}

export const OrderbookVisualizer: React.FC<OrderbookVisualizerProps> = ({ symbol }) => {
  const [selectedVenues, setSelectedVenues] = useState<Venue[]>(['binance', 'okx', 'bybit', 'deribit']);
  const [timeRange, setTimeRange] = useState<string>('1m');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [quantityThreshold, setQuantityThreshold] = useState<number>(0);
  const [showPressureZones, setShowPressureZones] = useState<boolean>(true);
  const [visualizationMode, setVisualizationMode] = useState<'realtime' | 'historical'>('realtime');
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  
  // Real-time orderbook data
  const { data: orderbookData, isConnected } = useOrderbookData(symbol, selectedVenues, timeRange);
  
  // Pressure zone analysis
  const pressureZones = usePressureZones(orderbookData, selectedVenues);
  
  // Filter data based on current settings
  const filteredData = useMemo(() => {
    if (!orderbookData) return null;
    
    return {
      ...orderbookData,
      bids: orderbookData.bids.filter(
        bid => bid.price >= priceRange[0] && bid.price <= priceRange[1] && bid.quantity >= quantityThreshold
      ),
      asks: orderbookData.asks.filter(
        ask => ask.price >= priceRange[0] && ask.price <= priceRange[1] && ask.quantity >= quantityThreshold
      )
    };
  }, [orderbookData, priceRange, quantityThreshold]);

  // Early loading state to prevent undefined data issues
  if (!orderbookData) {
    return (
      <div className="w-full h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-muted-foreground">Loading 3D visualization...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-background text-foreground">
      {/* Header */}
      <div className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-foreground">
            Orderbook Depth Visualizer
          </h1>
          <div className="px-3 py-1 bg-accent/20 rounded-md text-accent-foreground text-sm font-mono">
            {symbol}
          </div>
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-bid' : 'bg-ask'}`} />
          <span className="text-sm text-muted-foreground">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
        
        <VenueFilter
          selectedVenues={selectedVenues}
          onVenuesChange={setSelectedVenues}
        />
      </div>

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Control Panel */}
        <div className="w-80 border-r border-border bg-card/50">
          <ControlPanel
            timeRange={timeRange}
            onTimeRangeChange={setTimeRange}
            priceRange={priceRange}
            onPriceRangeChange={setPriceRange}
            quantityThreshold={quantityThreshold}
            onQuantityThresholdChange={setQuantityThreshold}
            showPressureZones={showPressureZones}
            onShowPressureZonesChange={setShowPressureZones}
            visualizationMode={visualizationMode}
            onVisualizationModeChange={setVisualizationMode}
            autoRotate={autoRotate}
            onAutoRotateChange={setAutoRotate}
          />
        </div>

        {/* 3D Visualization */}
        <div className="flex-1 relative bg-background">
          <Canvas
            camera={{ 
              position: [50, 40, 50], 
              fov: 60,
              near: 0.1,
              far: 1000
            }}
            onCreated={({ gl }) => {
              gl.setClearColor('#000000');
            }}
          >
            <React.Suspense fallback={null}>
              <ambientLight intensity={0.4} />
              <directionalLight 
                position={[10, 10, 5]} 
                intensity={0.8}
              />
              <pointLight position={[-10, -10, -10]} intensity={0.3} />
              
              {/* Controls */}
              <OrbitControls 
                enablePan={true}
                enableZoom={true}
                enableRotate={true}
                autoRotate={autoRotate}
                autoRotateSpeed={1}
                minDistance={20}
                maxDistance={200}
              />

              {/* Simple Grid */}
              <gridHelper args={[100, 20]} position={[0, 0, 0]} />

              {/* Test cube to ensure Canvas works */}
              <mesh position={[0, 1, 0]}>
                <boxGeometry args={[1, 1, 1]} />
                <meshPhongMaterial color="#22c55e" />
              </mesh>

              {/* Orderbook Data Visualization - only render if data is valid */}
              {filteredData && filteredData.bids && filteredData.asks && (
                <OrderbookBars 
                  data={filteredData}
                  venues={selectedVenues}
                  timeRange={timeRange}
                />
              )}

              {/* Pressure Zone Overlay - only render if enabled and data exists */}
              {showPressureZones && pressureZones && (
                <PressureZoneOverlay zones={pressureZones} />
              )}

              {/* Current Price Indicator - only render if price exists and is valid */}
              {filteredData?.currentPrice && typeof filteredData.currentPrice === 'number' && (
                <mesh position={[0, 10, 0]}>
                  <boxGeometry args={[2, 0.2, 40]} />
                  <meshBasicMaterial color="#F0B90B" transparent opacity={0.7} />
                </mesh>
              )}
            </React.Suspense>
          </Canvas>

          {/* Real-time Statistics Overlay */}
          <div className="absolute top-4 right-4 bg-card/90 backdrop-blur-sm border border-border rounded-lg p-4 min-w-64">
            <h3 className="text-lg font-semibold mb-3 text-foreground">Market Statistics</h3>
            
            {filteredData && (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Current Price:</span>
                  <span className="font-mono text-price-line">
                    ${filteredData.currentPrice?.toLocaleString()}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Spread:</span>
                  <span className="font-mono text-foreground">
                    ${filteredData.spread?.toFixed(2)}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Best Bid:</span>
                  <span className="font-mono text-bid">
                    ${filteredData.bids[0]?.price?.toLocaleString()}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Best Ask:</span>
                  <span className="font-mono text-ask">
                    ${filteredData.asks[0]?.price?.toLocaleString()}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Bid Volume:</span>
                  <span className="font-mono text-bid">
                    {filteredData.bids.reduce((sum, bid) => sum + bid.quantity, 0).toFixed(4)}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Ask Volume:</span>
                  <span className="font-mono text-ask">
                    {filteredData.asks.reduce((sum, ask) => sum + ask.quantity, 0).toFixed(4)}
                  </span>
                </div>
              </div>
            )}
            
            {pressureZones && showPressureZones && (
              <div className="mt-4 pt-3 border-t border-border">
                <h4 className="text-sm font-medium mb-2 text-foreground">Pressure Zones</h4>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-pressure-high">High Pressure:</span>
                    <span className="font-mono">{pressureZones.high.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-pressure-medium">Medium Pressure:</span>
                    <span className="font-mono">{pressureZones.medium.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-pressure-low">Low Pressure:</span>
                    <span className="font-mono">{pressureZones.low.length}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};