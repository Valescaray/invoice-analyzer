// Mock data for dashboard statistics
export const mockStore = {
  totalInvoices: 48,
  totalExpenses: 12450.75,
  topVendors: [
    { name: "Amazon Web Services", amount: 3200.00, count: 12 },
    { name: "Microsoft Azure", amount: 2800.50, count: 8 },
    { name: "Office Supplies Co", amount: 1500.25, count: 15 }
  ],
  expensesByCategory: [
    { category: "Cloud Services", value: 6000.50, percentage: 0.48 },
    { category: "Office Supplies", value: 3200.00, percentage: 0.26 },
    { category: "Software Licenses", value: 2100.25, percentage: 0.17 },
    { category: "Other", value: 1150.00, percentage: 0.09 }
  ]
};

// Mock data for invoices list
export const mockQuery = {
  invoices: [
    {
      id: "inv-001",
      vendor: "Amazon Web Services",
      date: "2024-01-15",
      totalAmount: 1250.00,
      tax: 125.00,
      status: "Analyzed",
      items: [
        { description: "EC2 Instance", quantity: 1, price: 800.00 },
        { description: "S3 Storage", quantity: 1, price: 450.00 }
      ]
    },
    {
      id: "inv-002",
      vendor: "Microsoft Azure",
      date: "2024-01-14",
      totalAmount: 980.50,
      tax: 98.05,
      status: "Analyzed",
      items: [
        { description: "Virtual Machines", quantity: 2, price: 980.50 }
      ]
    },
    {
      id: "inv-003",
      vendor: "Office Supplies Co",
      date: "2024-01-12",
      totalAmount: 345.75,
      tax: 34.58,
      status: "Pending",
      items: []
    },
    {
      id: "inv-004",
      vendor: "Amazon Web Services",
      date: "2024-01-10",
      totalAmount: 1950.00,
      tax: 195.00,
      status: "Analyzed",
      items: [
        { description: "RDS Database", quantity: 1, price: 1200.00 },
        { description: "CloudFront CDN", quantity: 1, price: 750.00 }
      ]
    },
    {
      id: "inv-005",
      vendor: "Microsoft Azure",
      date: "2024-01-08",
      totalAmount: 1820.00,
      tax: 182.00,
      status: "Analyzed",
      items: [
        { description: "Azure SQL", quantity: 1, price: 1820.00 }
      ]
    }
  ]
};

// Mock root props for upload component
export const mockRootProps = {
  maxFileSize: 10485760, // 10MB in bytes
  acceptedFileTypes: ["application/pdf", "image/jpeg", "image/png"],
  uploadEndpoint: "/analyze"
};