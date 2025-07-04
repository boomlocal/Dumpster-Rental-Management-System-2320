import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useData } from '../../contexts/DataContext';
import toast from 'react-hot-toast';

const { FiMapPin, FiTruck, FiRefreshCw, FiUsers, FiPackage, FiNavigation, FiEye } = FiIcons;

const LiveTrackingMap = () => {
  const { customers, drivers } = useData();
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [driverMarkers, setDriverMarkers] = useState([]);
  const [dumpsterMarkers, setDumpsterMarkers] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('all'); // 'all', 'drivers', 'dumpsters'
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Mock real-time data - in production this would come from your backend
  const [liveDrivers] = useState([
    {
      id: 1,
      name: 'Mike Johnson',
      status: 'active',
      currentLocation: { lat: 40.7128, lng: -74.0060 },
      accuracy: 5,
      speed: 25, // mph
      heading: 45,
      lastUpdate: new Date(),
      currentJob: 'Job #1001 - ABC Construction'
    },
    {
      id: 2,
      name: 'Sarah Davis',
      status: 'active',
      currentLocation: { lat: 40.7589, lng: -73.9851 },
      accuracy: 8,
      speed: 0, // stopped
      heading: 180,
      lastUpdate: new Date(),
      currentJob: 'Job #1002 - XYZ Roofing'
    }
  ]);

  const [liveDumpsters] = useState([
    {
      id: 'D001',
      binNumber: 'BH-001',
      size: '20 yard',
      status: 'deployed',
      location: { lat: 40.7505, lng: -73.9934 },
      customerId: 1,
      deployedDate: new Date('2024-01-15'),
      jobId: 1001
    },
    {
      id: 'D002',
      binNumber: 'BH-002',
      size: '30 yard',
      status: 'deployed',
      location: { lat: 40.7282, lng: -73.9942 },
      customerId: 2,
      deployedDate: new Date('2024-01-16'),
      jobId: 1002
    },
    {
      id: 'D003',
      binNumber: 'BH-003',
      size: '20 yard',
      status: 'available',
      location: { lat: 40.7614, lng: -73.9776 }, // Yard location
      customerId: null,
      deployedDate: null,
      jobId: null
    },
    {
      id: 'D004',
      binNumber: 'BH-004',
      size: '40 yard',
      status: 'maintenance',
      location: { lat: 40.7614, lng: -73.9776 }, // Yard location
      customerId: null,
      deployedDate: null,
      jobId: null
    }
  ]);

  const defaultCenter = { lat: 40.7128, lng: -74.0060 };

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
    [...driverMarkers, ...dumpsterMarkers].forEach(marker => marker.setMap(null));
    setDriverMarkers([]);
    setDumpsterMarkers([]);
  };

  const createDriverMarker = (driver) => {
    if (!map || !window.google) return null;

    const marker = new window.google.maps.Marker({
      position: driver.currentLocation,
      map: map,
      title: `${driver.name} - ${driver.currentJob}`,
      icon: {
        path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
        scale: 8,
        fillColor: driver.status === 'active' ? '#10b981' : '#6b7280',
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 2,
        rotation: driver.heading || 0
      },
      zIndex: 1000
    });

    const infoWindow = new window.google.maps.InfoWindow({
      content: createDriverInfoContent(driver)
    });

    marker.addListener('click', () => {
      infoWindow.open(map, marker);
    });

    // Hover effect
    marker.addListener('mouseover', () => {
      marker.setIcon({
        ...marker.getIcon(),
        scale: 10
      });
    });

    marker.addListener('mouseout', () => {
      marker.setIcon({
        ...marker.getIcon(),
        scale: 8
      });
    });

    return marker;
  };

  const createDumpsterMarker = (dumpster) => {
    if (!map || !window.google) return null;

    const customer = customers.find(c => c.id === dumpster.customerId);
    
    const marker = new window.google.maps.Marker({
      position: dumpster.location,
      map: map,
      title: `Bin ${dumpster.binNumber} - ${dumpster.size}`,
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 15,
        fillColor: getDumpsterStatusColor(dumpster.status),
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 2,
      },
      label: {
        text: dumpster.binNumber.split('-')[1], // Show just the number part
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: '12px'
      },
      zIndex: 500
    });

    const infoWindow = new window.google.maps.InfoWindow({
      content: createDumpsterInfoContent(dumpster, customer)
    });

    marker.addListener('click', () => {
      infoWindow.open(map, marker);
    });

    // Hover effect - show bin number
    marker.addListener('mouseover', () => {
      const hoverInfo = new window.google.maps.InfoWindow({
        content: `<div style="padding: 4px 8px; font-weight: bold;">${dumpster.binNumber}</div>`
      });
      hoverInfo.open(map, marker);
      
      // Store reference to close on mouseout
      marker.hoverInfo = hoverInfo;
    });

    marker.addListener('mouseout', () => {
      if (marker.hoverInfo) {
        marker.hoverInfo.close();
        marker.hoverInfo = null;
      }
    });

    return marker;
  };

  const createDriverInfoContent = (driver) => {
    return `
      <div style="padding: 12px; min-width: 250px;">
        <h3 style="margin: 0 0 8px 0; color: #1f2937; display: flex; align-items: center;">
          <span style="margin-right: 8px;">🚛</span>
          <strong>${driver.name}</strong>
        </h3>
        <div style="margin: 6px 0; color: #374151;">
          <strong>Status:</strong> 
          <span style="color: ${driver.status === 'active' ? '#10b981' : '#6b7280'}; text-transform: capitalize;">
            ${driver.status}
          </span>
        </div>
        <div style="margin: 6px 0; color: #374151;">
          <strong>Current Job:</strong> ${driver.currentJob}
        </div>
        <div style="margin: 6px 0; color: #374151;">
          <strong>Speed:</strong> ${driver.speed} mph
        </div>
        <div style="margin: 6px 0; color: #374151;">
          <strong>Location:</strong> ${driver.currentLocation.lat.toFixed(4)}, ${driver.currentLocation.lng.toFixed(4)}
        </div>
        <div style="margin: 6px 0; color: #374151;">
          <strong>GPS Accuracy:</strong> ±${driver.accuracy}m
        </div>
        <div style="margin: 8px 0 0 0; font-size: 12px; color: #6b7280;">
          Last updated: ${driver.lastUpdate.toLocaleTimeString()}
        </div>
      </div>
    `;
  };

  const createDumpsterInfoContent = (dumpster, customer) => {
    return `
      <div style="padding: 12px; min-width: 250px;">
        <h3 style="margin: 0 0 8px 0; color: #1f2937; display: flex; align-items: center;">
          <span style="margin-right: 8px;">🗑️</span>
          <strong>Bin ${dumpster.binNumber}</strong>
        </h3>
        <div style="margin: 6px 0; color: #374151;">
          <strong>Size:</strong> ${dumpster.size}
        </div>
        <div style="margin: 6px 0; color: #374151;">
          <strong>Status:</strong> 
          <span style="color: ${getDumpsterStatusColor(dumpster.status)}; text-transform: capitalize;">
            ${dumpster.status}
          </span>
        </div>
        ${customer ? `
          <div style="margin: 6px 0; color: #374151;">
            <strong>Customer:</strong> ${customer.name}
          </div>
        ` : ''}
        ${dumpster.jobId ? `
          <div style="margin: 6px 0; color: #374151;">
            <strong>Job ID:</strong> #${dumpster.jobId}
          </div>
        ` : ''}
        ${dumpster.deployedDate ? `
          <div style="margin: 6px 0; color: #374151;">
            <strong>Deployed:</strong> ${dumpster.deployedDate.toLocaleDateString()}
          </div>
        ` : ''}
        <div style="margin: 6px 0; color: #374151;">
          <strong>Location:</strong> ${dumpster.location.lat.toFixed(4)}, ${dumpster.location.lng.toFixed(4)}
        </div>
      </div>
    `;
  };

  const getDumpsterStatusColor = (status) => {
    switch (status) {
      case 'deployed': return '#3b82f6';
      case 'available': return '#10b981';
      case 'maintenance': return '#ef4444';
      case 'in-transit': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const updateMarkersOnMap = () => {
    if (!map || !window.google) return;

    clearMarkers();
    const newDriverMarkers = [];
    const newDumpsterMarkers = [];

    // Add driver markers
    if (selectedFilter === 'all' || selectedFilter === 'drivers') {
      liveDrivers.forEach(driver => {
        const marker = createDriverMarker(driver);
        if (marker) newDriverMarkers.push(marker);
      });
    }

    // Add dumpster markers
    if (selectedFilter === 'all' || selectedFilter === 'dumpsters') {
      liveDumpsters.forEach(dumpster => {
        const marker = createDumpsterMarker(dumpster);
        if (marker) newDumpsterMarkers.push(marker);
      });
    }

    setDriverMarkers(newDriverMarkers);
    setDumpsterMarkers(newDumpsterMarkers);

    // Fit map to show all markers
    if (newDriverMarkers.length > 0 || newDumpsterMarkers.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      [...newDriverMarkers, ...newDumpsterMarkers].forEach(marker => {
        bounds.extend(marker.getPosition());
      });
      map.fitBounds(bounds);
    }
  };

  const refreshData = () => {
    setLastUpdate(new Date());
    updateMarkersOnMap();
    toast.success('Live tracking data refreshed');
  };

  useEffect(() => {
    initializeMap();
  }, []);

  useEffect(() => {
    if (map && isLoaded) {
      updateMarkersOnMap();
    }
  }, [map, isLoaded, selectedFilter]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
      updateMarkersOnMap();
    }, 30000);

    return () => clearInterval(interval);
  }, [map, isLoaded, selectedFilter]);

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
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <h3 className="text-lg font-semibold text-gray-900">Live Tracking</h3>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Live</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Filter Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setSelectedFilter('all')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  selectedFilter === 'all'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setSelectedFilter('drivers')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  selectedFilter === 'drivers'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Drivers
              </button>
              <button
                onClick={() => setSelectedFilter('dumpsters')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  selectedFilter === 'dumpsters'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Dumpsters
              </button>
            </div>

            <button
              onClick={refreshData}
              className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <SafeIcon icon={FiRefreshCw} className="w-4 h-4" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiTruck} className="w-5 h-5 text-green-600" />
              <span className="font-medium text-green-800">Active Drivers</span>
            </div>
            <p className="text-2xl font-bold text-green-900 mt-2">
              {liveDrivers.filter(d => d.status === 'active').length}
            </p>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiPackage} className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-blue-800">Deployed Bins</span>
            </div>
            <p className="text-2xl font-bold text-blue-900 mt-2">
              {liveDumpsters.filter(d => d.status === 'deployed').length}
            </p>
          </div>

          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiMapPin} className="w-5 h-5 text-purple-600" />
              <span className="font-medium text-purple-800">Available Bins</span>
            </div>
            <p className="text-2xl font-bold text-purple-900 mt-2">
              {liveDumpsters.filter(d => d.status === 'available').length}
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiRefreshCw} className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-800">Last Update</span>
            </div>
            <p className="text-sm font-medium text-gray-900 mt-2">
              {lastUpdate.toLocaleTimeString()}
            </p>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="relative">
          <div
            ref={mapRef}
            className="h-[600px] w-full rounded-lg border border-gray-200 bg-gray-100"
          />
          
          {!isLoaded && !error && (
            <div className="absolute inset-0 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-gray-600">Loading live tracking map...</p>
              </div>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap items-center justify-between">
          <div className="flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <span>Active Drivers</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
              <span>Deployed Bins</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <span>Available Bins</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <span>Maintenance</span>
            </div>
          </div>
          
          <div className="text-sm text-gray-500">
            Hover over markers to see bin numbers • Click for details
          </div>
        </div>
      </div>

      {/* Info Panel */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-800 mb-2">Live Tracking Features:</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Real-time driver locations with speed and heading indicators</li>
          <li>• Dumpster positions with bin numbers (hover to see bin ID)</li>
          <li>• Color-coded status indicators for quick identification</li>
          <li>• Auto-refresh every 30 seconds for live updates</li>
          <li>• Click markers for detailed information</li>
        </ul>
      </div>
    </div>
  );
};

export default LiveTrackingMap;