import React from 'react';
import {motion} from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import DeleteButton from '../common/DeleteButton';

const {FiEdit, FiUser, FiMail, FiPhone, FiMapPin, FiBuilding} = FiIcons;

const CustomerList = ({customers, onEditCustomer, onDeleteCustomer}) => {
  if (customers.length === 0) {
    return (
      <div className="text-center py-12">
        <SafeIcon icon={FiUser} className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">No customers found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {customers.map((customer, index) => (
        <motion.div
          key={customer.id}
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          transition={{delay: index * 0.1}}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <SafeIcon icon={FiUser} className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{customer.name}</h3>
                {customer.company && (
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <SafeIcon icon={FiBuilding} className="w-4 h-4" />
                    <span>{customer.company}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onEditCustomer(customer)}
                className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                title="Edit Customer"
              >
                <SafeIcon icon={FiEdit} className="w-4 h-4" />
              </button>
              <DeleteButton
                onDelete={() => onDeleteCustomer(customer.id)}
                itemName="customer"
                itemIdentifier={customer.name}
                buttonSize="small"
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <SafeIcon icon={FiMail} className="w-4 h-4" />
              <span className="truncate">{customer.email}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <SafeIcon icon={FiPhone} className="w-4 h-4" />
              <span>{customer.phone}</span>
            </div>
            <div className="flex items-start space-x-2 text-sm text-gray-600">
              <SafeIcon icon={FiMapPin} className="w-4 h-4 mt-0.5" />
              <span className="flex-1">{customer.address}</span>
            </div>
          </div>

          {customer.notes && (
            <div className="mt-4 pt-3 border-t border-gray-100">
              <p className="text-sm text-gray-600 line-clamp-2">{customer.notes}</p>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default CustomerList;