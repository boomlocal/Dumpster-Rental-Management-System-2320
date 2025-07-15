import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useData } from '../../contexts/DataContext';
import ItemManagement from './ItemManagement';
import toast from 'react-hot-toast';

const { FiX, FiSave, FiPlus, FiDollarSign, FiFileText, FiUser, FiCalendar, FiTrash2, FiSettings } = FiIcons;

const InvoiceForm = ({ invoice, onClose, onSave }) => {
  const { customers } = useData();
  const [showItemManagement, setShowItemManagement] = useState(false);

  // Service items for dropdown selection
  const [serviceItems, setServiceItems] = useState([
    // Dumpster Drop-off
    { id: 1, description: '6 Yard Dumpster - Drop-off', defaultRate: 249.00, category: 'dumpster' },
    { id: 2, description: '10 Yard Dumpster - Drop-off', defaultRate: 299.00, category: 'dumpster' },
    { id: 3, description: '14 Yard Dumpster - Drop-off', defaultRate: 349.00, category: 'dumpster' },
    { id: 4, description: '20 Yard Dumpster - Drop-off', defaultRate: 399.00, category: 'dumpster' },
    { id: 5, description: '30 Yard Dumpster - Drop-off', defaultRate: 499.00, category: 'dumpster' },
    { id: 6, description: '40 Yard Dumpster - Drop-off', defaultRate: 599.00, category: 'dumpster' },
    // Pickup Services
    { id: 7, description: '6 Yard Dumpster - Pickup', defaultRate: 149.00, category: 'pickup' },
    { id: 8, description: '10 Yard Dumpster - Pickup', defaultRate: 179.00, category: 'pickup' },
    { id: 9, description: '14 Yard Dumpster - Pickup', defaultRate: 199.00, category: 'pickup' },
    { id: 10, description: '20 Yard Dumpster - Pickup', defaultRate: 229.00, category: 'pickup' },
    { id: 11, description: '30 Yard Dumpster - Pickup', defaultRate: 279.00, category: 'pickup' },
    { id: 12, description: '40 Yard Dumpster - Pickup', defaultRate: 329.00, category: 'pickup' },
    // Additional Services
    { id: 13, description: 'Extra Day Rental', defaultRate: 25.00, category: 'service' },
    { id: 14, description: 'Dumpster Relocation', defaultRate: 99.00, category: 'service' },
    { id: 15, description: 'Weekend Delivery', defaultRate: 75.00, category: 'service' },
    { id: 16, description: 'Same-Day Service', defaultRate: 99.00, category: 'service' },
    // Fees
    { id: 17, description: 'Overweight Fee (per ton)', defaultRate: 75.00, category: 'fee' },
    { id: 18, description: 'Prohibited Items Fee', defaultRate: 150.00, category: 'fee' },
    { id: 19, description: 'Late Payment Fee', defaultRate: 35.00, category: 'fee' }
  ]);

  // Default due date (30 days from today)
  const getDefaultDueDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date.toISOString().split('T')[0];
  };

  // Form state
  const [formData, setFormData] = useState({
    customerId: invoice?.customerId || '',
    customerName: invoice?.customerName || '',
    invoiceNumber: invoice?.invoiceNumber || '',
    issueDate: invoice?.issueDate ? invoice.issueDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    dueDate: invoice?.dueDate ? invoice.dueDate.toISOString().split('T')[0] : getDefaultDueDate(),
    status: invoice?.status || 'draft',
    items: invoice?.items || [{ description: '', quantity: 1, rate: 0, amount: 0 }],
    subtotal: invoice?.subtotal || 0,
    discountType: invoice?.discountType || 'percentage',
    discountValue: invoice?.discountValue || 0,
    discountAmount: invoice?.discountAmount || 0,
    taxRate: invoice?.taxRate || 8.25,
    tax: invoice?.tax || 0,
    total: invoice?.total || 0,
    notes: invoice?.notes || ''
  });

  // Recalculate totals when items or discount change
  useEffect(() => {
    calculateTotals();
  }, [formData.items, formData.taxRate, formData.discountType, formData.discountValue]);

  // Calculate subtotal, discount, tax, and total
  const calculateTotals = () => {
    // Calculate subtotal
    const subtotal = formData.items.reduce((sum, item) => sum + item.amount, 0);

    // Calculate discount amount
    let discountAmount = 0;
    if (formData.discountType === 'percentage') {
      discountAmount = subtotal * (formData.discountValue / 100);
    } else {
      discountAmount = formData.discountValue;
    }

    // Calculate taxable amount and tax
    const taxableAmount = subtotal - discountAmount;
    const tax = taxableAmount * (formData.taxRate / 100);

    // Calculate total
    const total = taxableAmount + tax;

    // Update form data
    setFormData(prev => ({
      ...prev,
      subtotal,
      discountAmount,
      tax,
      total
    }));
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle customer selection
  const handleCustomerSelect = (e) => {
    const customerId = e.target.value;
    if (customerId) {
      const customer = customers.find(c => c.id === parseInt(customerId));
      if (customer) {
        setFormData(prev => ({
          ...prev,
          customerId: customer.id,
          customerName: customer.name
        }));
      }
    }
  };

  // Handle adding a new item
  const handleAddItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: 1, rate: 0, amount: 0 }]
    }));
  };

  // Handle item field changes
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    
    if (field === 'quantity' || field === 'rate') {
      const newValue = parseFloat(value) || 0;
      updatedItems[index][field] = newValue;
      
      // Recalculate amount
      const quantity = field === 'quantity' ? newValue : updatedItems[index].quantity;
      const rate = field === 'rate' ? newValue : updatedItems[index].rate;
      updatedItems[index].amount = quantity * rate;
    } else {
      updatedItems[index][field] = value;
    }
    
    setFormData(prev => ({
      ...prev,
      items: updatedItems
    }));
  };

  // Handle removing an item
  const handleRemoveItem = (index) => {
    const updatedItems = formData.items.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      items: updatedItems
    }));
  };

  // Handle selecting a service item from dropdown
  const handleSelectItem = (index, itemId) => {
    if (itemId) {
      const selectedItem = serviceItems.find(item => item.id === parseInt(itemId));
      if (selectedItem) {
        handleItemChange(index, 'description', selectedItem.description);
        handleItemChange(index, 'rate', selectedItem.defaultRate);
        // Recalculate amount
        const updatedItems = [...formData.items];
        updatedItems[index].amount = updatedItems[index].quantity * selectedItem.defaultRate;
        setFormData(prev => ({
          ...prev,
          items: updatedItems
        }));
      }
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.customerId) {
      toast.error('Please select a customer');
      return;
    }
    
    if (formData.items.length === 0 || formData.items.some(item => !item.description)) {
      toast.error('Please add at least one item with a description');
      return;
    }
    
    // Convert dates to Date objects for storage
    const invoiceData = {
      ...formData,
      issueDate: new Date(formData.issueDate),
      dueDate: new Date(formData.dueDate)
    };
    
    // Save invoice
    if (invoice) {
      onSave(invoice.id, invoiceData);
    } else {
      onSave(invoiceData);
    }
    
    onClose();
  };

  // Custom Item Row Component
  const ItemRow = ({ item, index, onItemChange, onRemoveItem }) => {
    const [isCustom, setIsCustom] = useState(!serviceItems.find(si => si.description === item.description));
    
    const handlePresetSelect = (e) => {
      const selectedId = parseInt(e.target.value);
      if (selectedId) {
        const selectedItem = serviceItems.find(si => si.id === selectedId);
        if (selectedItem) {
          onItemChange(index, 'description', selectedItem.description);
          onItemChange(index, 'rate', selectedItem.defaultRate);
          const newAmount = item.quantity * selectedItem.defaultRate;
          onItemChange(index, 'amount', newAmount);
          setIsCustom(false);
        }
      } else {
        setIsCustom(true);
      }
    };

    return (
      <tr className="border-t border-gray-200">
        <td className="py-2 pr-2">
          <div className="space-y-2">
            {/* Toggle between preset and custom */}
            <div className="flex items-center space-x-2">
              <label className="flex items-center space-x-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={isCustom}
                  onChange={(e) => setIsCustom(e.target.checked)}
                  className="rounded text-primary-600 focus:ring-primary-500"
                />
                <span>Custom Item</span>
              </label>
            </div>
            
            {isCustom ? (
              // Custom item input
              <div className="space-y-2">
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => onItemChange(index, 'description', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter item description"
                />
              </div>
            ) : (
              // Preset item selector
              <select
                value={serviceItems.find(si => si.description === item.description)?.id || ''}
                onChange={handlePresetSelect}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select a preset item</option>
                <optgroup label="Dumpster Drop-off">
                  {serviceItems
                    .filter(si => si.category === 'dumpster')
                    .map(si => (
                      <option key={si.id} value={si.id}>{si.description}</option>
                    ))}
                </optgroup>
                <optgroup label="Pickup Services">
                  {serviceItems
                    .filter(si => si.category === 'pickup')
                    .map(si => (
                      <option key={si.id} value={si.id}>{si.description}</option>
                    ))}
                </optgroup>
                <optgroup label="Additional Services">
                  {serviceItems
                    .filter(si => si.category === 'service')
                    .map(si => (
                      <option key={si.id} value={si.id}>{si.description}</option>
                    ))}
                </optgroup>
                <optgroup label="Fees">
                  {serviceItems
                    .filter(si => si.category === 'fee')
                    .map(si => (
                      <option key={si.id} value={si.id}>{si.description}</option>
                    ))}
                </optgroup>
              </select>
            )}
          </div>
        </td>
        <td className="py-2 px-2">
          <input
            type="number"
            min="0"
            step="1"
            value={item.quantity}
            onChange={(e) => onItemChange(index, 'quantity', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </td>
        <td className="py-2 px-2">
          <div className="relative">
            <SafeIcon icon={FiDollarSign} className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="number"
              min="0"
              step="0.01"
              value={item.rate}
              onChange={(e) => onItemChange(index, 'rate', e.target.value)}
              className="w-full pl-8 pr-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </td>
        <td className="py-2 px-2">
          <div className="relative">
            <SafeIcon icon={FiDollarSign} className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="number"
              min="0"
              step="0.01"
              value={item.amount.toFixed(2)}
              readOnly
              className="w-full pl-8 pr-2 py-2 border border-gray-300 rounded-lg bg-gray-100"
            />
          </div>
        </td>
        <td className="py-2 pl-2">
          <button
            type="button"
            onClick={() => onRemoveItem(index)}
            className="text-red-500 hover:text-red-700 p-1"
          >
            <SafeIcon icon={FiTrash2} className="w-4 h-4" />
          </button>
        </td>
      </tr>
    );
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
        className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            {invoice ? 'Edit Invoice' : 'Create New Invoice'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2"
          >
            <SafeIcon icon={FiX} className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Customer & Invoice Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Customer *
              </label>
              <select
                value={formData.customerId}
                onChange={handleCustomerSelect}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              >
                <option value="">Select Customer</option>
                {customers.map(customer => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name} {customer.company ? `(${customer.company})` : ''}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Invoice Number
              </label>
              <div className="relative">
                <SafeIcon icon={FiFileText} className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="invoiceNumber"
                  value={formData.invoiceNumber}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="INV-1001"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Issue Date *
              </label>
              <div className="relative">
                <SafeIcon icon={FiCalendar} className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  name="issueDate"
                  value={formData.issueDate}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Due Date *
              </label>
              <div className="relative">
                <SafeIcon icon={FiCalendar} className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>
          
          {/* Invoice Items */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Invoice Items</h3>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => setShowItemManagement(true)}
                  className="text-sm text-gray-600 hover:text-gray-800 flex items-center space-x-1"
                >
                  <SafeIcon icon={FiSettings} className="w-4 h-4" />
                  <span>Manage Items</span>
                </button>
              </div>
            </div>
            
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-600">
                  <th className="pb-2">Description</th>
                  <th className="pb-2 w-24">Quantity</th>
                  <th className="pb-2 w-32">Rate</th>
                  <th className="pb-2 w-32">Amount</th>
                  <th className="pb-2 w-10"></th>
                </tr>
              </thead>
              <tbody>
                {formData.items.map((item, index) => (
                  <ItemRow
                    key={index}
                    item={item}
                    index={index}
                    onItemChange={handleItemChange}
                    onRemoveItem={handleRemoveItem}
                  />
                ))}
              </tbody>
            </table>
            
            <button
              type="button"
              onClick={handleAddItem}
              className="mt-4 text-primary-600 hover:text-primary-700 flex items-center space-x-1"
            >
              <SafeIcon icon={FiPlus} className="w-4 h-4" />
              <span>Add Item</span>
            </button>
          </div>
          
          {/* Totals */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                placeholder="Invoice notes or special instructions..."
              />
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">${formData.subtotal.toFixed(2)}</span>
              </div>
              
              <div className="flex items-end space-x-2">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Discount Type
                  </label>
                  <select
                    name="discountType"
                    value={formData.discountType}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount ($)</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Discount Value
                  </label>
                  <input
                    type="number"
                    min="0"
                    step={formData.discountType === 'percentage' ? '1' : '0.01'}
                    name="discountValue"
                    value={formData.discountValue}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div className="flex-1">
                  <span className="text-gray-600">Discount:</span>
                  <span className="ml-2 font-medium">-${formData.discountAmount.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="flex items-center">
                <label className="text-gray-600 mr-2">
                  Tax Rate (%):
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  name="taxRate"
                  value={formData.taxRate}
                  onChange={handleChange}
                  className="w-20 border border-gray-300 rounded-lg px-2 py-1 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <span className="ml-auto font-medium">${formData.tax.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between pt-4 border-t">
                <span className="text-lg font-bold text-gray-900">Total:</span>
                <span className="text-lg font-bold text-primary-600">${formData.total.toFixed(2)}</span>
              </div>
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
              <span>{invoice ? 'Update' : 'Create'} Invoice</span>
            </button>
          </div>
        </form>
        
        {/* Item Management Modal */}
        {showItemManagement && (
          <ItemManagement
            items={serviceItems}
            onClose={() => setShowItemManagement(false)}
          />
        )}
      </motion.div>
    </motion.div>
  );
};

export default InvoiceForm;