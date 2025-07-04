import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiEdit, FiTrash2, FiMapPin, FiPhone, FiMail, FiUser, FiClock, FiNavigation, FiEye, FiMap } = FiIcons;

const LocationList = ({ locations, onEditLocation, onDeleteLocation }) => {
  const getTypeColor = (type) => {
    switch (type) {
      case 'office': return 'bg-blue-100 text-blue-800';
      case 'warehouse': return 'bg-green-100 text-green-800';
      case 'service_area': return 'bg-purple-100 text-purple-800';
      case 'depot': return 'bg-orange-100 text-orange-800';
      case 'facility': return 'bg-gray-100 text-gray-800';
      case 'yard': return 'bg-yellow-100 text-yellow-800';
      case 'branch': return 'bg-indigo-100 text-indigo-800';
      case 'maintenance': return 'bg-red-100 text-red-800';
      case 'transfer': return 'bg-teal-100 text-teal-800';
      case 'landfill': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'maintenance': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (type) => {
    const labels = {
      office: 'Office',
      warehouse: 'Warehouse',
      service_area: 'Service Area',
      depot: 'Depot',
      facility: 'Facility',
      yard: 'Yard',
      branch: 'Branch',
      maintenance: 'Maintenance',
      transfer: 'Transfer Station',
      landfill: 'Landfill'
    };
    return labels[type] || type;
  };

  const openInMaps = (location) => {
    if (location.coordinates?.lat && location.coordinates?.lng) {
      const url = `https://www.google.com/maps?q=${location.coordinates.lat},${location.coordinates.lng}`;
      window.open(url, '_blank');
    } else {
      const address = encodeURIComponent(`${location.address}, ${location.city}, ${location.state} ${location.zipCode}`);
      const url = `https://www.google.com/maps/search/?api=1&query=${address}`;
      window.open(url, '_blank');
    }
  };

  const openStreetView = (location) => {
    if (location.coordinates?.lat && location.coordinates?.lng) {
      const url = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${location.coordinates.lat},${location.coordinates.lng}`;
      window.open(url, '_blank');
    } else {
      const address = encodeURIComponent(`${location.address}, ${location.city}, ${location.state} ${location.zipCode}`);
      const url = `https://www.google.com/maps/@?api=1&map_action=pano&query=${address}`;
      window.open(url, '_blank');
    }
  };

  const openSatelliteView = (location) => {
    if (location.coordinates?.lat && location.coordinates?.lng) {
      const url = `https://www.google.com/maps/@${location.coordinates.lat},${location.coordinates.lng},18z/data=!3m1!1e3`;
      window.open(url, '_blank');
    } else {
      const address = encodeURIComponent(`${location.address}, ${location.city}, ${location.state} ${location.zipCode}`);
      const url = `https://www.google.com/maps/search/${address}/@?data=!3m1!1e3`;
      window.open(url, '_blank');
    }
  };

  if (locations.length === 0) {
    return (
      <div className="text-center py-12">
        <SafeIcon icon={FiMapPin} className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">No locations found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {locations.map((location, index) => (
        <motion.div
          key={location.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-4 mb-3">
                <h3 className="text-lg font-semibold text-gray-900">
                  {location.name}
                </h3>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${getTypeColor(location.type)}`}>
                  {getTypeLabel(location.type)}
                </span>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(location.status)}`}>
                  {location.status}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiMapPin} className="w-4 h-4" />
                  <span>{location.address}, {location.city}, {location.state} {location.zipCode}</span>
                </div>

                {location.phone && (
                  <div className="flex items-center space-x-2">
                    <SafeIcon icon={FiPhone} className="w-4 h-4" />
                    <span>{location.phone}</span>
                  </div>
                )}

                {location.email && (
                  <div className="flex items-center space-x-2">
                    <SafeIcon icon={FiMail} className="w-4 h-4" />
                    <span>{location.email}</span>
                  </div>
                )}

                {location.manager && (
                  <div className="flex items-center space-x-2">
                    <SafeIcon icon={FiUser} className="w-4 h-4" />
                    <span>Manager: {location.manager}</span>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiClock} className="w-4 h-4" />
                  <span>{location.operatingHours}</span>
                </div>

                {location.coordinates?.lat && location.coordinates?.lng && (
                  <div className="flex items-center space-x-2">
                    <SafeIcon icon={FiNavigation} className="w-4 h-4" />
                    <button
                      onClick={() => openInMaps(location)}
                      className="text-primary-600 hover:text-primary-700 underline"
                    >
                      {location.coordinates.lat.toFixed(4)}, {location.coordinates.lng.toFixed(4)}
                    </button>
                  </div>
                )}
              </div>

              {/* Map View Options - Available to All Users */}
              <div className="flex items-center space-x-3 mb-3">
                <span className="text-sm font-medium text-gray-700">Map Views:</span>
                <button
                  onClick={() => openInMaps(location)}
                  className="flex items-center space-x-1 px-3 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Open in Maps"
                >
                  <SafeIcon icon={FiNavigation} className="w-4 h-4" />
                  <span>Directions</span>
                </button>
                
                <button
                  onClick={() => openStreetView(location)}
                  className="flex items-center space-x-1 px-3 py-1 text-sm text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                  title="Street View"
                >
                  <SafeIcon icon={FiEye} className="w-4 h-4" />
                  <span>Street View</span>
                </button>
                
                <button
                  onClick={() => openSatelliteView(location)}
                  className="flex items-center space-x-1 px-3 py-1 text-sm text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors"
                  title="Satellite View"
                >
                  <SafeIcon icon={FiMap} className="w-4 h-4" />
                  <span>Satellite</span>
                </button>
              </div>

              {location.notes && (
                <div className="text-sm text-gray-600">
                  <strong>Notes:</strong> {location.notes}
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2 ml-4">
              <button
                onClick={() => onEditLocation(location)}
                className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                title="Edit Location"
              >
                <SafeIcon icon={FiEdit} className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => onDeleteLocation(location.id)}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete Location"
              >
                <SafeIcon icon={FiTrash2} className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default LocationList;