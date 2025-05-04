import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { Icon } from 'leaflet';
import { DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM, STATUS_COLORS } from '../config';
import { Issue } from '../types';
import { Link } from 'react-router-dom';

interface MapViewProps {
  issues?: Issue[];
  selectable?: boolean;
  onLocationSelect?: (location: { lat: number; lng: number }) => void;
  selectedLocation?: { lat: number; lng: number } | null;
  height?: string;
}

// Custom marker icons for different issue statuses
const createIcon = (status: string) => {
  const color = status === 'Pending' ? '#F59E0B' : 
                status === 'In Progress' ? '#3B82F6' : 
                '#10B981';
                
  return new Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${
      status === 'Pending' ? 'orange' : 
      status === 'In Progress' ? 'blue' : 
      'green'
    }.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

const LocationMarker: React.FC<{
  onLocationSelect: (location: { lat: number; lng: number }) => void;
  selectedLocation: { lat: number; lng: number } | null;
}> = ({ onLocationSelect, selectedLocation }) => {
  const map = useMapEvents({
    click(e) {
      onLocationSelect({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });

  return selectedLocation ? (
    <Marker 
      position={[selectedLocation.lat, selectedLocation.lng]}
      icon={createIcon('Pending')}
    >
      <Popup>Selected location</Popup>
    </Marker>
  ) : null;
};

const MapView: React.FC<MapViewProps> = ({ 
  issues = [], 
  selectable = false, 
  onLocationSelect = () => {}, 
  selectedLocation = null,
  height = '500px'
}) => {
  return (
    <div style={{ height }} className="w-full rounded-lg overflow-hidden shadow-md">
      <MapContainer 
        center={selectedLocation || DEFAULT_MAP_CENTER} 
        zoom={DEFAULT_MAP_ZOOM} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {selectable && (
          <LocationMarker 
            onLocationSelect={onLocationSelect} 
            selectedLocation={selectedLocation} 
          />
        )}
        
        {!selectable && issues.map(issue => (
          <Marker 
            key={issue._id}
            position={[issue.location.lat, issue.location.lng]}
            icon={createIcon(issue.status)}
          >
            <Popup>
              <div className="w-48">
                <h3 className="font-semibold text-gray-800">{issue.title}</h3>
                <p className="text-xs text-gray-600 line-clamp-2 my-1">{issue.description}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${STATUS_COLORS[issue.status]}`}>
                    {issue.status}
                  </span>
                  <Link 
                    to={`/issue/${issue._id}`}
                    className="text-xs font-medium text-teal-600 hover:text-teal-800"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;