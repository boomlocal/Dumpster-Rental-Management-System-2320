```jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useData } from '../../contexts/DataContext';
import toast from 'react-hot-toast';

const { FiMapPin, FiNavigation, FiPackage, FiTruck, FiRefreshCw } = FiIcons;

const LiveTrackingMap = () => {
  const { customers } = useData();
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const [refreshing, setRefreshing] = useState(false);

  // Mock live tracking data
  const [liveDumpsters] = useState([
    {
      id: 'D001',
      binNumber: 'BH-001',
      size: '20 Yard',
      status: 'deployed',
      location: { lat: 40.7505, lng: -73.9934 },
      customerId: 1,
      deployedDate: new Date('2024-01-15'),
      jobId: 1001,
      lastUpdate: new Date()
    },
    {
      id: 'D002',
      binNumber: 'BH-002',
      size: '30 Yard',
      status: 'deployed',
      location: { lat: 40.7282, lng: -73.9942 },
      customerId: 2,
      deployedDate: new Date('2024-01-16'),
      jobId: 1002,
      lastUpdate: new Date()
    },
    {
      id: 'D003',
      binNumber: 'BH-003',
      size: '14 Yard',
      status: 'available',
      location: { lat: 40.7614, lng: -73.9776 }, // Yard location
      customerId: null,
      deployedDate: null,
      jobId: null,
      lastUpdate: new Date()
    },
    {
      id: 'D004',
      binNumber: 'BH-004',
      size: '40 Yard',
      status: 'in-transit',
      location: { lat: 40.7400, lng: -73.9900 },
      customerId: 3,
      deployedDate: null,
      jobId: 1003,
      lastUpdate: new Date()
    }
  ]);

  useEffect(() => {
    initializeMap();
    const refreshInterval = setInterval(refreshMap, 30000); // Refresh every 30 seconds
    return () => clearInterval(refreshInterval);
  }, []);

  const initializeMap = () => {
    if (!window.google || !mapRef.current) {
      console.error('Google Maps not loaded');
      return;
    }

    const map = new window.google.maps.Map(mapRef.current, {
      zoom: 12,
      center: { lat: 40.7128, lng: -74.0060 }, // New York City center
      mapTypeId: window.google.maps.MapTypeId.ROADMAP
    });

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // Add markers for each dumpster
    liveDumpsters.forEach(dumpster => {
      if (dumpster.location) {
        const customer = customers.find(c => c.id === dumpster.customerId);
        
        const marker = new window.google.maps.Marker({
          position: dumpster.location,
          map: map,
          title: `${dumpster.binNumber} - ${customer?.name || 'Unassigned'}`,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: getStatusColor(dumpster.status),
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: '#FFFFFF'
          }
        });

        const infoContent = `
          <div style="padding: 12px;">
            <h3 style="margin: 0 0 8px 0;font-weight: bold;">${dumpster.binNumber}</h3>
            <p style="margin: 4px 0;"><strong>Status:</strong> ${dumpster.status}</p>
            <p style="margin: 4px 0;"><strong>Size:</strong> ${dumpster.size}</p>
            ${customer ? `<p style="margin: 4px 0;"><strong>Customer:</strong> ${customer.name}</p>` : ''}
            <p style="margin: 4px 0;"><strong>Last Update:</strong> ${dumpster.lastUpdate.toLocaleTimeString()}</p>
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
  };

  const refreshMap = async () => {
    setRefreshing(true);
    try {
      // In a real app, fetch updated locations from your backend
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      initializeMap();
      toast.success('Map updated successfully');
    } catch (error) {
      console.error('Error refreshing map:', error);
      toast.error('Failed to update map');
    } finally {
      setRefreshing(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'deployed':
        return '#3B82F6'; // blue
      case 'available':
        return '#10B981'; // green
      case 'in-transit':
        return '#F59E0B'; // yellow
      case 'maintenance':
        return '#EF4444'; // red
      default:
        return '#6B7280'; // gray
    }
  };

  return (
    <div className="space-y-6">
      {/* Map Container */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Live Tracking Map</h3>
          <button
            onClick={refreshMap}
            disabled={refreshing}
            className="flex items-center space-x-2 px-4 py-2 text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors disabled:opacity-50"
          >
            <SafeIcon 
              icon={FiRefreshCw} 
              className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} 
            />
            <span>{refreshing ? 'Updating...' : 'Refresh'}</span>
          </button>
        </div>

        {/* Map */}
        <div ref={mapRef} className="w-full h-[600px] rounded-lg border border-gray-200" />

        {/* Legend */}
        <div className="flex items-center justify-end space-x-6 mt-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span>Deployed</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span>Available</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <span>In Transit</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span>Maintenance</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Bins</p>
              <p className="text-2xl font-bold text-gray-900">{liveDumpsters.length}</p>
            </div>
            <div className="p-3 bg-gray-100 rounded-lg">
              <SafeIcon icon={FiPackage} className="w-6 h-6 text-gray-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Deployed</p>
              <p className="text-2xl font-bold text-blue-600">
                {liveDumpsters.filter(d => d.status === 'deployed').length}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <SafeIcon icon={FiMapPin} className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">In Transit</p>
              <p className="text-2xl font-bold text-yellow-600">
                {liveDumpsters.filter(d => d.status === 'in-transit').length}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <SafeIcon icon={FiTruck} className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Available</p>
              <p className="text-2xl font-bold text-green-600">
                {liveDumpsters.filter(d => d.status === 'available').length}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <SafeIcon icon={FiNavigation} className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveTrackingMap;
```