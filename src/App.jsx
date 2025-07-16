```jsx
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { Toaster } from 'react-hot-toast';

// Import components
import Login from './components/auth/Login';
import Layout from './components/layout/Layout';
import Dashboard from './components/dashboard/Dashboard';
import CustomerPortal from './components/customer/CustomerPortal';
import DriverApp from './components/driver/DriverApp';
import GPSTracker from './components/driver/GPSTracker';
import JobManagement from './components/jobs/JobManagement';
import SchedulingCalendar from './components/scheduling/SchedulingCalendar';
import DumpsterTracking from './components/tracking/DumpsterTracking';
import Reports from './components/reports/Reports';
import CustomerManagement from './components/customers/CustomerManagement';
import UserManagement from './components/admin/UserManagement';
import LocationManagement from './components/admin/LocationManagement';
import InventoryManagement from './components/inventory/InventoryManagement';
import NotificationSettings from './components/admin/NotificationSettings';
import SystemLogs from './components/admin/SystemLogs';
import InvoiceManagement from './components/billing/InvoiceManagement';
import PhotoLibrary from './components/photos/PhotoLibrary';
import Settings from './components/settings/Settings';

// ProtectedRoute component
function ProtectedRoute({ children, allowedRoles = [] }) {
  // Mock authentication for demo - in production this would check real auth
  const user = { role: 'admin', name: 'Admin User' };
  const isAuthenticated = true;

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <DataProvider>
          <NotificationProvider>
            <div className="h-screen bg-gray-50 overflow-hidden">
              <Routes>
                {/* Root redirect to login */}
                <Route path="/" element={<Login />} />
                
                {/* Login route */}
                <Route path="/login" element={<Login />} />

                {/* Customer Portal */}
                <Route 
                  path="/customer-portal" 
                  element={
                    <ProtectedRoute allowedRoles={['customer']}>
                      <CustomerPortal />
                    </ProtectedRoute>
                  } 
                />

                {/* Main Application Routes */}
                <Route 
                  path="/app" 
                  element={
                    <ProtectedRoute allowedRoles={['admin', 'office_staff', 'driver']}>
                      <Layout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Navigate to="/app/dashboard" replace />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  
                  {/* Admin Routes */}
                  <Route 
                    path="users" 
                    element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <UserManagement />
                      </ProtectedRoute>
                    } 
                  />
                  <Route path="locations" element={<LocationManagement />} />
                  <Route path="inventory" element={<InventoryManagement />} />
                  <Route path="notifications" element={<NotificationSettings />} />
                  <Route path="logs" element={<SystemLogs />} />
                  <Route path="billing" element={<InvoiceManagement />} />

                  {/* Common Routes */}
                  <Route path="jobs" element={<JobManagement />} />
                  <Route path="scheduling" element={<SchedulingCalendar />} />
                  <Route path="customers" element={<CustomerManagement />} />
                  <Route path="reports" element={<Reports />} />
                  <Route path="photos" element={<PhotoLibrary />} />

                  {/* Driver Routes */}
                  <Route path="driver" element={<DriverApp />} />
                  <Route path="gps" element={<GPSTracker />} />

                  {/* Shared Routes */}
                  <Route path="tracking" element={<DumpsterTracking />} />
                  <Route path="settings" element={<Settings />} />
                </Route>

                {/* Legacy routes for backward compatibility */}
                <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />
                <Route path="/jobs" element={<Navigate to="/app/jobs" replace />} />
                <Route path="/customers" element={<Navigate to="/app/customers" replace />} />
                <Route path="/inventory" element={<Navigate to="/app/inventory" replace />} />
                <Route path="/tracking" element={<Navigate to="/app/tracking" replace />} />
                <Route path="/reports" element={<Navigate to="/app/reports" replace />} />
                <Route path="/settings" element={<Navigate to="/app/settings" replace />} />

                {/* Catch-all route */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>

              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#363636',
                    color: '#fff',
                  },
                }}
              />
            </div>
          </NotificationProvider>
        </DataProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
```