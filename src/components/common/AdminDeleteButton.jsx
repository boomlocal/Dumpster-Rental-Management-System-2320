import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import toast from 'react-hot-toast';

const AdminDeleteButton = ({ onDelete, itemName = 'item', confirmRequired = true, small = false }) => {
  const { effectiveRole } = useAuth();
  const [showConfirm, setShowConfirm] = useState(false);
  
  // Only admin can see delete buttons
  if (effectiveRole !== 'admin') {
    return null;
  }
  
  const handleClick = () => {
    if (!confirmRequired) {
      onDelete();
      return;
    }
    setShowConfirm(true);
  };
  
  const handleConfirm = () => {
    onDelete();
    setShowConfirm(false);
    toast.success(`${itemName} deleted successfully`);
  };
  
  if (showConfirm) {
    return (
      <div className="flex items-center space-x-2">
        <button
          onClick={handleConfirm}
          className="text-red-600 hover:text-red-700 text-sm font-medium"
        >
          Confirm
        </button>
        <button
          onClick={() => setShowConfirm(false)}
          className="text-gray-600 hover:text-gray-700 text-sm"
        >
          Cancel
        </button>
      </div>
    );
  }
  
  return (
    <button
      onClick={handleClick}
      className={`${
        small
          ? 'p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors'
          : 'flex items-center space-x-1 px-3 py-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors'
      }`}
      title={`Delete ${itemName}`}
    >
      <SafeIcon icon={FiIcons.FiTrash2} className={small ? "w-4 h-4" : "w-5 h-5"} />
      {!small && <span>Delete</span>}
    </button>
  );
};

export default AdminDeleteButton;