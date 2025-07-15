import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewAsRole, setViewAsRole] = useState(null);

  useEffect(() => {
    // For demo purposes, auto-login as admin
    const demoUser = {
      id: 1,
      name: 'John Admin',
      email: 'admin@binhaulerpro.com',
      role: 'admin',
      phone: '555-0001',
      company: 'BinHaulerPro Inc.'
    };
    setUser(demoUser);
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const mockUsers = {
        'admin@binhaulerpro.com': {
          id: 1,
          email: 'admin@binhaulerpro.com',
          name: 'John Admin',
          role: 'admin',
          phone: '555-0001',
          company: 'BinHaulerPro Inc.'
        }
      };

      if (mockUsers[email] && password === 'password') {
        const userData = mockUsers[email];
        setUser(userData);
        return { success: true, user: userData };
      }
      return { success: false, error: 'Invalid email or password' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed. Please try again.' };
    }
  };

  const logout = () => {
    setUser(null);
    setViewAsRole(null);
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAdmin: user?.role === 'admin',
    viewAsRole,
    setViewAsRole,
    effectiveRole: viewAsRole || user?.role,
    effectiveUser: user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};