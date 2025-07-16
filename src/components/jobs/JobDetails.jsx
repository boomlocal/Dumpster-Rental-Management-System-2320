import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import PhotoLibraryView from '../photos/PhotoLibraryView';
import toast from 'react-hot-toast';

const { FiMapPin, FiUser, FiTruck, FiClock, FiCheckCircle, FiCamera, FiFileText } = FiIcons;

const JobDetails = ({ job, onClose, onUpdate }) => {
  const { customers, photos } = useData();
  const [showPhotoLibrary, setShowPhotoLibrary] = useState(false);
  const [notes, setNotes] = useState(job?.notes || '');
  
  const customer = customers.find(c => c.id === job.customerId);

  const handleUpdateStatus = (status) => {
    if (onUpdate) {
      onUpdate(job.id, { status });
      toast.success(`Job status updated to ${status}`);
    }
  };
  
  const handleDeletePhoto = (photoId) => {
    // Implementation would depend on your data context
    toast.success('Photo deleted successfully');
  };
  
  const handleUpdatePhotoNotes = (photoId, notes) => {
    // Implementation would depend on your data context
    toast.success('Photo notes updated');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Job Details</h3>
        {onClose && (
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <SafeIcon icon={FiIcons.FiX} className="w-5 h-5" />
          </button>
        )}
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <SafeIcon icon={FiUser} className="w-5 h-5 text-gray-400" />
          <div>
            <p className="font-medium text-gray-900">{customer?.name || 'Unknown Customer'}</p>
            <p className="text-sm text-gray-500">{customer?.phone || 'No phone'}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <SafeIcon icon={FiMapPin} className="w-5 h-5 text-gray-400" />
          <div>
            <p className="font-medium text-gray-900">{job.address}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <SafeIcon icon={FiTruck} className="w-5 h-5 text-gray-400" />
          <div>
            <p className="font-medium text-gray-900">{job.dumpsterSize}</p>
            <p className="text-sm text-gray-500 capitalize">{job.type.replace('-', ' ')}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <SafeIcon icon={FiClock} className="w-5 h-5 text-gray-400" />
          <div>
            <p className="font-medium text-gray-900">{job.scheduledDate.toLocaleDateString()}</p>
            <p className="text-sm text-gray-500">{job.scheduledTime || 'All day'}</p>
          </div>
        </div>
        
        {job.notes && (
          <div className="flex items-start space-x-3">
            <SafeIcon icon={FiFileText} className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900">Notes</p>
              <p className="text-sm text-gray-600">{job.notes}</p>
            </div>
          </div>
        )}
      </div>
      
      {/* View Photos Button */}
      <button 
        onClick={() => setShowPhotoLibrary(true)} 
        className="flex items-center space-x-2 px-4 py-2 text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg"
      >
        <SafeIcon icon={FiCamera} className="w-4 h-4" />
        <span>View Photos</span>
      </button>
      
      {/* Status Update Buttons */}
      {onUpdate && (
        <div className="flex justify-end space-x-3 pt-4 border-t">
          {job.status !== 'completed' && (
            <button
              onClick={() => handleUpdateStatus('completed')}
              className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 flex items-center space-x-2"
            >
              <SafeIcon icon={FiCheckCircle} className="w-4 h-4" />
              <span>Complete Job</span>
            </button>
          )}
        </div>
      )}
      
      {/* Photo Library Modal */}
      {showPhotoLibrary && (
        <PhotoLibraryView
          photos={photos.filter(p => p.jobId === job.id)}
          title={`Photos for Job #${job.id}`}
          onClose={() => setShowPhotoLibrary(false)}
          onDeletePhoto={handleDeletePhoto}
          onUpdateNotes={handleUpdatePhotoNotes}
          canDownload={true}
        />
      )}
    </div>
  );
};

export default JobDetails;