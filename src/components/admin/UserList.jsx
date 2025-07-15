import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiEdit, FiTrash2, FiMail, FiPhone, FiUser, FiUserCheck, FiShield } = FiIcons;

const UserList = ({ users, onEditUser, onDeleteUser, currentUserId }) => {
  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800 border-red-200';
      case 'office_staff': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'driver': return 'bg-green-100 text-green-800 border-green-200';
      case 'customer': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'suspended': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
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

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin': return FiShield;
      case 'office_staff': return FiUserCheck;
      case 'driver': return FiUser;
      case 'customer': return FiUser;
      default: return FiUser;
    }
  };

  if (users.length === 0) {
    return (
      <div className="text-center py-12">
        <SafeIcon icon={FiUser} className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">No users found</p>
        <p className="text-gray-400 text-sm">Try adjusting your search filters</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {users.map((user, index) => (
        <motion.div
          key={user.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-4 mb-3">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <SafeIcon 
                    icon={getRoleIcon(user.role)} 
                    className="w-6 h-6 text-primary-600" 
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {user.name}
                      {user.id === currentUserId && (
                        <span className="ml-2 text-sm text-primary-600 font-normal">(You)</span>
                      )}
                    </h3>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getRoleColor(user.role)}`}>
                      {getRoleDisplayName(user.role)}
                    </span>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(user.status)}`}>
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-6 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <SafeIcon icon={FiMail} className="w-4 h-4" />
                      <span>{user.email}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <SafeIcon icon={FiPhone} className="w-4 h-4" />
                      <span>{user.phone}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Created: {user.createdAt?.toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onEditUser(user)}
                className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                title="Edit User"
              >
                <SafeIcon icon={FiEdit} className="w-5 h-5" />
              </button>
              {user.id !== currentUserId && (
                <button
                  onClick={() => onDeleteUser(user.id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete User"
                >
                  <SafeIcon icon={FiTrash2} className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default UserList;