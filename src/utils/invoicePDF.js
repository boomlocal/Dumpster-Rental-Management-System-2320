// Simple PDF generation without external dependencies
export const generateInvoicePDF = async (invoice) => {
  try {
    // Check if jsPDF is available
    if (typeof window !== 'undefined' && window.jsPDF) {
      const { jsPDF } = window.jsPDF;
      const pdf = new jsPDF();

      // Company info
      const companyInfo = {
        name: 'BinHauler Inc.',
        address: '123 Business Street',
        city: 'Business City, CA 12345',
        phone: '(555) 123-4567',
        email: 'billing@binhauler.com',
        website: 'https://www.binhauler.com'
      };

      // Header
      pdf.setFillColor(2, 132, 199);
      pdf.rect(0, 0, 210, 40, 'F');

      // Company name
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(24);
      pdf.setFont('helvetica', 'bold');
      pdf.text(companyInfo.name, 20, 25);

      // Invoice title
      pdf.setTextColor(31, 41, 55);
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.text('INVOICE', 150, 25);

      // Invoice details
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Invoice #: ${invoice.invoiceNumber}`, 150, 35);
      pdf.text(`Issue Date: ${invoice.issueDate.toLocaleDateString()}`, 150, 42);
      pdf.text(`Due Date: ${invoice.dueDate.toLocaleDateString()}`, 150, 49);

      // Company info
      pdf.setFontSize(10);
      pdf.setTextColor(156, 163, 175);
      let yPos = 50;
      pdf.text(companyInfo.address, 20, yPos);
      pdf.text(companyInfo.city, 20, yPos + 5);
      pdf.text(companyInfo.phone, 20, yPos + 10);
      pdf.text(companyInfo.email, 20, yPos + 15);

      // Bill to
      yPos = 80;
      pdf.setFontSize(14);
      pdf.setTextColor(31, 41, 55);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Bill To:', 20, yPos);
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text(invoice.customerName, 20, yPos + 8);

      // Items header
      yPos = 110;
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Description', 20, yPos);
      pdf.text('Qty', 120, yPos);
      pdf.text('Rate', 140, yPos);
      pdf.text('Amount', 170, yPos);

      // Draw line under header
      pdf.line(20, yPos + 2, 190, yPos + 2);

      // Items
      yPos += 10;
      pdf.setFont('helvetica', 'normal');
      invoice.items.forEach((item) => {
        pdf.text(item.description, 20, yPos);
        pdf.text(item.quantity.toString(), 120, yPos);
        pdf.text(`$${item.rate.toFixed(2)}`, 140, yPos);
        pdf.text(`$${item.amount.toFixed(2)}`, 170, yPos);
        yPos += 8;
      });

      // Totals
      yPos += 10;
      pdf.line(130, yPos, 190, yPos);
      yPos += 10;

      pdf.text('Subtotal:', 130, yPos);
      pdf.text(`$${invoice.subtotal.toFixed(2)}`, 170, yPos);

      if (invoice.discountAmount > 0) {
        yPos += 8;
        pdf.text('Discount:', 130, yPos);
        pdf.text(`-$${invoice.discountAmount.toFixed(2)}`, 170, yPos);
      }

      yPos += 8;
      pdf.text('Tax:', 130, yPos);
      pdf.text(`$${invoice.tax.toFixed(2)}`, 170, yPos);

      yPos += 10;
      pdf.setFont('helvetica', 'bold');
      pdf.text('Total:', 130, yPos);
      pdf.text(`$${invoice.total.toFixed(2)}`, 170, yPos);

      // Footer
      const pageHeight = pdf.internal.pageSize.height;
      pdf.setFontSize(8);
      pdf.setTextColor(156, 163, 175);
      pdf.text('Thank you for your business!', 105, pageHeight - 20, { align: 'center' });

      // Save the PDF
      pdf.save(`Invoice-${invoice.invoiceNumber}.pdf`);
    } else {
      // Fallback: Create a simple text file
      const content = `
INVOICE ${invoice.invoiceNumber}

Bill To: ${invoice.customerName}
Issue Date: ${invoice.issueDate.toLocaleDateString()}
Due Date: ${invoice.dueDate.toLocaleDateString()}

Items:
${invoice.items.map(item => 
  `${item.description} - Qty: ${item.quantity} - Rate: $${item.rate.toFixed(2)} - Amount: $${item.amount.toFixed(2)}`
).join('\n')}

Subtotal: $${invoice.subtotal.toFixed(2)}
Tax: $${invoice.tax.toFixed(2)}
Total: $${invoice.total.toFixed(2)}

Thank you for your business!
BinHauler Inc.
`;

      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Invoice-${invoice.invoiceNumber}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  } catch (error) {
    console.error('PDF generation error:', error);
    throw new Error('Failed to generate invoice PDF');
  }
};