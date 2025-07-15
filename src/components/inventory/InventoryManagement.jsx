import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import toast from 'react-hot-toast';

const { 
  FiPlus, 
  FiFilter, 
  FiSearch, 
  FiPackage,
  FiSettings,
  FiGrid,
  FiList,
  FiMapPin,
  FiCamera,
  FiEdit3,
  FiTrash2,
  FiX,
  FiSave
} = FiIcons;

const InventoryManagement = () => {
  // ... (keep all your existing state and helper functions)

  return (
    <div className="main-content bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setSelectedAsset(null);
            setShowAssetForm(true);
          }}
          className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 flex items-center space-x-2"
        >
          <SafeIcon icon={FiPlus} className="w-5 h-5" />
          <span>Add Asset</span>
        </motion.button>
      </div>

      {/* Main Container */}
      <div className="inventory-container">
        {/* Search and Filters */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <SafeIcon icon={FiSearch} className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search inventory..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <SafeIcon icon={FiFilter} className="w-5 h-5" />
                <span>Filters</span>
              </button>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white text-primary-600 shadow' : 'text-gray-600'}`}
                >
                  <SafeIcon icon={FiGrid} className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-white text-primary-600 shadow' : 'text-gray-600'}`}
                >
                  <SafeIcon icon={FiList} className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4"
              >
                {/* ... (keep your existing filter inputs) */}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Content */}
        <div className="mt-6">
          {filteredAssets.length === 0 ? (
            renderEmptyState()
          ) : (
            <div className={viewMode === 'grid' ? 'inventory-grid' : 'space-y-4'}>
              {viewMode === 'grid' ? renderGridView() : renderListView()}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showAssetForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="modal-container"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedAsset ? 'Edit Asset' : 'Add New Asset'}
                </h2>
                <button
                  onClick={() => setShowAssetForm(false)}
                  className="text-gray-400 hover:text-gray-600 p-2"
                >
                  <SafeIcon icon={FiX} className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6">
                <div className="text-center py-8">
                  <SafeIcon icon={FiSettings} className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">Asset form would appear here</p>
                  <p className="text-gray-400 text-sm mb-6">This is a simplified demo implementation</p>
                  <button
                    onClick={() => {
                      toast.success(selectedAsset ? 'Asset updated successfully' : 'Asset created successfully');
                      setShowAssetForm(false);
                    }}
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 inline-flex items-center space-x-2"
                  >
                    <SafeIcon icon={FiSave} className="w-4 h-4" />
                    <span>Save Asset</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InventoryManagement;