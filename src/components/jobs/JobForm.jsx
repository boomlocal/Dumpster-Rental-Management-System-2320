import React, { useState, useRef, useEffect } from 'react';
import { useData } from '../../contexts/DataContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import toast from 'react-hot-toast';

const { FiX, FiSave, FiCalendar, FiMapPin, FiTruck, FiHome, FiEye, FiMap } = FiIcons;

const JobForm = ({ job, onClose }) => {
  const { customers, addJob, updateJob } = useData();
  const { sendEmail, sendSMS } = useNotifications();
  const [formData, setFormData] = useState({
    customerId: job?.customerId || '',
    type: job?.type || 'drop-off',
    status: job?.status || 'scheduled',
    dumpsterSize: job?.dumpsterSize || '20 yard',
    scheduledDate: job?.scheduledDate?.toISOString().split('T')[0] || '',
    scheduledTime: job?.scheduledTime || '09:00',
    notes: job?.notes || '',
    // Full address fields
    streetAddress: job?.streetAddress || '',
    apartment: job?.apartment || '',
    city: job?.city || '',
    state: job?.state || '',
    zipCode: job?.zipCode || '',
    country: job?.country || 'United States',
    formattedAddress: job?.formattedAddress || '',
    coordinates: job?.coordinates || { lat: '', lng: '' }
  });

  const [autocomplete, setAutocomplete] = useState(null);
  const addressInputRef = useRef(null);

  const states = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
    'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
    'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
    'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
    'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
    'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
    'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
  ];

  useEffect(() => {
    initializeAutocomplete();
  }, []);

  const initializeAutocomplete = () => {
    if (!window.google || !window.google.maps || !window.google.maps.places) {
      console.log('Google Maps Places API not loaded');
      return;
    }

    try {
      const autocompleteInstance = new window.google.maps.places.Autocomplete(
        addressInputRef.current,
        {
          types: ['address'],
          componentRestrictions: { country: ['us', 'ca'] },
          fields: ['formatted_address', 'geometry', 'address_components', 'place_id']
        }
      );

      autocompleteInstance.addListener('place_changed', () => {
        const place = autocompleteInstance.getPlace();
        if (place.geometry && place.geometry.location) {
          handlePlaceSelect(place);
        }
      });

      setAutocomplete(autocompleteInstance);
    } catch (error) {
      console.error('Error initializing autocomplete:', error);
    }
  };

  const handlePlaceSelect = (place) => {
    const addressComponents = place.address_components || [];
    let streetNumber = '';
    let route = '';
    let city = '';
    let state = '';
    let zipCode = '';

    addressComponents.forEach(component => {
      const types = component.types;
      if (types.includes('street_number')) {
        streetNumber = component.long_name;
      } else if (types.includes('route')) {
        route = component.long_name;
      } else if (types.includes('locality')) {
        city = component.long_name;
      } else if (types.includes('administrative_area_level_1')) {
        state = component.short_name;
      } else if (types.includes('postal_code')) {
        zipCode = component.long_name;
      }
    });

    const fullAddress = streetNumber && route ? `${streetNumber} ${route}` : place.formatted_address;

    setFormData(prev => ({
      ...prev,
      streetAddress: fullAddress,
      city: city,
      state: state,
      zipCode: zipCode,
      formattedAddress: place.formatted_address,
      coordinates: {
        lat: place.geometry.location.lat().toFixed(6),
        lng: place.geometry.location.lng().toFixed(6)
      }
    }));

    toast.success('Address details auto-filled from Google Maps');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Combine address fields into a single address string for compatibility
    const fullAddress = `${formData.streetAddress}${formData.apartment ? ', ' + formData.apartment : ''}, ${formData.city}, ${formData.state} ${formData.zipCode}`;

    const jobData = {
      ...formData,
      scheduledDate: new Date(formData.scheduledDate),
      scheduledTime: formData.scheduledTime,
      address: fullAddress
    };

    if (job) {
      updateJob(job.id, jobData);
      toast.success('Job updated successfully');
    } else {
      addJob(jobData);
      toast.success('Job created successfully');

      // Send notifications
      const customer = customers.find(c => c.id === parseInt(formData.customerId));
      if (customer) {
        sendEmail(
          customer.email,
          'Job Scheduled',
          `Your ${formData.dumpsterSize} dumpster has been scheduled for ${formData.scheduledDate}`
        );
        sendSMS(
          customer.phone,
          `HaulerPro: Your ${formData.dumpsterSize} dumpster is scheduled for ${formData.scheduledDate} at ${formData.scheduledTime}`
        );
      }
    }

    onClose();
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openStreetView = () => {
    if (formData.coordinates.lat && formData.coordinates.lng) {
      const url = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${formData.coordinates.lat},${formData.coordinates.lng}`;
      window.open(url, '_blank');
    } else if (formData.formattedAddress || formData.streetAddress) {
      const address = encodeURIComponent(formData.formattedAddress || `${formData.streetAddress}, ${formData.city}, ${formData.state} ${formData.zipCode}`);
      const url = `https://www.google.com/maps/@?api=1&map_action=pano&query=${address}`;
      window.open(url, '_blank');
    } else {
      toast.error('No address available for Street View');
    }
  };

  const openSatelliteView = () => {
    if (formData.coordinates.lat && formData.coordinates.lng) {
      const url = `https://www.google.com/maps/@${formData.coordinates.lat},${formData.coordinates.lng},18z/data=!3m1!1e3`;
      window.open(url, '_blank');
    } else if (formData.formattedAddress || formData.streetAddress) {
      const address = encodeURIComponent(formData.formattedAddress || `${formData.streetAddress}, ${formData.city}, ${formData.state} ${formData.zipCode}`);
      const url = `https://www.google.com/maps/search/${address}/@?data=!3m1!1e3`;
      window.open(url, '_blank');
    } else {
      toast.error('No address available for Satellite View');
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
            {job ? 'Edit Job' : 'New Job'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2"
          >
            <SafeIcon icon={FiX} className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Job Details */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer *
                </label>
                <select
                  name="customerId"
                  value={formData.customerId}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Customer</option>
                  {customers.map(customer => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Type *
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
                  <option value="live-load">Live Load</option>
                </select>
              </div>

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
                  <option value="10 yard">10 Yard</option>
                  <option value="20 yard">20 Yard</option>
                  <option value="30 yard">30 Yard</option>
                  <option value="40 yard">40 Yard</option>
                </select>
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
                  <option value="scheduled">Scheduled</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Scheduled Date *
                </label>
                <input
                  type="date"
                  name="scheduledDate"
                  value={formData.scheduledDate}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Scheduled Time *
                </label>
                <input
                  type="time"
                  name="scheduledTime"
                  value={formData.scheduledTime}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>

          {/* Delivery Address with Google Maps Autocomplete */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <SafeIcon icon={FiMapPin} className="w-5 h-5 mr-2" />
              Delivery Address
            </h3>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Street Address * (Google Maps Autocomplete)
                </label>
                <div className="relative">
                  <SafeIcon icon={FiHome} className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    ref={addressInputRef}
                    type="text"
                    name="streetAddress"
                    value={formData.streetAddress}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Start typing address... (Google will suggest)"
                    required
                  />
                </div>
                
                {/* Map View Options */}
                {(formData.streetAddress || formData.coordinates.lat) && (
                  <div className="flex items-center space-x-2 mt-2">
                    <button
                      type="button"
                      onClick={openStreetView}
                      className="flex items-center space-x-1 px-3 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <SafeIcon icon={FiEye} className="w-4 h-4" />
                      <span>Street View</span>
                    </button>
                    <button
                      type="button"
                      onClick={openSatelliteView}
                      className="flex items-center space-x-1 px-3 py-1 text-sm text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                    >
                      <SafeIcon icon={FiMap} className="w-4 h-4" />
                      <span>Satellite View</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Apartment, Suite, etc.
                  </label>
                  <input
                    type="text"
                    name="apartment"
                    value={formData.apartment}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Apt 4B, Suite 200, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City * (Auto-filled)
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="City will auto-fill"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State * (Auto-filled)
                  </label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select State</option>
                    {states.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ZIP Code * (Auto-filled)
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="ZIP will auto-fill"
                    pattern="[0-9]{5}(-[0-9]{4})?"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country *
                  </label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  >
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Special Instructions / Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Special instructions, gate codes, placement details, etc."
            />
          </div>

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