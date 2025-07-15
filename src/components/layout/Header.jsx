import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import AdminViewSwitcher from './AdminViewSwitcher';

const { FiBell, FiLogOut } = FiIcons;

const Header = () => {
  const { effectiveUser, logout, isAdmin, viewAsRole } = useAuth();
  const { notifications } = useNotifications();

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="bg-white shadow-sm border-b px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Welcome back, {effectiveUser?.name}
          </h2>
          <p className="text-gray-600">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>

        <div className="flex items-center space-x-4">
          {/* Admin View Switcher */}
          {isAdmin && <AdminViewSwitcher />}

          {/* View As Indicator */}
          {viewAsRole && (
            <div className="bg-yellow-100 border border-yellow-200 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
              Viewing as {viewAsRole === 'office_staff' ? 'Office Staff' : viewAsRole}
            </div>
          )}

          <div className="relative">
            <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
              <SafeIcon icon={FiBell} className="w-6 h-6" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>

          <button
            onClick={logout}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <SafeIcon icon={FiLogOut} className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;