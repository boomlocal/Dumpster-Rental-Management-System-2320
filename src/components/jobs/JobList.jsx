import React from 'react';
import {motion} from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import DeleteButton from '../common/DeleteButton';

const {FiEdit, FiTruck, FiCalendar, FiMapPin, FiUser, FiClock} = FiIcons;

const JobList = ({jobs, onEditJob, onDeleteJob}) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (jobs.length === 0) {
    return (
      <div className="text-center py-12">
        <SafeIcon icon={FiTruck} className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">No jobs found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {jobs.map((job, index) => (
        <motion.div
          key={job.id}
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
                <h3 className="text-lg font-semibold text-gray-900">Job #{job.id}</h3>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(job.status)}`}>
                  {job.status.replace('-', ' ')}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onEditJob(job)}
                className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                title="Edit Job"
              >
                <SafeIcon icon={FiEdit} className="w-4 h-4" />
              </button>
              <DeleteButton
                onDelete={() => onDeleteJob(job.id)}
                itemName="job"
                itemIdentifier={`#${job.id}`}
                buttonSize="small"
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <SafeIcon icon={FiTruck} className="w-4 h-4" />
              <span className="font-medium">{job.dumpsterSize}</span>
              <span className="text-gray-400">•</span>
              <span className="capitalize">{job.type?.replace('-', ' ')}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <SafeIcon icon={FiCalendar} className="w-4 h-4" />
              <span>{new Date(job.scheduledDate).toLocaleDateString()}</span>
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
          </div>

          {job.notes && (
            <div className="mt-4 pt-3 border-t border-gray-100">
              <p className="text-sm text-gray-600 line-clamp-2">{job.notes}</p>
            </div>
          )}

          <div className="mt-4 pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Created</span>
              <span className="text-gray-700">{job.createdAt?.toLocaleDateString()}</span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default JobList;