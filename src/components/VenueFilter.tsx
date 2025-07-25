import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Venue } from '../types/orderbook';
import { Filter } from 'lucide-react';

interface VenueFilterProps {
  selectedVenues: Venue[];
  onVenuesChange: (venues: Venue[]) => void;
}

const venueConfig = {
  binance: { name: 'Binance', color: 'bg-binance text-black' },
  okx: { name: 'OKX', color: 'bg-okx text-white' },
  bybit: { name: 'Bybit', color: 'bg-bybit text-white' },
  deribit: { name: 'Deribit', color: 'bg-deribit text-white' },
};

export const VenueFilter: React.FC<VenueFilterProps> = ({
  selectedVenues,
  onVenuesChange
}) => {
  const toggleVenue = (venue: Venue) => {
    if (selectedVenues.includes(venue)) {
      onVenuesChange(selectedVenues.filter(v => v !== venue));
    } else {
      onVenuesChange([...selectedVenues, venue]);
    }
  };

  const selectAll = () => {
    onVenuesChange(['binance', 'okx', 'bybit', 'deribit']);
  };

  const selectNone = () => {
    onVenuesChange([]);
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex gap-2">
        {selectedVenues.map(venue => (
          <Badge
            key={venue}
            className={`${venueConfig[venue].color} text-xs font-medium`}
          >
            {venueConfig[venue].name}
          </Badge>
        ))}
        {selectedVenues.length === 0 && (
          <Badge variant="secondary" className="text-xs">
            No venues selected
          </Badge>
        )}
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-8">
            <Filter className="w-4 h-4 mr-2" />
            Venues ({selectedVenues.length})
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64" align="end">
          <div className="space-y-4">
            <div className="flex justify-between">
              <h4 className="font-medium text-sm">Trading Venues</h4>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs"
                  onClick={selectAll}
                >
                  All
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs"
                  onClick={selectNone}
                >
                  None
                </Button>
              </div>
            </div>
            
            <div className="space-y-3">
              {(Object.keys(venueConfig) as Venue[]).map(venue => (
                <div key={venue} className="flex items-center space-x-3">
                  <Checkbox
                    id={venue}
                    checked={selectedVenues.includes(venue)}
                    onCheckedChange={() => toggleVenue(venue)}
                  />
                  <label
                    htmlFor={venue}
                    className="flex items-center gap-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    <div className={`w-3 h-3 rounded-full ${venueConfig[venue].color}`} />
                    {venueConfig[venue].name}
                  </label>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-border">
              <div className="text-xs text-muted-foreground">
                Select multiple venues to compare orderbook depth across exchanges.
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};