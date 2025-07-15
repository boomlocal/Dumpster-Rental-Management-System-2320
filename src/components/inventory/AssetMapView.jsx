```jsx
import React, { useEffect, useRef, useState } from 'react';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiMapPin, FiHome, FiRefreshCw, FiTruck, FiSettings } = FiIcons;

const AssetMapView = ({ assets, yardLocations, onSelectAsset, onUpdateLocation }) => {
  const mapRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const markersRef = useRef([]);
  const infoWindowRef = useRef(null);
  
  useEffect(() => {
    initializeMap();
  }, [assets]);
  
  const initializeMap = () => {
    if (!window.google || !window.google.maps) {
      console.error('Google Maps not loaded');
      return;
    }
    
    if (!mapRef.current) return;
    
    const map = new window.google.maps.Map(mapRef.current, {
      zoom: 11,
      center: { lat: 26.1420, lng: -81.7948 }, // Naples, FL
      mapTypeId: window.google.maps.MapTypeId.ROADMAP,
      mapTypeControl: true,
      mapTypeControlOptions: {
        style: window.google.maps.MapTypeControlStyle.DROPDOWN_MENU,
        position: window.google.maps.ControlPosition.TOP_RIGHT
      }
    });
    
    // Create shared info window
    if (!infoWindowRef.current) {
      infoWindowRef.current = new window.google.maps.InfoWindow();
    }
    
    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];
    
    // Add yard location markers
    yardLocations.forEach(yard => {
      if (yard.coordinates) {
        const marker = new window.google.maps.Marker({
          position: yard.coordinates,
          map: map,
          title: yard.name,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            fillColor: '#10B981', // green
            fillOpacity: 1,
            strokeWeight: 1,
            strokeColor: '#FFFFFF',
            scale: 10
          }
        });
        
        marker.addListener('click', () => {
          infoWindowRef.current.setContent(`
            <div style="padding: 8px;">
              <h3 style="margin: 0 0 4px 0; font-weight: bold;">${yard.name}</h3>
              <p style="margin: 4px 0; font-size: 14px;">${yard.address}</p>
              <p style="margin: 4px 0; font-size: 14px; color: #10B981;">Yard Location</p>
            </div>
          `);
          infoWindowRef.current.open(map, marker);
        });
        
        markersRef.current.push(marker);
      }
    });
    
    // Add asset markers
    assets.forEach(asset => {
      if (asset.location?.coordinates) {
        const isYard = asset.location.type === 'yard';
        
        // Determine marker color based on status
        let markerColor;
        switch (asset.status) {
          case 'available': markerColor = '#10B981'; break; // green
          case 'deployed': markerColor = '#3B82F6'; break; // blue
          case 'maintenance': markerColor = '#EF4444'; break; // red
          case 'in-transit': markerColor = '#F59E0B'; break; // yellow
          default: markerColor = '#6B7280'; break; // gray
        }
        
        const marker = new window.google.maps.Marker({
          position: asset.location.coordinates,
          map: map,
          title: asset.assetNumber,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            fillColor: markerColor,
            fillOpacity: 0.9,
            strokeWeight: 2,
            strokeColor: '#FFFFFF',
            scale: 12
          },
          label: {
            text: asset.assetNumber.substring(0, 2),
            color: '#FFFFFF',
            fontSize: '10px',
            fontWeight: 'bold'
          },
          zIndex: 10
        });
        
        marker.addListener('click', () => {
          setSelectedAsset(asset);
          
          const infoContent = `
            <div style="padding: 8px; max-width: 300px;">
              <h3 style="margin: 0 0 4px 0; font-weight: bold;">${asset.assetNumber}</h3>
              <p style="margin: 4px 0; font-size: 14px;">${asset.containerSize} ${asset.containerUnit} ${asset.type}</p>
              <p style="margin: 4px 0; font-size: 14px; color: ${isYard ? '#3B82F6' : '#10B981'};">
                ${isYard ? 'Yard: ' : 'Customer: '} ${asset.location.address}
              </p>
              <p style="margin: 4px 0; font-size: 12px; color: #6B7280;">
                Updated: ${asset.location.timestamp.toLocaleDateString()}
              </p>
              <div style="margin-top: 8px;">
                <a style="color: #3B82F6; cursor: pointer; font-size: 13px;" 
                   onclick="document.dispatchEvent(new CustomEvent('select-asset', {detail: ${asset.id}}))">
                  Select Asset
                </a>
              </div>
            </div>
          `;
          
          infoWindowRef.current.setContent(infoContent);
          infoWindowRef.current.open(map, marker);
        });
        
        markersRef.current.push(marker);
      }
    });
    
    // Fit map to show all markers if there are any
    if (markersRef.current.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      markersRef.current.forEach(marker => {
        bounds.extend(marker.getPosition());
      });
      map.fitBounds(bounds);
      
      // Don't zoom in too far on small datasets
      if (map.getZoom() > 15) {
        map.setZoom(15);
      }
    }
    
    // Add custom event listener for info window actions
    document.addEventListener('select-asset', (e) => {
      const asset = assets.find(a => a.id === e.detail);
      if (asset) {
        onSelectAsset(asset);
      }
    });
    
    setMapLoaded(true);
    
    return () => {
      document.removeEventListener('select-asset', () => {});
    };
  };
  
  // Get asset stats by location type and status
  const getAssetStats = () => {
    return {
      deployed: assets.filter(a => a.location.type === 'customer').length,
      available: assets.filter(a => a.status === 'available' && a.location.type === 'yard').length,
      maintenance: assets.filter(a => a.status === 'maintenance').length,
      inTransit: assets.filter(a => a.status === 'in-transit').length
    };
  };
  
  const stats = getAssetStats();
  
  return (
    <div className="space-y-4">
      {/* Map Legend */}
      <div className="flex flex-wrap items-center justify-between bg-white p-3 rounded-lg shadow-sm">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-sm">Available ({stats.available})</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-sm">Deployed ({stats.deployed})</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-sm">Maintenance ({stats.maintenance})</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span className="text-sm">In Transit ({stats.inTransit})</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button 
            onClick={initializeMap}
            className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded"
          >
            <SafeIcon icon={FiRefreshCw} className="w-4 h-4" />
            <span>Refresh Map</span>
          </button>
        </div>
      </div>
      
      {/* Map Container */}
      <div className="relative">
        <div 
          ref={mapRef} 
          className="w-full h-[600px] rounded-lg border border-gray-200"
        ></div>
        
        {/* Loading State */}
        {!mapLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70">
            <div className="flex flex-col items-center">
              <SafeIcon icon={FiRefreshCw} className="w-8 h-8 text-primary-600 animate-spin mb-2" />
              <p className="text-gray-700">Loading map...</p>
            </div>
          </div>
        )}
        
        {/* Selected Asset Panel */}
        {selectedAsset && (
          <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-900">{selectedAsset.assetNumber}</h3>
              <button 
                onClick={() => setSelectedAsset(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <SafeIcon icon={FiX} className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <SafeIcon icon={FiTruck} className="w-4 h-4 text-gray-500" />
                <span>{selectedAsset.containerSize} {selectedAsset.containerUnit} {selectedAsset.type}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <SafeIcon 
                  icon={selectedAsset.location.type === 'yard' ? FiHome : FiMapPin} 
                  className={`w-4 h-4 ${selectedAsset.location.type === 'yard' ? 'text-blue-600' : 'text-green-600'}`} 
                />
                <span>{selectedAsset.location.address}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <SafeIcon icon={FiSettings} className="w-4 h-4 text-gray-500" />
                <span>Status: {selectedAsset.status}</span>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-3 pt-2 border-t border-gray-100">
              <button
                onClick={() => onUpdateLocation(selectedAsset)}
                className="text-xs text-blue-600 hover:text-blue-700 flex items-center space-x-1"
              >
                <SafeIcon icon={FiMapPin} className="w-3 h-3" />
                <span>Update Location</span>
              </button>
              
              <button
                onClick={() => onSelectAsset(selectedAsset)}
                className="text-xs text-primary-600 hover:text-primary-700 flex items-center space-x-1"
              >
                <SafeIcon icon={FiEdit} className="w-3 h-3" />
                <span>Edit Asset</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssetMapView;
```