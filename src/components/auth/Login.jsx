import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiTruck, FiMail, FiLock, FiEye, FiEyeOff, FiAlertCircle } = FiIcons;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await login(email, password);
      if (result.success) {
        // Navigate based on user role
        if (result.user.role === 'customer') {
          navigate('/customer-portal');
        } else {
          navigate('/dashboard');
        }
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demoEmail) => {
    setEmail(demoEmail);
    setPassword('password');
    setError('');
    setLoading(true);

    try {
      const result = await login(demoEmail, 'password');
      if (result.success) {
        if (result.user.role === 'customer') {
          navigate('/customer-portal');
        } else {
          navigate('/dashboard');
        }
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-primary-100 p-3 rounded-full">
              <SafeIcon icon={FiTruck} className="w-8 h-8 text-primary-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">BinHaulerPro</h1>
          <p className="text-gray-600">Dumpster Rental Management</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <SafeIcon icon={FiMail} className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <SafeIcon icon={FiLock} className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                <SafeIcon icon={showPassword ? FiEyeOff : FiEye} className="w-5 h-5" />
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center">
              <SafeIcon icon={FiAlertCircle} className="w-4 h-4 mr-2" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-3 font-medium">Demo Accounts:</p>
          <div className="space-y-2">
            <button
              onClick={() => handleDemoLogin('admin@binhaulerpro.com')}
              className="w-full text-left text-xs text-gray-700 hover:text-primary-600 p-2 hover:bg-white rounded transition-colors"
              disabled={loading}
            >
              <strong>Admin:</strong> admin@binhaulerpro.com / password
            </button>
            <button
              onClick={() => handleDemoLogin('office@binhaulerpro.com')}
              className="w-full text-left text-xs text-gray-700 hover:text-primary-600 p-2 hover:bg-white rounded transition-colors"
              disabled={loading}
            >
              <strong>Office:</strong> office@binhaulerpro.com / password
            </button>
            <button
              onClick={() => handleDemoLogin('driver@binhaulerpro.com')}
              className="w-full text-left text-xs text-gray-700 hover:text-primary-600 p-2 hover:bg-white rounded transition-colors"
              disabled={loading}
            >
              <strong>Driver:</strong> driver@binhaulerpro.com / password
            </button>
            <button
              onClick={() => handleDemoLogin('customer@binhaulerpro.com')}
              className="w-full text-left text-xs text-gray-700 hover:text-primary-600 p-2 hover:bg-white rounded transition-colors"
              disabled={loading}
            >
              <strong>Customer:</strong> customer@binhaulerpro.com / password
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;