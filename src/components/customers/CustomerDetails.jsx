import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import PhotoLibraryView from '../photos/PhotoLibraryView';
import toast from 'react-hot-toast';

const { FiUser, FiMail, FiPhone, FiMapPin, FiCamera, FiEdit, FiFileText, FiBuilding } = FiIcons;

const CustomerDetails = ({ customer, onClose, onEdit }) => {
  const { photos } = useData();
  const [showPhotoLibrary, setShowPhotoLibrary] = useState(false);

  const customerPhotos = photos.filter(p => p.customerId === customer.id);
  
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
        <h3 className="text-xl font-semibold text-gray-900">{customer.name}</h3>
        <div className="flex items-center space-x-2">
          {onEdit && (
            <button 
              onClick={() => onEdit(customer)} 
              className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
            >
              <SafeIcon icon={FiEdit} className="w-5 h-5" />
            </button>
          )}
          {onClose && (
            <button 
              onClick={onClose} 
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <SafeIcon icon={FiIcons.FiX} className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <SafeIcon icon={FiUser} className="w-5 h-5 text-gray-400" />
          <span className="text-gray-900">{customer.name}</span>
        </div>
        
        {customer.company && (
          <div className="flex items-center space-x-3">
            <SafeIcon icon={FiBuilding} className="w-5 h-5 text-gray-400" />
            <span className="text-gray-900">{customer.company}</span>
          </div>
        )}
        
        <div className="flex items-center space-x-3">
          <SafeIcon icon={FiMail} className="w-5 h-5 text-gray-400" />
          <span className="text-gray-900">{customer.email}</span>
        </div>
        
        <div className="flex items-center space-x-3">
          <SafeIcon icon={FiPhone} className="w-5 h-5 text-gray-400" />
          <span className="text-gray-900">{customer.phone}</span>
        </div>
        
        <div className="flex items-start space-x-3">
          <SafeIcon icon={FiMapPin} className="w-5 h-5 text-gray-400 mt-0.5" />
          <span className="text-gray-900">{customer.address}</span>
        </div>
        
        {customer.notes && (
          <div className="flex items-start space-x-3">
            <SafeIcon icon={FiFileText} className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900">Notes</p>
              <p className="text-sm text-gray-600">{customer.notes}</p>
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
      
      {/* Photo Library Modal */}
      {showPhotoLibrary && (
        <PhotoLibraryView
          photos={customerPhotos}
          title={`Photos for ${customer.name}`}
          onClose={() => setShowPhotoLibrary(false)}
          onDeletePhoto={handleDeletePhoto}
          onUpdateNotes={handleUpdatePhotoNotes}
          canDownload={true}
        />
      )}
    </div>
  );
};

export default CustomerDetails;