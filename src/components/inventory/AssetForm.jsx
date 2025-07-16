import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import UniversalPhotoUpload from '../photos/UniversalPhotoUpload';
import toast from 'react-hot-toast';

const { FiX, FiSave, FiPackage, FiTruck, FiCamera, FiMapPin, FiCalendar, FiDollarSign, FiFileText, FiSettings } = FiIcons;

const AssetForm = ({ asset, onClose, onSave }) => {
  const { user } = useAuth();
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const [errors, setErrors] = useState({});

  // Form state
  const [formData, setFormData] = useState({
    assetNumber: asset?.assetNumber || '',
    type: asset?.type || 'dumpster',
    // Container-specific fields
    containerSize: asset?.containerSize || '',
    containerUnit: asset?.containerUnit || 'yard',
    length: asset?.length || '',
    width: asset?.width || '',
    height: asset?.height || '',
    // Vehicle-specific fields
    vin: asset?.vin || '', // Single field for VIN/Serial Number
    // Common fields
    status: asset?.status || 'available',
    condition: asset?.condition || 'excellent',
    manufacturer: asset?.manufacturer || '',
    model: asset?.model || '',
    purchaseDate: asset?.purchaseDate || '',
    purchasePrice: asset?.purchasePrice || '',
    warrantyExpiration: asset?.warrantyExpiration || '',
    location: {
      type: asset?.location?.type || 'yard',
      address: asset?.location?.address || '',
      coordinates: asset?.location?.coordinates || { lat: '', lng: '' }
    },
    maintenanceSchedule: asset?.maintenanceSchedule || 'quarterly',
    notes: asset?.notes || '',
    photos: asset?.photos || []
  });

  // Check if current type is vehicle
  const isVehicleType = ['truck', 'trailer', 'loader', 'compactor'].includes(formData.type);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      // Handle nested objects like location.type
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear error when field is updated
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    const newErrors = {};
    if (!formData.assetNumber.trim()) {
      newErrors.assetNumber = 'Asset number is required';
    }
    if (!formData.type) {
      newErrors.type = 'Asset type is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Please fix the errors before submitting');
      return;
    }

    try {
      if (asset) {
        onSave(asset.id, formData);
      } else {
        onSave(formData);
      }
      onClose();
    } catch (error) {
      console.error('Error saving asset:', error);
      toast.error('Failed to save asset');
    }
  };

  const handlePhotoTaken = (photoData) => {
    setFormData(prev => ({
      ...prev,
      photos: [...prev.photos, photoData]
    }));
    toast.success('Photo added successfully');
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div className="bg-white rounded-xl shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Asset Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Asset Number *
              </label>
              <div className="relative">
                <SafeIcon icon={FiPackage} className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="assetNumber"
                  value={formData.assetNumber}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.assetNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., D-001, T-001"
                  required
                />
              </div>
              {errors.assetNumber && (
                <p className="text-red-500 text-sm mt-1">{errors.assetNumber}</p>
              )}
            </div>

            {/* Asset Type */}
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
                required
              >
                <optgroup label="Containers">
                  <option value="dumpster">Dumpster</option>
                  <option value="roll-off">Roll-off Container</option>
                  <option value="compactor">Compactor</option>
                </optgroup>
                <optgroup label="Vehicles">
                  <option value="truck">Truck</option>
                  <option value="trailer">Trailer</option>
                  <option value="loader">Loader</option>
                </optgroup>
                <optgroup label="Equipment">
                  <option value="equipment">Other Equipment</option>
                </optgroup>
              </select>
              {errors.type && (
                <p className="text-red-500 text-sm mt-1">{errors.type}</p>
              )}
            </div>

            {/* Container-specific fields */}
            {!isVehicleType && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Container Size
                  </label>
                  <input
                    type="text"
                    name="containerSize"
                    value={formData.containerSize}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g., 20, 30, 40"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unit
                  </label>
                  <select
                    name="containerUnit"
                    value={formData.containerUnit}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="yard">Yard</option>
                    <option value="cubic-yard">Cubic Yard</option>
                    <option value="ton">Ton</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Length (ft)
                  </label>
                  <input
                    type="number"
                    name="length"
                    value={formData.length}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Length in feet"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Width (ft)
                  </label>
                  <input
                    type="number"
                    name="width"
                    value={formData.width}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Width in feet"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Height (ft)
                  </label>
                  <input
                    type="number"
                    name="height"
                    value={formData.height}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Height in feet"
                  />
                </div>
              </>
            )}

            {/* Vehicle-specific fields */}
            {isVehicleType && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  VIN or Serial Number
                </label>
                <input
                  type="text"
                  name="vin"
                  value={formData.vin}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter VIN or Serial Number"
                />
              </div>
            )}

            {/* Common fields */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="available">Available</option>
                <option value="deployed">Deployed</option>
                <option value="maintenance">Maintenance</option>
                {isVehicleType && <option value="in-service">In Service</option>}
                {isVehicleType && <option value="out-of-service">Out of Service</option>}
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
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="poor">Poor</option>
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
                placeholder="e.g., Caterpillar, Ford"
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
                placeholder="Model name/number"
              />
            </div>

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
                <SafeIcon icon={FiDollarSign} className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  name="purchasePrice"
                  value={formData.purchasePrice}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Purchase price"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Warranty Expiration
              </label>
              <input
                type="date"
                name="warrantyExpiration"
                value={formData.warrantyExpiration}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maintenance Schedule
              </label>
              <select
                name="maintenanceSchedule"
                value={formData.maintenanceSchedule}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="semi-annual">Semi-Annual</option>
                <option value="annual">Annual</option>
              </select>
            </div>
          </div>

          {/* Location Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Location Information</h3>
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
                  <option value="yard">Yard</option>
                  <option value="customer">Customer Site</option>
                  <option value="maintenance">Maintenance Facility</option>
                  <option value="in-transit">In Transit</option>
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
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
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

          {/* Photo Upload */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Photos</h3>
              <button
                type="button"
                onClick={() => setShowPhotoUpload(true)}
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center space-x-2"
              >
                <SafeIcon icon={FiCamera} className="w-4 h-4" />
                <span>Add Photos</span>
              </button>
            </div>
            
            {formData.photos.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {formData.photos.map((photo, index) => (
                  <div key={index} className="relative">
                    <img
                      src={photo.url}
                      alt={`Asset photo ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border border-gray-200"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center space-x-2"
            >
              <SafeIcon icon={FiSave} className="w-4 h-4" />
              <span>{asset ? 'Update' : 'Save'} Asset</span>
            </button>
          </div>
        </form>

        {/* Photo Upload Modal */}
        {showPhotoUpload && (
          <UniversalPhotoUpload
            type="asset"
            title={`Add Photos - ${formData.assetNumber}`}
            onPhotoTaken={handlePhotoTaken}
            onClose={() => setShowPhotoUpload(false)}
            maxPhotos={10}
          />
        )}
      </div>
    </motion.div>
  );
};

export default AssetForm;