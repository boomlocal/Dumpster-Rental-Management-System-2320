import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { generateInvoicePDF } from '../../utils/invoicePDF';
import toast from 'react-hot-toast';

const { FiEdit, FiDownload, FiMail, FiEye, FiFileText } = FiIcons;

const InvoiceList = ({ invoices, onEditInvoice, onUpdateInvoice }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDownloadPDF = async (invoice) => {
    try {
      await generateInvoicePDF(invoice);
      toast.success('Invoice PDF downloaded successfully');
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('Failed to generate PDF');
    }
  };

  const handleSendEmail = (invoice) => {
    // In real app, this would trigger email sending
    toast.success(`Invoice ${invoice.invoiceNumber} sent to ${invoice.customerName}`);
    onUpdateInvoice(invoice.id, { status: 'sent' });
  };

  const handleMarkAsPaid = (invoice) => {
    onUpdateInvoice(invoice.id, { 
      status: 'paid',
      paidDate: new Date()
    });
    toast.success(`Invoice ${invoice.invoiceNumber} marked as paid`);
  };

  if (invoices.length === 0) {
    return (
      <div className="text-center py-12">
        <SafeIcon icon={FiFileText} className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">No invoices found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {invoices.map((invoice, index) => (
        <motion.div
          key={invoice.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-4 mb-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  {invoice.invoiceNumber}
                </h3>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(invoice.status)}`}>
                  {invoice.status}
                </span>
                <span className="text-sm text-gray-500 bg-gray-200 px-2 py-1 rounded">
                  ${invoice.total.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <span className="font-medium">Customer:</span>
                  <span>{invoice.customerName}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="font-medium">Issue Date:</span>
                  <span>{invoice.issueDate.toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="font-medium">Due Date:</span>
                  <span>{invoice.dueDate.toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onEditInvoice(invoice)}
                className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                title="Edit Invoice"
              >
                <SafeIcon icon={FiEdit} className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => handleDownloadPDF(invoice)}
                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Download PDF"
              >
                <SafeIcon icon={FiDownload} className="w-5 h-5" />
              </button>
              
              {invoice.status !== 'paid' && (
                <>
                  <button
                    onClick={() => handleSendEmail(invoice)}
                    className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Send Email"
                  >
                    <SafeIcon icon={FiMail} className="w-5 h-5" />
                  </button>
                  
                  <button
                    onClick={() => handleMarkAsPaid(invoice)}
                    className="bg-green-600 text-white px-3 py-1 rounded text-sm font-medium hover:bg-green-700"
                  >
                    Mark Paid
                  </button>
                </>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default InvoiceList;