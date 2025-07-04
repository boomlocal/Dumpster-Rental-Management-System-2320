import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import toast from 'react-hot-toast';

const { FiSave, FiMessageSquare, FiPhone, FiSettings, FiClock, FiPlus, FiX } = FiIcons;

const NotificationSettings = () => {
  const [twilioSettings, setTwilioSettings] = useState({
    accountSid: '',
    authToken: '',
    phoneNumber: '',
    isConfigured: false
  });

  const [notificationRules, setNotificationRules] = useState([
    { id: 1, type: 'sms', timing: '1hour', message: 'Your dumpster delivery is scheduled for 1 hour from now.', active: true },
    { id: 2, type: 'voice', timing: '30minutes', message: 'This is a reminder that your dumpster will be delivered in 30 minutes.', active: true },
    { id: 3, type: 'sms', timing: '15minutes', message: 'Your dumpster delivery will arrive in 15 minutes.', active: false }
  ]);

  const [newRule, setNewRule] = useState({
    type: 'sms',
    timing: '1hour',
    message: '',
    active: true
  });

  const [showAddRule, setShowAddRule] = useState(false);

  const timingOptions = [
    { value: '2hours', label: '2 Hours Before' },
    { value: '1hour', label: '1 Hour Before' },
    { value: '30minutes', label: '30 Minutes Before' },
    { value: '15minutes', label: '15 Minutes Before' },
    { value: '5minutes', label: '5 Minutes Before' }
  ];

  const handleTwilioSave = () => {
    if (!twilioSettings.accountSid || !twilioSettings.authToken || !twilioSettings.phoneNumber) {
      toast.error('Please fill in all Twilio credentials');
      return;
    }

    setTwilioSettings(prev => ({ ...prev, isConfigured: true }));
    toast.success('Twilio settings saved successfully!');
  };

  const handleAddRule = () => {
    if (!newRule.message.trim()) {
      toast.error('Please enter a message');
      return;
    }

    if (notificationRules.length >= 3) {
      toast.error('Maximum 3 notification rules allowed');
      return;
    }

    const rule = {
      id: Date.now(),
      ...newRule,
      message: newRule.message.trim()
    };

    setNotificationRules(prev => [...prev, rule]);
    setNewRule({ type: 'sms', timing: '1hour', message: '', active: true });
    setShowAddRule(false);
    toast.success('Notification rule added successfully!');
  };

  const handleDeleteRule = (id) => {
    setNotificationRules(prev => prev.filter(rule => rule.id !== id));
    toast.success('Notification rule deleted');
  };

  const handleToggleRule = (id) => {
    setNotificationRules(prev => 
      prev.map(rule => 
        rule.id === id ? { ...rule, active: !rule.active } : rule
      )
    );
  };

  const handleUpdateRule = (id, field, value) => {
    setNotificationRules(prev => 
      prev.map(rule => 
        rule.id === id ? { ...rule, [field]: value } : rule
      )
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Notification Settings</h1>
      </div>

      {/* Twilio Configuration */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <SafeIcon icon={FiSettings} className="w-6 h-6 text-primary-600" />
          <h2 className="text-xl font-semibold text-gray-900">Twilio Configuration</h2>
          {twilioSettings.isConfigured && (
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
              Configured
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account SID *
            </label>
            <input
              type="text"
              value={twilioSettings.accountSid}
              onChange={(e) => setTwilioSettings(prev => ({ ...prev, accountSid: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Auth Token *
            </label>
            <input
              type="password"
              value={twilioSettings.authToken}
              onChange={(e) => setTwilioSettings(prev => ({ ...prev, authToken: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Your auth token"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Twilio Phone Number *
            </label>
            <input
              type="tel"
              value={twilioSettings.phoneNumber}
              onChange={(e) => setTwilioSettings(prev => ({ ...prev, phoneNumber: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="+1234567890"
            />
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-800 mb-2">Setup Instructions:</h4>
          <ol className="text-sm text-blue-700 space-y-1">
            <li>1. Go to <a href="https://console.twilio.com" target="_blank" rel="noopener noreferrer" className="underline">Twilio Console</a></li>
            <li>2. Copy your Account SID and Auth Token</li>
            <li>3. Purchase a phone number for SMS/Voice</li>
            <li>4. Enter the credentials above and save</li>
          </ol>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={handleTwilioSave}
            className="bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700 flex items-center space-x-2"
          >
            <SafeIcon icon={FiSave} className="w-4 h-4" />
            <span>Save Twilio Settings</span>
          </button>
        </div>
      </div>

      {/* Notification Rules */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <SafeIcon icon={FiClock} className="w-6 h-6 text-primary-600" />
            <h2 className="text-xl font-semibold text-gray-900">Notification Rules</h2>
            <span className="text-sm text-gray-500">
              ({notificationRules.length}/3 rules)
            </span>
          </div>
          {notificationRules.length < 3 && (
            <button
              onClick={() => setShowAddRule(true)}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 flex items-center space-x-2"
            >
              <SafeIcon icon={FiPlus} className="w-4 h-4" />
              <span>Add Rule</span>
            </button>
          )}
        </div>

        <div className="space-y-4">
          {notificationRules.map((rule) => (
            <motion.div
              key={rule.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-gray-200 rounded-lg p-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <SafeIcon 
                        icon={rule.type === 'sms' ? FiMessageSquare : FiPhone} 
                        className="w-5 h-5 text-primary-600" 
                      />
                      <select
                        value={rule.type}
                        onChange={(e) => handleUpdateRule(rule.id, 'type', e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 text-sm"
                      >
                        <option value="sms">SMS</option>
                        <option value="voice">Voice</option>
                      </select>
                    </div>
                    <select
                      value={rule.timing}
                      onChange={(e) => handleUpdateRule(rule.id, 'timing', e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1 text-sm"
                    >
                      {timingOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={rule.active}
                        onChange={() => handleToggleRule(rule.id)}
                        className="rounded"
                      />
                      <span className="text-sm">Active</span>
                    </label>
                  </div>
                  <textarea
                    value={rule.message}
                    onChange={(e) => handleUpdateRule(rule.id, 'message', e.target.value)}
                    rows={2}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter notification message..."
                  />
                </div>
                <button
                  onClick={() => handleDeleteRule(rule.id)}
                  className="ml-4 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <SafeIcon icon={FiX} className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Add New Rule Form */}
        {showAddRule && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 border border-primary-200 rounded-lg p-4 bg-primary-50"
          >
            <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Notification Rule</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <SafeIcon 
                    icon={newRule.type === 'sms' ? FiMessageSquare : FiPhone} 
                    className="w-5 h-5 text-primary-600" 
                  />
                  <select
                    value={newRule.type}
                    onChange={(e) => setNewRule(prev => ({ ...prev, type: e.target.value }))}
                    className="border border-gray-300 rounded px-2 py-1"
                  >
                    <option value="sms">SMS</option>
                    <option value="voice">Voice</option>
                  </select>
                </div>
                <select
                  value={newRule.timing}
                  onChange={(e) => setNewRule(prev => ({ ...prev, timing: e.target.value }))}
                  className="border border-gray-300 rounded px-2 py-1"
                >
                  {timingOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <textarea
                value={newRule.message}
                onChange={(e) => setNewRule(prev => ({ ...prev, message: e.target.value }))}
                rows={2}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter notification message..."
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowAddRule(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddRule}
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700"
                >
                  Add Rule
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default NotificationSettings;