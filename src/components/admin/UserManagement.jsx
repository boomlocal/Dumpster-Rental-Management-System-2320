import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import UserForm from './UserForm';
import UserList from './UserList';
import toast from 'react-hot-toast';

const { FiPlus, FiUsers, FiSearch, FiFilter, FiUserPlus } = FiIcons;

const UserManagement = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'John Admin',
      email: 'admin@binhaulerpro.com',
      role: 'admin',
      status: 'active',
      phone: '555-0001',
      createdAt: new Date('2024-01-01')
    },
    {
      id: 2,
      name: 'Jane Office',
      email: 'office@binhaulerpro.com',
      role: 'office_staff',
      status: 'active',
      phone: '555-0002',
      createdAt: new Date('2024-01-02')
    },
    {
      id: 3,
      name: 'Mike Driver',
      email: 'driver@binhaulerpro.com',
      role: 'driver',
      status: 'active',
      phone: '555-0003',
      createdAt: new Date('2024-01-03')
    },
    {
      id: 4,
      name: 'Sarah Customer',
      email: 'customer@binhaulerpro.com',
      role: 'customer',
      status: 'active',
      phone: '555-0004',
      createdAt: new Date('2024-01-04')
    }
  ]);

  const [showUserForm, setShowUserForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Only admins can access this component
  if (user?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <SafeIcon icon={FiUsers} className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700">Access Denied</h3>
          <p className="text-gray-500">Only administrators can manage users.</p>
        </div>
      </div>
    );
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.phone.includes(searchTerm);
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleAddUser = (userData) => {
    // Check if email already exists
    const emailExists = users.some(existingUser => 
      existingUser.email.toLowerCase() === userData.email.toLowerCase()
    );
    
    if (emailExists) {
      toast.error('A user with this email address already exists');
      return;
    }

    const newUser = {
      ...userData,
      id: Date.now(),
      createdAt: new Date(),
      status: userData.status || 'active'
    };
    
    setUsers(prev => [...prev, newUser]);
    toast.success(`User "${userData.name}" created successfully`);
    setShowUserForm(false);
  };

  const handleUpdateUser = (id, updates) => {
    // Check if email already exists (excluding current user)
    if (updates.email) {
      const emailExists = users.some(existingUser => 
        existingUser.id !== id && 
        existingUser.email.toLowerCase() === updates.email.toLowerCase()
      );
      
      if (emailExists) {
        toast.error('A user with this email address already exists');
        return;
      }
    }

    setUsers(prev =>
      prev.map(user =>
        user.id === id ? { ...user, ...updates } : user
      )
    );
    toast.success('User updated successfully');
    setShowUserForm(false);
    setSelectedUser(null);
  };

  const handleDeleteUser = (id) => {
    // Prevent deleting the current admin user
    if (id === user?.id) {
      toast.error('You cannot delete your own account');
      return;
    }

    const userToDelete = users.find(u => u.id === id);
    setUsers(prev => prev.filter(user => user.id !== id));
    toast.success(`User "${userToDelete?.name}" deleted successfully`);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowUserForm(true);
  };

  const handleCloseForm = () => {
    setShowUserForm(false);
    setSelectedUser(null);
  };

  const getUserStats = () => {
    const total = users.length;
    const active = users.filter(u => u.status === 'active').length;
    const inactive = users.filter(u => u.status === 'inactive').length;
    const byRole = {
      admin: users.filter(u => u.role === 'admin').length,
      office_staff: users.filter(u => u.role === 'office_staff').length,
      driver: users.filter(u => u.role === 'driver').length,
      customer: users.filter(u => u.role === 'customer').length
    };
    return { total, active, inactive, byRole };
  };

  const stats = getUserStats();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowUserForm(true)}
          className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 flex items-center space-x-2 shadow-md"
        >
          <SafeIcon icon={FiUserPlus} className="w-5 h-5" />
          <span>Add New User</span>
        </motion.button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-sm text-gray-500">All system users</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <SafeIcon icon={FiUsers} className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-3xl font-bold text-green-600">{stats.active}</p>
              <p className="text-sm text-green-600">Currently enabled</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <SafeIcon icon={FiUsers} className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Administrators</p>
              <p className="text-3xl font-bold text-red-600">{stats.byRole.admin}</p>
              <p className="text-sm text-red-600">Admin users</p>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <SafeIcon icon={FiUserPlus} className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Staff & Drivers</p>
              <p className="text-3xl font-bold text-purple-600">
                {stats.byRole.office_staff + stats.byRole.driver}
              </p>
              <p className="text-sm text-purple-600">Internal users</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <SafeIcon icon={FiUsers} className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters and User List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 mb-6">
          <div className="relative flex-1 max-w-md">
            <SafeIcon icon={FiSearch} className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiFilter} className="w-5 h-5 text-gray-400" />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="office_staff">Office Staff</option>
                <option value="driver">Driver</option>
                <option value="customer">Customer</option>
              </select>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
            <div className="text-sm text-gray-500">
              {filteredUsers.length} users
            </div>
          </div>
        </div>

        <UserList
          users={filteredUsers}
          onEditUser={handleEditUser}
          onDeleteUser={handleDeleteUser}
          currentUserId={user?.id}
        />
      </div>

      {/* User Form Modal */}
      {showUserForm && (
        <UserForm
          user={selectedUser}
          onClose={handleCloseForm}
          onSave={selectedUser ? handleUpdateUser : handleAddUser}
        />
      )}

      {/* Info Panel */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-800 mb-2">User Management Info:</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Create and manage user accounts for all system roles</li>
          <li>• Assign appropriate permissions: Admin, Office Staff, Driver, Customer</li>
          <li>• Monitor user activity and manage account status</li>
          <li>• Email addresses must be unique across all users</li>
          <li>• Password requirements: minimum 6 characters for new users</li>
        </ul>
      </div>
    </div>
  );
};

export default UserManagement;