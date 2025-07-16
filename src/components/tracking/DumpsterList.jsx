import React from 'react';
import {useData} from '../../contexts/DataContext';
import {motion} from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const {FiTruck, FiMapPin, FiUser, FiEdit, FiNavigation} = FiIcons;

const DumpsterList = ({dumpsters}) => {
  const {customers} = useData();

  const getCustomerName = (customerId) => {
    if (!customerId) return 'Not assigned';
    const customer = customers.find(c => c.id === customerId);
    return customer ? customer.name : 'Unknown Customer';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'in-use': return 'bg-blue-100 text-blue-800';
      case 'deployed': return 'bg-blue-100 text-blue-800';
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {dumpsters.map((dumpster, index) => (
        <motion.div
          key={dumpster.id}
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          transition={{delay: index * 0.1}}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <SafeIcon icon={FiTruck} className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {dumpster.binNumber || `Dumpster #${dumpster.id}`}
                </h3>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(dumpster.status)}`}>
                  {dumpster.status.replace('-', ' ')}
                </span>
              </div>
            </div>
            <button className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
              <SafeIcon icon={FiEdit} className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Size</span>
              <span className="text-gray-700 font-medium">{dumpster.size}</span>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <SafeIcon icon={FiUser} className="w-4 h-4" />
              <span className="truncate">{getCustomerName(dumpster.customerId)}</span>
            </div>

            {dumpster.location && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <SafeIcon icon={FiMapPin} className="w-4 h-4" />
                <span>
                  {dumpster.location.lat?.toFixed(4)}, {dumpster.location.lng?.toFixed(4)}
                </span>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Job #{dumpster.jobId || 'Not assigned'}
              </div>
              {dumpster.location && (
                <button className="text-sm text-primary-600 hover:text-primary-700 flex items-center space-x-1">
                  <SafeIcon icon={FiNavigation} className="w-4 h-4" />
                  <span>View on Map</span>
                </button>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default DumpsterList;