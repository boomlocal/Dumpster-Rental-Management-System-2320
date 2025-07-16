import React, { createContext, useContext, useState } from 'react';
import toast from 'react-hot-toast';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [twilioConfig, setTwilioConfig] = useState({
    accountSid: '',
    authToken: '',
    phoneNumber: '',
    isConfigured: false
  });

  const sendNotification = (type, message, recipient) => {
    try {
      const notification = {
        id: Date.now(),
        type,
        message,
        recipient,
        timestamp: new Date(),
        read: false
      };
      setNotifications(prev => [notification, ...prev]);
      toast.success(`${type.toUpperCase()} notification queued`);
      return { success: true, notification };
    } catch (error) {
      console.error('Notification error:', error);
      toast.error('Failed to send notification');
      return { success: false, error: error.message };
    }
  };

  const sendEmail = (to, subject, body) => {
    return sendNotification('email', `${subject} - ${body}`, to);
  };

  const sendSMS = (to, message) => {
    if (!twilioConfig.isConfigured) {
      toast.error('Twilio not configured. Please set up SMS credentials.');
      return { success: false, error: 'Twilio not configured' };
    }
    
    // In a real app, this would call your backend API
    // For demo purposes, just show as sent
    return sendNotification('sms', message, to);
  };

  const sendVoiceCall = (to, message) => {
    if (!twilioConfig.isConfigured) {
      toast.error('Twilio not configured. Please set up voice credentials.');
      return { success: false, error: 'Twilio not configured' };
    }
    
    // In a real app, this would call your backend API
    // For demo purposes, still show as sent
    return sendNotification('voice', message, to);
  };

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const updateTwilioConfig = (config) => {
    setTwilioConfig(config);
  };

  const value = {
    notifications,
    twilioConfig,
    sendNotification,
    sendEmail,
    sendSMS,
    sendVoiceCall,
    markAsRead,
    updateTwilioConfig
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};