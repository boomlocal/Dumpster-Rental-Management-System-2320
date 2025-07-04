import React, { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [customers, setCustomers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [dumpsters, setDumpsters] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [systemLogs, setSystemLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMockData();
  }, []);

  const loadMockData = () => {
    try {
      setCustomers([
        {
          id: 1,
          name: 'ABC Construction',
          email: 'contact@abc.com',
          phone: '555-0101',
          address: '123 Main St, New York, NY 12345',
          streetAddress: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '12345',
          jobs: 15
        },
        {
          id: 2,
          name: 'XYZ Roofing',
          email: 'info@xyz.com',
          phone: '555-0102',
          address: '456 Oak Ave, Los Angeles, CA 90210',
          streetAddress: '456 Oak Ave',
          city: 'Los Angeles',
          state: 'CA',
          zipCode: '90210',
          jobs: 8
        },
        {
          id: 3,
          name: 'Home Renovations LLC',
          email: 'hello@home.com',
          phone: '555-0103',
          address: '789 Pine Rd, Chicago, IL 60601',
          streetAddress: '789 Pine Rd',
          city: 'Chicago',
          state: 'IL',
          zipCode: '60601',
          jobs: 22
        }
      ]);

      setJobs([
        {
          id: 1,
          customerId: 1,
          type: 'drop-off',
          status: 'scheduled',
          dumpsterSize: '20 yard',
          scheduledDate: new Date('2024-01-15'),
          address: '123 Main St, New York, NY 12345',
          notes: 'Gate code: 1234'
        },
        {
          id: 2,
          customerId: 2,
          type: 'pickup',
          status: 'in-progress',
          dumpsterSize: '30 yard',
          scheduledDate: new Date('2024-01-16'),
          address: '456 Oak Ave, Los Angeles, CA 90210',
          notes: 'Heavy load - concrete'
        }
      ]);

      setDumpsters([
        {
          id: 1,
          size: '20 yard',
          location: { lat: 40.7128, lng: -74.0060 },
          status: 'in-use',
          customerId: 1
        },
        {
          id: 2,
          size: '30 yard',
          location: { lat: 40.7589, lng: -73.9851 },
          status: 'available',
          customerId: null
        },
        {
          id: 3,
          size: '20 yard',
          location: { lat: 40.7505, lng: -73.9934 },
          status: 'in-use',
          customerId: 2
        },
        {
          id: 4,
          size: '40 yard',
          location: { lat: 40.7282, lng: -73.9942 },
          status: 'maintenance',
          customerId: null
        },
        {
          id: 5,
          size: '10 yard',
          location: { lat: 40.7614, lng: -73.9776 },
          status: 'available',
          customerId: null
        }
      ]);

      setDrivers([
        {
          id: 1,
          name: 'Mike Johnson',
          phone: '555-0201',
          status: 'active',
          currentJobs: 3
        },
        {
          id: 2,
          name: 'Sarah Davis',
          phone: '555-0202',
          status: 'active',
          currentJobs: 2
        }
      ]);

      // Mock photos for demonstration
      setPhotos([
        {
          id: 1,
          jobId: 1,
          customerId: 1,
          type: 'delivery',
          url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=600&fit=crop',
          timestamp: new Date('2024-01-15T10:30:00'),
          location: {
            lat: 40.7128,
            lng: -74.0060,
            accuracy: 5
          },
          notes: 'Dumpster placed near garage as requested',
          filename: 'delivery_1642248600000.jpg'
        },
        {
          id: 2,
          jobId: 1,
          customerId: 1,
          type: 'delivery',
          url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=600&fit=crop',
          timestamp: new Date('2024-01-15T10:35:00'),
          location: {
            lat: 40.7128,
            lng: -74.0060,
            accuracy: 3
          },
          notes: 'Clear access path to street',
          filename: 'delivery_1642248900000.jpg'
        }
      ]);

    } catch (error) {
      console.error('Error loading mock data:', error);
    } finally {
      setLoading(false);
    }
  };

  const addCustomer = (customer) => {
    try {
      const newCustomer = {
        ...customer,
        id: Date.now()
      };
      setCustomers(prev => [...prev, newCustomer]);
      
      // Log the action
      addSystemLog({
        level: 'info',
        category: 'customer',
        action: 'Customer Created',
        message: `New customer "${customer.name}" created`,
        userId: 1, // Would be current user ID
        details: { customerId: newCustomer.id, customerName: customer.name }
      });
      
      return newCustomer;
    } catch (error) {
      console.error('Error adding customer:', error);
      throw error;
    }
  };

  const updateCustomer = (id, updates) => {
    try {
      setCustomers(prev =>
        prev.map(customer =>
          customer.id === id ? { ...customer, ...updates } : customer
        )
      );
      
      // Log the action
      addSystemLog({
        level: 'info',
        category: 'customer',
        action: 'Customer Updated',
        message: `Customer information updated for ID ${id}`,
        userId: 1,
        details: { customerId: id, updates }
      });
    } catch (error) {
      console.error('Error updating customer:', error);
      throw error;
    }
  };

  const addJob = (job) => {
    try {
      const newJob = {
        ...job,
        id: Date.now()
      };
      setJobs(prev => [...prev, newJob]);
      
      // Log the action
      addSystemLog({
        level: 'info',
        category: 'job_site',
        action: 'Job Created',
        message: `New job created for customer ID ${job.customerId}`,
        userId: 1,
        details: { jobId: newJob.id, customerId: job.customerId, type: job.type }
      });
      
      return newJob;
    } catch (error) {
      console.error('Error adding job:', error);
      throw error;
    }
  };

  const updateJob = (id, updates) => {
    try {
      setJobs(prev =>
        prev.map(job =>
          job.id === id ? { ...job, ...updates } : job
        )
      );
      
      // Log the action
      addSystemLog({
        level: updates.status === 'completed' ? 'success' : 'info',
        category: 'job_site',
        action: updates.status === 'completed' ? 'Job Completed' : 'Job Updated',
        message: `Job #${id} ${updates.status === 'completed' ? 'completed' : 'updated'}`,
        userId: 1,
        details: { jobId: id, updates }
      });
    } catch (error) {
      console.error('Error updating job:', error);
      throw error;
    }
  };

  const addPhoto = async (photoData) => {
    try {
      const newPhoto = {
        ...photoData,
        id: Date.now(),
        timestamp: new Date()
      };
      setPhotos(prev => [...prev, newPhoto]);
      
      // Log the action
      addSystemLog({
        level: 'info',
        category: 'job_site',
        action: 'Photo Captured',
        message: `${photoData.type} photo captured for job ${photoData.jobId}`,
        userId: 3, // Driver ID
        details: { 
          photoId: newPhoto.id, 
          jobId: photoData.jobId, 
          type: photoData.type,
          hasGPS: !!photoData.location
        }
      });
      
      return newPhoto;
    } catch (error) {
      console.error('Error adding photo:', error);
      throw error;
    }
  };

  const updatePhotoNotes = async (photoId, notes) => {
    try {
      setPhotos(prev =>
        prev.map(photo =>
          photo.id === photoId ? { ...photo, notes } : photo
        )
      );
      
      // Log the action
      addSystemLog({
        level: 'info',
        category: 'other',
        action: 'Photo Notes Updated',
        message: `Photo notes updated for photo ID ${photoId}`,
        userId: 1,
        details: { photoId, notesLength: notes.length }
      });
    } catch (error) {
      console.error('Error updating photo notes:', error);
      throw error;
    }
  };

  const addSystemLog = (logData) => {
    const newLog = {
      id: Date.now(),
      timestamp: new Date(),
      userName: getUserName(logData.userId),
      userRole: getUserRole(logData.userId),
      ipAddress: '192.168.1.100', // Mock IP
      userAgent: navigator.userAgent,
      ...logData
    };
    
    setSystemLogs(prev => [newLog, ...prev].slice(0, 1000)); // Keep last 1000 logs
  };

  const getUserName = (userId) => {
    const userNames = {
      1: 'John Admin',
      2: 'Jane Office',
      3: 'Mike Driver',
      4: 'Sarah Customer'
    };
    return userNames[userId] || 'System';
  };

  const getUserRole = (userId) => {
    const userRoles = {
      1: 'admin',
      2: 'office_staff',
      3: 'driver',
      4: 'customer'
    };
    return userRoles[userId] || 'system';
  };

  const getPhotosByCustomer = (customerId) => {
    return photos.filter(photo => photo.customerId === customerId);
  };

  const getPhotosByJob = (jobId) => {
    return photos.filter(photo => photo.jobId === jobId);
  };

  const value = {
    customers,
    jobs,
    dumpsters,
    drivers,
    photos,
    systemLogs,
    loading,
    addCustomer,
    updateCustomer,
    addJob,
    updateJob,
    addPhoto,
    updatePhotoNotes,
    addSystemLog,
    getPhotosByCustomer,
    getPhotosByJob
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};