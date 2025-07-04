import React from 'react';
import { useData } from '../../contexts/DataContext';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import JobPhotoButton from './JobPhotoButton';

const { FiEdit, FiCalendar, FiMapPin, FiTruck, FiEye, FiMap, FiNavigation } = FiIcons;

const JobList = ({ jobs, onEditJob }) => {
  const { customers } = useData();

  const getCustomerName = (customerId) => {
    const customer = customers.find(c => c.id === customerId);
    return customer ? customer.name : 'Unknown Customer';
  };

  const getCustomer = (customerId) => {
    return customers.find(c => c.id === customerId);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const openInMaps = (job) => {
    if (job.coordinates?.lat && job.coordinates?.lng) {
      const url = `https://www.google.com/maps?q=${job.coordinates.lat},${job.coordinates.lng}`;
      window.open(url, '_blank');
    } else if (job.address) {
      const address = encodeURIComponent(job.address);
      const url = `https://www.google.com/maps/search/?api=1&query=${address}`;
      window.open(url, '_blank');
    }
  };

  const openStreetView = (job) => {
    if (job.coordinates?.lat && job.coordinates?.lng) {
      const url = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${job.coordinates.lat},${job.coordinates.lng}`;
      window.open(url, '_blank');
    } else if (job.address) {
      const address = encodeURIComponent(job.address);
      const url = `https://www.google.com/maps/@?api=1&map_action=pano&query=${address}`;
      window.open(url, '_blank');
    }
  };

  const openSatelliteView = (job) => {
    if (job.coordinates?.lat && job.coordinates?.lng) {
      const url = `https://www.google.com/maps/@${job.coordinates.lat},${job.coordinates.lng},18z/data=!3m1!1e3`;
      window.open(url, '_blank');
    } else if (job.address) {
      const address = encodeURIComponent(job.address);
      const url = `https://www.google.com/maps/search/${address}/@?data=!3m1!1e3`;
      window.open(url, '_blank');
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
    <div className="space-y-4">
      {jobs.map((job, index) => (
        <motion.div
          key={job.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-4 mb-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  Job #{job.id} - {getCustomerName(job.customerId)}
                </h3>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(job.status)}`}>
                  {job.status.replace('-', ' ')}
                </span>
                <span className="text-sm text-gray-500 bg-gray-200 px-2 py-1 rounded">
                  {job.dumpsterSize}
                </span>
              </div>

              <div className="flex items-center space-x-6 text-sm text-gray-600 mb-3">
                <div className="flex items-center space-x-1">
                  <SafeIcon icon={FiCalendar} className="w-4 h-4" />
                  <span>{job.scheduledDate.toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <SafeIcon icon={FiMapPin} className="w-4 h-4" />
                  <span>{job.address}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <SafeIcon icon={FiTruck} className="w-4 h-4" />
                  <span className="capitalize">{job.type.replace('-', ' ')}</span>
                </div>
              </div>

              {/* Map View Options & Photo Upload - Available to All Users */}
              {job.address && (
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-sm font-medium text-gray-700">Actions:</span>
                  <button
                    onClick={() => openInMaps(job)}
                    className="flex items-center space-x-1 px-3 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Open in Maps"
                  >
                    <SafeIcon icon={FiNavigation} className="w-4 h-4" />
                    <span>Directions</span>
                  </button>
                  
                  <button
                    onClick={() => openStreetView(job)}
                    className="flex items-center space-x-1 px-3 py-1 text-sm text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                    title="Street View"
                  >
                    <SafeIcon icon={FiEye} className="w-4 h-4" />
                    <span>Street View</span>
                  </button>
                  
                  <button
                    onClick={() => openSatelliteView(job)}
                    className="flex items-center space-x-1 px-3 py-1 text-sm text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg transition-colors"
                    title="Satellite View"
                  >
                    <SafeIcon icon={FiMap} className="w-4 h-4" />
                    <span>Satellite</span>
                  </button>

                  {/* Photo Upload Button - Available to All Users */}
                  <JobPhotoButton job={job} customer={getCustomer(job.customerId)} />
                </div>
              )}

              {job.notes && (
                <div className="mt-2 text-sm text-gray-500">
                  <strong>Notes:</strong> {job.notes}
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => onEditJob(job)}
                className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                title="Edit Job"
              >
                <SafeIcon icon={FiEdit} className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default JobList;