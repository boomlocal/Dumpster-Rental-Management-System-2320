import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiMapPin, FiTruck, FiSettings, FiRefreshCw } = FiIcons;

const MapView = ({ dumpsters }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  // Default center
  const defaultCenter = { lat: 40.7128, lng: -74.0060 };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return '#10b981';
      case 'in-use': return '#3b82f6';  
      case 'maintenance': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const initializeMap = () => {
    if (!window.google) {
      setError('Google Maps JavaScript API not loaded. Please add your API key to index.html');
      return;
    }

    try {
      const mapInstance = new window.google.maps.Map(mapRef.current, {
        zoom: 12,
        center: defaultCenter,
        mapTypeId: window.google.maps.MapTypeId.ROADMAP,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }]
          }
        ]
      });

      setMap(mapInstance);
      setIsLoaded(true);
      setError(null);
    } catch (err) {
      setError('Failed to initialize Google Maps: ' + err.message);
    }
  };

  const clearMarkers = () => {
    markers.forEach(marker => marker.setMap(null));
    setMarkers([]);
  };

  const addMarkersToMap = () => {
    if (!map || !window.google) return;

    clearMarkers();
    const newMarkers = [];

    dumpsters.forEach((dumpster) => {
      if (dumpster.location && dumpster.location.lat && dumpster.location.lng) {
        const marker = new window.google.maps.Marker({
          position: { lat: dumpster.location.lat, lng: dumpster.location.lng },
          map: map,
          title: `Dumpster #${dumpster.id} - ${dumpster.size}`,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 12,
            fillColor: getStatusColor(dumpster.status),
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2,
          }
        });

        const infoWindow = new window.google.maps.InfoWindow({
          content: createInfoWindowContent(dumpster)
        });

        marker.addListener('click', () => {
          infoWindow.open(map, marker);
        });

        newMarkers.push(marker);
      }
    });

    setMarkers(newMarkers);

    if (newMarkers.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      newMarkers.forEach(marker => {
        bounds.extend(marker.getPosition());
      });
      map.fitBounds(bounds);
    }
  };

  const createInfoWindowContent = (dumpster) => {
    return `
      <div style="padding: 8px; min-width: 200px;">
        <h3 style="margin: 0 0 8px 0; color: #1f2937;"><strong>Dumpster #${dumpster.id}</strong></h3>
        <p style="margin: 4px 0; color: #374151;"><strong>Size:</strong> ${dumpster.size}</p>
        <p style="margin: 4px 0; color: #374151;"><strong>Status:</strong> <span style="color: ${getStatusColor(dumpster.status)};">${dumpster.status.replace('-', ' ')}</span></p>
        <p style="margin: 4px 0; color: #374151;"><strong>Location:</strong> ${dumpster.location.lat.toFixed(4)}, ${dumpster.location.lng.toFixed(4)}</p>
        ${dumpster.customerId ? `<p style="margin: 4px 0; color: #374151;"><strong>Assigned:</strong> Customer #${dumpster.customerId}</p>` : ''}
      </div>
    `;
  };

  const refreshMap = () => {
    if (map) {
      addMarkersToMap();
    }
  };

  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google && window.google.maps) {
        initializeMap();
        return;
      }

      // Check if script tag exists
      const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
      if (existingScript) {
        const checkGoogle = setInterval(() => {
          if (window.google && window.google.maps) {
            clearInterval(checkGoogle);
            initializeMap();
          }
        }, 100);
        
        // Clear interval after 10 seconds if Google Maps doesn't load
        setTimeout(() => {
          clearInterval(checkGoogle);
          if (!window.google) {
            setError('Google Maps API failed to load. Please check your API key and internet connection.');
          }
        }, 10000);
        
        return;
      }

      setError('Google Maps API not loaded. Please add the Google Maps script to index.html with your API key.');
    };

    loadGoogleMaps();
  }, []);

  useEffect(() => {
    if (map && isLoaded) {
      addMarkersToMap();
    }
  }, [map, dumpsters, isLoaded]);

  if (error) {
    return (
      <div className="space-y-4">
        <div className="h-96 bg-red-50 border-2 border-red-200 rounded-lg flex items-center justify-center">
          <div className="text-center p-6 max-w-md">
            <SafeIcon icon={FiMapPin} className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-800 mb-2">Map Configuration Required</h3>
            <p className="text-red-700 mb-4 text-sm">{error}</p>
            <div className="bg-white border border-red-300 rounded-lg p-4 text-left">
              <h4 className="font-semibold text-red-800 mb-2">Setup Instructions:</h4>
              <ol className="text-sm text-red-700 space-y-1">
                <li>1. Get a Google Maps API key from Google Cloud Console</li>
                <li>2. Replace YOUR_API_KEY in index.html with your actual key</li>
                <li>3. Enable Maps JavaScript API in Google Cloud Console</li>
                <li>4. Refresh this page</li>
              </ol>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Available ({dumpsters.filter(d => d.status === 'available').length})</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>In Use ({dumpsters.filter(d => d.status === 'in-use').length})</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Maintenance ({dumpsters.filter(d => d.status === 'maintenance').length})</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Live Dumpster Locations</h3>
        <button
          onClick={refreshMap}
          className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <SafeIcon icon={FiRefreshCw} className="w-4 h-4" />
          <span>Refresh</span>
        </button>
      </div>

      <div className="relative">
        <div 
          ref={mapRef} 
          className="h-96 w-full rounded-lg border border-gray-200 bg-gray-100"
          style={{ minHeight: '400px' }}
        />
        
        {!isLoaded && !error && (
          <div className="absolute inset-0 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-gray-600">Loading map...</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Available ({dumpsters.filter(d => d.status === 'available').length})</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>In Use ({dumpsters.filter(d => d.status === 'in-use').length})</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Maintenance ({dumpsters.filter(d => d.status === 'maintenance').length})</span>
          </div>
        </div>
        <div className="text-sm text-gray-500">
          Total: {dumpsters.length} dumpsters
        </div>
      </div>
    </div>
  );
};

export default MapView;