import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import toast from 'react-hot-toast';

const { FiEye, FiChevronDown, FiUser, FiTruck, FiUsers, FiUserCheck, FiRotateCcw } = FiIcons;

const AdminViewSwitcher = () => {
  const { user, viewAsRole, switchViewTo, resetView, isAdmin } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  // Only show for admin users
  if (!isAdmin) return null;

  const viewOptions = [
    { 
      value: 'admin', 
      label: 'Admin View', 
      icon: FiUserCheck,
      description: 'Full administrative access'
    },
    { 
      value: 'driver', 
      label: 'Driver View', 
      icon: FiTruck,
      description: 'Driver mobile interface'
    },
    { 
      value: 'office_staff', 
      label: 'Office Staff View', 
      icon: FiUsers,
      description: 'Office management tools'
    },
    { 
      value: 'customer', 
      label: 'Customer View', 
      icon: FiUser,
      description: 'Customer portal experience'
    }
  ];

  const currentView = viewAsRole || 'admin';
  const currentOption = viewOptions.find(opt => opt.value === currentView);

  const handleViewChange = (role) => {
    setIsOpen(false);
    
    if (role === 'admin') {
      resetView();
      toast.success('Switched back to Admin view');
    } else {
      switchViewTo(role);
      const roleLabel = viewOptions.find(opt => opt.value === role)?.label;
      toast.success(`Switched to ${roleLabel}`);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-colors ${
          viewAsRole 
            ? 'bg-yellow-50 border-yellow-200 text-yellow-800 hover:bg-yellow-100' 
            : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
        }`}
      >
        <SafeIcon icon={FiEye} className="w-4 h-4" />
        <span className="text-sm font-medium">
          {viewAsRole ? `Viewing as: ${currentOption?.label}` : 'Admin View'}
        </span>
        <SafeIcon icon={FiChevronDown} className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
          >
            <div className="p-2">
              <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-100 mb-2">
                View as Role
              </div>
              
              {viewOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleViewChange(option.value)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left transition-colors ${
                    currentView === option.value
                      ? 'bg-primary-50 text-primary-700'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <SafeIcon icon={option.icon} className="w-4 h-4" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{option.label}</p>
                    <p className="text-xs text-gray-500">{option.description}</p>
                  </div>
                  {currentView === option.value && (
                    <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                  )}
                </button>
              ))}

              {viewAsRole && (
                <div className="border-t border-gray-100 mt-2 pt-2">
                  <button
                    onClick={() => handleViewChange('admin')}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-md"
                  >
                    <SafeIcon icon={FiRotateCcw} className="w-4 h-4" />
                    <span>Return to Admin View</span>
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminViewSwitcher;