import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import toast from 'react-hot-toast';

const { FiSave, FiFileText, FiHash, FiSettings, FiDollarSign } = FiIcons;

const InvoiceSettings = () => {
  const [invoiceSettings, setInvoiceSettings] = useState({
    nextInvoiceNumber: 1001,
    invoicePrefix: 'INV',
    invoiceSuffix: '',
    taxRate: 8.25,
    taxName: 'Sales Tax',
    currency: 'USD',
    currencySymbol: '$',
    dueDays: 30,
    
    // Company Information
    companyName: 'BinHaulerPro Inc.',
    companyAddress: '123 Business St',
    companyCity: 'Business City',
    companyState: 'CA',
    companyZip: '12345',
    companyPhone: '(555) 123-4567',
    companyEmail: 'billing@binhaulerpro.com',
    companyWebsite: 'https://binhaulerpro.com',
    taxId: '12-3456789',
    
    // Invoice Template
    logoUrl: '',
    primaryColor: '#0284c7',
    accentColor: '#0ea5e9',
    footerText: 'Thank you for your business!',
    
    // Terms and Notes
    paymentTerms: 'Payment is due within 30 days of invoice date.',
    defaultNotes: 'Please include invoice number on payment.',
    lateFeePenalty: 1.5,
    lateFeeAfterDays: 30
  });

  const currencies = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' }
  ];

  const handleSave = () => {
    toast.success('Invoice settings saved successfully!');
  };

  const handleChange = (field, value) => {
    setInvoiceSettings(prev => ({ ...prev, [field]: value }));
  };

  const generatePreviewNumber = () => {
    return `${invoiceSettings.invoicePrefix}${invoiceSettings.nextInvoiceNumber.toString().padStart(4, '0')}${invoiceSettings.invoiceSuffix}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Invoice Settings</h2>
      </div>

      {/* Invoice Numbering */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <SafeIcon icon={FiHash} className="w-6 h-6 text-primary-600" />
          <h3 className="text-xl font-semibold text-gray-900">Invoice Numbering</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Next Invoice Number
            </label>
            <input
              type="number"
              value={invoiceSettings.nextInvoiceNumber}
              onChange={(e) => handleChange('nextInvoiceNumber', parseInt(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              min="1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prefix (Optional)
            </label>
            <input
              type="text"
              value={invoiceSettings.invoicePrefix}
              onChange={(e) => handleChange('invoicePrefix', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="INV"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Suffix (Optional)
            </label>
            <input
              type="text"
              value={invoiceSettings.invoiceSuffix}
              onChange={(e) => handleChange('invoiceSuffix', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="-2024"
            />
          </div>
        </div>

        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            Preview: <span className="font-medium">{generatePreviewNumber()}</span>
          </p>
        </div>
      </div>

      {/* Tax and Currency */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <SafeIcon icon={FiDollarSign} className="w-6 h-6 text-primary-600" />
          <h3 className="text-xl font-semibold text-gray-900">Tax & Currency</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Default Tax Rate (%)
            </label>
            <input
              type="number"
              step="0.01"
              value={invoiceSettings.taxRate}
              onChange={(e) => handleChange('taxRate', parseFloat(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="8.25"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tax Name
            </label>
            <input
              type="text"
              value={invoiceSettings.taxName}
              onChange={(e) => handleChange('taxName', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Sales Tax"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Currency
            </label>
            <select
              value={invoiceSettings.currency}
              onChange={(e) => {
                const currency = currencies.find(c => c.code === e.target.value);
                handleChange('currency', currency.code);
                handleChange('currencySymbol', currency.symbol);
              }}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {currencies.map(currency => (
                <option key={currency.code} value={currency.code}>
                  {currency.symbol} - {currency.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Due Days
            </label>
            <input
              type="number"
              value={invoiceSettings.dueDays}
              onChange={(e) => handleChange('dueDays', parseInt(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              min="1"
            />
          </div>
        </div>
      </div>

      {/* Company Information */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <SafeIcon icon={FiSettings} className="w-6 h-6 text-primary-600" />
          <h3 className="text-xl font-semibold text-gray-900">Company Information</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Name
            </label>
            <input
              type="text"
              value={invoiceSettings.companyName}
              onChange={(e) => handleChange('companyName', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <input
              type="text"
              value={invoiceSettings.companyAddress}
              onChange={(e) => handleChange('companyAddress', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City
            </label>
            <input
              type="text"
              value={invoiceSettings.companyCity}
              onChange={(e) => handleChange('companyCity', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              State
            </label>
            <input
              type="text"
              value={invoiceSettings.companyState}
              onChange={(e) => handleChange('companyState', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ZIP Code
            </label>
            <input
              type="text"
              value={invoiceSettings.companyZip}
              onChange={(e) => handleChange('companyZip', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone
            </label>
            <input
              type="tel"
              value={invoiceSettings.companyPhone}
              onChange={(e) => handleChange('companyPhone', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={invoiceSettings.companyEmail}
              onChange={(e) => handleChange('companyEmail', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Website
            </label>
            <input
              type="url"
              value={invoiceSettings.companyWebsite}
              onChange={(e) => handleChange('companyWebsite', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tax ID
            </label>
            <input
              type="text"
              value={invoiceSettings.taxId}
              onChange={(e) => handleChange('taxId', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Terms and Notes */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <SafeIcon icon={FiFileText} className="w-6 h-6 text-primary-600" />
          <h3 className="text-xl font-semibold text-gray-900">Terms & Notes</h3>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Terms
            </label>
            <textarea
              value={invoiceSettings.paymentTerms}
              onChange={(e) => handleChange('paymentTerms', e.target.value)}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Default Notes
            </label>
            <textarea
              value={invoiceSettings.defaultNotes}
              onChange={(e) => handleChange('defaultNotes', e.target.value)}
              rows={2}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Footer Text
            </label>
            <input
              type="text"
              value={invoiceSettings.footerText}
              onChange={(e) => handleChange('footerText', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Late Fee Penalty (% per month)
              </label>
              <input
                type="number"
                step="0.1"
                value={invoiceSettings.lateFeePenalty}
                onChange={(e) => handleChange('lateFeePenalty', parseFloat(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Late Fee After Days
              </label>
              <input
                type="number"
                value={invoiceSettings.lateFeeAfterDays}
                onChange={(e) => handleChange('lateFeeAfterDays', parseInt(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700 flex items-center space-x-2"
        >
          <SafeIcon icon={FiSave} className="w-4 h-4" />
          <span>Save Invoice Settings</span>
        </button>
      </div>
    </div>
  );
};

export default InvoiceSettings;