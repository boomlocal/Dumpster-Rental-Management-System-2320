import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import UserForm from './UserForm';
import UserList from './UserList';
import DeleteButton from '../common/DeleteButton';
import toast from 'react-hot-toast';

const { FiPlus, FiUsers, FiSearch, FiFilter } = FiIcons;

const UserManagement = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'John Admin',
      email: 'admin@binhaulerpro.com',
      phone: '(555) 123-4567',
      role: 'admin',
      status: 'active',
      createdAt: new Date('2023-12-01')
    },
    {
      id: 2,
      name: 'Jane Office',
      email: 'office@binhaulerpro.com',
      phone: '(555) 234-5678',
      role: 'office_staff',
      status: 'active',
      createdAt: new Date('2023-12-15')
    },
    {
      id: 3,
      name: 'Mike Driver',
      email: 'driver@binhaulerpro.com',
      phone: '(555) 345-6789',
      role: 'driver',
      status: 'active',
      createdAt: new Date('2023-12-20')
    },
    {
      id: 4,
      name: 'Sarah Customer',
      email: 'customer@binhaulerpro.com',
      phone: '(555) 456-7890',
      role: 'customer',
      status: 'active',
      createdAt: new Date('2023-12-25')
    }
  ]);
  
  const [showUserForm, setShowUserForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Filter users based on search term and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Add a new user
  const handleAddUser = (userData) => {
    const newUser = {
      ...userData,
      id: Date.now(),
      createdAt: new Date()
    };
    setUsers(prev => [...prev, newUser]);
    setShowUserForm(false);
    toast.success('User added successfully');
  };

  // Update an existing user
  const handleUpdateUser = (id, updates) => {
    setUsers(prev => 
      prev.map(user => user.id === id ? { ...user, ...updates } : user)
    );
    setShowUserForm(false);
    setSelectedUser(null);
    toast.success('User updated successfully');
  };

  // Delete a user
  const handleDeleteUser = (userId) => {
    // Prevent deleting own account
    if (userId === user.id) {
      toast.error('You cannot delete your own account');
      return;
    }
    
    setUsers(prev => prev.filter(user => user.id !== userId));
    toast.success('User deleted successfully');
  };

  // Edit a user
  const handleEditUser = (userToEdit) => {
    setSelectedUser(userToEdit);
    setShowUserForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowUserForm(true)}
          className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 flex items-center space-x-2"
        >
          <SafeIcon icon={FiPlus} className="w-5 h-5" />
          <span>Add User</span>
        </motion.button>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {/* Filters */}
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
          </div>
        </div>
        
        {/* User List */}
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
          onClose={() => {
            setShowUserForm(false);
            setSelectedUser(null);
          }}
          onSave={selectedUser ? handleUpdateUser : handleAddUser}
        />
      )}
    </div>
  );
};

export default UserManagement;