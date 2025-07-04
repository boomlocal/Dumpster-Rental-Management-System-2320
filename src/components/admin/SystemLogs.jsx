import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { format } from 'date-fns';

const { 
  FiSearch, FiFilter, FiDownload, FiRefreshCw, FiEye, FiUser, 
  FiTruck, FiMapPin, FiHome, FiUsers, FiSettings, FiAlertTriangle,
  FiCheckCircle, FiInfo, FiX, FiCalendar
} = FiIcons;

const SystemLogs = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [filters, setFilters] = useState({
    category: 'all',
    level: 'all',
    dateRange: 'today',
    startDate: '',
    endDate: '',
    search: '',
    userId: 'all'
  });
  const [loading, setLoading] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);

  // Only allow admin access
  if (user?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <SafeIcon icon={FiSettings} className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700">Access Denied</h3>
          <p className="text-gray-500">Only administrators can view system logs.</p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    loadSystemLogs();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [logs, filters]);

  const loadSystemLogs = async () => {
    setLoading(true);
    try {
      // Mock system logs data
      const mockLogs = [
        {
          id: 1,
          timestamp: new Date(),
          level: 'info',
          category: 'customer',
          action: 'Customer Created',
          message: 'New customer "ABC Construction" created by John Admin',
          userId: 1,
          userName: 'John Admin',
          userRole: 'admin',
          details: {
            customerId: 1,
            customerName: 'ABC Construction',
            email: 'contact@abc.com',
            phone: '555-0101'
          },
          ipAddress: '192.168.1.100',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        {
          id: 2,
          timestamp: new Date(Date.now() - 1000 * 60 * 30),
          level: 'success',
          category: 'job_site',
          action: 'Job Completed',
          message: 'Job #1001 completed by Mike Driver',
          userId: 3,
          userName: 'Mike Driver',
          userRole: 'driver',
          details: {
            jobId: 1001,
            customerId: 1,
            location: '123 Main St, New York, NY',
            dumpsterSize: '20 yard',
            completionTime: '14:30'
          },
          ipAddress: '192.168.1.105',
          userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)'
        },
        {
          id: 3,
          timestamp: new Date(Date.now() - 1000 * 60 * 45),
          level: 'warning',
          category: 'driver',
          action: 'GPS Tracking Lost',
          message: 'GPS signal lost for driver Mike Driver',
          userId: 3,
          userName: 'Mike Driver',
          userRole: 'driver',
          details: {
            lastKnownLocation: '40.7128, -74.0060',
            duration: '5 minutes',
            reason: 'Signal timeout'
          },
          ipAddress: '192.168.1.105',
          userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)'
        },
        {
          id: 4,
          timestamp: new Date(Date.now() - 1000 * 60 * 60),
          level: 'info',
          category: 'facility',
          action: 'Dumpster Maintenance',
          message: 'Dumpster #D001 marked for maintenance',
          userId: 2,
          userName: 'Jane Office',
          userRole: 'office_staff',
          details: {
            dumpsterId: 'D001',
            issue: 'Hydraulic leak detected',
            priority: 'high',
            assignedTo: 'Maintenance Team'
          },
          ipAddress: '192.168.1.102',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        {
          id: 5,
          timestamp: new Date(Date.now() - 1000 * 60 * 90),
          level: 'error',
          category: 'other',
          action: 'Payment Failed',
          message: 'Payment processing failed for invoice INV-1001',
          userId: null,
          userName: 'System',
          userRole: 'system',
          details: {
            invoiceId: 'INV-1001',
            amount: 399.00,
            customerId: 1,
            errorCode: 'CARD_DECLINED',
            gateway: 'Stripe'
          },
          ipAddress: 'system',
          userAgent: 'System Process'
        },
        {
          id: 6,
          timestamp: new Date(Date.now() - 1000 * 60 * 120),
          level: 'info',
          category: 'customer',
          action: 'Login Attempt',
          message: 'Customer portal login by Sarah Customer',
          userId: 4,
          userName: 'Sarah Customer',
          userRole: 'customer',
          details: {
            loginMethod: 'email_password',
            success: true,
            sessionId: 'sess_abc123'
          },
          ipAddress: '192.168.1.150',
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        }
      ];

      setLogs(mockLogs);
    } catch (error) {
      console.error('Error loading system logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...logs];

    // Category filter
    if (filters.category !== 'all') {
      filtered = filtered.filter(log => log.category === filters.category);
    }

    // Level filter
    if (filters.level !== 'all') {
      filtered = filtered.filter(log => log.level === filters.level);
    }

    // Date range filter
    const now = new Date();
    if (filters.dateRange !== 'all') {
      const startDate = new Date();
      switch (filters.dateRange) {
        case 'today':
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          startDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(now.getMonth() - 1);
          break;
        case 'custom':
          if (filters.startDate) {
            const customStart = new Date(filters.startDate);
            filtered = filtered.filter(log => log.timestamp >= customStart);
          }
          if (filters.endDate) {
            const customEnd = new Date(filters.endDate);
            customEnd.setHours(23, 59, 59, 999);
            filtered = filtered.filter(log => log.timestamp <= customEnd);
          }
          break;
        default:
          break;
      }

      if (filters.dateRange !== 'custom') {
        filtered = filtered.filter(log => log.timestamp >= startDate);
      }
    }

    // User filter
    if (filters.userId !== 'all') {
      filtered = filtered.filter(log => log.userId === parseInt(filters.userId));
    }

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(log =>
        log.message.toLowerCase().includes(searchTerm) ||
        log.action.toLowerCase().includes(searchTerm) ||
        log.userName.toLowerCase().includes(searchTerm)
      );
    }

    // Sort by timestamp (newest first)
    filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    setFilteredLogs(filtered);
  };

  const getLevelIcon = (level) => {
    switch (level) {
      case 'error': return FiX;
      case 'warning': return FiAlertTriangle;
      case 'success': return FiCheckCircle;
      case 'info':
      default: return FiInfo;
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'error': return 'text-red-600 bg-red-50';
      case 'warning': return 'text-yellow-600 bg-yellow-50';
      case 'success': return 'text-green-600 bg-green-50';
      case 'info':
      default: return 'text-blue-600 bg-blue-50';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'customer': return FiUsers;
      case 'job_site': return FiMapPin;
      case 'facility': return FiHome;
      case 'driver': return FiTruck;
      case 'other':
      default: return FiSettings;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'customer': return 'bg-purple-100 text-purple-800';
      case 'job_site': return 'bg-blue-100 text-blue-800';
      case 'facility': return 'bg-green-100 text-green-800';
      case 'driver': return 'bg-orange-100 text-orange-800';
      case 'other':
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const exportLogs = () => {
    const csvContent = [
      ['Timestamp', 'Level', 'Category', 'Action', 'User', 'Message', 'IP Address'].join(','),
      ...filteredLogs.map(log => [
        log.timestamp.toISOString(),
        log.level,
        log.category,
        log.action,
        log.userName,
        `"${log.message}"`,
        log.ipAddress
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `system-logs-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const users = [
    { id: 1, name: 'John Admin', role: 'admin' },
    { id: 2, name: 'Jane Office', role: 'office_staff' },
    { id: 3, name: 'Mike Driver', role: 'driver' },
    { id: 4, name: 'Sarah Customer', role: 'customer' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">System Logs</h1>
        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-500">
            {filteredLogs.length} entries
          </span>
          <button
            onClick={loadSystemLogs}
            className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <SafeIcon icon={FiRefreshCw} className="w-4 h-4" />
            <span>Refresh</span>
          </button>
          <button
            onClick={exportLogs}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 flex items-center space-x-2"
          >
            <SafeIcon icon={FiDownload} className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-4">
          {/* Search */}
          <div className="xl:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <div className="relative">
              <SafeIcon icon={FiSearch} className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Search logs..."
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">Show All</option>
              <option value="customer">Customer</option>
              <option value="job_site">Job Site</option>
              <option value="facility">Facility</option>
              <option value="driver">Driver</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Level Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Level
            </label>
            <select
              value={filters.level}
              onChange={(e) => setFilters(prev => ({ ...prev, level: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Levels</option>
              <option value="info">Info</option>
              <option value="success">Success</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
            </select>
          </div>

          {/* User Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              User
            </label>
            <select
              value={filters.userId}
              onChange={(e) => setFilters(prev => ({ ...prev, userId: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Users</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.role})
                </option>
              ))}
              <option value="null">System</option>
            </select>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date Range
            </label>
            <select
              value={filters.dateRange}
              onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>
        </div>

        {/* Custom Date Range */}
        {filters.dateRange === 'custom' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
        )}
      </div>

      {/* Logs List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="text-center py-12">
            <SafeIcon icon={FiSettings} className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No logs found</p>
            <p className="text-gray-400 text-sm">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredLogs.map((log, index) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.02 }}
                className="p-6 hover:bg-gray-50 cursor-pointer"
                onClick={() => setSelectedLog(log)}
              >
                <div className="flex items-start space-x-4">
                  {/* Level Icon */}
                  <div className={`p-2 rounded-lg ${getLevelColor(log.level)}`}>
                    <SafeIcon icon={getLevelIcon(log.level)} className="w-4 h-4" />
                  </div>

                  {/* Log Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {log.action}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(log.category)}`}>
                        <SafeIcon icon={getCategoryIcon(log.category)} className="w-3 h-3 inline mr-1" />
                        {log.category.replace('_', ' ')}
                      </span>
                    </div>
                    
                    <p className="text-gray-700 mb-2">{log.message}</p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <SafeIcon icon={FiUser} className="w-4 h-4" />
                        <span>{log.userName} ({log.userRole})</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <SafeIcon icon={FiCalendar} className="w-4 h-4" />
                        <span>{format(log.timestamp, 'MMM dd, yyyy HH:mm:ss')}</span>
                      </div>
                    </div>
                  </div>

                  {/* View Details Button */}
                  <button className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                    <SafeIcon icon={FiEye} className="w-4 h-4" />
                    <span>Details</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Log Details Modal */}
      {selectedLog && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedLog(null)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">Log Details</h2>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-gray-400 hover:text-gray-600 p-2"
              >
                <SafeIcon icon={FiX} className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Action
                  </label>
                  <p className="text-gray-900">{selectedLog.action}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Level
                  </label>
                  <span className={`inline-flex items-center px-2 py-1 text-sm font-medium rounded-full ${getLevelColor(selectedLog.level)}`}>
                    <SafeIcon icon={getLevelIcon(selectedLog.level)} className="w-4 h-4 mr-1" />
                    {selectedLog.level}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <span className={`inline-flex items-center px-2 py-1 text-sm font-medium rounded-full ${getCategoryColor(selectedLog.category)}`}>
                    <SafeIcon icon={getCategoryIcon(selectedLog.category)} className="w-4 h-4 mr-1" />
                    {selectedLog.category.replace('_', ' ')}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Timestamp
                  </label>
                  <p className="text-gray-900">{format(selectedLog.timestamp, 'MMM dd, yyyy HH:mm:ss')}</p>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedLog.message}</p>
              </div>

              {/* User Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    User
                  </label>
                  <p className="text-gray-900">{selectedLog.userName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <p className="text-gray-900">{selectedLog.userRole}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    IP Address
                  </label>
                  <p className="text-gray-900 font-mono text-sm">{selectedLog.ipAddress}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    User Agent
                  </label>
                  <p className="text-gray-900 text-sm truncate" title={selectedLog.userAgent}>
                    {selectedLog.userAgent}
                  </p>
                </div>
              </div>

              {/* Details */}
              {selectedLog.details && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Details
                  </label>
                  <pre className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg overflow-x-auto">
                    {JSON.stringify(selectedLog.details, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default SystemLogs;