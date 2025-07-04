import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useData } from '../../contexts/DataContext';
import toast from 'react-hot-toast';

const { FiPackage, FiMapPin, FiCheck, FiCamera, FiClock, FiUser } = FiIcons;

const BinDropoffForm = ({ job, onComplete }) => {
  const { customers, updateJob } = useData();
  const [formData, setFormData] = useState({
    binNumber: '',
    placementLocation: '',
    accessNotes: '',
    customerPresent: false,
    customerName: '',
    completionNotes: ''
  });
  const [currentLocation, setCurrentLocation] = useState(null);

  const customer = customers.find(c => c.id === job.customerId);

  React.useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          toast.error('Unable to get GPS location');
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.binNumber.trim()) {
      toast.error('Bin number is required');
      return;
    }

    if (!currentLocation) {
      toast.error('GPS location is required for dropoff');
      return;
    }

    // Update job with dropoff information
    const updateData = {
      status: 'completed',
      completedAt: new Date(),
      binNumber: formData.binNumber.trim(),
      dropoffLocation: currentLocation,
      placementNotes: formData.placementLocation,
      accessNotes: formData.accessNotes,
      customerPresent: formData.customerPresent,
      customerContactName: formData.customerName,
      completionNotes: formData.completionNotes
    };

    updateJob(job.id, updateData);

    // Also update dumpster tracking
    updateDumpsterLocation(formData.binNumber, currentLocation, job.customerId);

    toast.success(`Bin ${formData.binNumber} successfully dropped off!`);
    onComplete();
  };

  const updateDumpsterLocation = (binNumber, location, customerId) => {
    // In a real app, this would update your dumpster tracking database
    const dumpsterUpdate = {
      binNumber: binNumber,
      location: location,
      status: 'deployed',
      customerId: customerId,
      jobId: job.id,
      deployedAt: new Date()
    };
    
    console.log('Updating dumpster tracking:', dumpsterUpdate);
    // This would be sent to your backend API
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
    >
      <div className="flex items-center space-x-3 mb-6">
        <SafeIcon icon={FiPackage} className="w-6 h-6 text-primary-600" />
        <h3 className="text-xl font-semibold text-gray-900">Bin Dropoff Form</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Job Information */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-3">Job Details</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiUser} className="w-4 h-4 text-gray-400" />
              <span><strong>Customer:</strong> {customer?.name}</span>
            </div>
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiMapPin} className="w-4 h-4 text-gray-400" />
              <span><strong>Address:</strong> {job.address}</span>
            </div>
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiPackage} className="w-4 h-4 text-gray-400" />
              <span><strong>Size:</strong> {job.dumpsterSize}</span>
            </div>
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiClock} className="w-4 h-4 text-gray-400" />
              <span><strong>Scheduled:</strong> {job.scheduledDate.toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Bin Number - REQUIRED */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bin Number * <span className="text-red-500">(Required for tracking)</span>
          </label>
          <div className="relative">
            <SafeIcon icon={FiPackage} className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              name="binNumber"
              value={formData.binNumber}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg font-mono"
              placeholder="e.g., BH-001, D-123, etc."
              required
            />
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Enter the bin number exactly as labeled on the dumpster
          </p>
        </div>

        {/* GPS Location Status */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiMapPin} className="w-5 h-5 text-green-600" />
              <span className="font-medium text-green-800">GPS Location</span>
            </div>
            {currentLocation ? (
              <div className="text-green-700">
                <div className="text-sm">
                  Lat: {currentLocation.lat.toFixed(6)}
                </div>
                <div className="text-sm">
                  Lng: {currentLocation.lng.toFixed(6)}
                </div>
                <div className="text-xs text-green-600">
                  Accuracy: ±{currentLocation.accuracy?.toFixed(0)}m
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={getCurrentLocation}
                className="text-sm text-green-700 hover:text-green-800 underline"
              >
                Get Location
              </button>
            )}
          </div>
        </div>

        {/* Placement Details */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Placement Location
          </label>
          <textarea
            name="placementLocation"
            value={formData.placementLocation}
            onChange={handleChange}
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Describe where the dumpster was placed (e.g., 'In driveway, 10 feet from garage door')"
          />
        </div>

        {/* Access Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Access Notes
          </label>
          <textarea
            name="accessNotes"
            value={formData.accessNotes}
            onChange={handleChange}
            rows={2}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Any access issues, gate codes, or special instructions"
          />
        </div>

        {/* Customer Contact */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              name="customerPresent"
              checked={formData.customerPresent}
              onChange={handleChange}
              className="h-4 w-4 text-primary-600 rounded"
            />
            <label className="text-sm font-medium text-gray-700">
              Customer was present during delivery
            </label>
          </div>

          {formData.customerPresent && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Customer Name/Contact
              </label>
              <input
                type="text"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Name of person who received delivery"
              />
            </div>
          )}
        </div>

        {/* Completion Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional Notes
          </label>
          <textarea
            name="completionNotes"
            value={formData.completionNotes}
            onChange={handleChange}
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Any additional notes about the delivery..."
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4 pt-4 border-t">
          <button
            type="submit"
            disabled={!formData.binNumber || !currentLocation}
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <SafeIcon icon={FiCheck} className="w-5 h-5" />
            <span>Complete Dropoff</span>
          </button>
        </div>
      </form>

      {/* Important Notice */}
      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-medium text-yellow-800 mb-2">Important:</h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Bin number is required for tracking and customer service</li>
          <li>• GPS location is automatically captured for precise tracking</li>
          <li>• Take photos using the photo capture feature if needed</li>
          <li>• Ensure bin is placed safely and accessibly</li>
        </ul>
      </div>
    </motion.div>
  );
};

export default BinDropoffForm;