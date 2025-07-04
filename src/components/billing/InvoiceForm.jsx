import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import CustomerForm from '../customers/CustomerForm';
import ItemManagement from './ItemManagement';
import toast from 'react-hot-toast';

const { FiX, FiSave, FiPlus, FiTrash2, FiUser, FiCalendar, FiEdit3, FiSettings } = FiIcons;

const InvoiceForm = ({ invoice, onClose, onSave }) => {
  const { customers } = useData();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    customerId: invoice?.customerId || '',
    dueDate: invoice?.dueDate?.toISOString().split('T')[0] || 
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    items: invoice?.items || [
      { description: '', quantity: 1, rate: 0, amount: 0 }
    ],
    notes: invoice?.notes || '',
    taxRate: invoice?.taxRate || 8.25,
    discountAmount: invoice?.discountAmount || 0
  });

  const [errors, setErrors] = useState({});
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [showItemManagement, setShowItemManagement] = useState(false);

  // Predefined service items
  const [serviceItems] = useState([
    {
      id: 1,
      description: '10 Yard Dumpster - Drop-off',
      defaultRate: 299.00,
      category: 'dumpster'
    },
    {
      id: 2,
      description: '20 Yard Dumpster - Drop-off',
      defaultRate: 399.00,
      category: 'dumpster'
    },
    {
      id: 3,
      description: '30 Yard Dumpster - Drop-off',
      defaultRate: 499.00,
      category: 'dumpster'
    },
    {
      id: 4,
      description: '40 Yard Dumpster - Drop-off',
      defaultRate: 599.00,
      category: 'dumpster'
    },
    {
      id: 5,
      description: '10 Yard Dumpster - Pickup',
      defaultRate: 150.00,
      category: 'pickup'
    },
    {
      id: 6,
      description: '20 Yard Dumpster - Pickup',
      defaultRate: 200.00,
      category: 'pickup'
    },
    {
      id: 7,
      description: '30 Yard Dumpster - Pickup',
      defaultRate: 250.00,
      category: 'pickup'
    },
    {
      id: 8,
      description: '40 Yard Dumpster - Pickup',
      defaultRate: 300.00,
      category: 'pickup'
    },
    {
      id: 9,
      description: 'Dumpster Exchange',
      defaultRate: 75.00,
      category: 'service'
    },
    {
      id: 10,
      description: 'Additional Week Rental',
      defaultRate: 50.00,
      category: 'service'
    },
    {
      id: 11,
      description: 'Overweight Fee (per ton)',
      defaultRate: 65.00,
      category: 'fee'
    },
    {
      id: 12,
      description: 'Late Return Fee',
      defaultRate: 25.00,
      category: 'fee'
    },
    {
      id: 13,
      description: 'Fuel Surcharge',
      defaultRate: 15.00,
      category: 'fee'
    },
    {
      id: 14,
      description: 'Permit Fee',
      defaultRate: 35.00,
      category: 'fee'
    },
    {
      id: 15,
      description: 'Custom Service',
      defaultRate: 0.00,
      category: 'custom'
    }
  ]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.customerId) {
      newErrors.customerId = 'Customer is required';
    }

    if (formData.items.length === 0) {
      newErrors.items = 'At least one item is required';
    }

    formData.items.forEach((item, index) => {
      if (!item.description.trim()) {
        newErrors[`item_${index}_description`] = 'Description is required';
      }
      if (item.quantity <= 0) {
        newErrors[`item_${index}_quantity`] = 'Quantity must be greater than 0';
      }
      if (item.rate < 0) {
        newErrors[`item_${index}_rate`] = 'Rate cannot be negative';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    const customer = customers.find(c => c.id === parseInt(formData.customerId));
    const subtotal = formData.items.reduce((sum, item) => sum + item.amount, 0);
    const discountAmount = formData.discountAmount || 0;
    const taxableAmount = subtotal - discountAmount;
    const tax = (taxableAmount * formData.taxRate) / 100;
    const total = taxableAmount + tax;

    const invoiceData = {
      ...formData,
      customerId: parseInt(formData.customerId),
      customerName: customer?.name,
      dueDate: new Date(formData.dueDate),
      subtotal,
      discountAmount,
      tax,
      total
    };

    if (invoice) {
      onSave(invoice.id, invoiceData);
    } else {
      onSave(invoiceData);
    }

    onClose();
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };

    // Recalculate amount
    if (field === 'quantity' || field === 'rate') {
      newItems[index].amount = newItems[index].quantity * newItems[index].rate;
    }

    setFormData(prev => ({ ...prev, items: newItems }));

    // Clear error
    if (errors[`item_${index}_${field}`]) {
      setErrors(prev => ({ ...prev, [`item_${index}_${field}`]: '' }));
    }
  };

  const handleServiceItemSelect = (index, serviceItemId) => {
    if (!serviceItemId) return;

    const serviceItem = serviceItems.find(item => item.id === parseInt(serviceItemId));
    if (serviceItem) {
      handleItemChange(index, 'description', serviceItem.description);
      handleItemChange(index, 'rate', serviceItem.defaultRate);
    }
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: 1, rate: 0, amount: 0 }]
    }));
  };

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      const newItems = formData.items.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, items: newItems }));
    }
  };

  const handleCustomerCreated = (newCustomer) => {
    setFormData(prev => ({ ...prev, customerId: newCustomer.id }));
    setShowCustomerForm(false);
    toast.success('Customer created and selected');
  };

  const getCalculations = () => {
    const subtotal = formData.items.reduce((sum, item) => sum + item.amount, 0);
    const discountAmount = formData.discountAmount || 0;
    const taxableAmount = subtotal - discountAmount;
    const tax = (taxableAmount * formData.taxRate) / 100;
    const total = taxableAmount + tax;

    return { subtotal, discountAmount, taxableAmount, tax, total };
  };

  const calculations = getCalculations();
  const canManageItems = user?.role === 'admin' || user?.role === 'office_staff';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            {invoice ? 'Edit Invoice' : 'Create Invoice'}
          </h2>
          <div className="flex items-center space-x-2">
            {canManageItems && (
              <button
                onClick={() => setShowItemManagement(true)}
                className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <SafeIcon icon={FiSettings} className="w-4 h-4" />
                <span className="text-sm">Manage Items</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-2"
            >
              <SafeIcon icon={FiX} className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Customer and Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Customer *
              </label>
              <div className="space-y-2">
                <div className="relative">
                  <SafeIcon icon={FiUser} className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <select
                    value={formData.customerId}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, customerId: e.target.value }));
                      if (errors.customerId) setErrors(prev => ({ ...prev, customerId: '' }));
                    }}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                      errors.customerId ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select Customer</option>
                    <option value="new" className="font-medium text-primary-600">
                      + Add New Customer
                    </option>
                    <option disabled className="text-gray-400">
                      ────────────────
                    </option>
                    {customers.map(customer => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name}
                      </option>
                    ))}
                  </select>
                </div>
                {formData.customerId === 'new' && (
                  <button
                    type="button"
                    onClick={() => setShowCustomerForm(true)}
                    className="w-full bg-primary-50 text-primary-700 border border-primary-200 py-2 px-4 rounded-lg hover:bg-primary-100 transition-colors flex items-center justify-center space-x-2"
                  >
                    <SafeIcon icon={FiPlus} className="w-4 h-4" />
                    <span>Create New Customer</span>
                  </button>
                )}
              </div>
              {errors.customerId && <p className="text-red-500 text-sm mt-1">{errors.customerId}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Due Date *
              </label>
              <div className="relative">
                <SafeIcon icon={FiCalendar} className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Invoice Items */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Invoice Items</h3>
              <button
                type="button"
                onClick={addItem}
                className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 flex items-center space-x-2"
              >
                <SafeIcon icon={FiPlus} className="w-4 h-4" />
                <span>Add Item</span>
              </button>
            </div>

            <div className="space-y-4">
              {formData.items.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="grid grid-cols-12 gap-4 items-end">
                    {/* Service Item Selector */}
                    <div className="col-span-12 mb-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Service Item (Optional)
                      </label>
                      <select
                        onChange={(e) => handleServiceItemSelect(index, e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="">Choose a service item...</option>
                        <optgroup label="Dumpster Drop-off">
                          {serviceItems.filter(item => item.category === 'dumpster').map(item => (
                            <option key={item.id} value={item.id}>
                              {item.description} - ${item.defaultRate.toFixed(2)}
                            </option>
                          ))}
                        </optgroup>
                        <optgroup label="Pickup Services">
                          {serviceItems.filter(item => item.category === 'pickup').map(item => (
                            <option key={item.id} value={item.id}>
                              {item.description} - ${item.defaultRate.toFixed(2)}
                            </option>
                          ))}
                        </optgroup>
                        <optgroup label="Additional Services">
                          {serviceItems.filter(item => item.category === 'service').map(item => (
                            <option key={item.id} value={item.id}>
                              {item.description} - ${item.defaultRate.toFixed(2)}
                            </option>
                          ))}
                        </optgroup>
                        <optgroup label="Fees">
                          {serviceItems.filter(item => item.category === 'fee').map(item => (
                            <option key={item.id} value={item.id}>
                              {item.description} - ${item.defaultRate.toFixed(2)}
                            </option>
                          ))}
                        </optgroup>
                        <optgroup label="Custom">
                          {serviceItems.filter(item => item.category === 'custom').map(item => (
                            <option key={item.id} value={item.id}>
                              {item.description}
                            </option>
                          ))}
                        </optgroup>
                      </select>
                    </div>

                    {/* Manual Item Entry */}
                    <div className="col-span-5">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description *
                      </label>
                      <textarea
                        value={item.description}
                        onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                        rows={2}
                        className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                          errors[`item_${index}_description`] ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter item description"
                      />
                      {errors[`item_${index}_description`] && (
                        <p className="text-red-500 text-sm mt-1">{errors[`item_${index}_description`]}</p>
                      )}
                    </div>

                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quantity *
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 1)}
                        className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                          errors[`item_${index}_quantity`] ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rate *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={item.rate}
                        onChange={(e) => handleItemChange(index, 'rate', parseFloat(e.target.value) || 0)}
                        className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                          errors[`item_${index}_rate`] ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Amount
                      </label>
                      <input
                        type="text"
                        value={`$${item.amount.toFixed(2)}`}
                        disabled
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 text-gray-600"
                      />
                    </div>

                    <div className="col-span-1 flex justify-center">
                      {formData.items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tax and Discount */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tax Rate (%)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.taxRate}
                onChange={(e) => setFormData(prev => ({ ...prev, taxRate: parseFloat(e.target.value) || 0 }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discount Amount ($)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.discountAmount}
                onChange={(e) => setFormData(prev => ({ ...prev, discountAmount: parseFloat(e.target.value) || 0 }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Additional notes or instructions..."
            />
          </div>

          {/* Invoice Summary */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Invoice Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">${calculations.subtotal.toFixed(2)}</span>
              </div>
              {calculations.discountAmount > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Discount:</span>
                  <span className="font-medium text-red-600">-${calculations.discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Tax ({formData.taxRate}%):</span>
                <span className="font-medium">${calculations.tax.toFixed(2)}</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total:</span>
                  <span>${calculations.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
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
              <span>{invoice ? 'Update' : 'Create'} Invoice</span>
            </button>
          </div>
        </form>
      </motion.div>

      {/* Customer Form Modal */}
      {showCustomerForm && (
        <CustomerForm
          onClose={() => setShowCustomerForm(false)}
          onSave={handleCustomerCreated}
        />
      )}

      {/* Item Management Modal */}
      {showItemManagement && (
        <ItemManagement
          items={serviceItems}
          onClose={() => setShowItemManagement(false)}
        />
      )}
    </motion.div>
  );
};

export default InvoiceForm;