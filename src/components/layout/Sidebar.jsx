import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const {
  FiHome, FiUsers, FiTruck, FiCalendar, FiMapPin, FiBarChart3, FiSettings,
  FiClipboard, FiSmartphone, FiUserPlus, FiMessageSquare, FiNavigation,
  FiFileText, FiDollarSign, FiCamera, FiActivity
} = FiIcons;

const Sidebar = () => {
  const { effectiveUser, effectiveRole } = useAuth();

  const getMenuItems = () => {
    const baseItems = [
      { path: '/dashboard', icon: FiHome, label: 'Dashboard' }
    ];

    if (effectiveRole === 'admin') {
      baseItems.push(
        { path: '/users', icon: FiUserPlus, label: 'User Management' },
        { path: '/customers', icon: FiUsers, label: 'Customers' },
        { path: '/jobs', icon: FiClipboard, label: 'Jobs' },
        { path: '/scheduling', icon: FiCalendar, label: 'Scheduling' },
        { path: '/billing', icon: FiDollarSign, label: 'Billing & Invoices' },
        { path: '/tracking', icon: FiMapPin, label: 'Tracking' },
        { path: '/locations', icon: FiMapPin, label: 'Locations' },
        { path: '/photos', icon: FiCamera, label: 'Photo Library' },
        { path: '/reports', icon: FiBarChart3, label: 'Reports' },
        { path: '/notifications', icon: FiMessageSquare, label: 'Notifications' },
        { path: '/logs', icon: FiActivity, label: 'System Logs' }
      );
    }

    if (effectiveRole === 'office_staff') {
      baseItems.push(
        { path: '/customers', icon: FiUsers, label: 'Customers' },
        { path: '/jobs', icon: FiClipboard, label: 'Jobs' },
        { path: '/scheduling', icon: FiCalendar, label: 'Scheduling' },
        { path: '/tracking', icon: FiMapPin, label: 'Tracking' },
        { path: '/photos', icon: FiCamera, label: 'Photo Library' },
        { path: '/reports', icon: FiBarChart3, label: 'Reports' }
      );
    }

    if (effectiveRole === 'driver') {
      baseItems.push(
        { path: '/driver', icon: FiSmartphone, label: 'Driver App' },
        { path: '/tracking', icon: FiMapPin, label: 'Tracking' },
        { path: '/gps', icon: FiNavigation, label: 'GPS Tracker' }
      );
    }

    baseItems.push({ path: '/settings', icon: FiSettings, label: 'Settings' });

    return baseItems;
  };

  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'admin': return 'Administrator';
      case 'office_staff': return 'Office Staff';
      case 'driver': return 'Driver';
      case 'customer': return 'Customer';
      default: return role;
    }
  };

  return (
    <div className="bg-white w-64 shadow-lg flex flex-col">
      <div className="p-6 border-b">
        <div className="flex items-center space-x-3">
          <div className="bg-primary-100 p-2 rounded-lg">
            <SafeIcon icon={FiTruck} className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">BinHaulerPro</h1>
            <p className="text-sm text-gray-500">{getRoleDisplayName(effectiveRole)}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {getMenuItems().map((item) => (
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
            <SafeIcon icon={item.icon} className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t">
        <div className="flex items-center space-x-3 px-4 py-3">
          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="text-primary-600 font-medium text-sm">
              {effectiveUser?.name?.charAt(0)}
            </span>
          </div>
          <div>
            <p className="font-medium text-gray-900">{effectiveUser?.name}</p>
            <p className="text-sm text-gray-500">{effectiveUser?.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;