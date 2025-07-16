```jsx
import React, { useState, useCallback, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import AssetForm from './AssetForm';
import AssetList from './AssetList';
import ActivityLogs from './ActivityLogs';
import toast from 'react-hot-toast';

const { FiPlus, FiPackage, FiSearch, FiFilter, FiSettings } = FiIcons;

const InventoryManagement = () => {
  const { user } = useAuth();
  const [assets, setAssets] = useState([
    {
      id: 1,
      assetNumber: 'D-001',
      type: 'dumpster',
      containerSize: '20',
      containerUnit: 'yard',
      status: 'available',
      condition: 'excellent',
      manufacturer: 'Waste Management Co',
      model: 'WM-2000',
      location: {
        type: 'yard',
        address: 'Main Yard - 123 Industrial Blvd'
      },
      purchaseDate: '2023-01-15',
      purchasePrice: 5000,
      notes: 'Standard 20-yard dumpster for residential use'
    }
  ]);

  const [showAssetForm, setShowAssetForm] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);

  // Access control check
  if (user?.role !== 'admin' && user?.role !== 'office_staff') {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <SafeIcon 
              icon={FiPackage} 
              className="w-16 h-16 text-gray-300 mx-auto mb-4"
            />
            <h3 className="text-lg font-semibold text-gray-700">
              Access Denied
            </h3>
            <p className="text-gray-500">
              Only administrators and office staff can manage inventory.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Memoized filters
  const filteredAssets = useMemo(() => {
    return assets.filter(asset => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        asset.assetNumber.toLowerCase().includes(searchLower) ||
        asset.type.toLowerCase().includes(searchLower) ||
        asset.manufacturer?.toLowerCase().includes(searchLower) ||
        asset.model?.toLowerCase().includes(searchLower);
        
      const matchesStatus = statusFilter === 'all' || asset.status === statusFilter;
      const matchesType = typeFilter === 'all' || asset.type === typeFilter;
      
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [assets, searchTerm, statusFilter, typeFilter]);

  // Memoized stats
  const stats = useMemo(() => {
    return {
      total: assets.length,
      available: assets.filter(a => a.status === 'available').length,
      deployed: assets.filter(a => a.status === 'deployed').length,
      maintenance: assets.filter(a => a.status === 'maintenance').length
    };
  }, [assets]);

  const handleAddAsset = useCallback(async (assetData) => {
    try {
      setIsLoading(true);
      const newAsset = {
        ...assetData,
        id: Date.now(),
        createdAt: new Date(),
        createdBy: user?.name || 'Unknown'
      };
      setAssets(prev => [...prev, newAsset]);
      setShowAssetForm(false);
      toast.success('Asset added successfully');
    } catch (error) {
      console.error('Error adding asset:', error);
      toast.error('Failed to add asset');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const handleEditAsset = (asset) => {
    setSelectedAsset(asset);
    setShowAssetForm(true);
  };

  const handleDeleteAsset = (assetId) => {
    setAssets(prev => prev.filter(a => a.id !== assetId));
    toast.success('Asset deleted successfully');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowAssetForm(true)}
            className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 flex items-center space-x-2"
          >
            <SafeIcon icon={FiPlus} className="w-5 h-5" />
            <span>Add Asset</span>
          </motion.button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Assets</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <SafeIcon icon={FiPackage} className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </motion.div>

          {/* Add more stat cards here */}
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 mb-6">
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
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="available">Available</option>
                <option value="deployed">Deployed</option>
                <option value="maintenance">Maintenance</option>
              </select>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="dumpster">Dumpster</option>
                <option value="truck">Truck</option>
                <option value="equipment">Equipment</option>
              </select>
            </div>
          </div>

          {/* Asset List */}
          <AssetList
            assets={filteredAssets}
            onEditAsset={handleEditAsset}
            onDeleteAsset={handleDeleteAsset}
          />
        </div>
      </div>

      {/* Asset Form Modal */}
      {showAssetForm && (
        <AssetForm
          asset={selectedAsset}
          onClose={() => {
            setShowAssetForm(false);
            setSelectedAsset(null);
          }}
          onSave={selectedAsset ? handleEditAsset : handleAddAsset}
        />
      )}
    </div>
  );
};

export default InventoryManagement;
```