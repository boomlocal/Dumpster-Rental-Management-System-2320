import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import toast from 'react-hot-toast';

const { FiSave, FiCreditCard, FiPlus, FiX, FiSettings, FiDollarSign } = FiIcons;

const PaymentSettings = () => {
  const [paymentMethods, setPaymentMethods] = useState([
    { id: 1, name: 'Cash', type: 'manual', enabled: true, config: {} },
    { id: 2, name: 'Check', type: 'manual', enabled: true, config: {} }
  ]);

  const [showAddMethod, setShowAddMethod] = useState(false);
  const [newMethod, setNewMethod] = useState({
    name: '',
    type: 'stripe',
    enabled: true,
    config: {}
  });

  const paymentProviders = [
    {
      id: 'stripe',
      name: 'Stripe',
      fields: [
        { key: 'publishableKey', label: 'Publishable Key', type: 'text', placeholder: 'pk_live_...' },
        { key: 'secretKey', label: 'Secret Key', type: 'password', placeholder: 'sk_live_...' },
        { key: 'webhookSecret', label: 'Webhook Secret', type: 'password', placeholder: 'whsec_...' }
      ]
    },
    {
      id: 'paypal',
      name: 'PayPal',
      fields: [
        { key: 'clientId', label: 'Client ID', type: 'text', placeholder: 'Your PayPal Client ID' },
        { key: 'clientSecret', label: 'Client Secret', type: 'password', placeholder: 'Your PayPal Client Secret' },
        { key: 'environment', label: 'Environment', type: 'select', options: ['sandbox', 'production'] }
      ]
    },
    {
      id: 'square',
      name: 'Square',
      fields: [
        { key: 'applicationId', label: 'Application ID', type: 'text', placeholder: 'sq0idp-...' },
        { key: 'accessToken', label: 'Access Token', type: 'password', placeholder: 'EAAAl...' },
        { key: 'environment', label: 'Environment', type: 'select', options: ['sandbox', 'production'] }
      ]
    },
    {
      id: 'custom',
      name: 'Custom/Other',
      fields: [
        { key: 'embedCode', label: 'Embed Code/HTML', type: 'textarea', placeholder: 'Paste your payment form embed code here...' },
        { key: 'apiEndpoint', label: 'API Endpoint (optional)', type: 'text', placeholder: 'https://api.example.com/payments' },
        { key: 'apiKey', label: 'API Key (optional)', type: 'password', placeholder: 'Your API key' }
      ]
    }
  ];

  const handleAddMethod = () => {
    if (!newMethod.name.trim()) {
      toast.error('Please enter a payment method name');
      return;
    }

    const method = {
      id: Date.now(),
      ...newMethod,
      name: newMethod.name.trim()
    };

    setPaymentMethods(prev => [...prev, method]);
    setNewMethod({ name: '', type: 'stripe', enabled: true, config: {} });
    setShowAddMethod(false);
    toast.success('Payment method added successfully!');
  };

  const handleDeleteMethod = (id) => {
    setPaymentMethods(prev => prev.filter(method => method.id !== id));
    toast.success('Payment method removed');
  };

  const handleToggleMethod = (id) => {
    setPaymentMethods(prev =>
      prev.map(method =>
        method.id === id ? { ...method, enabled: !method.enabled } : method
      )
    );
  };

  const handleUpdateConfig = (id, field, value) => {
    setPaymentMethods(prev =>
      prev.map(method =>
        method.id === id
          ? { ...method, config: { ...method.config, [field]: value } }
          : method
      )
    );
  };

  const handleSave = () => {
    toast.success('Payment settings saved successfully!');
  };

  const getProviderFields = (type) => {
    return paymentProviders.find(p => p.id === type)?.fields || [];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Payment Settings</h2>
        <button
          onClick={() => setShowAddMethod(true)}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 flex items-center space-x-2"
        >
          <SafeIcon icon={FiPlus} className="w-4 h-4" />
          <span>Add Payment Method</span>
        </button>
      </div>

      {/* Current Payment Methods */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <SafeIcon icon={FiCreditCard} className="w-6 h-6 text-primary-600" />
          <h3 className="text-xl font-semibold text-gray-900">Payment Methods</h3>
        </div>

        <div className="space-y-6">
          {paymentMethods.map((method) => (
            <motion.div
              key={method.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-gray-200 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <h4 className="text-lg font-semibold text-gray-900">{method.name}</h4>
                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {paymentProviders.find(p => p.id === method.type)?.name || method.type}
                  </span>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={method.enabled}
                      onChange={() => handleToggleMethod(method.id)}
                      className="rounded"
                    />
                    <span className="text-sm">Enabled</span>
                  </label>
                </div>
                {method.type !== 'manual' && (
                  <button
                    onClick={() => handleDeleteMethod(method.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <SafeIcon icon={FiX} className="w-4 h-4" />
                  </button>
                )}
              </div>

              {method.type !== 'manual' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {getProviderFields(method.type).map((field) => (
                    <div key={field.key}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {field.label}
                      </label>
                      {field.type === 'select' ? (
                        <select
                          value={method.config[field.key] || ''}
                          onChange={(e) => handleUpdateConfig(method.id, field.key, e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                          <option value="">Select {field.label}</option>
                          {field.options?.map(option => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      ) : field.type === 'textarea' ? (
                        <textarea
                          value={method.config[field.key] || ''}
                          onChange={(e) => handleUpdateConfig(method.id, field.key, e.target.value)}
                          rows={4}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder={field.placeholder}
                        />
                      ) : (
                        <input
                          type={field.type}
                          value={method.config[field.key] || ''}
                          onChange={(e) => handleUpdateConfig(method.id, field.key, e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder={field.placeholder}
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Add Payment Method Modal */}
      {showAddMethod && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl shadow-2xl max-w-md w-full"
          >
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-bold text-gray-900">Add Payment Method</h3>
              <button
                onClick={() => setShowAddMethod(false)}
                className="text-gray-400 hover:text-gray-600 p-2"
              >
                <SafeIcon icon={FiX} className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method Name
                </label>
                <input
                  type="text"
                  value={newMethod.name}
                  onChange={(e) => setNewMethod(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., Credit Card, Bank Transfer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Provider Type
                </label>
                <select
                  value={newMethod.type}
                  onChange={(e) => setNewMethod(prev => ({ ...prev, type: e.target.value, config: {} }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {paymentProviders.map(provider => (
                    <option key={provider.id} value={provider.id}>
                      {provider.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  onClick={() => setShowAddMethod(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddMethod}
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700"
                >
                  Add Method
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700 flex items-center space-x-2"
        >
          <SafeIcon icon={FiSave} className="w-4 h-4" />
          <span>Save Payment Settings</span>
        </button>
      </div>

      {/* Information Panel */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-800 mb-2">Payment Integration Info:</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Configure your payment gateways with API credentials</li>
          <li>• Test in sandbox/development mode before going live</li>
          <li>• Custom/Other allows embedding any payment form code</li>
          <li>• Manual methods (Cash, Check) don't require API setup</li>
          <li>• Enable/disable methods to control customer options</li>
        </ul>
      </div>
    </div>
  );
};

export default PaymentSettings;