import React, { useEffect, useRef } from 'react';
import { useData } from '../../contexts/DataContext';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const MapView = ({ dumpsters }) => {
  const { customers } = useData();
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  
  // Default center coordinates (New York City as example)
  const defaultCenter = {
    lat: 40.7128,
    lng: -74.0060
  };

  useEffect(() => {
    if (!window.google) {
      console.error('Google Maps JavaScript API not loaded');
      return;
    }

    // Initialize the map
    const map = new window.google.maps.Map(mapRef.current, {
      zoom: 12,
      center: defaultCenter,
      mapTypeId: window.google.maps.MapTypeId.ROADMAP
    });

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // Add markers for each dumpster
    dumpsters.forEach(dumpster => {
      if (dumpster.location) {
        const customer = customers.find(c => c.id === dumpster.customerId);
        
        const marker = new window.google.maps.Marker({
          position: dumpster.location,
          map: map,
          title: `Dumpster #${dumpster.id}`,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: getStatusColor(dumpster.status),
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: '#FFFFFF'
          }
        });

        // Info window content
        const infoContent = `
          <div style="padding: 12px;">
            <h3 style="margin: 0 0 8px 0;font-weight: bold;">Dumpster #${dumpster.id}</h3>
            <p style="margin: 4px 0;"><strong>Status:</strong> ${dumpster.status}</p>
            <p style="margin: 4px 0;"><strong>Size:</strong> ${dumpster.size}</p>
            ${customer ? `<p style="margin: 4px 0;"><strong>Customer:</strong> ${customer.name}</p>` : ''}
          </div>
        `;

        const infoWindow = new window.google.maps.InfoWindow({
          content: infoContent
        });

        marker.addListener('click', () => {
          infoWindow.open(map, marker);
        });

        markersRef.current.push(marker);
      }
    });

    // Fit map to show all markers
    if (markersRef.current.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      markersRef.current.forEach(marker => {
        bounds.extend(marker.getPosition());
      });
      map.fitBounds(bounds);
    }
  }, [dumpsters, customers]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return '#10B981'; // green
      case 'in-use':
        return '#3B82F6'; // blue
      case 'maintenance':
        return '#EF4444'; // red
      default:
        return '#6B7280'; // gray
    }
  };

  return (
    <div className="space-y-4">
      <div ref={mapRef} className="w-full h-[600px] rounded-lg border border-gray-200" />
      
      {/* Map Legend */}
      <div className="flex items-center justify-end space-x-6 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span>Available</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span>In Use</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span>Maintenance</span>
        </div>
      </div>
    </div>
  );
};

export default MapView;