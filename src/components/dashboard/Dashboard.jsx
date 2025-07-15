import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import StatsCard from './StatsCard';
import RecentJobs from './RecentJobs';
import QuickActions from './QuickActions';

const { FiTruck, FiUsers, FiCalendar, FiDollarSign, FiTrendingUp, FiMapPin, FiCheckCircle, FiClock } = FiIcons;

const Dashboard = () => {
  const { effectiveUser, effectiveRole } = useAuth();
  const { customers, jobs, dumpsters, drivers } = useData();

  const getStats = () => {
    if (effectiveRole === 'driver') {
      return [
        { title: 'Today\'s Jobs', value: '5', icon: FiCalendar, color: 'blue' },
        { title: 'Completed', value: '3', icon: FiCheckCircle, color: 'green' },
        { title: 'Pending', value: '2', icon: FiClock, color: 'yellow' },
        { title: 'Miles Driven', value: '127', icon: FiTrendingUp, color: 'purple' }
      ];
    }

    return [
      { title: 'Active Jobs', value: jobs.length.toString(), icon: FiTruck, color: 'blue' },
      { title: 'Total Customers', value: customers.length.toString(), icon: FiUsers, color: 'green' },
      { title: 'Available Dumpsters', value: dumpsters.filter(d => d.status === 'available').length.toString(), icon: FiMapPin, color: 'yellow' },
      { title: 'Monthly Revenue', value: '$45,680', icon: FiDollarSign, color: 'purple' }
    ];
  };

  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    let greeting = 'Good morning';
    if (hour >= 12 && hour < 18) {
      greeting = 'Good afternoon';
    } else if (hour >= 18) {
      greeting = 'Good evening';
    }
    return `${greeting}, ${effectiveUser?.name}!`;
  };

  const getRoleSpecificContent = () => {
    switch (effectiveRole) {
      case 'admin':
        return (
          <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-primary-800 mb-2">Admin Overview</h3>
            <p className="text-primary-700">
              Welcome to your administrative dashboard. You have full access to all system features including user management, reports, and system settings.
            </p>
          </div>
        );
      case 'office_staff':
        return (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">Office Staff Dashboard</h3>
            <p className="text-blue-700">
              Manage customers, schedule jobs, and track dumpster locations. You can view reports and handle day-to-day operations.
            </p>
          </div>
        );
      case 'driver':
        return (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-green-800 mb-2">Driver Dashboard</h3>
            <p className="text-green-700">
              View your assigned jobs, update job status, and track your daily progress. Use the Driver App for mobile-optimized workflow.
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{getWelcomeMessage()}</h1>
          <p className="text-gray-600 mt-1">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {getRoleSpecificContent()}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {getStats().map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <StatsCard {...stat} />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentJobs />
        </div>
        <div>
          <QuickActions />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;