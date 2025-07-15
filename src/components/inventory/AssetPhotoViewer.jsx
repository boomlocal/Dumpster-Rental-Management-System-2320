```jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const {
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiDownload,
  FiTrash2,
  FiCamera,
  FiCalendar,
  FiUser
} = FiIcons;

const AssetPhotoViewer = ({
  photos,
  assetNumber,
  onClose,
  onDelete,
  canDelete = false,
  onAddPhotos
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < photos.length - 1 ? prev + 1 : 0));
  };

  const handleDownload = async (photo) => {
    try {
      const response = await fetch(photo.url);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${assetNumber}_photo_${photo.id}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download photo');
    }
  };

  if (!photos || photos.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      >
        <div className="bg-white rounded-xl p-8 max-w-md w-full text-center">
          <SafeIcon icon={FiCamera} className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Photos Available</h3>
          <p className="text-gray-500 mb-6">This asset doesn't have any photos yet.</p>
          {onAddPhotos && (
            <button
              onClick={onAddPhotos}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center space-x-2 mx-auto"
            >
              <SafeIcon icon={FiCamera} className="w-4 h-4" />
              <span>Add Photos</span>
            </button>
          )}
        </div>
      </motion.div>
    );
  }

  const currentPhoto = photos[currentIndex];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300 z-50"
      >
        <SafeIcon icon={FiX} className="w-8 h-8" />
      </button>

      {/* Navigation buttons */}
      <button
        onClick={handlePrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300"
      >
        <SafeIcon icon={FiChevronLeft} className="w-8 h-8" />
      </button>

      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300"
      >
        <SafeIcon icon={FiChevronRight} className="w-8 h-8" />
      </button>

      {/* Main content */}
      <div className="max-w-7xl w-full mx-4 relative">
        {/* Photo */}
        <img
          src={currentPhoto.url}
          alt={`Asset ${assetNumber} photo ${currentIndex + 1}`}
          className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
        />

        {/* Photo information */}
        <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-50 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-medium">
                {assetNumber} - Photo {currentIndex + 1} of {photos.length}
              </h3>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <SafeIcon icon={FiCalendar} className="w-4 h-4" />
                  <span>{new Date(currentPhoto.timestamp).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <SafeIcon icon={FiUser} className="w-4 h-4" />
                  <span>{currentPhoto.uploadedBy}</span>
                </div>
              </div>
              {currentPhoto.notes && (
                <p className="text-sm mt-2">{currentPhoto.notes}</p>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex space-x-2">
              <button
                onClick={() => handleDownload(currentPhoto)}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-lg"
                title="Download photo"
              >
                <SafeIcon icon={FiDownload} className="w-5 h-5" />
              </button>
              {canDelete && (
                <button
                  onClick={() => onDelete(currentPhoto.id)}
                  className="bg-red-500 bg-opacity-20 hover:bg-opacity-30 p-2 rounded-lg"
                  title="Delete photo"
                >
                  <SafeIcon icon={FiTrash2} className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AssetPhotoViewer;
```