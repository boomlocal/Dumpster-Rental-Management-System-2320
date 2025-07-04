import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import CustomerPhotoButton from './CustomerPhotoButton';

const { FiEdit, FiMail, FiPhone, FiMapPin, FiUsers, FiEye, FiMap, FiNavigation } = FiIcons;

const CustomerList = ({ customers, onEditCustomer }) => {
  const openInMaps = (customer) => {
    if (customer.coordinates?.lat && customer.coordinates?.lng) {
      const url = `https://www.google.com/maps?q=${customer.coordinates.lat},${customer.coordinates.lng}`;
      window.open(url, '_blank');
    } else if (customer.address) {
      const address = encodeURIComponent(customer.address);
      const url = `https://www.google.com/maps/search/?api=1&query=${address}`;
      window.open(url, '_blank');
    }
  };

  const openStreetView = (customer) => {
    if (customer.coordinates?.lat && customer.coordinates?.lng) {
      const url = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${customer.coordinates.lat},${customer.coordinates.lng}`;
      window.open(url, '_blank');
    } else if (customer.address) {
      const address = encodeURIComponent(customer.address);
      const url = `https://www.google.com/maps/@?api=1&map_action=pano&query=${address}`;
      window.open(url, '_blank');
    }
  };

  const openSatelliteView = (customer) => {
    if (customer.coordinates?.lat && customer.coordinates?.lng) {
      const url = `https://www.google.com/maps/@${customer.coordinates.lat},${customer.coordinates.lng},18z/data=!3m1!1e3`;
      window.open(url, '_blank');
    } else if (customer.address) {
      const address = encodeURIComponent(customer.address);
      const url = `https://www.google.com/maps/search/${address}/@?data=!3m1!1e3`;
      window.open(url, '_blank');
    }
  };

  if (customers.length === 0) {
    return (
      <div className="text-center py-12">
        <SafeIcon icon={FiUsers} className="w-16 h-16 text-gray-300 mx-auto mb-4" />
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
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-4 mb-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  {customer.name}
                </h3>
                {customer.company && (
                  <span className="text-sm text-gray-500 bg-gray-200 px-2 py-1 rounded">
                    {customer.company}
                  </span>
                )}
                <span className="text-sm text-primary-600 bg-primary-50 px-2 py-1 rounded">
                  {customer.jobs || 0} jobs
                </span>
              </div>

              <div className="flex items-center space-x-6 text-sm text-gray-600 mb-3">
                <div className="flex items-center space-x-1">
                  <SafeIcon icon={FiMail} className="w-4 h-4" />
                  <span>{customer.email}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <SafeIcon icon={FiPhone} className="w-4 h-4" />
                  <span>{customer.phone}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <SafeIcon icon={FiMapPin} className="w-4 h-4" />
                  <span>{customer.address}</span>
                </div>
              </div>

              {/* Map View Options & Photo Upload - Available to All Users */}
              {customer.address && (
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-sm font-medium text-gray-700">Actions:</span>
                  <button
                    onClick={() => openInMaps(customer)}
                    className="flex items-center space-x-1 px-3 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Open in Maps"
                  >
                    <SafeIcon icon={FiNavigation} className="w-4 h-4" />
                    <span>Directions</span>
                  </button>
                  
                  <button
                    onClick={() => openStreetView(customer)}
                    className="flex items-center space-x-1 px-3 py-1 text-sm text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                    title="Street View"
                  >
                    <SafeIcon icon={FiEye} className="w-4 h-4" />
                    <span>Street View</span>
                  </button>
                  
                  <button
                    onClick={() => openSatelliteView(customer)}
                    className="flex items-center space-x-1 px-3 py-1 text-sm text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg transition-colors"
                    title="Satellite View"
                  >
                    <SafeIcon icon={FiMap} className="w-4 h-4" />
                    <span>Satellite</span>
                  </button>

                  {/* Photo Upload Button - Available to All Users */}
                  <CustomerPhotoButton customer={customer} />
                </div>
              )}

              {customer.notes && (
                <div className="text-sm text-gray-500">
                  <strong>Notes:</strong> {customer.notes}
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
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