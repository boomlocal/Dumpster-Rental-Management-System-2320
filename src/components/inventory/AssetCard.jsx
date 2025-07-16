```jsx
import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import DeleteButton from '../common/DeleteButton';

const { FiPackage, FiMapPin, FiEdit } = FiIcons;

const AssetCard = ({ asset, onEdit, onDelete }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'in-use': return 'bg-blue-100 text-blue-800';
      case 'maintenance': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-3">
            <div className="bg-primary-100 p-2 rounded-full">
              <SafeIcon icon={FiPackage} className="w-5 h-5 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{asset.binNumber}</h3>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(asset.status)}`}>
              {asset.status}
            </span>
          </div>

          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiPackage} className="w-4 h-4" />
              <span>{asset.size}</span>
            </div>
            {asset.location && (
              <div className="flex items-center space-x-2">
                <SafeIcon icon={FiMapPin} className="w-4 h-4" />
                <span>
                  {asset.location.lat.toFixed(6)}, {asset.location.lng.toFixed(6)}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(asset)}
            className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
          >
            <SafeIcon icon={FiEdit} className="w-4 h-4" />
          </button>
          <DeleteButton
            onDelete={() => onDelete(asset.id)}
            itemName="asset"
            itemIdentifier={asset.binNumber}
            buttonSize="small"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default AssetCard;
```