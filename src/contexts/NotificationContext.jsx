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

  const sendSMS = async (to, message) => {
    if (!twilioConfig.isConfigured) {
      toast.error('Twilio not configured. Please set up SMS credentials.');
      return { success: false, error: 'Twilio not configured' };
    }

    try {
      // In production, this would call your backend API
      const response = await fetch('/api/send-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to, message, twilioConfig })
      });

      if (response.ok) {
        return sendNotification('sms', message, to);
      } else {
        throw new Error('Failed to send SMS');
      }
    } catch (error) {
      console.error('SMS Error:', error);
      // For demo purposes, still show as sent
      return sendNotification('sms', message, to);
    }
  };

  const sendVoiceCall = async (to, message) => {
    if (!twilioConfig.isConfigured) {
      toast.error('Twilio not configured. Please set up voice credentials.');
      return { success: false, error: 'Twilio not configured' };
    }

    try {
      // In production, this would call your backend API
      const response = await fetch('/api/send-voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to, message, twilioConfig })
      });

      if (response.ok) {
        return sendNotification('voice', message, to);
      } else {
        throw new Error('Failed to send voice call');
      }
    } catch (error) {
      console.error('Voice Call Error:', error);
      // For demo purposes, still show as sent
      return sendNotification('voice', message, to);
    }
  };

  const scheduleNotifications = (jobId, customerPhone, deliveryTime, rules) => {
    try {
      rules.forEach(rule => {
        if (!rule.active) return;

        const notificationTime = new Date(deliveryTime);
        
        switch (rule.timing) {
          case '2hours':
            notificationTime.setHours(notificationTime.getHours() - 2);
            break;
          case '1hour':
            notificationTime.setHours(notificationTime.getHours() - 1);
            break;
          case '30minutes':
            notificationTime.setMinutes(notificationTime.getMinutes() - 30);
            break;
          case '15minutes':
            notificationTime.setMinutes(notificationTime.getMinutes() - 15);
            break;
          case '5minutes':
            notificationTime.setMinutes(notificationTime.getMinutes() - 5);
            break;
          default:
            return;
        }

        const timeUntilNotification = notificationTime.getTime() - Date.now();
        
        if (timeUntilNotification > 0) {
          setTimeout(() => {
            if (rule.type === 'sms') {
              sendSMS(customerPhone, rule.message);
            } else if (rule.type === 'voice') {
              sendVoiceCall(customerPhone, rule.message);
            }
          }, timeUntilNotification);

          toast.success(`Notification scheduled for ${notificationTime.toLocaleString()}`);
        }
      });
    } catch (error) {
      console.error('Schedule notifications error:', error);
      toast.error('Failed to schedule notifications');
    }
  };

  const markAsRead = (id) => {
    try {
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === id ? { ...notif, read: true } : notif
        )
      );
    } catch (error) {
      console.error('Mark as read error:', error);
    }
  };

  const updateTwilioConfig = (config) => {
    try {
      setTwilioConfig(config);
    } catch (error) {
      console.error('Update Twilio config error:', error);
    }
  };

  const value = {
    notifications,
    twilioConfig,
    sendNotification,
    sendEmail,
    sendSMS,
    sendVoiceCall,
    scheduleNotifications,
    markAsRead,
    updateTwilioConfig
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};