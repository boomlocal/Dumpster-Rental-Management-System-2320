import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import toast from 'react-hot-toast';

const { FiTruck, FiCalendar, FiMapPin, FiDollarSign, FiCheck } = FiIcons;

const dumpsterSizes = [
  { size: '6 Yard', price: 249, description: 'Small residential cleanouts, garage cleaning' },
  { size: '10 Yard', price: 299, description: 'Home renovation, small construction projects' },
  { size: '14 Yard', price: 349, description: 'Medium renovation projects, roofing jobs' },
  { size: '20 Yard', price: 399, description: 'Large home remodeling, construction debris' },
  { size: '30 Yard', price: 499, description: 'Major construction, commercial projects' },
  { size: '40 Yard', price: 599, description: 'Large demolition, industrial projects' }
];

const OrderForm = () => {
  const [formData, setFormData] = useState({
    dumpsterSize: '20 Yard',
    serviceType: 'drop-off',
    deliveryDate: '',
    deliveryTime: 'morning',
    pickupDate: '',
    address: '',
    specialInstructions: '',
    projectType: 'construction',
    estimatedWeight: 'under-2-tons'
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedDumpster = dumpsterSizes.find(d => d.size === formData.dumpsterSize);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Order submitted successfully! We will contact you soon.');
      
      // Reset form
      setFormData({
        dumpsterSize: '20 Yard',
        serviceType: 'drop-off',
        deliveryDate: '',
        deliveryTime: 'morning',
        pickupDate: '',
        address: '',
        specialInstructions: '',
        projectType: 'construction',
        estimatedWeight: 'under-2-tons'
      });
      setCurrentStep(1);
    } catch (error) {
      toast.error('Failed to submit order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep1 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Dumpster Size</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dumpsterSizes.map((dumpster) => (
            <motion.div
              key={dumpster.size}
              whileHover={{ scale: 1.02 }}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                formData.dumpsterSize === dumpster.size
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setFormData(prev => ({ ...prev, dumpsterSize: dumpster.size }))}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-900">{dumpster.size}</h4>
                <span className="text-xl font-bold text-primary-600">${dumpster.price}</span>
              </div>
              <p className="text-sm text-gray-600">{dumpster.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Type</h3>
        <div className="space-y-3">
          {[
            { value: 'drop-off', label: 'Drop-off Only', description: 'We deliver the dumpster to your location' },
            { value: 'pickup', label: 'Pickup Only', description: 'We pick up an existing dumpster' },
            { value: 'drop-off-pickup', label: 'Drop-off & Pickup', description: 'Complete service with delivery and pickup' }
          ].map((service) => (
            <label key={service.value} className="flex items-start space-x-3">
              <input
                type="radio"
                name="serviceType"
                value={service.value}
                checked={formData.serviceType === service.value}
                onChange={handleChange}
                className="mt-1"
              />
              <div>
                <span className="font-medium text-gray-900">{service.label}</span>
                <p className="text-sm text-gray-600">{service.description}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Type</h3>
        <select
          name="projectType"
          value={formData.projectType}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="construction">Construction</option>
          <option value="renovation">Home Renovation</option>
          <option value="cleanout">Cleanout</option>
          <option value="roofing">Roofing</option>
          <option value="landscaping">Landscaping</option>
          <option value="demolition">Demolition</option>
          <option value="other">Other</option>
        </select>
      </div>
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Information</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Delivery Address *
            </label>
            <div className="relative">
              <SafeIcon icon={FiMapPin} className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={3}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter complete delivery address including any access instructions"
                required
              />
            </div>
          </div>

          {(formData.serviceType === 'drop-off' || formData.serviceType === 'drop-off-pickup') && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Date *
                  </label>
                  <div className="relative">
                    <SafeIcon icon={FiCalendar} className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      name="deliveryDate"
                      value={formData.deliveryDate}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Time
                  </label>
                  <select
                    name="deliveryTime"
                    value={formData.deliveryTime}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="morning">Morning (8 AM - 12 PM)</option>
                    <option value="afternoon">Afternoon (12 PM - 5 PM)</option>
                    <option value="anytime">Anytime</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {(formData.serviceType === 'pickup' || formData.serviceType === 'drop-off-pickup') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pickup Date *
              </label>
              <div className="relative">
                <SafeIcon icon={FiCalendar} className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  name="pickupDate"
                  value={formData.pickupDate}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  min={formData.deliveryDate || new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estimated Weight
            </label>
            <select
              name="estimatedWeight"
              value={formData.estimatedWeight}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="under-2-tons">Under 2 tons</option>
              <option value="2-4-tons">2-4 tons</option>
              <option value="4-6-tons">4-6 tons</option>
              <option value="over-6-tons">Over 6 tons</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Special Instructions
            </label>
            <textarea
              name="specialInstructions"
              value={formData.specialInstructions}
              onChange={handleChange}
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Any special instructions for placement, access, or pickup..."
            />
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderStep3 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
        
        <div className="bg-gray-50 rounded-lg p-6 space-y-4">
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-900">Dumpster Size:</span>
            <span className="text-gray-700">{formData.dumpsterSize}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-900">Service Type:</span>
            <span className="text-gray-700 capitalize">{formData.serviceType.replace('-', ' ')}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-900">Project Type:</span>
            <span className="text-gray-700 capitalize">{formData.projectType}</span>
          </div>
          
          {formData.deliveryDate && (
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-900">Delivery Date:</span>
              <span className="text-gray-700">{new Date(formData.deliveryDate).toLocaleDateString()}</span>
            </div>
          )}
          
          {formData.pickupDate && (
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-900">Pickup Date:</span>
              <span className="text-gray-700">{new Date(formData.pickupDate).toLocaleDateString()}</span>
            </div>
          )}
          
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-900">Address:</span>
            <span className="text-gray-700 text-right max-w-xs">{formData.address}</span>
          </div>
          
          <div className="border-t pt-4 flex justify-between items-center">
            <span className="text-xl font-bold text-gray-900">Total:</span>
            <span className="text-2xl font-bold text-primary-600">${selectedDumpster?.price}</span>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-800 mb-2">What happens next?</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• We'll contact you within 24 hours to confirm your order</li>
          <li>• You'll receive a confirmation email with order details</li>
          <li>• We'll call 30 minutes before delivery</li>
          <li>• Payment is due upon delivery or pickup</li>
        </ul>
      </div>
    </motion.div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Request a Dumpster</h2>
        <p className="text-gray-600">Complete the form below to request a dumpster rental</p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  step <= currentStep
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step < currentStep ? (
                  <SafeIcon icon={FiCheck} className="w-5 h-5" />
                ) : (
                  step
                )}
              </div>
              {step < 3 && (
                <div
                  className={`w-20 h-1 mx-2 ${
                    step < currentStep ? 'bg-primary-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-sm text-gray-600">Size & Type</span>
          <span className="text-sm text-gray-600">Schedule</span>
          <span className="text-sm text-gray-600">Review</span>
        </div>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8 pt-6 border-t">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={handlePrevious}
              className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium"
            >
              Previous
            </button>
          )}
          
          <div className="ml-auto">
            {currentStep < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={currentStep === 2 && !formData.address}
                className="bg-primary-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-green-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <SafeIcon icon={FiCheck} className="w-4 h-4" />
                    <span>Submit Order</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default OrderForm;