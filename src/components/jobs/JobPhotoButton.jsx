import React, { useState } from 'react';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import UniversalPhotoUpload from '../photos/UniversalPhotoUpload';

const { FiCamera } = FiIcons;

const JobPhotoButton = ({ job, customer }) => {
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);

  const handlePhotoTaken = (photoData) => {
    // Photo is automatically saved to the system
    console.log('Photo added for job:', job.id, photoData);
  };

  return (
    <>
      <button
        onClick={() => setShowPhotoUpload(true)}
        className="flex items-center space-x-1 px-3 py-1 text-sm text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors"
        title="Upload Photos"
      >
        <SafeIcon icon={FiCamera} className="w-4 h-4" />
        <span>Photos</span>
      </button>

      {showPhotoUpload && (
        <UniversalPhotoUpload
          jobId={job.id}
          customerId={job.customerId}
          type="job"
          title={`Upload Photos - Job #${job.id} (${customer?.name || 'Unknown Customer'})`}
          onPhotoTaken={handlePhotoTaken}
          onClose={() => setShowPhotoUpload(false)}
          maxPhotos={15}
        />
      )}
    </>
  );
};

export default JobPhotoButton;