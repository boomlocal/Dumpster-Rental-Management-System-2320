```jsx
import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiX, FiHome, FiMapPin, FiCalendar, FiUser, FiClipboard, FiExternalLink } = FiIcons;

const LocationHistoryModal = ({ asset, onClose, getJobInfo }) => {
  // Sort history by date (newest first)
  const sortedHistory = [...asset.locationHistory].sort((a, b) => 
    new Date(b.timestamp) - new Date(a.timestamp)
  );
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">
            Location History: {asset.assetNumber}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2"
          >
            <SafeIcon icon={FiX} className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="space-y-6">
            {sortedHistory.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No location history available</p>
              </div>
            ) : (
              <div className="relative">
                {/* Timeline connector */}
                <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-gray-200"></div>
                
                {/* History items */}
                <div className="space-y-6">
                  {sortedHistory.map((location, index) => {
                    const job = location.jobId ? getJobInfo(location.jobId) : null;
                    const isCurrentLocation = index === 0;
                    
                    return (
                      <div key={index} className="relative flex items-start space-x-4 pl-2">
                        {/* Timeline dot */}
                        <div className={`flex-shrink-0 w-3 h-3 mt-2 rounded-full z-10 ${
                          isCurrentLocation ? 'bg-blue-600' : 'bg-gray-400'
                        }`}></div>
                        
                        {/* Content */}
                        <div className={`flex-1 p-4 rounded-lg ${
                          isCurrentLocation ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
                        }`}>
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center space-x-3">
                              <SafeIcon 
                                icon={location.type === 'yard' ? FiHome : FiMapPin} 
                                className={`w-5 h-5 ${location.type === 'yard' ? 'text-blue-600' : 'text-green-600'}`} 
                              />
                              <h3 className="font-medium text-gray-900">
                                {location.type === 'yard' ? 'Yard Location' : 'Customer Location'}
                              </h3>
                            </div>
                            
                            {isCurrentLocation && (
                              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                Current
                              </span>
                            )}
                          </div>
                          
                          <p className="text-gray-700 mb-2">{location.address}</p>
                          
                          {job && (
                            <div className="flex items-center space-x-2 mb-2 text-sm">
                              <SafeIcon icon={FiClipboard} className="w-4 h-4 text-gray-500" />
                              <span className="text-gray-600">Job #{job.id} - {job.type}</span>
                            </div>
                          )}
                          
                          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <SafeIcon icon={FiCalendar} className="w-4 h-4" />
                              <span>
                                {location.timestamp.toLocaleDateString()} at {location.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                              </span>
                            </div>
                            
                            <div className="flex items-center space-x-1 mt-1 sm:mt-0">
                              <SafeIcon icon={FiUser} className="w-4 h-4" />
                              <span>Updated by {location.updatedBy}</span>
                            </div>
                          </div>
                          
                          {location.coordinates && (
                            <div className="mt-2">
                              <a 
                                href={`https://maps.google.com/?q=${location.coordinates.lat},${location.coordinates.lng}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 hover:text-blue-700 flex items-center space-x-1"
                              >
                                <SafeIcon icon={FiExternalLink} className="w-4 h-4" />
                                <span>View on Map</span>
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LocationHistoryModal;
```