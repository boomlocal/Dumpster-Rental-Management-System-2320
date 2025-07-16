```jsx
import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { 
  FiInfo, 
  FiCheckCircle, 
  FiAlertTriangle, 
  FiXCircle,
  FiClock,
  FiUser,
  FiMonitor
} = FiIcons;

const ActivityLogs = ({ logs }) => {
  const getLevelIcon = (level) => {
    switch (level) {
      case 'success':
        return FiCheckCircle;
      case 'warning':
        return FiAlertTriangle;
      case 'error':
        return FiXCircle;
      default:
        return FiInfo;
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'success':
        return 'text-green-600 bg-green-50';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50';
      case 'error':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-blue-600 bg-blue-50';
    }
  };

  if (!logs || logs.length === 0) {
    return (
      <div className="text-center py-8 bg-white rounded-lg shadow-sm border border-gray-200">
        <SafeIcon icon={FiInfo} className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">No activity logs found</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Activity Logs</h3>
      </div>
      <div className="divide-y divide-gray-200">
        {logs.map((log) => (
          <motion.div
            key={log.id}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-lg ${getLevelColor(log.level)}`}>
                <SafeIcon icon={getLevelIcon(log.level)} className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-gray-900">{log.action}</span>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <SafeIcon icon={FiClock} className="w-4 h-4" />
                    <span>{new Date(log.timestamp).toLocaleString()}</span>
                  </div>
                </div>
                <p className="text-gray-600 mb-2">{log.message}</p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <SafeIcon icon={FiUser} className="w-4 h-4" />
                    <span>{log.userName || 'System'} ({log.userRole || 'system'})</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <SafeIcon icon={FiMonitor} className="w-4 h-4" />
                    <span>{log.ipAddress}</span>
                  </div>
                </div>
                {log.details && (
                  <div className="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-600 font-mono">
                    <pre className="whitespace-pre-wrap">
                      {JSON.stringify(log.details, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ActivityLogs;
```