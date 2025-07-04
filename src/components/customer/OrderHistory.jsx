import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiTruck, FiCalendar, FiMapPin, FiDollarSign } = FiIcons;

const OrderHistory = () => {
  const mockOrders = [
    {
      id: 1,
      orderNumber: 'ORD-2024-001',
      dumpsterSize: '20 yard',
      serviceType: 'drop-off',
      status: 'completed',
      orderDate: '2024-01-10',
      deliveryDate: '2024-01-12',
      pickupDate: '2024-01-19',
      address: '123 Main St, City, ST 12345',
      total: 399
    },
    {
      id: 2,
      orderNumber: 'ORD-2024-002',
      dumpsterSize: '30 yard',
      serviceType: 'exchange',
      status: 'in-progress',
      orderDate: '2024-01-15',
      deliveryDate: '2024-01-17',
      pickupDate: null,
      address: '456 Oak Ave, City, ST 12345',
      total: 499
    },
    {
      id: 3,
      orderNumber: 'ORD-2024-003',
      dumpsterSize: '10 yard',
      serviceType: 'pickup',
      status: 'scheduled',
      orderDate: '2024-01-20',
      deliveryDate: null,
      pickupDate: '2024-01-22',
      address: '789 Pine Rd, City, ST 12345',
      total: 299
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Order History</h3>
        <div className="text-sm text-gray-500">
          {mockOrders.length} orders
        </div>
      </div>

      <div className="space-y-4">
        {mockOrders.map((order, index) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <h4 className="text-lg font-semibold text-gray-900">
                  {order.orderNumber}
                </h4>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(order.status)}`}>
                  {order.status.replace('-', ' ')}
                </span>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-gray-900">${order.total}</p>
                <p className="text-sm text-gray-500">Total</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div className="flex items-center space-x-2">
                <SafeIcon icon={FiTruck} className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Size & Type</p>
                  <p className="font-medium">{order.dumpsterSize}</p>
                  <p className="text-sm text-gray-500 capitalize">{order.serviceType.replace('-', ' ')}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <SafeIcon icon={FiCalendar} className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Order Date</p>
                  <p className="font-medium">{new Date(order.orderDate).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <SafeIcon icon={FiCalendar} className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Delivery Date</p>
                  <p className="font-medium">
                    {order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <SafeIcon icon={FiMapPin} className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Address</p>
                  <p className="font-medium text-sm">{order.address}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex space-x-3">
                <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  View Details
                </button>
                {order.status === 'completed' && (
                  <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                    Reorder
                  </button>
                )}
              </div>
              {order.pickupDate && (
                <div className="text-sm text-gray-500">
                  Pickup: {new Date(order.pickupDate).toLocaleDateString()}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistory;