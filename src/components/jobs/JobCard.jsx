```jsx
import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import DeleteButton from '../common/DeleteButton';

const { FiTruck, FiCalendar, FiMapPin, FiUser, FiEdit } = FiIcons;

const JobCard = ({ job, customer, onEdit, onDelete }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(job.status)}`}>
              {job.status}
            </span>
            <span className="text-sm text-gray-500">#{job.id}</span>
          </div>

          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiUser} className="w-4 h-4" />
              <span>{customer?.name || 'Unknown Customer'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiTruck} className="w-4 h-4" />
              <span>{job.dumpsterSize}</span>
            </div>
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiCalendar} className="w-4 h-4" />
              <span>{new Date(job.scheduledDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiMapPin} className="w-4 h-4" />
              <span>{job.address}</span>
            </div>
          </div>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(job)}
            className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
          >
            <SafeIcon icon={FiEdit} className="w-4 h-4" />
          </button>
          <DeleteButton
            onDelete={() => onDelete(job.id)}
            itemName="job"
            itemIdentifier={`#${job.id}`}
            buttonSize="small"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default JobCard;
```