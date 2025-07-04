import React from 'react';
import { useData } from '../../contexts/DataContext';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiTruck, FiMapPin, FiUser, FiEdit } = FiIcons;

const DumpsterList = ({ dumpsters }) => {
  const { customers } = useData();

  const getCustomerName = (customerId) => {
    if (!customerId) return 'Not assigned';
    const customer = customers.find(c => c.id === customerId);
    return customer ? customer.name : 'Unknown Customer';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'in-use': return 'bg-blue-100 text-blue-800';
      case 'maintenance': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (dumpsters.length === 0) {
    return (
      <div className="text-center py-12">
        <SafeIcon icon={FiTruck} className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">No dumpsters found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {dumpsters.map((dumpster, index) => (
        <motion.div
          key={dumpster.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-4 mb-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  Dumpster #{dumpster.id}
                </h3>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(dumpster.status)}`}>
                  {dumpster.status.replace('-', ' ')}
                </span>
                <span className="text-sm text-gray-500 bg-gray-200 px-2 py-1 rounded">
                  {dumpster.size}
                </span>
              </div>
              
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <SafeIcon icon={FiMapPin} className="w-4 h-4" />
                  <span>
                    {dumpster.location ? 
                      `${dumpster.location.lat.toFixed(4)}, ${dumpster.location.lng.toFixed(4)}` :
                      'Location not set'
                    }
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <SafeIcon icon={FiUser} className="w-4 h-4" />
                  <span>{getCustomerName(dumpster.customerId)}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                <SafeIcon icon={FiEdit} className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default DumpsterList;