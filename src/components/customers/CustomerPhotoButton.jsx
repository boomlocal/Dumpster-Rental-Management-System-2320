import React, { useState } from 'react';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import UniversalPhotoUpload from '../photos/UniversalPhotoUpload';

const { FiCamera } = FiIcons;

const CustomerPhotoButton = ({ customer }) => {
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);

  const handlePhotoTaken = (photoData) => {
    // Photo is automatically saved to the system
    console.log('Photo added for customer:', customer.id, photoData);
  };

  return (
    <>
      <button
        onClick={() => setShowPhotoUpload(true)}
        className="flex items-center space-x-1 px-3 py-1 text-sm text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors"
        title="Upload Photos"
      >
        <SafeIcon icon={FiCamera} className="w-4 h-4" />
        <span>Photos</span>
      </button>

      {showPhotoUpload && (
        <UniversalPhotoUpload
          customerId={customer.id}
          type="customer"
          title={`Upload Photos - ${customer.name}`}
          onPhotoTaken={handlePhotoTaken}
          onClose={() => setShowPhotoUpload(false)}
          maxPhotos={10}
        />
      )}
    </>
  );
};

export default CustomerPhotoButton;