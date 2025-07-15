```jsx
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import AssetForm from './AssetForm';
import toast from 'react-hot-toast';

const { 
  FiPlus, 
  FiFilter, 
  FiSearch, 
  FiPackage,
  FiGrid,
  FiList,
  FiEdit3,
  FiTrash2
} = FiIcons;

const InventoryManagement = () => {
  const { user } = useAuth();
  
  // State definitions
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAssetForm, setShowAssetForm] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);

  // Mock assets data with more comprehensive structure
  const [assets, setAssets] = useState([
    {
      id: 1,
      assetNumber: 'D-001',
      type: 'roll-off',
      containerSize: '20',
      containerUnit: 'yard',
      status: 'available',
      condition: 'excellent',
      manufacturer: 'Wastequip',
      model: 'DRS-20',
      serialNumber: 'WQ2024001',
      purchaseDate: '2024-01-15',
      purchasePrice: 15000,
      currentValue: 12000,
      location: {
        type: 'yard',
        address: 'Main Yard - 123 Industrial Blvd',
        coordinates: { lat: 40.7614, lng: -73.9776 }
      },
      lastInspection: '2024-01-01',
      nextInspection: '2025-01-01',
      maintenanceNotes: 'Regular maintenance up to date',
      notes: 'Primary 20-yard container for commercial jobs'
    },
    {
      id: 2,
      assetNumber: 'D-002',
      type: 'roll-off',
      containerSize: '30',
      containerUnit: 'yard',
      status: 'deployed',
      condition: 'good',
      manufacturer: 'Dumpster Rental Systems',
      model: 'DRS-30',
      serialNumber: 'DRS2024002',
      purchaseDate: '2024-01-20',
      purchasePrice: 18000,
      currentValue: 15000,
      location: {
        type: 'customer',
        address: '456 Oak Ave, Los Angeles, CA 90210',
        coordinates: { lat: 34.0522, lng: -118.2437 }
      },
      lastInspection: '2024-01-10',
      nextInspection: '2025-01-10',
      maintenanceNotes: 'Minor rust treatment needed',
      notes: 'Deployed to ABC Construction project'
    }
  ]);

  // Filter assets based on search term
  const filteredAssets = assets.filter(asset => 
    asset.assetNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.location.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSaveAsset = (assetData) => {
    if (selectedAsset) {
      // Update existing asset
      setAssets(prev => prev.map(asset => 
        asset.id === selectedAsset.id 
          ? { ...asset, ...assetData, id: selectedAsset.id }
          : asset
      ));
      toast.success('Asset updated successfully');
    } else {
      // Add new asset
      const newAsset = {
        ...assetData,
        id: Date.now()
      };
      setAssets(prev => [...prev, newAsset]);
      toast.success('Asset created successfully');
    }
    
    setShowAssetForm(false);
    setSelectedAsset(null);
  };

  const handleDeleteAsset = (assetId) => {
    if (window.confirm('Are you sure you want to delete this asset?')) {
      setAssets(prev => prev.filter(asset => asset.id !== assetId));
      toast.success('Asset deleted successfully');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'deployed': return 'bg-blue-100 text-blue-800';
      case 'in-transit': return 'bg-yellow-100 text-yellow-800';
      case 'maintenance': return 'bg-red-100 text-red-800';
      case 'out-of-service': return 'bg-gray-100 text-gray-800';
      case 'retired': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getConditionColor = (condition) => {
    switch (condition) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-blue-600';
      case 'fair': return 'text-yellow-600';
      case 'poor': return 'text-orange-600';
      case 'needs-repair': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  // Render empty state
  const renderEmptyState = () => (
    <div className="text-center py-12">
      <SafeIcon icon={FiPackage} className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <p className="text-gray-500 text-lg">No assets found</p>
      <p className="text-gray-400 text-sm">Add your first asset or adjust your search filters</p>
    </div>
  );

  // Render grid view
  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredAssets.map(asset => (
        <motion.div
          key={asset.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{asset.assetNumber}</h3>
            <span className={`px-2 py-1 text-sm rounded-full ${getStatusColor(asset.status)}`}>
              {asset.status.replace('-', ' ')}
            </span>
          </div>
          
          <div className="space-y-2 text-sm text-gray-600 mb-4">
            <p><strong>Type:</strong> {asset.type.replace('-', ' ')}</p>
            <p><strong>Size:</strong> {asset.containerSize} {asset.containerUnit}</p>
            <p><strong>Condition:</strong> <span className={getConditionColor(asset.condition)}>{asset.condition}</span></p>
            <p><strong>Location:</strong> {asset.location.address}</p>
            {asset.manufacturer && <p><strong>Manufacturer:</strong> {asset.manufacturer}</p>}
          </div>
          
          <div className="flex justify-end space-x-2">
            <button 
              onClick={() => {
                setSelectedAsset(asset);
                setShowAssetForm(true);
              }}
              className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
              title="Edit Asset"
            >
              <SafeIcon icon={FiEdit3} className="w-5 h-5" />
            </button>
            <button 
              onClick={() => handleDeleteAsset(asset.id)}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete Asset"
            >
              <SafeIcon icon={FiTrash2} className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );

  // Render list view
  const renderListView = () => (
    <div className="space-y-4">
      {filteredAssets.map(asset => (
        <motion.div
          key={asset.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <SafeIcon icon={FiPackage} className="w-8 h-8 text-gray-400" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{asset.assetNumber}</h3>
                <p className="text-sm text-gray-600">
                  {asset.containerSize} {asset.containerUnit} {asset.type.replace('-', ' ')} - {asset.condition}
                </p>
                <p className="text-sm text-gray-500">{asset.location.address}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className={`px-2 py-1 text-sm rounded-full ${getStatusColor(asset.status)}`}>
                {asset.status.replace('-', ' ')}
              </span>
              <div className="flex space-x-2">
                <button 
                  onClick={() => {
                    setSelectedAsset(asset);
                    setShowAssetForm(true);
                  }}
                  className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  title="Edit Asset"
                >
                  <SafeIcon icon={FiEdit3} className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => handleDeleteAsset(asset.id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete Asset"
                >
                  <SafeIcon icon={FiTrash2} className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  return (
    <div className="p-6">
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Assets</p>
              <p className="text-3xl font-bold text-gray-900">{assets.length}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <SafeIcon icon={FiPackage} className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Available</p>
              <p className="text-3xl font-bold text-green-600">
                {assets.filter(a => a.status === 'available').length}
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <SafeIcon icon={FiPackage} className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Deployed</p>
              <p className="text-3xl font-bold text-blue-600">
                {assets.filter(a => a.status === 'deployed').length}
              </p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <SafeIcon icon={FiPackage} className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Maintenance</p>
              <p className="text-3xl font-bold text-red-600">
                {assets.filter(a => a.status === 'maintenance').length}
              </p>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <SafeIcon icon={FiPackage} className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <SafeIcon icon={FiSearch} className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search assets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-4">
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
            <div className="text-sm text-gray-500">
              {filteredAssets.length} assets
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {filteredAssets.length === 0 ? (
          renderEmptyState()
        ) : (
          viewMode === 'grid' ? renderGridView() : renderListView()
        )}
      </div>

      {/* Asset Form Modal */}
      {showAssetForm && (
        <AssetForm
          asset={selectedAsset}
          onClose={() => {
            setShowAssetForm(false);
            setSelectedAsset(null);
          }}
          onSave={handleSaveAsset}
        />
      )}
    </div>
  );
};

export default InventoryManagement;
```