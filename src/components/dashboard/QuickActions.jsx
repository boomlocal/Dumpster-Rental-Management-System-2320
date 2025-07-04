import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiPlus, FiCalendar, FiMapPin, FiUsers, FiTruck, FiBarChart3 } = FiIcons;

const QuickActions = () => {
  const { effectiveRole } = useAuth();
  const navigate = useNavigate();

  const getActions = () => {
    if (effectiveRole === 'driver') {
      return [
        { title: 'View My Jobs', icon: FiTruck, action: () => navigate('/driver') },
        { title: 'Update Location', icon: FiMapPin, action: () => navigate('/tracking') }
      ];
    }

    return [
      { title: 'New Job', icon: FiPlus, action: () => navigate('/jobs') },
      { title: 'Schedule Pickup', icon: FiCalendar, action: () => navigate('/scheduling') },
      { title: 'Track Dumpsters', icon: FiMapPin, action: () => navigate('/tracking') },
      { title: 'Add Customer', icon: FiUsers, action: () => navigate('/customers') },
      { title: 'View Reports', icon: FiBarChart3, action: () => navigate('/reports') }
    ];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
      <div className="space-y-3">
        {getActions().map((action, index) => (
          <motion.button
            key={action.title}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={action.action}
            className="w-full flex items-center space-x-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <div className="flex-shrink-0">
              <SafeIcon icon={action.icon} className="w-5 h-5 text-primary-600" />
            </div>
            <span className="font-medium text-gray-900">{action.title}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default QuickActions;