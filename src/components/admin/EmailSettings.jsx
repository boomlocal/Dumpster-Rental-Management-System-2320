import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import toast from 'react-hot-toast';

const { FiSave, FiMail, FiServer, FiLock, FiSettings, FiTestTube } = FiIcons;

const EmailSettings = () => {
  const [smtpSettings, setSmtpSettings] = useState({
    host: '',
    port: 587,
    secure: false,
    username: '',
    password: '',
    fromEmail: '',
    fromName: 'BinHauler',
    isConfigured: false
  });

  const [testEmail, setTestEmail] = useState('');
  const [testing, setTesting] = useState(false);

  const smtpProviders = [
    {
      name: 'Gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      instructions: 'Use your Gmail address and App Password (not regular password)'
    },
    {
      name: 'Outlook/Hotmail',
      host: 'smtp-mail.outlook.com',
      port: 587,
      secure: false,
      instructions: 'Use your Outlook email and password'
    },
    {
      name: 'Yahoo',
      host: 'smtp.mail.yahoo.com',
      port: 587,
      secure: false,
      instructions: 'Use your Yahoo email and App Password'
    },
    {
      name: 'SendGrid',
      host: 'smtp.sendgrid.net',
      port: 587,
      secure: false,
      instructions: 'Use "apikey" as username and your API key as password'
    },
    {
      name: 'Mailgun',
      host: 'smtp.mailgun.org',
      port: 587,
      secure: false,
      instructions: 'Use your Mailgun SMTP credentials'
    }
  ];

  const handleSave = () => {
    if (!smtpSettings.host || !smtpSettings.username || !smtpSettings.password || !smtpSettings.fromEmail) {
      toast.error('Please fill in all required SMTP settings');
      return;
    }

    setSmtpSettings(prev => ({
      ...prev,
      isConfigured: true
    }));
    toast.success('SMTP settings saved successfully!');
  };

  const handleTestEmail = async () => {
    if (!testEmail) {
      toast.error('Please enter a test email address');
      return;
    }

    if (!smtpSettings.isConfigured) {
      toast.error('Please configure and save SMTP settings first');
      return;
    }

    setTesting(true);
    try {
      // In real app, this would call your backend API
      const response = await fetch('/api/email/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: testEmail, smtpSettings })
      });

      if (response.ok) {
        toast.success('Test email sent successfully!');
      } else {
        throw new Error('Failed to send test email');
      }
    } catch (error) {
      console.error('Test email error:', error);
      toast.error('Failed to send test email. Check your SMTP settings.');
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Email Settings</h2>
      </div>

      {/* SMTP Provider Quick Setup */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <SafeIcon icon={FiServer} className="w-6 h-6 text-primary-600" />
          <h3 className="text-xl font-semibold text-gray-900">Quick Setup</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {smtpProviders.map((provider) => (
            <motion.div
              key={provider.name}
              whileHover={{ scale: 1.02 }}
              onClick={() => handleProviderSelect(provider)}
              className="p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition-colors"
            >
              <h4 className="font-semibold text-gray-900 mb-2">{provider.name}</h4>
              <p className="text-sm text-gray-600">{provider.instructions}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* SMTP Configuration */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <SafeIcon icon={FiSettings} className="w-6 h-6 text-primary-600" />
          <h3 className="text-xl font-semibold text-gray-900">SMTP Configuration</h3>
          {smtpSettings.isConfigured && (
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
              Configured
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SMTP Host *
            </label>
            <input
              type="text"
              value={smtpSettings.host}
              onChange={(e) => setSmtpSettings(prev => ({ ...prev, host: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="smtp.gmail.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Port *
            </label>
            <input
              type="number"
              value={smtpSettings.port}
              onChange={(e) => setSmtpSettings(prev => ({ ...prev, port: parseInt(e.target.value) }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="587"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username (Email) *
            </label>
            <input
              type="email"
              value={smtpSettings.username}
              onChange={(e) => setSmtpSettings(prev => ({ ...prev, username: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="your-email@gmail.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password *
            </label>
            <input
              type="password"
              value={smtpSettings.password}
              onChange={(e) => setSmtpSettings(prev => ({ ...prev, password: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="App password or API key"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              From Email *
            </label>
            <input
              type="email"
              value={smtpSettings.fromEmail}
              onChange={(e) => setSmtpSettings(prev => ({ ...prev, fromEmail: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="noreply@binhauler.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              From Name
            </label>
            <input
              type="text"
              value={smtpSettings.fromName}
              onChange={(e) => setSmtpSettings(prev => ({ ...prev, fromName: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="BinHauler"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={smtpSettings.secure}
              onChange={(e) => setSmtpSettings(prev => ({ ...prev, secure: e.target.checked }))}
              className="rounded"
            />
            <span className="text-sm text-gray-700">Use SSL/TLS (usually for port 465)</span>
          </label>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={handleSave}
            className="bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700 flex items-center space-x-2"
          >
            <SafeIcon icon={FiSave} className="w-4 h-4" />
            <span>Save SMTP Settings</span>
          </button>
        </div>
      </div>

      {/* Test Email */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <SafeIcon icon={FiTestTube} className="w-6 h-6 text-primary-600" />
          <h3 className="text-xl font-semibold text-gray-900">Test Email</h3>
        </div>

        <div className="flex items-end space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Test Email Address
            </label>
            <input
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="test@example.com"
            />
          </div>

          <button
            onClick={handleTestEmail}
            disabled={testing || !smtpSettings.isConfigured}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <SafeIcon icon={FiMail} className="w-4 h-4" />
            <span>{testing ? 'Sending...' : 'Send Test'}</span>
          </button>
        </div>
      </div>

      {/* Setup Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-800 mb-2">SMTP Setup Instructions:</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• For Gmail: Enable 2FA and use App Passwords instead of your regular password</li>
          <li>• For SendGrid: Use "apikey" as username and your API key as password</li>
          <li>• Port 587 with STARTTLS is recommended for most providers</li>
          <li>• Test your configuration before using in production</li>
        </ul>
      </div>
    </div>
  );
};

export default EmailSettings;