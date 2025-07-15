```jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import toast from 'react-hot-toast';

const { 
  FiX, 
  FiSave, 
  FiPackage, 
  FiMapPin, 
  FiCalendar, 
  FiDollarSign,
  FiFileText,
  FiSettings,
  FiTool,
  FiNavigation,
  FiCamera,
  FiTrash2
} = FiIcons;

const AssetForm = ({ asset, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    assetNumber: asset?.assetNumber || '',
    type: asset?.type || 'roll-off',
    containerSize: asset?.containerSize || '20',
    containerUnit: asset?.containerUnit || 'yard',
    status: asset?.status || 'available',
    condition: asset?.condition || 'excellent',
    purchaseDate: asset?.purchaseDate || '',
    purchasePrice: asset?.purchasePrice || '',
    currentValue: asset?.currentValue || '',
    manufacturer: asset?.manufacturer || '',
    model: asset?.model || '',
    serialNumber: asset?.serialNumber || '',
    location: {
      type: asset?.location?.type || 'yard',
      address: asset?.location?.address || '',
      coordinates: asset?.location?.coordinates || { lat: '', lng: '' }
    },
    lastInspection: asset?.lastInspection || '',
    nextInspection: asset?.nextInspection || '',
    maintenanceNotes: asset?.maintenanceNotes || '',
    notes: asset?.notes || ''
  });

  const [errors, setErrors] = useState({});
  const [photos, setPhotos] = useState(asset?.photos || []);

  const assetTypes = [
    { value: 'roll-off', label: 'Roll-off Dumpster' },
    { value: 'front-load', label: 'Front Load Container' },
    { value: 'rear-load', label: 'Rear Load Container' },
    { value: 'compactor', label: 'Compactor' },
    { value: 'trailer', label: 'Trailer' },
    { value: 'truck', label: 'Truck' },
    { value: 'equipment', label: 'Equipment' },
    { value: 'other', label: 'Other' }
  ];

  const containerSizes = [
    { value: '6', label: '6' },
    { value: '10', label: '10' },
    { value: '12', label: '12' },
    { value: '14', label: '14' },
    { value: '15', label: '15' },
    { value: '20', label: '20' },
    { value: '30', label: '30' },
    { value: '40', label: '40' }
  ];

  const containerUnits = [
    { value: 'yard', label: 'Yard' },
    { value: 'cubic-yard', label: 'Cubic Yard' },
    { value: 'ton', label: 'Ton' },
    { value: 'gallon', label: 'Gallon' }
  ];

  const statusOptions = [
    { value: 'available', label: 'Available', color: 'text-green-600' },
    { value: 'deployed', label: 'Deployed', color: 'text-blue-600' },
    { value: 'in-transit', label: 'In Transit', color: 'text-yellow-600' },
    { value: 'maintenance', label: 'Maintenance', color: 'text-red-600' },
    { value: 'out-of-service', label: 'Out of Service', color: 'text-gray-600' },
    { value: 'retired', label: 'Retired', color: 'text-gray-400' }
  ];

  const conditionOptions = [
    { value: 'excellent', label: 'Excellent' },
    { value: 'good', label: 'Good' },
    { value: 'fair', label: 'Fair' },
    { value: 'poor', label: 'Poor' },
    { value: 'needs-repair', label: 'Needs Repair' }
  ];

  const locationTypes = [
    { value: 'yard', label: 'Yard' },
    { value: 'customer', label: 'Customer Site' },
    { value: 'depot', label: 'Depot' },
    { value: 'maintenance', label: 'Maintenance Facility' },
    { value: 'transit', label: 'In Transit' }
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.assetNumber.trim()) {
      newErrors.assetNumber = 'Asset number is required';
    }

    if (!formData.type) {
      newErrors.type = 'Asset type is required';
    }

    if (!formData.containerSize) {
      newErrors.containerSize = 'Container size is required';
    }

    if (formData.purchasePrice && isNaN(formData.purchasePrice)) {
      newErrors.purchasePrice = 'Purchase price must be a number';
    }

    if (formData.currentValue && isNaN(formData.currentValue)) {
      newErrors.currentValue = 'Current value must be a number';
    }

    if (formData.location.coordinates.lat && (isNaN(formData.location.coordinates.lat) || formData.location.coordinates.lat < -90 || formData.location.coordinates.lat > 90)) {
      newErrors.lat = 'Latitude must be between -90 and 90';
    }

    if (formData.location.coordinates.lng && (isNaN(formData.location.coordinates.lng) || formData.location.coordinates.lng < -180 || formData.location.coordinates.lng > 180)) {
      newErrors.lng = 'Longitude must be between -180 and 180';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors before submitting');
      return;
    }

    const assetData = {
      ...formData,
      photos,
      purchasePrice: formData.purchasePrice ? parseFloat(formData.purchasePrice) : null,
      currentValue: formData.currentValue ? parseFloat(formData.currentValue) : null,
      location: {
        ...formData.location,
        coordinates: {
          lat: formData.location.coordinates.lat ? parseFloat(formData.location.coordinates.lat) : null,
          lng: formData.location.coordinates.lng ? parseFloat(formData.location.coordinates.lng) : null
        }
      }
    };

    onSave(assetData);
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      if (parent === 'location') {
        if (child === 'lat' || child === 'lng') {
          setFormData(prev => ({
            ...prev,
            location: {
              ...prev.location,
              coordinates: {
                ...prev.location.coordinates,
                [child]: value
              }
            }
          }));
        } else {
          setFormData(prev => ({
            ...prev,
            location: {
              ...prev.location,
              [child]: value
            }
          }));
        }
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            location: {
              ...prev.location,
              coordinates: {
                lat: position.coords.latitude.toFixed(6),
                lng: position.coords.longitude.toFixed(6)
              }
            }
          }));
          toast.success('Location coordinates updated');
        },
        (error) => {
          toast.error('Unable to get current location');
        }
      );
    } else {
      toast.error('Geolocation not supported by browser');
    }
  };

  const calculateNextInspection = () => {
    if (formData.lastInspection) {
      const lastDate = new Date(formData.lastInspection);
      const nextDate = new Date(lastDate);
      nextDate.setFullYear(nextDate.getFullYear() + 1); // Add 1 year
      
      setFormData(prev => ({
        ...prev,
        nextInspection: nextDate.toISOString().split('T')[0]
      }));
    }
  };

  const addPhoto = (photoData) => {
    setPhotos(prev => [...prev, photoData]);
  };

  const removePhoto = (photoId) => {
    setPhotos(prev => prev.filter(p => p.id !== photoId));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            {asset ? 'Edit Asset' : 'Add New Asset'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2"
          >
            <SafeIcon icon={FiX} className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <SafeIcon icon={FiPackage} className="w-5 h-5 mr-2" />
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Asset Number *
                </label>
                <input
                  type="text"
                  name="assetNumber"
                  value={formData.assetNumber}
                  onChange={handleChange}
                  className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.assetNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., D-001, T-123"
                />
                {errors.assetNumber && <p className="text-red-500 text-sm mt-1">{errors.assetNumber}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Asset Type *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.type ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  {assetTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Container Size *
                </label>
                <div className="flex space-x-2">
                  <select
                    name="containerSize"
                    value={formData.containerSize}
                    onChange={handleChange}
                    className={`flex-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                      errors.containerSize ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    {containerSizes.map(size => (
                      <option key={size.value} value={size.value}>
                        {size.label}
                      </option>
                    ))}
                  </select>
                  <select
                    name="containerUnit"
                    value={formData.containerUnit}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    {containerUnits.map(unit => (
                      <option key={unit.value} value={unit.value}>
                        {unit.label}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.containerSize && <p className="text-red-500 text-sm mt-1">{errors.containerSize}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status *
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {statusOptions.map(status => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Condition
                </label>
                <select
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {conditionOptions.map(condition => (
                    <option key={condition.value} value={condition.value}>
                      {condition.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Manufacturer
                </label>
                <input
                  type="text"
                  name="manufacturer"
                  value={formData.manufacturer}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., Wastequip, Dumpster Rental Systems"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Model
                </label>
                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Model number or name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Serial Number
                </label>
                <input
                  type="text"
                  name="serialNumber"
                  value={formData.serialNumber}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Serial number"
                />
              </div>
            </div>
          </div>

          {/* Financial Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <SafeIcon icon={FiDollarSign} className="w-5 h-5 mr-2" />
              Financial Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Purchase Date
                </label>
                <input
                  type="date"
                  name="purchaseDate"
                  value={formData.purchaseDate}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Purchase Price
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-500">$</span>
                  <input
                    type="number"
                    step="0.01"
                    name="purchasePrice"
                    value={formData.purchasePrice}
                    onChange={handleChange}
                    className={`w-full pl-8 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                      errors.purchasePrice ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0.00"
                  />
                </div>
                {errors.purchasePrice && <p className="text-red-500 text-sm mt-1">{errors.purchasePrice}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Value
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-500">$</span>
                  <input
                    type="number"
                    step="0.01"
                    name="currentValue"
                    value={formData.currentValue}
                    onChange={handleChange}
                    className={`w-full pl-8 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                      errors.currentValue ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0.00"
                  />
                </div>
                {errors.currentValue && <p className="text-red-500 text-sm mt-1">{errors.currentValue}</p>}
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <SafeIcon icon={FiMapPin} className="w-5 h-5 mr-2" />
              Location Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location Type
                </label>
                <select
                  name="location.type"
                  value={formData.location.type}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {locationTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  name="location.address"
                  value={formData.location.address}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Current location address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Latitude
                </label>
                <input
                  type="number"
                  step="0.000001"
                  name="location.lat"
                  value={formData.location.coordinates.lat}
                  onChange={handleChange}
                  className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.lat ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Latitude"
                />
                {errors.lat && <p className="text-red-500 text-sm mt-1">{errors.lat}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Longitude
                </label>
                <input
                  type="number"
                  step="0.000001"
                  name="location.lng"
                  value={formData.location.coordinates.lng}
                  onChange={handleChange}
                  className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.lng ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Longitude"
                />
                {errors.lng && <p className="text-red-500 text-sm mt-1">{errors.lng}</p>}
              </div>

              <div className="md:col-span-2">
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  className="flex items-center space-x-2 px-4 py-2 text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors"
                >
                  <SafeIcon icon={FiNavigation} className="w-4 h-4" />
                  <span>Use Current Location</span>
                </button>
              </div>
            </div>
          </div>

          {/* Maintenance Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <SafeIcon icon={FiTool} className="w-5 h-5 mr-2" />
              Maintenance Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Inspection
                </label>
                <input
                  type="date"
                  name="lastInspection"
                  value={formData.lastInspection}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Next Inspection
                </label>
                <div className="flex space-x-2">
                  <input
                    type="date"
                    name="nextInspection"
                    value={formData.nextInspection}
                    onChange={handleChange}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={calculateNextInspection}
                    className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    title="Calculate next inspection (1 year from last)"
                  >
                    Auto
                  </button>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maintenance Notes
                </label>
                <textarea
                  name="maintenanceNotes"
                  value={formData.maintenanceNotes}
                  onChange={handleChange}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Maintenance history, repairs, issues..."
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Additional notes about this asset..."
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700 flex items-center space-x-2"
            >
              <SafeIcon icon={FiSave} className="w-5 h-5" />
              <span>{asset ? 'Update' : 'Create'} Asset</span>
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default AssetForm;
```