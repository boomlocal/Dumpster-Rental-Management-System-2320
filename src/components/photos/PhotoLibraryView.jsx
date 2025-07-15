```jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import toast from 'react-hot-toast';

const { FiX, FiDownload, FiTrash2, FiEdit2, FiMaximize2, FiCalendar, FiMapPin } = FiIcons;

const PhotoLibraryView = ({ photos, onClose, title, onDeletePhoto, onUpdateNotes, canDownload = false }) => {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [editingNotes, setEditingNotes] = useState(null);
  const [noteText, setNoteText] = useState('');

  const handlePhotoClick = (photo) => {
    setSelectedPhoto(photo);
  };

  const handleDownload = async (photo) => {
    try {
      const response = await fetch(photo.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = photo.filename || `photo_${photo.id}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Photo downloaded successfully');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download photo');
    }
  };

  const handleDelete = (photo) => {
    if (window.confirm('Are you sure you want to delete this photo?')) {
      onDeletePhoto(photo.id);
      toast.success('Photo deleted successfully');
    }
  };

  const startEditingNotes = (photo) => {
    setEditingNotes(photo.id);
    setNoteText(photo.notes || '');
  };

  const saveNotes = async (photoId) => {
    await onUpdateNotes(photoId, noteText);
    setEditingNotes(null);
    toast.success('Notes updated successfully');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-2">
            <SafeIcon icon={FiX} className="w-6 h-6" />
          </button>
        </div>

        {/* Photo Grid */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {photos.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No photos available</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  className="relative group border border-gray-200 rounded-lg overflow-hidden bg-gray-50"
                >
                  {/* Photo */}
                  <div
                    className="aspect-square cursor-pointer overflow-hidden"
                    onClick={() => handlePhotoClick(photo)}
                  >
                    <img
                      src={photo.url}
                      alt={`Photo ${photo.id}`}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>

                  {/* Info Overlay */}
                  <div className="p-3 bg-white border-t border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm text-gray-500">
                        <SafeIcon icon={FiCalendar} className="w-4 h-4 inline mr-1" />
                        {new Date(photo.timestamp).toLocaleDateString()}
                      </div>
                      {photo.location && (
                        <div className="text-sm text-gray-500">
                          <SafeIcon icon={FiMapPin} className="w-4 h-4 inline mr-1" />
                          GPS
                        </div>
                      )}
                    </div>

                    {/* Notes */}
                    {editingNotes === photo.id ? (
                      <div className="mt-2">
                        <textarea
                          value={noteText}
                          onChange={(e) => setNoteText(e.target.value)}
                          className="w-full text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          rows={2}
                          placeholder="Add notes..."
                        />
                        <div className="flex justify-end space-x-2 mt-2">
                          <button
                            onClick={() => saveNotes(photo.id)}
                            className="text-xs bg-primary-600 text-white px-2 py-1 rounded hover:bg-primary-700"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingNotes(null)}
                            className="text-xs text-gray-600 hover:text-gray-800"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        className="text-sm text-gray-600 cursor-pointer hover:text-gray-900"
                        onClick={() => startEditingNotes(photo)}
                      >
                        {photo.notes ? (
                          <p className="line-clamp-2">{photo.notes}</p>
                        ) : (
                          <p className="italic text-gray-400">Add notes...</p>
                        )}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex space-x-1 bg-black bg-opacity-50 rounded-lg p-1">
                        <button
                          onClick={() => handlePhotoClick(photo)}
                          className="p-1 text-white hover:text-primary-200"
                          title="View"
                        >
                          <SafeIcon icon={FiMaximize2} className="w-4 h-4" />
                        </button>
                        {canDownload && (
                          <button
                            onClick={() => handleDownload(photo)}
                            className="p-1 text-white hover:text-primary-200"
                            title="Download"
                          >
                            <SafeIcon icon={FiDownload} className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => startEditingNotes(photo)}
                          className="p-1 text-white hover:text-primary-200"
                          title="Edit Notes"
                        >
                          <SafeIcon icon={FiEdit2} className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(photo)}
                          className="p-1 text-white hover:text-red-200"
                          title="Delete"
                        >
                          <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Photo Viewer Modal */}
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="max-w-7xl w-full mx-4 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedPhoto.url}
                alt={`Photo ${selectedPhoto.id}`}
                className="w-full h-auto max-h-[90vh] object-contain rounded-lg"
              />
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 text-white hover:text-gray-300"
              >
                <SafeIcon icon={FiX} className="w-8 h-8" />
              </button>
              <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-50 text-white p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm">
                      Taken on {new Date(selectedPhoto.timestamp).toLocaleString()}
                    </p>
                    {selectedPhoto.location && (
                      <p className="text-sm mt-1">
                        GPS: {selectedPhoto.location.lat}, {selectedPhoto.location.lng}
                      </p>
                    )}
                  </div>
                  {canDownload && (
                    <button
                      onClick={() => handleDownload(selectedPhoto)}
                      className="bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-200 flex items-center space-x-2"
                    >
                      <SafeIcon icon={FiDownload} className="w-4 h-4" />
                      <span>Download</span>
                    </button>
                  )}
                </div>
                {selectedPhoto.notes && (
                  <p className="mt-2 text-sm">{selectedPhoto.notes}</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default PhotoLibraryView;
```