import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { useAuth } from './contexts/AuthContext';
import { Toaster } from 'react-hot-toast';

// Lazy load components for better performance
import Login from './components/auth/Login';
import Layout from './components/layout/Layout';

// Lazy loaded components
const Dashboard = React.lazy(() => import('./components/dashboard/Dashboard'));
const CustomerPortal = React.lazy(() => import('./components/customer/CustomerPortal'));
const DriverApp = React.lazy(() => import('./components/driver/DriverApp'));
const GPSTracker = React.lazy(() => import('./components/driver/GPSTracker'));
const JobManagement = React.lazy(() => import('./components/jobs/JobManagement'));
const SchedulingCalendar = React.lazy(() => import('./components/scheduling/SchedulingCalendar'));
const DumpsterTracking = React.lazy(() => import('./components/tracking/DumpsterTracking'));
const Reports = React.lazy(() => import('./components/reports/Reports'));
const CustomerManagement = React.lazy(() => import('./components/customers/CustomerManagement'));
const UserManagement = React.lazy(() => import('./components/admin/UserManagement'));
const LocationManagement = React.lazy(() => import('./components/admin/LocationManagement'));
const InventoryManagement = React.lazy(() => import('./components/inventory/InventoryManagement'));
const NotificationSettings = React.lazy(() => import('./components/admin/NotificationSettings'));
const SystemLogs = React.lazy(() => import('./components/admin/SystemLogs'));
const InvoiceManagement = React.lazy(() => import('./components/billing/InvoiceManagement'));
const PhotoLibrary = React.lazy(() => import('./components/photos/PhotoLibrary'));
const Settings = React.lazy(() => import('./components/settings/Settings'));

function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
    </div>
  );
}

function ProtectedRoute({ children, allowedRoles }) {
  const { user, effectiveRole, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Use effectiveRole for permission checking (supports admin view switching)
  if (allowedRoles && !allowedRoles.includes(effectiveRole)) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <React.Suspense fallback={<LoadingSpinner />}>
      {children}
    </React.Suspense>
  );
}

function AppRoutes() {
  const { user, effectiveRole, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Routes>
      <Route 
        path="/login" 
        element={user ? <Navigate to="/dashboard" replace /> : <Login />} 
      />

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
        path="/" 
        element={
          <ProtectedRoute allowedRoles={['admin', 'office_staff', 'driver']}>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route 
          path="dashboard" 
          element={
            <React.Suspense fallback={<LoadingSpinner />}>
              <Dashboard />
            </React.Suspense>
          } 
        />

        {/* Admin Only */}
        <Route 
          path="users" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <UserManagement />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="locations" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <LocationManagement />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="inventory" 
          element={
            <ProtectedRoute allowedRoles={['admin', 'office_staff']}>
              <InventoryManagement />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="notifications" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <NotificationSettings />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="logs" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <SystemLogs />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="billing" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <InvoiceManagement />
            </ProtectedRoute>
          } 
        />

        {/* Admin and Office Staff Only */}
        <Route 
          path="jobs" 
          element={
            <ProtectedRoute allowedRoles={['admin', 'office_staff']}>
              <JobManagement />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="scheduling" 
          element={
            <ProtectedRoute allowedRoles={['admin', 'office_staff']}>
              <SchedulingCalendar />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="customers" 
          element={
            <ProtectedRoute allowedRoles={['admin', 'office_staff']}>
              <CustomerManagement />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="reports" 
          element={
            <ProtectedRoute allowedRoles={['admin', 'office_staff']}>
              <Reports />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="photos" 
          element={
            <ProtectedRoute allowedRoles={['admin', 'office_staff']}>
              <PhotoLibrary />
            </ProtectedRoute>
          } 
        />

        {/* Driver Only */}
        <Route 
          path="driver" 
          element={
            <ProtectedRoute allowedRoles={['driver']}>
              <DriverApp />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="gps" 
          element={
            <ProtectedRoute allowedRoles={['driver']}>
              <GPSTracker />
            </ProtectedRoute>
          } 
        />

        {/* All Internal Users */}
        <Route 
          path="tracking" 
          element={
            <ProtectedRoute allowedRoles={['admin', 'office_staff', 'driver']}>
              <DumpsterTracking />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="settings" 
          element={
            <ProtectedRoute allowedRoles={['admin', 'office_staff', 'driver']}>
              <Settings />
            </ProtectedRoute>
          } 
        />
      </Route>

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <DataProvider>
          <NotificationProvider>
            <div className="h-screen bg-gray-50 overflow-hidden">
              <AppRoutes />
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