import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiX, FiDownload, FiMapPin, FiClock, FiUser, FiCamera, FiEdit3, FiSave } = FiIcons;

const PhotoViewer = ({ photo, onClose, onDownload, customer }) => {
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [noteText, setNoteText] = useState(photo.notes || '');

  const handleSaveNotes = () => {
    // In a real app, this would save to the database
    setIsEditingNotes(false);
    // Update the photo object with new notes
    photo.notes = noteText;
  };

  const openInMaps = () => {
    if (photo.location) {
      const { lat, lng } = photo.location;
      const url = `https://www.google.com/maps?q=${lat},${lng}`;
      window.open(url, '_blank');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Photo Details</h2>
          <div className="flex items-center space-x-2">
            {onDownload && (
              <button
                onClick={() => onDownload(photo)}
                className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 flex items-center space-x-2"
              >
                <SafeIcon icon={FiDownload} className="w-4 h-4" />
                <span>Download</span>
              </button>
            )}
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-2">
              <SafeIcon icon={FiX} className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Photo */}
            <div className="lg:col-span-2">
              <div className="relative">
                <img
                  src={photo.url}
                  alt={`${photo.type} photo`}
                  className="w-full h-auto rounded-lg shadow-sm"
                />
                
                {/* Photo Type Badge */}
                <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-medium ${
                  photo.type === 'delivery' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  <SafeIcon icon={FiCamera} className="w-4 h-4 inline mr-1" />
                  {photo.type} Photo
                </div>

                {/* GPS Indicator */}
                {photo.location && (
                  <button
                    onClick={openInMaps}
                    className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm hover:bg-green-700 flex items-center space-x-1"
                  >
                    <SafeIcon icon={FiMapPin} className="w-4 h-4" />
                    <span>View on Map</span>
                  </button>
                )}
              </div>
            </div>

            {/* Details */}
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <h3 className="font-semibold text-gray-900 mb-3">Photo Information</h3>
                
                <div className="flex items-center space-x-3">
                  <SafeIcon icon={FiUser} className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">{customer?.name || 'Unknown Customer'}</p>
                    <p className="text-sm text-gray-600">{customer?.company}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <SafeIcon icon={FiClock} className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">
                      {photo.timestamp.toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      {photo.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>

                {photo.location && (
                  <div className="flex items-start space-x-3">
                    <SafeIcon icon={FiMapPin} className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">GPS Coordinates</p>
                      <p className="text-sm text-gray-600">
                        Lat: {photo.location.lat.toFixed(6)}
                      </p>
                      <p className="text-sm text-gray-600">
                        Lng: {photo.location.lng.toFixed(6)}
                      </p>
                      {photo.location.accuracy && (
                        <p className="text-xs text-gray-500">
                          Accuracy: ±{photo.location.accuracy.toFixed(0)}m
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Address */}
              {customer?.address && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Customer Address</h4>
                  <p className="text-sm text-gray-600">{customer.address}</p>
                </div>
              )}

              {/* Notes Section */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">Notes</h4>
                  <button
                    onClick={() => setIsEditingNotes(!isEditingNotes)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <SafeIcon icon={isEditingNotes ? FiX : FiEdit3} className="w-4 h-4" />
                  </button>
                </div>

                {isEditingNotes ? (
                  <div className="space-y-3">
                    <textarea
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      rows={4}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Add notes about this photo..."
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSaveNotes}
                        className="bg-primary-600 text-white px-3 py-1 rounded text-sm hover:bg-primary-700 flex items-center space-x-1"
                      >
                        <SafeIcon icon={FiSave} className="w-3 h-3" />
                        <span>Save</span>
                      </button>
                      <button
                        onClick={() => {
                          setIsEditingNotes(false);
                          setNoteText(photo.notes || '');
                        }}
                        className="text-gray-600 hover:text-gray-800 px-3 py-1 text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    {photo.notes ? (
                      <p className="text-sm text-gray-600 whitespace-pre-wrap">{photo.notes}</p>
                    ) : (
                      <p className="text-sm text-gray-400 italic">No notes added</p>
                    )}
                  </div>
                )}
              </div>

              {/* File Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">File Information</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>Filename: {photo.filename || `photo_${photo.id}.jpg`}</p>
                  <p>Type: JPEG Image</p>
                  <p>Job ID: #{photo.jobId}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PhotoViewer;