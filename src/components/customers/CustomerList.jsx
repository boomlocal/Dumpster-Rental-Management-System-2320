```jsx
import React from 'react';
import { useData } from '../../contexts/DataContext';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import CustomerPhotoButton from './CustomerPhotoButton';

const { FiEdit, FiTrash2, FiMapPin, FiPhone, FiMail, FiUser } = FiIcons;

const CustomerList = ({ customers, onEditCustomer }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  if (customers.length === 0) {
    return (
      <div className="text-center py-12">
        <SafeIcon icon={FiUser} className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">No customers found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {customers.map((customer, index) => (
        <motion.div
          key={customer.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-4 mb-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  {customer.name}
                </h3>
                {customer.status && (
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(customer.status)}`}>
                    {customer.status}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-600">
                {customer.company && (
                  <div className="flex items-center space-x-2">
                    <SafeIcon icon={FiUser} className="w-4 h-4" />
                    <span>{customer.company}</span>
                  </div>
                )}
                {customer.email && (
                  <div className="flex items-center space-x-2">
                    <SafeIcon icon={FiMail} className="w-4 h-4" />
                    <span>{customer.email}</span>
                  </div>
                )}
                {customer.phone && (
                  <div className="flex items-center space-x-2">
                    <SafeIcon icon={FiPhone} className="w-4 h-4" />
                    <span>{customer.phone}</span>
                  </div>
                )}
                {customer.address && (
                  <div className="flex items-center space-x-2">
                    <SafeIcon icon={FiMapPin} className="w-4 h-4" />
                    <span>{customer.address}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <CustomerPhotoButton customer={customer} />
              <button
                onClick={() => onEditCustomer(customer)}
                className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                title="Edit Customer"
              >
                <SafeIcon icon={FiEdit} className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default CustomerList;
```