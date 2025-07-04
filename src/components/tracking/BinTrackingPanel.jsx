import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useData } from '../../contexts/DataContext';

const { FiPackage, FiSearch, FiMapPin, FiTruck, FiUser, FiCalendar, FiNavigation } = FiIcons;

const BinTrackingPanel = () => {
  const { customers } = useData();
  const [searchBin, setSearchBin] = useState('');
  const [selectedBin, setSelectedBin] = useState(null);

  // Mock bin tracking data - in production this would come from your backend
  const [trackedBins] = useState([
    {
      id: 'D001',
      binNumber: 'BH-001',
      size: '20 yard',
      status: 'deployed',
      location: { lat: 40.7505, lng: -73.9934 },
      customerId: 1,
      deployedDate: new Date('2024-01-15'),
      jobId: 1001,
      lastUpdate: new Date(),
      address: '123 Main St, New York, NY 12345'
    },
    {
      id: 'D002',
      binNumber: 'BH-002',
      size: '30 yard',
      status: 'deployed',
      location: { lat: 40.7282, lng: -73.9942 },
      customerId: 2,
      deployedDate: new Date('2024-01-16'),
      jobId: 1002,
      lastUpdate: new Date(),
      address: '456 Oak Ave, Los Angeles, CA 90210'
    },
    {
      id: 'D003',
      binNumber: 'BH-003',
      size: '20 yard',
      status: 'available',
      location: { lat: 40.7614, lng: -73.9776 }, // Yard location
      customerId: null,
      deployedDate: null,
      jobId: null,
      lastUpdate: new Date(),
      address: 'Main Yard - 789 Industrial Blvd'
    },
    {
      id: 'D004',
      binNumber: 'BH-004',
      size: '40 yard',
      status: 'in-transit',
      location: { lat: 40.7400, lng: -73.9900 },
      customerId: 3,
      deployedDate: null,
      jobId: 1003,
      lastUpdate: new Date(),
      address: 'En route to customer'
    },
    {
      id: 'D005',
      binNumber: 'BH-005',
      size: '10 yard',
      status: 'maintenance',
      location: { lat: 40.7614, lng: -73.9776 }, // Yard location
      customerId: null,
      deployedDate: null,
      jobId: null,
      lastUpdate: new Date(),
      address: 'Maintenance Bay - Main Yard'
    }
  ]);

  const filteredBins = trackedBins.filter(bin =>
    bin.binNumber.toLowerCase().includes(searchBin.toLowerCase()) ||
    bin.id.toLowerCase().includes(searchBin.toLowerCase())
  );

  const getCustomerName = (customerId) => {
    if (!customerId) return 'No customer assigned';
    const customer = customers.find(c => c.id === customerId);
    return customer ? customer.name : 'Unknown Customer';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'deployed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'available': return 'bg-green-100 text-green-800 border-green-200';
      case 'in-transit': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'maintenance': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'deployed': return FiMapPin;
      case 'available': return FiPackage;
      case 'in-transit': return FiTruck;
      case 'maintenance': return FiUser;
      default: return FiPackage;
    }
  };

  const openInMaps = (bin) => {
    if (bin.location?.lat && bin.location?.lng) {
      const url = `https://www.google.com/maps?q=${bin.location.lat},${bin.location.lng}`;
      window.open(url, '_blank');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center">
            <SafeIcon icon={FiPackage} className="w-6 h-6 mr-2 text-primary-600" />
            Bin Tracking
          </h3>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Live Tracking Active</span>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <SafeIcon icon={FiSearch} className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchBin}
            onChange={(e) => setSearchBin(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Search by bin number (e.g., BH-001) or ID..."
          />
        </div>

        {/* Bin List */}
        <div className="space-y-3">
          {filteredBins.map((bin, index) => (
            <motion.div
              key={bin.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                selectedBin?.id === bin.id
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedBin(selectedBin?.id === bin.id ? null : bin)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-lg">
                    <SafeIcon icon={getStatusIcon(bin.status)} className="w-6 h-6 text-gray-600" />
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-3">
                      <h4 className="text-lg font-semibold text-gray-900">
                        {bin.binNumber}
                      </h4>
                      <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(bin.status)}`}>
                        {bin.status.replace('-', ' ')}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                      <span>{bin.size}</span>
                      <span>•</span>
                      <span>{getCustomerName(bin.customerId)}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm text-gray-500">
                    Last update: {bin.lastUpdate.toLocaleTimeString()}
                  </div>
                  {bin.location && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openInMaps(bin);
                      }}
                      className="text-sm text-primary-600 hover:text-primary-700 flex items-center space-x-1 mt-1"
                    >
                      <SafeIcon icon={FiNavigation} className="w-4 h-4" />
                      <span>View on Map</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Expanded Details */}
              {selectedBin?.id === bin.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 pt-4 border-t border-gray-200"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h5 className="font-medium text-gray-700 mb-2">Location Details</h5>
                      <div className="space-y-1 text-gray-600">
                        <div className="flex items-center space-x-2">
                          <SafeIcon icon={FiMapPin} className="w-4 h-4" />
                          <span>{bin.address}</span>
                        </div>
                        {bin.location && (
                          <div className="text-xs text-gray-500">
                            GPS: {bin.location.lat.toFixed(4)}, {bin.location.lng.toFixed(4)}
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h5 className="font-medium text-gray-700 mb-2">Assignment Details</h5>
                      <div className="space-y-1 text-gray-600">
                        {bin.jobId && (
                          <div className="flex items-center space-x-2">
                            <SafeIcon icon={FiTruck} className="w-4 h-4" />
                            <span>Job #{bin.jobId}</span>
                          </div>
                        )}
                        {bin.deployedDate && (
                          <div className="flex items-center space-x-2">
                            <SafeIcon icon={FiCalendar} className="w-4 h-4" />
                            <span>Deployed: {bin.deployedDate.toLocaleDateString()}</span>
                          </div>
                        )}
                        {bin.customerId && (
                          <div className="flex items-center space-x-2">
                            <SafeIcon icon={FiUser} className="w-4 h-4" />
                            <span>{getCustomerName(bin.customerId)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {filteredBins.length === 0 && (
          <div className="text-center py-8">
            <SafeIcon icon={FiPackage} className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No bins found matching "{searchBin}"</p>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Total Bins', count: trackedBins.length, color: 'bg-gray-500' },
          { label: 'Deployed', count: trackedBins.filter(b => b.status === 'deployed').length, color: 'bg-blue-500' },
          { label: 'Available', count: trackedBins.filter(b => b.status === 'available').length, color: 'bg-green-500' },
          { label: 'In Transit', count: trackedBins.filter(b => b.status === 'in-transit').length, color: 'bg-yellow-500' },
          { label: 'Maintenance', count: trackedBins.filter(b => b.status === 'maintenance').length, color: 'bg-red-500' }
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${stat.color}`}></div>
              <span className="text-sm font-medium text-gray-700">{stat.label}</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stat.count}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BinTrackingPanel;