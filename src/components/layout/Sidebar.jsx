import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const Sidebar = () => {
  const { effectiveUser, effectiveRole } = useAuth();

  const getMenuItems = () => {
    const baseItems = [
      { path: '/dashboard', icon: FiIcons.FiHome, label: 'Dashboard' }
    ];

    if (effectiveRole === 'admin') {
      baseItems.push(
        { path: '/users', icon: FiIcons.FiUserPlus, label: 'User Management' },
        { path: '/customers', icon: FiIcons.FiUsers, label: 'Customers' },
        { path: '/jobs', icon: FiIcons.FiClipboard, label: 'Jobs' },
        { path: '/scheduling', icon: FiIcons.FiCalendar, label: 'Scheduling' },
        { path: '/billing', icon: FiIcons.FiDollarSign, label: 'Billing & Invoices' },
        { path: '/tracking', icon: FiIcons.FiMapPin, label: 'Tracking' },
        { path: '/locations', icon: FiIcons.FiMapPin, label: 'Locations' },
        { path: '/inventory', icon: FiIcons.FiPackage, label: 'Inventory' },
        { path: '/photos', icon: FiIcons.FiCamera, label: 'Photo Library' },
        { path: '/reports', icon: FiIcons.FiBarChart3, label: 'Reports' },
        { path: '/notifications', icon: FiIcons.FiMessageSquare, label: 'Notifications' },
        { path: '/logs', icon: FiIcons.FiActivity, label: 'System Logs' }
      );
    }

    baseItems.push({ path: '/settings', icon: FiIcons.FiSettings, label: 'Settings' });

    return baseItems;
  };

  const menuItems = getMenuItems();

  return (
    <div className="bg-white w-64 shadow-lg flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="bg-primary-100 p-2 rounded-lg">
            <SafeIcon icon={FiIcons.FiTruck} className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">BinHaulerPro</h1>
            <p className="text-sm text-gray-500">{effectiveRole}</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
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

      {/* User Info */}
      <div className="p-4 border-t flex-shrink-0">
        <div className="flex items-center space-x-3 px-4 py-3">
          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-primary-600 font-medium text-sm">
              {effectiveUser?.name?.charAt(0)}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-medium text-gray-900 truncate">{effectiveUser?.name}</p>
            <p className="text-sm text-gray-500 truncate">{effectiveUser?.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;