import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import LocationForm from './LocationForm';
import LocationList from './LocationList';
import toast from 'react-hot-toast';

const { FiPlus, FiMapPin, FiSearch, FiFilter, FiSettings } = FiIcons;

const LocationManagement = () => {
  const { user } = useAuth();
  const [locations, setLocations] = useState([
    {
      id: 1,
      name: 'Main Office',
      type: 'office',
      address: '123 Business Street',
      city: 'Business City',
      state: 'CA',
      zipCode: '12345',
      phone: '(555) 123-4567',
      email: 'main@binhaulerpro.com',
      manager: 'John Smith',
      operatingHours: '8:00 AM - 5:00 PM',
      status: 'active',
      coordinates: { lat: 40.7128, lng: -74.0060 },
      notes: 'Primary business location with customer service'
    },
    {
      id: 2,
      name: 'North Warehouse',
      type: 'warehouse',
      address: '456 Industrial Blvd',
      city: 'Industrial Park',
      state: 'CA',
      zipCode: '12346',
      phone: '(555) 123-4568',
      email: 'north@binhaulerpro.com',
      manager: 'Sarah Johnson',
      operatingHours: '6:00 AM - 6:00 PM',
      status: 'active',
      coordinates: { lat: 40.7589, lng: -73.9851 },
      notes: 'Main equipment storage and dispatch center'
    },
    {
      id: 3,
      name: 'Downtown Service Area',
      type: 'service_area',
      address: '789 Central Ave',
      city: 'Downtown',
      state: 'CA',
      zipCode: '12347',
      phone: '(555) 123-4569',
      email: 'downtown@binhaulerpro.com',
      manager: 'Mike Rodriguez',
      operatingHours: '24/7',
      status: 'active',
      coordinates: { lat: 40.7505, lng: -73.9934 },
      notes: 'High-demand urban service coverage area'
    }
  ]);

  const [showLocationForm, setShowLocationForm] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const maxLocations = 50;

  // Only allow admin access
  if (user?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <SafeIcon icon={FiMapPin} className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700">Access Denied</h3>
          <p className="text-gray-500">Only administrators can manage locations.</p>
        </div>
      </div>
    );
  }

  const filteredLocations = locations.filter(location => {
    const matchesSearch = location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || location.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || location.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleAddLocation = (locationData) => {
    if (locations.length >= maxLocations) {
      toast.error(`Maximum ${maxLocations} locations allowed`);
      return;
    }

    const newLocation = {
      ...locationData,
      id: Date.now()
    };
    setLocations(prev => [...prev, newLocation]);
    toast.success('Location added successfully');
  };

  const handleUpdateLocation = (id, updates) => {
    setLocations(prev =>
      prev.map(location =>
        location.id === id ? { ...location, ...updates } : location
      )
    );
    toast.success('Location updated successfully');
  };

  const handleDeleteLocation = (id) => {
    setLocations(prev => prev.filter(location => location.id !== id));
    toast.success('Location deleted successfully');
  };

  const handleEditLocation = (location) => {
    setSelectedLocation(location);
    setShowLocationForm(true);
  };

  const handleCloseForm = () => {
    setShowLocationForm(false);
    setSelectedLocation(null);
  };

  const getLocationStats = () => {
    const total = locations.length;
    const active = locations.filter(l => l.status === 'active').length;
    const inactive = locations.filter(l => l.status === 'inactive').length;
    const remaining = maxLocations - total;

    return { total, active, inactive, remaining };
  };

  const stats = getLocationStats();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Location Management</h1>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowLocationForm(true)}
          disabled={locations.length >= maxLocations}
          className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          <SafeIcon icon={FiPlus} className="w-5 h-5" />
          <span>Add Location</span>
        </motion.button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Locations</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-sm text-blue-600">of {maxLocations} allowed</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <SafeIcon icon={FiMapPin} className="w-6 h-6 text-blue-600" />
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
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-3xl font-bold text-green-600">{stats.active}</p>
              <p className="text-sm text-green-600">Currently operating</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <SafeIcon icon={FiMapPin} className="w-6 h-6 text-green-600" />
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
              <p className="text-sm font-medium text-gray-600">Inactive</p>
              <p className="text-3xl font-bold text-red-600">{stats.inactive}</p>
              <p className="text-sm text-red-600">Temporarily closed</p>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <SafeIcon icon={FiMapPin} className="w-6 h-6 text-red-600" />
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
              <p className="text-sm font-medium text-gray-600">Remaining</p>
              <p className="text-3xl font-bold text-purple-600">{stats.remaining}</p>
              <p className="text-sm text-purple-600">Available slots</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <SafeIcon icon={FiPlus} className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 mb-6">
          <div className="relative flex-1 max-w-md">
            <SafeIcon icon={FiSearch} className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiFilter} className="w-5 h-5 text-gray-400" />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="office">Office</option>
                <option value="warehouse">Warehouse</option>
                <option value="service_area">Service Area</option>
                <option value="depot">Depot</option>
                <option value="facility">Facility</option>
                <option value="yard">Yard</option>
                <option value="branch">Branch</option>
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
              <option value="maintenance">Maintenance</option>
            </select>
            
            <div className="text-sm text-gray-500">
              {filteredLocations.length} locations
            </div>
          </div>
        </div>

        <LocationList
          locations={filteredLocations}
          onEditLocation={handleEditLocation}
          onDeleteLocation={handleDeleteLocation}
        />
      </div>

      {/* Location Form Modal */}
      {showLocationForm && (
        <LocationForm
          location={selectedLocation}
          onClose={handleCloseForm}
          onSave={selectedLocation ? handleUpdateLocation : handleAddLocation}
          maxReached={locations.length >= maxLocations}
        />
      )}

      {/* Info Panel */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-800 mb-2">Location Management Info:</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Manage up to {maxLocations} business locations including offices, warehouses, and service areas</li>
          <li>• Each location can have contact information, operating hours, and GPS coordinates</li>
          <li>• Use locations for job assignment, routing optimization, and service area management</li>
          <li>• Inactive locations are retained for historical data but not used for new operations</li>
        </ul>
      </div>
    </div>
  );
};

export default LocationManagement;