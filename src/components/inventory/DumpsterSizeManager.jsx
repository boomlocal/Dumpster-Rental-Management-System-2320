import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import toast from 'react-hot-toast';

const { FiX, FiPlus, FiEdit3, FiTrash2, FiSave, FiSettings, FiPackage } = FiIcons;

const DumpsterSizeManager = ({ sizes, onUpdateSizes, onClose }) => {
  const [sizeList, setSizeList] = useState([...sizes]);
  const [newSize, setNewSize] = useState({ value: '', label: '', description: '' });
  const [editingId, setEditingId] = useState(null);
  const [editingSize, setEditingSize] = useState({ value: '', label: '', description: '' });

  const handleAddSize = () => {
    if (!newSize.value || !newSize.label) {
      toast.error('Size value and label are required');
      return;
    }

    // Check for duplicates
    if (sizeList.some(size => size.value === newSize.value)) {
      toast.error('This size already exists');
      return;
    }

    const size = {
      id: Date.now(),
      value: newSize.value,
      label: newSize.label,
      description: newSize.description || `${newSize.label} dumpster container`,
      isCustom: true
    };

    setSizeList(prev => [...prev, size]);
    setNewSize({ value: '', label: '', description: '' });
    toast.success('Dumpster size added successfully');
  };

  const handleEditSize = (size) => {
    setEditingId(size.id);
    setEditingSize({
      value: size.value,
      label: size.label,
      description: size.description || ''
    });
  };

  const handleUpdateSize = () => {
    if (!editingSize.value || !editingSize.label) {
      toast.error('Size value and label are required');
      return;
    }

    // Check for duplicates (excluding current item)
    if (sizeList.some(size => size.id !== editingId && size.value === editingSize.value)) {
      toast.error('This size already exists');
      return;
    }

    setSizeList(prev => prev.map(size => 
      size.id === editingId 
        ? { 
            ...size, 
            value: editingSize.value, 
            label: editingSize.label, 
            description: editingSize.description 
          }
        : size
    ));

    setEditingId(null);
    setEditingSize({ value: '', label: '', description: '' });
    toast.success('Dumpster size updated successfully');
  };

  const handleDeleteSize = (id) => {
    const sizeToDelete = sizeList.find(size => size.id === id);
    
    if (!sizeToDelete.isCustom) {
      toast.error('Cannot delete standard dumpster sizes');
      return;
    }

    setSizeList(prev => prev.filter(size => size.id !== id));
    toast.success('Dumpster size deleted successfully');
  };

  const handleSaveChanges = () => {
    onUpdateSizes(sizeList);
    toast.success('Dumpster size settings saved');
    onClose();
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingSize({ value: '', label: '', description: '' });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <SafeIcon icon={FiPackage} className="w-6 h-6 mr-2 text-primary-600" />
            Manage Dumpster Sizes
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2"
          >
            <SafeIcon icon={FiX} className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Add New Size */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Add New Dumpster Size</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Size Value * (e.g., 25, 35)
                </label>
                <input
                  type="text"
                  value={newSize.value}
                  onChange={(e) => setNewSize(prev => ({ ...prev, value: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="25"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Display Label * (e.g., 25 Yard)
                </label>
                <input
                  type="text"
                  value={newSize.label}
                  onChange={(e) => setNewSize(prev => ({ ...prev, label: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="25 Yard"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (optional)
                </label>
                <input
                  type="text"
                  value={newSize.description}
                  onChange={(e) => setNewSize(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Description"
                />
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={handleAddSize}
                className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 flex items-center space-x-2"
              >
                <SafeIcon icon={FiPlus} className="w-4 h-4" />
                <span>Add Size</span>
              </button>
            </div>
          </div>

          {/* Existing Sizes */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Dumpster Sizes</h3>
            <div className="space-y-3">
              {sizeList.map((size) => (
                <motion.div
                  key={size.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-50 rounded-lg p-4 flex items-center justify-between"
                >
                  {editingId === size.id ? (
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <input
                        type="text"
                        value={editingSize.value}
                        onChange={(e) => setEditingSize(prev => ({ ...prev, value: e.target.value }))}
                        className="border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Size value"
                      />
                      <input
                        type="text"
                        value={editingSize.label}
                        onChange={(e) => setEditingSize(prev => ({ ...prev, label: e.target.value }))}
                        className="border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Display label"
                      />
                      <input
                        type="text"
                        value={editingSize.description}
                        onChange={(e) => setEditingSize(prev => ({ ...prev, description: e.target.value }))}
                        className="border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Description"
                      />
                    </div>
                  ) : (
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <span className="text-lg font-semibold text-gray-900">{size.label}</span>
                        {!size.isCustom && (
                          <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">
                            Standard
                          </span>
                        )}
                        {size.isCustom && (
                          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                            Custom
                          </span>
                        )}
                      </div>
                      {size.description && (
                        <p className="text-sm text-gray-600 mt-1">{size.description}</p>
                      )}
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    {editingId === size.id ? (
                      <>
                        <button
                          onClick={handleUpdateSize}
                          className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 flex items-center space-x-1"
                        >
                          <SafeIcon icon={FiSave} className="w-3 h-3" />
                          <span>Save</span>
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="text-gray-600 hover:text-gray-800 px-3 py-1 text-sm"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEditSize(size)}
                          className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          title="Edit Size"
                        >
                          <SafeIcon icon={FiEdit3} className="w-4 h-4" />
                        </button>
                        {size.isCustom && (
                          <button
                            onClick={() => handleDeleteSize(size.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Size"
                          >
                            <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Info Panel */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 mb-2">Dumpster Size Management:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Add custom dumpster sizes to match your inventory</li>
              <li>• Standard sizes (6, 10, 12, 15, 20, 30, 40 yard) cannot be deleted</li>
              <li>• Custom sizes can be edited or removed as needed</li>
              <li>• Size values should be numeric (e.g., 25, 35, 45)</li>
              <li>• Display labels appear in dropdowns (e.g., "25 Yard")</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-4 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveChanges}
            className="bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700 flex items-center space-x-2"
          >
            <SafeIcon icon={FiSave} className="w-4 h-4" />
            <span>Save Changes</span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DumpsterSizeManager;