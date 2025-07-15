import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import UniversalPhotoUpload from '../photos/UniversalPhotoUpload';
import BinDropoffForm from './BinDropoffForm';
import toast from 'react-hot-toast';

const { FiMapPin, FiUser, FiTruck, FiClock, FiCheckCircle, FiCamera, FiFileText, FiPackage } = FiIcons;

const JobDetails = ({ job }) => {
  const { customers, updateJob } = useData();
  const { sendNotification } = useNotifications();
  const [notes, setNotes] = useState('');
  const [weight, setWeight] = useState('');
  const [showPhotoCapture, setShowPhotoCapture] = useState(false);
  const [photoType, setPhotoType] = useState(null);
  const [showDropoffForm, setShowDropoffForm] = useState(false);

  const customer = customers.find(c => c.id === job.customerId);

  const handleStatusUpdate = (newStatus) => {
    updateJob(job.id, { status: newStatus });
    
    // Send notification
    if (customer) {
      sendNotification(
        'sms',
        `Job update: Your ${job.dumpsterSize} dumpster is now ${newStatus}`,
        customer.phone
      );
    }
    
    toast.success(`Job marked as ${newStatus}`);
  };

  const handleStartDropoff = () => {
    if (job.type === 'drop-off' || job.type === 'exchange') {
      setShowDropoffForm(true);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    const updateData = {
      status: 'completed',
      completedAt: new Date(),
      weight: weight || null,
      completionNotes: notes || null
    };
    
    updateJob(job.id, updateData);
    
    if (customer) {
      sendNotification(
        'email',
        `Job completed: Your ${job.dumpsterSize} dumpster has been successfully ${job.type}`,
        customer.email
      );
    }
    
    toast.success('Job completed successfully');
  };

  const openPhotoCapture = (type) => {
    setPhotoType(type);
    setShowPhotoCapture(true);
  };

  const handlePhotoTaken = (photoData) => {
    toast.success(`${photoType} photo captured successfully`);
  };

  const handleDropoffComplete = () => {
    setShowDropoffForm(false);
  };

  if (showDropoffForm) {
    return (
      <BinDropoffForm 
        job={job} 
        onComplete={handleDropoffComplete} 
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Job Details</h3>
        <span className="text-sm text-gray-500">#{job.id}</span>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <SafeIcon icon={FiUser} className="w-5 h-5 text-gray-400" />
          <div>
            <p className="font-medium text-gray-900">{customer?.name}</p>
            <p className="text-sm text-gray-500">{customer?.phone}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <SafeIcon icon={FiMapPin} className="w-5 h-5 text-gray-400" />
          <div>
            <p className="font-medium text-gray-900">{job.address}</p>
            <button className="text-sm text-primary-600 hover:text-primary-700">
              Open in Maps
            </button>
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

      {/* Photo Capture Section */}
      <div className="border-t pt-4">
        <h4 className="font-medium text-gray-900 mb-3">Photo Documentation</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button
            onClick={() => openPhotoCapture('delivery')}
            className="flex items-center justify-center space-x-2 p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
          >
            <SafeIcon icon={FiCamera} className="w-5 h-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-600">Delivery Photos</span>
          </button>
          <button
            onClick={() => openPhotoCapture('pickup')}
            className="flex items-center justify-center space-x-2 p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
          >
            <SafeIcon icon={FiCamera} className="w-5 h-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-600">Pickup Photos</span>
          </button>
        </div>
      </div>

      {job.status !== 'completed' && (
        <div className="space-y-4 border-t pt-4">
          {/* Notes and Weight for non-dropoff jobs */}
          {job.type !== 'drop-off' && job.type !== 'exchange' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weight (optional)
                </label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter weight in lbs"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Add completion notes..."
                />
              </div>
            </>
          )}

          <div className="flex space-x-3">
            {job.status === 'scheduled' && (
              <button
                onClick={() => handleStatusUpdate('in-progress')}
                className="flex-1 bg-yellow-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-yellow-700 flex items-center justify-center space-x-2"
              >
                <SafeIcon icon={FiClock} className="w-4 h-4" />
                <span>Start Job</span>
              </button>
            )}

            {(job.type === 'drop-off' || job.type === 'exchange') ? (
              <button
                onClick={handleStartDropoff}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 flex items-center justify-center space-x-2"
              >
                <SafeIcon icon={FiPackage} className="w-4 h-4" />
                <span>Complete Dropoff</span>
              </button>
            ) : (
              <button
                onClick={handleComplete}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 flex items-center justify-center space-x-2"
              >
                <SafeIcon icon={FiCheckCircle} className="w-4 h-4" />
                <span>Complete</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Photo Capture Modal */}
      {showPhotoCapture && (
        <UniversalPhotoUpload
          jobId={job.id}
          customerId={job.customerId}
          type={photoType}
          title={`${photoType} Photos - Job #${job.id}`}
          onPhotoTaken={handlePhotoTaken}
          onClose={() => {
            setShowPhotoCapture(false);
            setPhotoType(null);
          }}
          maxPhotos={5}
        />
      )}
    </motion.div>
  );
};

export default JobDetails;