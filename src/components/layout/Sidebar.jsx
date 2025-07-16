import React from 'react';
import { NavLink } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { 
  FiHome, FiUsers, FiTruck, FiCalendar, FiMapPin, FiBarChart3, 
  FiSettings, FiClipboard, FiUserPlus, FiDollarSign, FiCamera
} = FiIcons;

const Sidebar = () => {
  const menuItems = [
    { path: '/dashboard', icon: FiHome, label: 'Dashboard' },
    { path: '/customers', icon: FiUsers, label: 'Customers' },
    { path: '/jobs', icon: FiClipboard, label: 'Jobs' },
    { path: '/scheduling', icon: FiCalendar, label: 'Scheduling' },
    { path: '/tracking', icon: FiMapPin, label: 'Tracking' },
    { path: '/billing', icon: FiDollarSign, label: 'Billing' },
    { path: '/inventory', icon: FiTruck, label: 'Inventory' },
    { path: '/photos', icon: FiCamera, label: 'Photos' },
    { path: '/reports', icon: FiBarChart3, label: 'Reports' },
    { path: '/users', icon: FiUserPlus, label: 'Users' },
    { path: '/settings', icon: FiSettings, label: 'Settings' }
  ];

  return (
    <div className="bg-white w-64 shadow-lg flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="bg-primary-100 p-2 rounded-lg">
            <SafeIcon icon={FiTruck} className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">BinHauler</h1>
            <p className="text-sm text-gray-500">Admin Dashboard</p>
          </div>
        </div>
      </div>
      
      {/* Navigation Menu - Scrollable */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <SafeIcon icon={item.icon} className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>
      
      {/* User Info Footer */}
      <div className="p-4 border-t flex-shrink-0">
        <div className="flex items-center space-x-3 px-4 py-3">
          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-primary-600 font-medium text-sm">A</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-medium text-gray-900 truncate">Admin User</p>
            <p className="text-sm text-gray-500 truncate">admin@binhauler.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;