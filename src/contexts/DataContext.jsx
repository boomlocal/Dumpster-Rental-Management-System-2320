import React, { createContext, useContext, useState } from 'react';

// Create the context
const DataContext = createContext();

// Custom hook for using the context
export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

// Provider component
export const DataProvider = ({ children }) => {
  // Customers state
  const [customers, setCustomers] = useState([
    {
      id: 1,
      name: 'ABC Construction',
      email: 'contact@abc.com',
      phone: '555-0101',
      company: 'ABC Construction LLC',
      address: '123 Main St, New York, NY 10001',
      createdAt: new Date('2024-01-10')
    },
    {
      id: 2,
      name: 'XYZ Roofing',
      email: 'info@xyzroofing.com',
      phone: '555-0202',
      company: 'XYZ Roofing Services',
      address: '456 Oak Ave, Los Angeles, CA 90001',
      createdAt: new Date('2024-01-15')
    },
    {
      id: 3,
      name: 'Acme Demolition',
      email: 'projects@acmedemolition.com',
      phone: '555-0303',
      company: 'Acme Demolition Inc.',
      address: '789 Pine Rd, Chicago, IL 60601',
      createdAt: new Date('2024-01-20')
    }
  ]);

  // Jobs state
  const [jobs, setJobs] = useState([
    {
      id: 1001,
      customerId: 1,
      dumpsterSize: '20 Yard',
      type: 'drop-off',
      scheduledDate: new Date('2024-01-15'),
      scheduledTime: 'morning',
      status: 'completed',
      address: '123 Main St, New York, NY 10001',
      coordinates: { lat: 40.7128, lng: -74.0060 },
      notes: 'Place dumpster in driveway',
      createdAt: new Date('2024-01-10')
    },
    {
      id: 1002,
      customerId: 2,
      dumpsterSize: '30 Yard',
      type: 'drop-off',
      scheduledDate: new Date('2024-01-20'),
      scheduledTime: 'afternoon',
      status: 'completed',
      address: '456 Oak Ave, Los Angeles, CA 90001',
      coordinates: { lat: 34.0522, lng: -118.2437 },
      notes: 'Customer prefers rear placement',
      createdAt: new Date('2024-01-15')
    },
    {
      id: 1003,
      customerId: 3,
      dumpsterSize: '40 Yard',
      type: 'drop-off',
      scheduledDate: new Date('2024-01-25'),
      scheduledTime: 'morning',
      status: 'scheduled',
      address: '789 Pine Rd, Chicago, IL 60601',
      coordinates: { lat: 41.8781, lng: -87.6298 },
      notes: 'Concrete disposal, heavy materials',
      createdAt: new Date('2024-01-20')
    }
  ]);

  // Dumpsters state
  const [dumpsters, setDumpsters] = useState([
    {
      id: 1,
      assetNumber: 'D-001',
      binNumber: 'BH-001',
      size: '20 yard',
      status: 'in-use',
      location: { lat: 40.7128, lng: -74.0060 },
      customerId: 1,
      jobId: 1001
    },
    {
      id: 2,
      assetNumber: 'D-002',
      binNumber: 'BH-002',
      size: '30 yard',
      status: 'in-use',
      location: { lat: 34.0522, lng: -118.2437 },
      customerId: 2,
      jobId: 1002
    },
    {
      id: 3,
      assetNumber: 'D-003',
      binNumber: 'BH-003',
      size: '40 yard',
      status: 'available',
      location: { lat: 41.8781, lng: -87.6298 },
      customerId: null,
      jobId: null
    }
  ]);

  // Drivers state
  const [drivers, setDrivers] = useState([
    {
      id: 1,
      name: 'John Driver',
      email: 'john@binhaulerpro.com',
      phone: '555-1111',
      status: 'active'
    },
    {
      id: 2,
      name: 'Sarah Driver',
      email: 'sarah@binhaulerpro.com',
      phone: '555-2222',
      status: 'active'
    }
  ]);

  // Photos state
  const [photos, setPhotos] = useState([
    {
      id: 1,
      jobId: 1001,
      customerId: 1,
      type: 'delivery',
      url: 'https://images.unsplash.com/photo-1610041321420-a0b7d47d396c',
      timestamp: new Date('2024-01-15T10:30:00'),
      location: { lat: 40.7128, lng: -74.0060 },
      notes: 'Dumpster placed in driveway',
      filename: 'delivery_1001.jpg',
      uploadedBy: 'John Driver',
      userRole: 'driver'
    },
    {
      id: 2,
      jobId: 1002,
      customerId: 2,
      type: 'delivery',
      url: 'https://images.unsplash.com/photo-1526951521990-620dc14c214b',
      timestamp: new Date('2024-01-20T14:45:00'),
      location: { lat: 34.0522, lng: -118.2437 },
      notes: 'Dumpster placed in back yard',
      filename: 'delivery_1002.jpg',
      uploadedBy: 'Sarah Driver',
      userRole: 'driver'
    }
  ]);

  // Customer operations
  const addCustomer = (customerData) => {
    const newCustomer = { ...customerData, id: Date.now(), createdAt: new Date() };
    setCustomers(prev => [...prev, newCustomer]);
    return newCustomer;
  };

  const updateCustomer = (id, updates) => {
    setCustomers(prev => 
      prev.map(customer => 
        customer.id === id ? { ...customer, ...updates } : customer
      )
    );
  };

  const deleteCustomer = (id) => {
    setCustomers(prev => prev.filter(customer => customer.id !== id));
  };

  // Job operations
  const addJob = (jobData) => {
    const newJob = { ...jobData, id: Date.now(), createdAt: new Date() };
    setJobs(prev => [...prev, newJob]);
    return newJob;
  };

  const updateJob = (id, updates) => {
    setJobs(prev => 
      prev.map(job => 
        job.id === id ? { ...job, ...updates } : job
      )
    );
  };

  const deleteJob = (id) => {
    setJobs(prev => prev.filter(job => job.id !== id));
  };

  // Dumpster operations
  const addDumpster = (dumpsterData) => {
    const newDumpster = { ...dumpsterData, id: Date.now() };
    setDumpsters(prev => [...prev, newDumpster]);
    return newDumpster;
  };

  const updateDumpster = (id, updates) => {
    setDumpsters(prev => 
      prev.map(dumpster => 
        dumpster.id === id ? { ...dumpster, ...updates } : dumpster
      )
    );
  };

  const deleteDumpster = (id) => {
    setDumpsters(prev => prev.filter(dumpster => dumpster.id !== id));
  };

  // Photo operations
  const addPhoto = (photoData) => {
    const newPhoto = { ...photoData, id: photoData.id || Date.now() };
    setPhotos(prev => [...prev, newPhoto]);
    return newPhoto;
  };

  const updatePhotoNotes = (id, notes) => {
    setPhotos(prev => 
      prev.map(photo => 
        photo.id === id ? { ...photo, notes } : photo
      )
    );
  };

  const deletePhoto = (id) => {
    setPhotos(prev => prev.filter(photo => photo.id !== id));
  };

  // Context value
  const value = {
    // Data
    customers,
    jobs,
    dumpsters,
    drivers,
    photos,
    
    // Customer operations
    addCustomer,
    updateCustomer,
    deleteCustomer,
    
    // Job operations
    addJob,
    updateJob,
    deleteJob,
    
    // Dumpster operations
    addDumpster,
    updateDumpster,
    deleteDumpster,
    
    // Photo operations
    addPhoto,
    updatePhotoNotes,
    deletePhoto
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;