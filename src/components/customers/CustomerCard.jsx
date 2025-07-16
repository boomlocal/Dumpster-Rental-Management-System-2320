```jsx
import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import DeleteButton from '../common/DeleteButton';

const { FiUser, FiMail, FiPhone, FiMapPin, FiEdit } = FiIcons;

const CustomerCard = ({ customer, onEdit, onDelete }) => {
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
              <SafeIcon icon={FiUser} className="w-5 h-5 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{customer.name}</h3>
          </div>
          
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiMail} className="w-4 h-4" />
              <span>{customer.email}</span>
            </div>
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiPhone} className="w-4 h-4" />
              <span>{customer.phone}</span>
            </div>
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiMapPin} className="w-4 h-4" />
              <span>{customer.address}</span>
            </div>
          </div>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(customer)}
            className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
          >
            <SafeIcon icon={FiEdit} className="w-4 h-4" />
          </button>
          <DeleteButton
            onDelete={() => onDelete(customer.id)}
            itemName="customer"
            itemIdentifier={customer.name}
            buttonSize="small"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default CustomerCard;
```