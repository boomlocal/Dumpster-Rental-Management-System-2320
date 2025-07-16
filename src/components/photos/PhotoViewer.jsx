```jsx
import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useAuth } from '../../contexts/AuthContext';

const { FiTrash2, FiDownload, FiX } = FiIcons;

const PhotoViewer = ({ photo, onClose, onDelete, onDownload }) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <motion.div 
      className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="relative max-w-6xl w-full mx-4">
        <img 
          src={photo.url} 
          alt={`Photo ${photo.id}`} 
          className="w-full h-auto max-h-[80vh] object-contain"
        />
        
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-white hover:text-gray-300"
        >
          <SafeIcon icon={FiX} className="w-8 h-8" />
        </button>
        
        <div className="absolute top-4 left-4 flex space-x-3">
          {isAdmin && (
            <>
              <button
                onClick={() => onDownload(photo)}
                className="p-2 text-white hover:text-blue-300 transition-colors"
                title="Download Photo"
              >
                <SafeIcon icon={FiDownload} className="w-6 h-6" />
              </button>
              
              <button
                onClick={() => {
                  onDelete(photo.id);
                  onClose();
                }}
                className="p-2 text-white hover:text-red-300 transition-colors"
                title="Delete Photo"
              >
                <SafeIcon icon={FiTrash2} className="w-6 h-6" />
              </button>
            </>
          )}
        </div>
        
        {/* Photo information */}
        <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-50 text-white p-4 rounded">
          <h3 className="font-medium mb-1">
            {photo.type} photo - {new Date(photo.timestamp).toLocaleString()}
          </h3>
          {photo.notes && <p className="text-sm">{photo.notes}</p>}
        </div>
      </div>
    </motion.div>
  );
};

export default PhotoViewer;
```