```jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import toast from 'react-hot-toast';

const { FiX, FiSave, FiMapPin, FiHome, FiMail, FiPhone, FiUser, FiClock, FiSettings, FiMap, FiEye, FiNavigation } = FiIcons;

const LocationForm = ({ location, onClose, onSave, maxReached }) => {
  const [formData, setFormData] = useState({
    name: location?.name || '',
    type: location?.type || 'office',
    // Separate address fields for Google Maps integration
    streetAddress: location?.streetAddress || location?.address || '',
    apartment: location?.apartment || '',
    city: location?.city || '',
    state: location?.state || '',
    zipCode: location?.zipCode || '',
    country: location?.country || 'United States',
    // Legacy address field for backward compatibility
    address: location?.address || '',
    phone: location?.phone || '',
    email: location?.email || '',
    manager: location?.manager || '',
    operatingHours: location?.operatingHours || '8:00 AM - 5:00 PM',
    status: location?.status || 'active',
    coordinates: location?.coordinates || { lat: '', lng: '' },
    notes: location?.notes || '',
    formattedAddress: location?.formattedAddress || ''
  });

  const [errors, setErrors] = useState({});
  const [autocomplete, setAutocomplete] = useState(null);
  const addressInputRef = useRef(null);
  const [showMap, setShowMap] = useState(false);
  const [mapView, setMapView] = useState('default'); // 'default', 'street', 'satellite'
  const mapRef = useRef(null);

  // US States array
  const states = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
    'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
    'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
    'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
    'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
    'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
    'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
  ];

  const locationTypes = [
    { value: 'office', label: 'Office', description: 'Administrative office location' },
    { value: 'warehouse', label: 'Warehouse', description: 'Storage and equipment facility' },
    { value: 'service_area', label: 'Service Area', description: 'Customer service coverage area' },
    { value: 'depot', label: 'Depot', description: 'Equipment staging and dispatch center' },
    { value: 'facility', label: 'Facility', description: 'General business facility' },
    { value: 'yard', label: 'Yard', description: 'Outdoor storage and operations yard' },
    { value: 'branch', label: 'Branch', description: 'Satellite office or branch location' },
    { value: 'maintenance', label: 'Maintenance', description: 'Equipment repair and maintenance facility' },
    { value: 'transfer', label: 'Transfer Station', description: 'Waste transfer and processing station' },
    { value: 'landfill', label: 'Landfill', description: 'Waste disposal site' }
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
    
    // Initialize address parts
    let streetNumber = '';
    let route = '';
    let city = '';
    let state = '';
    let zipCode = '';
    let country = '';

    // Parse address components
    addressComponents.forEach(component => {
      const types = component.types;
      
      if (types.includes('street_number')) {
        streetNumber = component.long_name;
      } else if (types.includes('route')) {
        route = component.long_name;
      } else if (types.includes('locality')) {
        city = component.long_name;
      } else if (types.includes('administrative_area_level_1')) {
        state = component.long_name; // Use long_name for full state name
      } else if (types.includes('postal_code')) {
        zipCode = component.long_name;
      } else if (types.includes('country')) {
        country = component.long_name;
      }
    });

    // Combine street number and route for full street address
    const fullAddress = streetNumber && route ? `${streetNumber} ${route}` : route || streetNumber;

    // Update form data with all parsed components
    setFormData(prev => ({
      ...prev,
      streetAddress: fullAddress,
      city: city,
      state: state,
      zipCode: zipCode,
      country: country || 'United States',
      address: place.formatted_address, // Keep for backward compatibility
      formattedAddress: place.formatted_address,
      coordinates: {
        lat: place.geometry.location.lat().toFixed(6),
        lng: place.geometry.location.lng().toFixed(6)
      }
    }));

    // Clear any existing errors
    setErrors({});
    
    toast.success('Address details auto-filled from Google Maps');
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Location name is required';
    }

    if (!formData.streetAddress.trim()) {
      newErrors.streetAddress = 'Address is required';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.state) {
      newErrors.state = 'State is required';
    }

    if (!formData.zipCode.trim()) {
      newErrors.zipCode = 'ZIP code is required';
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (formData.coordinates.lat && (isNaN(formData.coordinates.lat) || formData.coordinates.lat < -90 || formData.coordinates.lat > 90)) {
      newErrors.lat = 'Latitude must be between -90 and 90';
    }

    if (formData.coordinates.lng && (isNaN(formData.coordinates.lng) || formData.coordinates.lng < -180 || formData.coordinates.lng > 180)) {
      newErrors.lng = 'Longitude must be between -180 and 180';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!location && maxReached) {
      toast.error('Maximum number of locations reached');
      return;
    }

    if (!validateForm()) {
      return;
    }

    // Combine address fields into a single address string for compatibility
    const fullAddress = `${formData.streetAddress}${formData.apartment ? ', ' + formData.apartment : ''}, ${formData.city}, ${formData.state} ${formData.zipCode}`;

    // Clean up coordinates
    const cleanedData = {
      ...formData,
      address: fullAddress,
      coordinates: {
        lat: formData.coordinates.lat ? parseFloat(formData.coordinates.lat) : null,
        lng: formData.coordinates.lng ? parseFloat(formData.coordinates.lng) : null
      }
    };

    if (location) {
      onSave(location.id, cleanedData);
    } else {
      onSave(cleanedData);
    }
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'lat' || name === 'lng') {
      setFormData(prev => ({
        ...prev,
        coordinates: {
          ...prev.coordinates,
          [name]: value
        }
      }));
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
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          setFormData(prev => ({
            ...prev,
            coordinates: {
              lat: lat.toFixed(6),
              lng: lng.toFixed(6)
            }
          }));

          // Reverse geocoding to get address
          if (window.google && window.google.maps) {
            const geocoder = new window.google.maps.Geocoder();
            const latlng = { lat: lat, lng: lng };
            
            geocoder.geocode({ location: latlng }, (results, status) => {
              if (status === 'OK' && results[0]) {
                handlePlaceSelect(results[0]);
              }
            });
          }
          
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

  const openMapView = (type) => {
    setMapView(type);
    setShowMap(true);
    
    // Initialize map on next render cycle
    setTimeout(() => {
      if (mapRef.current && window.google && window.google.maps) {
        const coordinates = formData.coordinates.lat && formData.coordinates.lng
          ? { lat: parseFloat(formData.coordinates.lat), lng: parseFloat(formData.coordinates.lng) }
          : { lat: 40.7128, lng: -74.0060 }; // Default to NYC if no coordinates

        const mapOptions = {
          center: coordinates,
          zoom: 17,
          mapTypeId: type === 'satellite' ? window.google.maps.MapTypeId.SATELLITE : window.google.maps.MapTypeId.ROADMAP
        };

        const map = new window.google.maps.Map(mapRef.current, mapOptions);

        // Add marker at location
        new window.google.maps.Marker({
          position: coordinates,
          map: map,
          title: formData.name || 'Location'
        });

        // Initialize Street View if requested
        if (type === 'street') {
          const panorama = new window.google.maps.StreetViewPanorama(
            mapRef.current,
            {
              position: coordinates,
              pov: {
                heading: 34,
                pitch: 10
              },
              zoom: 1
            }
          );
          map.setStreetView(panorama);
        }
      }
    }, 100);
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
            {location ? 'Edit Location' : 'Add New Location'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2"
          >
            <SafeIcon icon={FiX} className="w-6 h-6" />
          </button>
        </div>

        {showMap ? (
          <div className="p-6 space-y-4">
            <h3 className="text-lg font-semibold">
              {mapView === 'street' ? 'Street View' : mapView === 'satellite' ? 'Satellite View' : 'Map View'}:
              <span className="ml-2 text-primary-600">{formData.name}</span>
            </h3>
            <div ref={mapRef} className="w-full h-[400px] rounded-lg border border-gray-200"></div>
            <div className="flex justify-end">
              <button
                onClick={() => setShowMap(false)}
                className="px-4 py-2 bg-gray-100 rounded-lg text-gray-700 hover:bg-gray-200"
              >
                Back to Form
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location Name *
                  </label>
                  <div className="relative">
                    <SafeIcon icon={FiMapPin} className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="e.g., Main Office, North Warehouse"
                    />
                  </div>
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location Type *
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    {locationTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  {formData.type && (
                    <p className="text-sm text-gray-500 mt-1">
                      {locationTypes.find(t => t.value === formData.type)?.description}
                    </p>
                  )}
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
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="maintenance">Under Maintenance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Operating Hours
                  </label>
                  <div className="relative">
                    <SafeIcon icon={FiClock} className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="operatingHours"
                      value={formData.operatingHours}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="e.g., 8:00 AM - 5:00 PM, 24/7"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Address Information with Google Maps Autocomplete */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <SafeIcon icon={FiHome} className="w-5 h-5 mr-2" />
                Address Information
              </h3>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Street Address * (Google Maps Autocomplete)
                  </label>
                  <div className="relative">
                    <SafeIcon icon={FiMapPin} className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      ref={addressInputRef}
                      type="text"
                      name="streetAddress"
                      value={formData.streetAddress}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                        errors.streetAddress ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Start typing address... (Google will suggest)"
                    />
                  </div>
                  {errors.streetAddress && <p className="text-red-500 text-sm mt-1">{errors.streetAddress}</p>}
                  
                  {/* Map View Options */}
                  {(formData.streetAddress || formData.coordinates.lat) && (
                    <div className="flex items-center space-x-2 mt-2">
                      <button
                        type="button"
                        onClick={() => openMapView('street')}
                        className="flex items-center space-x-1 px-3 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <SafeIcon icon={FiEye} className="w-4 h-4" />
                        <span>Street View</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => openMapView('satellite')}
                        className="flex items-center space-x-1 px-3 py-1 text-sm text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                      >
                        <SafeIcon icon={FiMap} className="w-4 h-4" />
                        <span>Satellite View</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => openMapView('default')}
                        className="flex items-center space-x-1 px-3 py-1 text-sm text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors"
                      >
                        <SafeIcon icon={FiMapPin} className="w-4 h-4" />
                        <span>Map View</span>
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                        errors.city ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="City will auto-fill"
                    />
                    {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State * (Auto-filled)
                    </label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                        errors.state ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select State</option>
                      {states.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                    {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
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
                      className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                        errors.zipCode ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="ZIP will auto-fill"
                      pattern="[0-9]{5}(-[0-9]{4})?"
                    />
                    {errors.zipCode && <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country
                    </label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <SafeIcon icon={FiPhone} className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <SafeIcon icon={FiMail} className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="location@binhaulerpro.com"
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location Manager
                  </label>
                  <div className="relative">
                    <SafeIcon icon={FiUser} className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="manager"
                      value={formData.manager}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Manager name"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* GPS Coordinates */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">GPS Coordinates (Auto-filled by Maps)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="0.000001"
                    name="lat"
                    value={formData.coordinates.lat}
                    onChange={handleChange}
                    className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                      errors.lat ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Auto-filled from address"
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
                    name="lng"
                    value={formData.coordinates.lng}
                    onChange={handleChange}
                    className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                      errors.lng ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Auto-filled from address"
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
                  <p className="text-sm text-gray-500 mt-1">
                    Coordinates are automatically filled when you select an address from Google Maps
                  </p>
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
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Additional notes about this location..."
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
                disabled={!location && maxReached}
                className="bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <SafeIcon icon={FiSave} className="w-5 h-5" />
                <span>{location ? 'Update' : 'Add'} Location</span>
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
};

export default LocationForm;
```