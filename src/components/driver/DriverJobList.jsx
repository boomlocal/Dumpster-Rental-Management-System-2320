import React from 'react';
import { useData } from '../../contexts/DataContext';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiMapPin, FiClock, FiTruck } = FiIcons;

const DriverJobList = ({ jobs, onSelectJob }) => {
  const { customers } = useData();

  const getCustomerName = (customerId) => {
    const customer = customers.find(c => c.id === customerId);
    return customer ? customer.name : 'Unknown Customer';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (jobs.length === 0) {
    return (
      <div className="text-center py-8">
        <SafeIcon icon={FiTruck} className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">No jobs scheduled for today</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {jobs.map((job, index) => (
        <motion.div
          key={job.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          onClick={() => onSelectJob(job)}
          className="p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-gray-900">
              {getCustomerName(job.customerId)}
            </h4>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(job.status)}`}>
              {job.status.replace('-', ' ')}
            </span>
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <SafeIcon icon={FiClock} className="w-4 h-4" />
              <span>{job.scheduledDate.toLocaleDateString()}</span>
            </div>
            <div className="flex items-center space-x-1">
              <SafeIcon icon={FiMapPin} className="w-4 h-4" />
              <span>{job.address}</span>
            </div>
            <div className="flex items-center space-x-1">
              <SafeIcon icon={FiTruck} className="w-4 h-4" />
              <span>{job.dumpsterSize}</span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default DriverJobList;