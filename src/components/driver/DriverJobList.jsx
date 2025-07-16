import React from 'react';
import {useData} from '../../contexts/DataContext';
import {motion} from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const {FiMapPin, FiClock, FiTruck, FiUser, FiCalendar} = FiIcons;

const DriverJobList = ({jobs, onSelectJob}) => {
  const {customers} = useData();

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
    <div className="space-y-4">
      {jobs.map((job, index) => (
        <motion.div
          key={job.id}
          initial={{opacity: 0, x: -20}}
          animate={{opacity: 1, x: 0}}
          transition={{delay: index * 0.1}}
          onClick={() => onSelectJob(job)}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <SafeIcon icon={FiTruck} className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">
                  {getCustomerName(job.customerId)}
                </h4>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(job.status)}`}>
                  {job.status.replace('-', ' ')}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">#{job.id}</div>
              <div className="text-xs text-gray-500">{job.dumpsterSize}</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <SafeIcon icon={FiCalendar} className="w-4 h-4" />
              <span>{job.scheduledDate.toLocaleDateString()}</span>
              {job.scheduledTime && (
                <>
                  <span className="text-gray-400">•</span>
                  <span className="capitalize">{job.scheduledTime}</span>
                </>
              )}
            </div>
            <div className="flex items-start space-x-2 text-sm text-gray-600">
              <SafeIcon icon={FiMapPin} className="w-4 h-4 mt-0.5" />
              <span className="flex-1">{job.address}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <SafeIcon icon={FiTruck} className="w-4 h-4" />
              <span className="capitalize">{job.type?.replace('-', ' ')}</span>
            </div>
          </div>

          {job.notes && (
            <div className="mt-3 pt-2 border-t border-gray-100">
              <p className="text-sm text-gray-600 line-clamp-2">{job.notes}</p>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default DriverJobList;