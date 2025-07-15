import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useData } from '../../contexts/DataContext';
import toast from 'react-hot-toast';

const { FiX, FiSave, FiUser, FiMapPin, FiCalendar, FiPackage, FiFileText, FiPlus } = FiIcons;

const JobForm = ({ job, onClose, onSave }) => {
  const { customers } = useData();
  const today = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    customerId: job?.customerId || '',
    dumpsterSize: job?.dumpsterSize || '20 Yard',
    type: job?.type || 'drop-off',
    scheduledDate: job?.scheduledDate ? job.scheduledDate.toISOString().split('T')[0] : today,
    scheduledTime: job?.scheduledTime || 'morning',
    status: job?.status || 'scheduled',
    address: job?.address || '',
    notes: job?.notes || ''
  });

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [errors, setErrors] = useState({});

  // If job has a customer, set the selected customer
  useEffect(() => {
    if (formData.customerId) {
      const customer = customers.find(c => c.id === parseInt(formData.customerId));
      setSelectedCustomer(customer);
    }
  }, [formData.customerId, customers]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Clear errors when field is updated
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }

    // Update address when customer changes
    if (name === 'customerId' && value) {
      const customer = customers.find(c => c.id === parseInt(value));
      if (customer) {
        setSelectedCustomer(customer);
        setFormData(prev => ({
          ...prev,
          address: customer.address || ''
        }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.customerId) {
      newErrors.customerId = 'Please select a customer';
    }
    
    if (!formData.dumpsterSize) {
      newErrors.dumpsterSize = 'Please select a dumpster size';
    }
    
    if (!formData.scheduledDate) {
      newErrors.scheduledDate = 'Please select a date';
    }
    
    if (!formData.address) {
      newErrors.address = 'Address is required';
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
    
    const jobData = {
      ...formData,
      customerId: parseInt(formData.customerId),
      scheduledDate: new Date(formData.scheduledDate)
    };
    
    try {
      if (job) {
        onSave(job.id, jobData);
      } else {
        onSave(jobData);
      }
      
      onClose();
      toast.success(`Job ${job ? 'updated' : 'created'} successfully`);
    } catch (error) {
      console.error('Error saving job:', error);
      toast.error('Failed to save job');
    }
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
            {job ? 'Edit Job' : 'Schedule New Job'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2"
          >
            <SafeIcon icon={FiX} className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Customer Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Customer *
            </label>
            <div className="relative">
              <SafeIcon icon={FiUser} className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <select
                name="customerId"
                value={formData.customerId}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  errors.customerId ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select Customer</option>
                {customers.map(customer => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name} {customer.company ? `(${customer.company})` : ''}
                  </option>
                ))}
              </select>
            </div>
            {errors.customerId && <p className="text-red-500 text-sm mt-1">{errors.customerId}</p>}
          </div>

          {/* Job Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dumpster Size *
              </label>
              <select
                name="dumpsterSize"
                value={formData.dumpsterSize}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="6 Yard">6 Yard</option>
                <option value="10 Yard">10 Yard</option>
                <option value="14 Yard">14 Yard</option>
                <option value="20 Yard">20 Yard</option>
                <option value="30 Yard">30 Yard</option>
                <option value="40 Yard">40 Yard</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Type *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="drop-off">Drop-off</option>
                <option value="pickup">Pickup</option>
                <option value="exchange">Exchange</option>
                <option value="live-load">Live Load (Wait and Load)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Scheduled Date *
              </label>
              <div className="relative">
                <SafeIcon icon={FiCalendar} className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  name="scheduledDate"
                  value={formData.scheduledDate}
                  onChange={handleChange}
                  min={today}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.scheduledDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.scheduledDate && <p className="text-red-500 text-sm mt-1">{errors.scheduledDate}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Scheduled Time
              </label>
              <select
                name="scheduledTime"
                value={formData.scheduledTime}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="morning">Morning (8am - 12pm)</option>
                <option value="afternoon">Afternoon (12pm - 5pm)</option>
                <option value="anytime">Anytime</option>
              </select>
            </div>

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
                <option value="scheduled">Scheduled</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address *
            </label>
            <div className="relative">
              <SafeIcon icon={FiMapPin} className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={3}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  errors.address ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Full delivery address"
              />
            </div>
            {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
            
            {selectedCustomer && (
              <p className="text-sm text-gray-500 mt-2">
                <span className="font-medium">Customer address:</span> {selectedCustomer.address}
                <button
                  type="button"
                  className="ml-2 text-primary-600 hover:text-primary-700"
                  onClick={() => setFormData(prev => ({ ...prev, address: selectedCustomer.address }))}
                >
                  Use this address
                </button>
              </p>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <div className="relative">
              <SafeIcon icon={FiFileText} className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={4}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Special instructions, placement details, etc."
              />
            </div>
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
              <span>{job ? 'Update' : 'Create'} Job</span>
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default JobForm;