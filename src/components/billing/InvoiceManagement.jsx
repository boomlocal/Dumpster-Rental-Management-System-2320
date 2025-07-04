import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import InvoiceForm from './InvoiceForm';
import InvoiceList from './InvoiceList';
import toast from 'react-hot-toast';

const { FiPlus, FiFileText, FiSearch, FiFilter } = FiIcons;

const InvoiceManagement = () => {
  const [invoices, setInvoices] = useState([
    {
      id: 1,
      invoiceNumber: 'INV-1001',
      customerId: 1,
      customerName: 'ABC Construction',
      issueDate: new Date('2024-01-15'),
      dueDate: new Date('2024-02-14'),
      status: 'paid',
      subtotal: 399.00,
      tax: 32.72,
      total: 431.72,
      items: [
        { description: '20 Yard Dumpster - Drop-off', quantity: 1, rate: 399.00, amount: 399.00 }
      ]
    },
    {
      id: 2,
      invoiceNumber: 'INV-1002',
      customerId: 2,
      customerName: 'XYZ Roofing',
      issueDate: new Date('2024-01-20'),
      dueDate: new Date('2024-02-19'),
      status: 'sent',
      subtotal: 499.00,
      tax: 40.92,
      total: 539.92,
      items: [
        { description: '30 Yard Dumpster - Drop-off', quantity: 1, rate: 499.00, amount: 499.00 }
      ]
    }
  ]);

  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = 
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddInvoice = (invoiceData) => {
    const newInvoice = {
      ...invoiceData,
      id: Date.now(),
      invoiceNumber: `INV-${1000 + invoices.length + 1}`,
      issueDate: new Date(),
      status: 'draft'
    };
    setInvoices(prev => [...prev, newInvoice]);
    toast.success('Invoice created successfully');
  };

  const handleUpdateInvoice = (id, updates) => {
    setInvoices(prev => prev.map(invoice => 
      invoice.id === id ? { ...invoice, ...updates } : invoice
    ));
    toast.success('Invoice updated successfully');
  };

  const handleEditInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setShowInvoiceForm(true);
  };

  const handleCloseForm = () => {
    setShowInvoiceForm(false);
    setSelectedInvoice(null);
  };

  const getTotalStats = () => {
    const total = filteredInvoices.reduce((sum, inv) => sum + inv.total, 0);
    const paid = filteredInvoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.total, 0);
    const outstanding = filteredInvoices.filter(inv => inv.status !== 'paid').reduce((sum, inv) => sum + inv.total, 0);
    
    return { total, paid, outstanding };
  };

  const stats = getTotalStats();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Invoice Management</h1>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowInvoiceForm(true)}
          className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 flex items-center space-x-2"
        >
          <SafeIcon icon={FiPlus} className="w-5 h-5" />
          <span>Create Invoice</span>
        </motion.button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Invoiced</p>
              <p className="text-3xl font-bold text-gray-900">${stats.total.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <SafeIcon icon={FiFileText} className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Paid</p>
              <p className="text-3xl font-bold text-green-600">${stats.paid.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <SafeIcon icon={FiFileText} className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Outstanding</p>
              <p className="text-3xl font-bold text-red-600">${stats.outstanding.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <SafeIcon icon={FiFileText} className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 mb-6">
          <div className="relative flex-1 max-w-md">
            <SafeIcon icon={FiSearch} className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search invoices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiFilter} className="w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="sent">Sent</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
            <div className="text-sm text-gray-500">
              {filteredInvoices.length} invoices
            </div>
          </div>
        </div>

        <InvoiceList
          invoices={filteredInvoices}
          onEditInvoice={handleEditInvoice}
          onUpdateInvoice={handleUpdateInvoice}
        />
      </div>

      {showInvoiceForm && (
        <InvoiceForm
          invoice={selectedInvoice}
          onClose={handleCloseForm}
          onSave={selectedInvoice ? handleUpdateInvoice : handleAddInvoice}
        />
      )}
    </div>
  );
};

export default InvoiceManagement;