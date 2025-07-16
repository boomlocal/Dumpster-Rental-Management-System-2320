```jsx
import React from 'react';
import {motion} from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import DeleteButton from '../common/DeleteButton';

const {FiEdit, FiPackage, FiMapPin, FiTruck, FiSettings} = FiIcons;

// Add the 'export' keyword here
export const AssetList = ({assets, onEditAsset, onDeleteAsset}) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'deployed': return 'bg-blue-100 text-blue-800';
      case 'maintenance': return 'bg-red-100 text-red-800';
      case 'in-transit': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAssetIcon = (type) => {
    switch (type) {
      case 'truck': return FiTruck;
      case 'trailer': return FiTruck;
      case 'loader': return FiTruck;
      case 'equipment': return FiSettings;
      default: return FiPackage;
    }
  };

  if (assets.length === 0) {
    return (
      <div className="text-center py-12">
        <SafeIcon icon={FiPackage} className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">No assets found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {assets.map((asset, index) => (
        <motion.div
          key={asset.id}
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          transition={{delay: index * 0.1}}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <SafeIcon icon={getAssetIcon(asset.type)} className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{asset.assetNumber}</h3>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(asset.status)}`}>
                  {asset.status.replace('-', ' ')}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onEditAsset(asset)}
                className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                title="Edit Asset"
              >
                <SafeIcon icon={FiEdit} className="w-4 h-4" />
              </button>
              <DeleteButton
                onDelete={() => onDeleteAsset(asset.id)}
                itemName="asset"
                itemIdentifier={asset.assetNumber}
                buttonSize="small"
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Type</span>
              <span className="text-gray-700 capitalize">{asset.type}</span>
            </div>
            
            {asset.containerSize && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Size</span>
                <span className="text-gray-700">{asset.containerSize} {asset.containerUnit}</span>
              </div>
            )}

            {asset.manufacturer && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Manufacturer</span>
                <span className="text-gray-700">{asset.manufacturer}</span>
              </div>
            )}

            {asset.location && (
              <div className="flex items-start space-x-2 text-sm text-gray-600">
                <SafeIcon icon={FiMapPin} className="w-4 h-4 mt-0.5" />
                <span className="flex-1">{asset.location.address}</span>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Condition</span>
              <span className={`capitalize ${
                asset.condition === 'excellent' ? 'text-green-600' :
                asset.condition === 'good' ? 'text-blue-600' :
                asset.condition === 'fair' ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {asset.condition}
              </span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// Add default export
export default AssetList;
```