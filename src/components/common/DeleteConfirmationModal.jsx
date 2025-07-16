import React, {useState} from 'react';
import {motion} from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import toast from 'react-hot-toast';

const {FiTrash2, FiX, FiAlertTriangle} = FiIcons;

const DeleteConfirmationModal = ({isOpen, onClose, onDelete, itemName='item', itemIdentifier=''}) => {
  const [confirmText, setConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (confirmText.toUpperCase() !== 'DELETE') {
      toast.error('Please type DELETE to confirm');
      return;
    }

    setIsDeleting(true);
    try {
      await onDelete();
      toast.success(`${itemName} deleted successfully`);
      onClose();
    } catch (error) {
      toast.error(`Failed to delete ${itemName}`);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      exit={{opacity: 0}}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{scale: 0.95, opacity: 0}}
        animate={{scale: 1, opacity: 1}}
        exit={{scale: 0.95, opacity: 0}}
        className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3 text-red-600">
            <SafeIcon icon={FiAlertTriangle} className="w-6 h-6" />
            <h3 className="text-xl font-bold">Delete Confirmation</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <SafeIcon icon={FiX} className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <p className="text-gray-700">
            Are you sure you want to delete this {itemName}
            {itemIdentifier && <span className="font-medium"> ({itemIdentifier})</span>}?
            This action cannot be undone.
          </p>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-700 font-medium mb-2">
              To confirm deletion, type DELETE in the box below:
            </p>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="w-full border border-red-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Type DELETE here"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={confirmText.toUpperCase() !== 'DELETE' || isDeleting}
            className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <SafeIcon icon={FiTrash2} className="w-4 h-4" />
            <span>{isDeleting ? 'Deleting...' : 'Delete'}</span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DeleteConfirmationModal;