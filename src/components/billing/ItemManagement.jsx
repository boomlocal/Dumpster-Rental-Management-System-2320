import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import toast from 'react-hot-toast';

const { FiX, FiPlus, FiEdit3, FiTrash2, FiSave, FiDollarSign, FiTag, FiFileText } = FiIcons;

const ItemManagement = ({ items, onClose }) => {
  const [serviceItems, setServiceItems] = useState(items);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    description: '',
    defaultRate: 0,
    category: 'service'
  });

  const categories = [
    { value: 'dumpster', label: 'Dumpster Drop-off' },
    { value: 'pickup', label: 'Pickup Services' },
    { value: 'service', label: 'Additional Services' },
    { value: 'fee', label: 'Fees' },
    { value: 'custom', label: 'Custom' }
  ];

  const handleAddItem = () => {
    if (!formData.description.trim()) {
      toast.error('Description is required');
      return;
    }

    const newItem = {
      id: Date.now(),
      description: formData.description.trim(),
      defaultRate: parseFloat(formData.defaultRate) || 0,
      category: formData.category
    };

    setServiceItems(prev => [...prev, newItem]);
    setFormData({ description: '', defaultRate: 0, category: 'service' });
    setShowAddForm(false);
    toast.success('Item added successfully');
  };

  const handleEditItem = (item) => {
    setEditingItem(item.id);
    setFormData({
      description: item.description,
      defaultRate: item.defaultRate,
      category: item.category
    });
  };

  const handleUpdateItem = () => {
    if (!formData.description.trim()) {
      toast.error('Description is required');
      return;
    }

    setServiceItems(prev =>
      prev.map(item =>
        item.id === editingItem
          ? {
              ...item,
              description: formData.description.trim(),
              defaultRate: parseFloat(formData.defaultRate) || 0,
              category: formData.category
            }
          : item
      )
    );

    setEditingItem(null);
    setFormData({ description: '', defaultRate: 0, category: 'service' });
    toast.success('Item updated successfully');
  };

  const handleDeleteItem = (id) => {
    setServiceItems(prev => prev.filter(item => item.id !== id));
    toast.success('Item deleted successfully');
  };

  const cancelEdit = () => {
    setEditingItem(null);
    setShowAddForm(false);
    setFormData({ description: '', defaultRate: 0, category: 'service' });
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'dumpster': return 'bg-blue-100 text-blue-800';
      case 'pickup': return 'bg-green-100 text-green-800';
      case 'service': return 'bg-purple-100 text-purple-800';
      case 'fee': return 'bg-red-100 text-red-800';
      case 'custom': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryLabel = (category) => {
    const cat = categories.find(c => c.value === category);
    return cat ? cat.label : category;
  };

  const groupedItems = categories.reduce((acc, category) => {
    acc[category.value] = serviceItems.filter(item => item.category === category.value);
    return acc;
  }, {});

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Manage Service Items</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 flex items-center space-x-2"
            >
              <SafeIcon icon={FiPlus} className="w-4 h-4" />
              <span>Add Item</span>
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-2"
            >
              <SafeIcon icon={FiX} className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Add/Edit Form */}
          {(showAddForm || editingItem) && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6"
            >
              <h3 className="text-lg font-semibold text-blue-900 mb-4">
                {editingItem ? 'Edit Item' : 'Add New Item'}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <div className="relative">
                    <SafeIcon icon={FiFileText} className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter item description"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Default Rate
                  </label>
                  <div className="relative">
                    <SafeIcon icon={FiDollarSign} className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.defaultRate}
                      onChange={(e) => setFormData(prev => ({ ...prev, defaultRate: e.target.value }))}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <div className="relative">
                    <SafeIcon icon={FiTag} className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      {categories.map(category => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-4">
                <button
                  onClick={cancelEdit}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={editingItem ? handleUpdateItem : handleAddItem}
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 flex items-center space-x-2"
                >
                  <SafeIcon icon={FiSave} className="w-4 h-4" />
                  <span>{editingItem ? 'Update' : 'Add'} Item</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* Items List by Category */}
          <div className="space-y-6">
            {categories.map(category => (
              <div key={category.value} className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                  <span>{category.label}</span>
                  <span className="text-sm text-gray-500">
                    ({groupedItems[category.value]?.length || 0} items)
                  </span>
                </h3>

                {groupedItems[category.value]?.length === 0 ? (
                  <p className="text-gray-500 text-sm italic">No items in this category</p>
                ) : (
                  <div className="grid gap-3">
                    {groupedItems[category.value]?.map(item => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gray-50 rounded-lg p-4 flex items-center justify-between hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <h4 className="font-medium text-gray-900">{item.description}</h4>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(item.category)}`}>
                              {getCategoryLabel(item.category)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            Default Rate: <span className="font-medium">${item.defaultRate.toFixed(2)}</span>
                          </p>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEditItem(item)}
                            className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          >
                            <SafeIcon icon={FiEdit3} className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Info Panel */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 mb-2">Service Items Information:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Service items help create invoices quickly with predefined descriptions and rates</li>
              <li>• All items must have a description - rates can be adjusted per invoice</li>
              <li>• Items are organized by category for easy selection</li>
              <li>• Changes here will appear in the invoice creation dropdown</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ItemManagement;