import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from '@/components/ui/button';

// Fix for default marker icons in Leaflet with Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface UnitMapProps {
  location?: { lat: number; lng: number };
  onLocationChange?: (location: { lat: number; lng: number }) => void;
  readonly?: boolean;
  unitName?: string;
}

function LocationMarker({ 
  position, 
  onPositionChange, 
  readonly 
}: { 
  position: [number, number] | null;
  onPositionChange: (pos: [number, number]) => void;
  readonly: boolean;
}) {
  useMapEvents({
    click(e) {
      if (!readonly) {
        onPositionChange([e.latlng.lat, e.latlng.lng]);
      }
    },
  });

  return position ? (
    <Marker position={position}>
      <Popup>
        <div className="text-center">
          <p className="font-medium">Unit Location</p>
          <p className="text-xs text-muted-foreground">
            {position[0].toFixed(6)}, {position[1].toFixed(6)}
          </p>
        </div>
      </Popup>
    </Marker>
  ) : null;
}

export function UnitMap({ location, onLocationChange, readonly = false, unitName }: UnitMapProps) {
  const [position, setPosition] = useState<[number, number] | null>(
    location ? [location.lat, location.lng] : null
  );

  // Default center: Cairo, Egypt
  const defaultCenter: [number, number] = [30.0444, 31.2357];
  const center = position || defaultCenter;

  const handlePositionChange = (pos: [number, number]) => {
    setPosition(pos);
    onLocationChange?.({ lat: pos[0], lng: pos[1] });
  };

  return (
    <div className="relative w-full h-[300px] rounded-lg overflow-hidden border border-border">
      <MapContainer
        center={center}
        zoom={position ? 15 : 10}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker 
          position={position} 
          onPositionChange={handlePositionChange}
          readonly={readonly}
        />
      </MapContainer>
      {!readonly && !position && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 pointer-events-none">
          <p className="text-sm text-muted-foreground bg-background px-3 py-1 rounded-md shadow-sm">
            Click on the map to set location
          </p>
        </div>
      )}
      {!readonly && position && (
        <div className="absolute bottom-2 right-2 z-[1000]">
          <Button
            size="sm"
            variant="destructive"
            onClick={() => {
              setPosition(null);
              onLocationChange?.(undefined as any);
            }}
          >
            Clear Location
          </Button>
        </div>
      )}
    </div>
  );
}
