import React, { createContext, useContext, useState } from 'react';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({ role: 'admin', name: 'Admin User', email: 'admin@binhauler.com' });
  const [loading, setLoading] = useState(false);
  const [viewAsRole, setViewAsRole] = useState(null);

  const login = async (email, password) => {
    try {
      setLoading(true);
      // Mock authentication
      if (email === 'admin@binhauler.com' && password === 'password') {
        const user = { id: 1, role: 'admin', name: 'Admin User', email: 'admin@binhauler.com' };
        setUser(user);
        return { success: true, user };
      } else if (email === 'driver@binhauler.com' && password === 'password') {
        const user = { id: 2, role: 'driver', name: 'Driver User', email: 'driver@binhauler.com' };
        setUser(user);
        return { success: true, user };
      } else if (email === 'office@binhauler.com' && password === 'password') {
        const user = { id: 3, role: 'office_staff', name: 'Office Staff', email: 'office@binhauler.com' };
        setUser(user);
        return { success: true, user };
      } else if (email === 'customer@binhauler.com' && password === 'password') {
        const user = { id: 4, role: 'customer', name: 'Customer', email: 'customer@binhauler.com' };
        setUser(user);
        return { success: true, user };
      }
      
      return { success: false, error: 'Invalid credentials' };
    } catch (error) {
      toast.error('Login failed. Please try again.');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setViewAsRole(null);
  };

  // Admin view switcher functions
  const switchViewTo = (role) => {
    if (user?.role === 'admin') {
      setViewAsRole(role);
    }
  };

  const resetView = () => {
    setViewAsRole(null);
  };

  // Get effective role for permissions
  const effectiveRole = (user?.role === 'admin' && viewAsRole) ? viewAsRole : user?.role;
  
  // Get effective user (for display purposes)
  const effectiveUser = user ? { 
    ...user, 
    role: effectiveRole
  } : null;

  const value = {
    user,
    effectiveUser,
    effectiveRole,
    viewAsRole,
    loading,
    login,
    logout,
    switchViewTo,
    resetView,
    isAdmin: user?.role === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;