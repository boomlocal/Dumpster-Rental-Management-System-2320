import React, { useState } from 'react';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import UniversalPhotoUpload from '../photos/UniversalPhotoUpload';
import toast from 'react-hot-toast';

const { FiCamera } = FiIcons;

const JobPhotoButton = ({ job }) => {
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const [photoType, setPhotoType] = useState(null);

  const handleOpenPhotoUpload = (type) => {
    if (!job.address) {
      toast.error('Job must have a valid address to add photos');
      return;
    }
    setPhotoType(type);
    setShowPhotoUpload(true);
  };

  const handlePhotoTaken = (photoData) => {
    toast.success(`${photoType} photo captured successfully`);
  };

  return (
    <>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => handleOpenPhotoUpload('delivery')}
          className="flex items-center space-x-1 px-3 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
          title="Delivery Photos"
        >
          <SafeIcon icon={FiCamera} className="w-4 h-4" />
          <span>Delivery</span>
        </button>
        <button
          onClick={() => handleOpenPhotoUpload('pickup')}
          className="flex items-center space-x-1 px-3 py-1 text-sm text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
          title="Pickup Photos"
        >
          <SafeIcon icon={FiCamera} className="w-4 h-4" />
          <span>Pickup</span>
        </button>
      </div>

      {showPhotoUpload && (
        <UniversalPhotoUpload
          jobId={job.id}
          type={photoType}
          title={`${photoType} Photos - Job #${job.id}`}
          onPhotoTaken={handlePhotoTaken}
          onClose={() => {
            setShowPhotoUpload(false);
            setPhotoType(null);
          }}
          maxPhotos={5}
        />
      )}
    </>
  );
};

export default JobPhotoButton;