import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import toast from 'react-hot-toast';

const { FiMapPin, FiNavigation, FiActivity, FiClock, FiTruck } = FiIcons;

const GPSTracker = () => {
  const [location, setLocation] = useState(null);
  const [tracking, setTracking] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [speed, setSpeed] = useState(0);
  const [heading, setHeading] = useState(0);

  const startTracking = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      toast.error('GPS tracking not supported');
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    };

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, speed: currentSpeed, heading: currentHeading } = position.coords;
        
        setLocation({
          lat: latitude,
          lng: longitude,
          accuracy: position.coords.accuracy,
          timestamp: new Date(position.timestamp)
        });
        
        setSpeed(currentSpeed ? Math.round(currentSpeed * 2.237) : 0); // Convert m/s to mph
        setHeading(currentHeading || 0);
        setLastUpdate(new Date());
        setError(null);
        
        // Send location to server
        sendLocationUpdate({
          lat: latitude,
          lng: longitude,
          speed: currentSpeed,
          heading: currentHeading,
          timestamp: position.timestamp
        });
      },
      (err) => {
        setError(`GPS Error: ${err.message}`);
        toast.error('Failed to get GPS location');
      },
      options
    );

    setTracking(true);
    toast.success('GPS tracking started');

    // Store watch ID for cleanup
    return () => {
      navigator.geolocation.clearWatch(watchId);
      setTracking(false);
    };
  };

  const stopTracking = () => {
    setTracking(false);
    toast.success('GPS tracking stopped');
  };

  const sendLocationUpdate = async (locationData) => {
    try {
      // In a real app, send to your backend API
      console.log('Sending location update:', locationData);
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Update local storage for demo
      localStorage.setItem('driver_location', JSON.stringify(locationData));
    } catch (error) {
      console.error('Failed to send location update:', error);
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation not supported');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({
          lat: latitude,
          lng: longitude,
          accuracy: position.coords.accuracy,
          timestamp: new Date(position.timestamp)
        });
        setLastUpdate(new Date());
        toast.success('Location updated');
      },
      (err) => {
        setError(`GPS Error: ${err.message}`);
        toast.error('Failed to get location');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  useEffect(() => {
    let cleanup;
    if (tracking) {
      cleanup = startTracking();
    }
    return cleanup;
  }, [tracking]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">GPS Tracking</h2>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${tracking ? 'bg-green-500' : 'bg-gray-300'}`}></div>
          <span className="text-sm text-gray-600">
            {tracking ? 'Tracking Active' : 'Tracking Inactive'}
          </span>
        </div>
      </div>

      {/* Control Panel */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Location Controls</h3>
          <div className="flex space-x-3">
            <button
              onClick={getCurrentLocation}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 flex items-center space-x-2"
            >
              <SafeIcon icon={FiNavigation} className="w-4 h-4" />
              <span>Get Location</span>
            </button>
            {!tracking ? (
              <button
                onClick={() => setTracking(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 flex items-center space-x-2"
              >
                <SafeIcon icon={FiActivity} className="w-4 h-4" />
                <span>Start Tracking</span>
              </button>
            ) : (
              <button
                onClick={stopTracking}
                className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 flex items-center space-x-2"
              >
                <SafeIcon icon={FiActivity} className="w-4 h-4" />
                <span>Stop Tracking</span>
              </button>
            )}
          </div>
        </div>

        {/* Location Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-50 rounded-lg p-4"
          >
            <div className="flex items-center space-x-2 mb-2">
              <SafeIcon icon={FiMapPin} className="w-5 h-5 text-primary-600" />
              <span className="font-medium text-gray-900">Location</span>
            </div>
            {location ? (
              <div className="text-sm text-gray-600">
                <p>Lat: {location.lat.toFixed(6)}</p>
                <p>Lng: {location.lng.toFixed(6)}</p>
                <p>Accuracy: {location.accuracy?.toFixed(0)}m</p>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No location data</p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-50 rounded-lg p-4"
          >
            <div className="flex items-center space-x-2 mb-2">
              <SafeIcon icon={FiTruck} className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-gray-900">Speed</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{speed} mph</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-50 rounded-lg p-4"
          >
            <div className="flex items-center space-x-2 mb-2">
              <SafeIcon icon={FiNavigation} className="w-5 h-5 text-green-600" />
              <span className="font-medium text-gray-900">Heading</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{heading.toFixed(0)}°</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-50 rounded-lg p-4"
          >
            <div className="flex items-center space-x-2 mb-2">
              <SafeIcon icon={FiClock} className="w-5 h-5 text-purple-600" />
              <span className="font-medium text-gray-900">Last Update</span>
            </div>
            {lastUpdate ? (
              <p className="text-sm text-gray-600">
                {lastUpdate.toLocaleTimeString()}
              </p>
            ) : (
              <p className="text-sm text-gray-500">Never</p>
            )}
          </motion.div>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}
      </div>

      {/* Permission Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-800 mb-2">GPS Tracking Info:</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Location permission is required for GPS tracking</li>
          <li>• Tracking updates your location every few seconds</li>
          <li>• Data is sent to the office for route optimization</li>
          <li>• You can start/stop tracking at any time</li>
        </ul>
      </div>
    </div>
  );
};

export default GPSTracker;