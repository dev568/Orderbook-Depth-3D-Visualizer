import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

interface ControlPanelProps {
  timeRange: string;
  onTimeRangeChange: (range: string) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  quantityThreshold: number;
  onQuantityThresholdChange: (threshold: number) => void;
  showPressureZones: boolean;
  onShowPressureZonesChange: (show: boolean) => void;
  visualizationMode: 'realtime' | 'historical';
  onVisualizationModeChange: (mode: 'realtime' | 'historical') => void;
  autoRotate: boolean;
  onAutoRotateChange: (rotate: boolean) => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  timeRange,
  onTimeRangeChange,
  priceRange,
  onPriceRangeChange,
  quantityThreshold,
  onQuantityThresholdChange,
  showPressureZones,
  onShowPressureZonesChange,
  visualizationMode,
  onVisualizationModeChange,
  autoRotate,
  onAutoRotateChange
}) => {
  return (
    <div className="h-full overflow-y-auto p-4 space-y-4">
      {/* Time Range Selection */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Time Range</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Select value={timeRange} onValueChange={onTimeRangeChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1m">1 Minute</SelectItem>
              <SelectItem value="5m">5 Minutes</SelectItem>
              <SelectItem value="15m">15 Minutes</SelectItem>
              <SelectItem value="1h">1 Hour</SelectItem>
              <SelectItem value="4h">4 Hours</SelectItem>
              <SelectItem value="1d">1 Day</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Price Range Filter */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Price Range</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">
              Range: ${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()}
            </Label>
            <Slider
              value={priceRange}
              onValueChange={(value) => onPriceRangeChange(value as [number, number])}
              min={0}
              max={100000}
              step={1000}
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>

      {/* Quantity Threshold */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Quantity Filter</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">
              Min Quantity: {quantityThreshold.toFixed(4)}
            </Label>
            <Slider
              value={[quantityThreshold]}
              onValueChange={(value) => onQuantityThresholdChange(value[0])}
              min={0}
              max={10}
              step={0.1}
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Visualization Mode */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Visualization Mode</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Select value={visualizationMode} onValueChange={onVisualizationModeChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="realtime">Real-time</SelectItem>
              <SelectItem value="historical">Historical</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Display Options */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Display Options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="pressure-zones" className="text-sm">Pressure Zones</Label>
            <Switch
              id="pressure-zones"
              checked={showPressureZones}
              onCheckedChange={onShowPressureZonesChange}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="auto-rotate" className="text-sm">Auto Rotate</Label>
            <Switch
              id="auto-rotate"
              checked={autoRotate}
              onCheckedChange={onAutoRotateChange}
            />
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full text-xs"
            onClick={() => {
              onPriceRangeChange([40000, 80000]);
              onQuantityThresholdChange(0.1);
            }}
          >
            Focus High Volume
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full text-xs"
            onClick={() => {
              onPriceRangeChange([0, 100000]);
              onQuantityThresholdChange(0);
            }}
          >
            Reset Filters
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full text-xs"
            onClick={() => onShowPressureZonesChange(!showPressureZones)}
          >
            Toggle Pressure Zones
          </Button>
        </CardContent>
      </Card>

      {/* Performance Info */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-muted-foreground space-y-1">
            <div>Rendering: 60 FPS</div>
            <div>Data Points: ~2,000</div>
            <div>Memory Usage: Low</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};