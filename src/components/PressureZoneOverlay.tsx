import React from 'react';
import { Sphere } from '@react-three/drei';
import { PressureZoneData } from '../types/orderbook';

interface PressureZoneOverlayProps {
  zones: PressureZoneData;
}

export const PressureZoneOverlay: React.FC<PressureZoneOverlayProps> = ({ zones }) => {
  // Enhanced safety checks
  if (!zones || typeof zones !== 'object') {
    return null;
  }

  const { high = [], medium = [], low = [] } = zones;

  // Ensure arrays are valid
  if (!Array.isArray(high) && !Array.isArray(medium) && !Array.isArray(low)) {
    return null;
  }

  return (
    <group>
      {/* High Pressure Zones - Use simple mesh instead of Sphere */}
      {Array.isArray(high) && high.slice(0, 3).map((zone, index) => {
        if (!zone || typeof zone.priceLevel !== 'number' || typeof zone.totalVolume !== 'number') {
          return null;
        }

        const x = Math.max(-30, Math.min(30, (zone.priceLevel - 50000) / 1500));
        const y = Math.max(1, Math.min(15, Math.log(zone.totalVolume + 1) * 1.5));
        const z = -index * 2;
        
        return (
          <mesh
            key={`high-${index}-${zone.priceLevel}`}
            position={[x, y, z]}
          >
            <sphereGeometry args={[1.2, 16, 16]} />
            <meshPhongMaterial
              color="#ef4444"
              transparent
              opacity={0.6}
            />
          </mesh>
        );
      })}

      {/* Medium Pressure Zones */}
      {Array.isArray(medium) && medium.slice(0, 3).map((zone, index) => {
        if (!zone || typeof zone.priceLevel !== 'number' || typeof zone.totalVolume !== 'number') {
          return null;
        }

        const x = Math.max(-30, Math.min(30, (zone.priceLevel - 50000) / 1500));
        const y = Math.max(1, Math.min(15, Math.log(zone.totalVolume + 1) * 1.2));
        const z = -index * 2 - 8;
        
        return (
          <mesh
            key={`medium-${index}-${zone.priceLevel}`}
            position={[x, y, z]}
          >
            <sphereGeometry args={[0.9, 16, 16]} />
            <meshPhongMaterial
              color="#f59e0b"
              transparent
              opacity={0.4}
            />
          </mesh>
        );
      })}

      {/* Low Pressure Zones */}
      {Array.isArray(low) && low.slice(0, 3).map((zone, index) => {
        if (!zone || typeof zone.priceLevel !== 'number' || typeof zone.totalVolume !== 'number') {
          return null;
        }

        const x = Math.max(-30, Math.min(30, (zone.priceLevel - 50000) / 1500));
        const y = Math.max(1, Math.min(15, Math.log(zone.totalVolume + 1) * 1));
        const z = -index * 2 - 16;
        
        return (
          <mesh
            key={`low-${index}-${zone.priceLevel}`}
            position={[x, y, z]}
          >
            <sphereGeometry args={[0.6, 16, 16]} />
            <meshPhongMaterial
              color="#22c55e"
              transparent
              opacity={0.3}
            />
          </mesh>
        );
      })}
    </group>
  );
};