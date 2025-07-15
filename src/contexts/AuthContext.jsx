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
  const [viewAsRole, setViewAsRole] = useState(null); // Admin view switcher

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('hauler_pro_user');
      const savedViewAs = localStorage.getItem('hauler_pro_view_as');
      
      if (savedUser) {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        
        // Only restore view-as if user is admin
        if (userData.role === 'admin' && savedViewAs) {
          setViewAsRole(savedViewAs);
        }
      }
    } catch (error) {
      console.error('Error parsing saved user:', error);
      localStorage.removeItem('hauler_pro_user');
      localStorage.removeItem('hauler_pro_view_as');
    } finally {
      setLoading(false);
    }
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
        },
        'office@binhaulerpro.com': {
          id: 2,
          email: 'office@binhaulerpro.com',
          name: 'Jane Office',
          role: 'office_staff',
          phone: '555-0002',
          company: 'BinHaulerPro Inc.'
        },
        'driver@binhaulerpro.com': {
          id: 3,
          email: 'driver@binhaulerpro.com',
          name: 'Mike Driver',
          role: 'driver',
          phone: '555-0003',
          company: 'BinHaulerPro Inc.'
        },
        'customer@binhaulerpro.com': {
          id: 4,
          email: 'customer@binhaulerpro.com',
          name: 'Sarah Customer',
          role: 'customer',
          phone: '555-0004',
          company: 'ABC Construction'
        }
      };

      if (mockUsers[email] && password === 'password') {
        const userData = mockUsers[email];
        setUser(userData);
        localStorage.setItem('hauler_pro_user', JSON.stringify(userData));
        
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
    localStorage.removeItem('hauler_pro_user');
    localStorage.removeItem('hauler_pro_view_as');
  };

  // Admin view switcher functions
  const switchViewTo = (role) => {
    if (user?.role === 'admin') {
      setViewAsRole(role);
      localStorage.setItem('hauler_pro_view_as', role);
    }
  };

  const resetView = () => {
    setViewAsRole(null);
    localStorage.removeItem('hauler_pro_view_as');
  };

  // Get effective user role (for permissions and UI)
  const getEffectiveRole = () => {
    if (user?.role === 'admin' && viewAsRole) {
      return viewAsRole;
    }
    return user?.role;
  };

  // Get effective user object (for UI display)
  const getEffectiveUser = () => {
    if (user?.role === 'admin' && viewAsRole) {
      // Return a mock user object for the view-as role
      const viewAsUsers = {
        driver: {
          ...user,
          name: `${user.name} (as Driver)`,
          role: 'driver'
        },
        office_staff: {
          ...user,
          name: `${user.name} (as Office)`,
          role: 'office_staff'
        },
        customer: {
          ...user,
          name: `${user.name} (as Customer)`,
          role: 'customer'
        }
      };
      return viewAsUsers[viewAsRole] || user;
    }
    return user;
  };

  const value = {
    user,
    effectiveUser: getEffectiveUser(),
    effectiveRole: getEffectiveRole(),
    viewAsRole,
    login,
    logout,
    loading,
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