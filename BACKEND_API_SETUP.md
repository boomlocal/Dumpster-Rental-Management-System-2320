# Backend API Setup for BinHaulerPro

## 📋 Required Backend Endpoints

### SMS & Voice Notifications (Twilio Integration)

Create these endpoints in your backend:

#### 1. Send SMS Endpoint
```javascript
// POST /api/send-sms
app.post('/api/send-sms', async (req, res) => {
  const { to, message, twilioConfig } = req.body;
  
  try {
    const client = require('twilio')(twilioConfig.accountSid, twilioConfig.authToken);
    
    const messageResult = await client.messages.create({
      body: message,
      from: twilioConfig.phoneNumber,
      to: to
    });
    
    res.json({ success: true, messageSid: messageResult.sid });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
```

#### 2. Send Voice Call Endpoint
```javascript
// POST /api/send-voice
app.post('/api/send-voice', async (req, res) => {
  const { to, message, twilioConfig } = req.body;
  
  try {
    const client = require('twilio')(twilioConfig.accountSid, twilioConfig.authToken);
    
    const call = await client.calls.create({
      twiml: `<Response><Say>${message}</Say></Response>`,
      to: to,
      from: twilioConfig.phoneNumber
    });
    
    res.json({ success: true, callSid: call.sid });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
```

### GPS Tracking Endpoints

#### 3. Update Driver Location
```javascript
// POST /api/driver/location
app.post('/api/driver/location', async (req, res) => {
  const { driverId, lat, lng, speed, heading, timestamp } = req.body;
  
  try {
    // Save to database
    await db.driverLocations.create({
      driverId,
      latitude: lat,
      longitude: lng,
      speed,
      heading,
      timestamp: new Date(timestamp)
    });
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
```

#### 4. Get Driver Locations
```javascript
// GET /api/driver/locations
app.get('/api/driver/locations', async (req, res) => {
  try {
    const locations = await db.driverLocations.findAll({
      where: {
        timestamp: {
          [Op.gte]: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
        }
      },
      order: [['timestamp', 'DESC']]
    });
    
    res.json({ success: true, locations });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
```

## 🔧 Environment Variables

Create a `.env` file in your backend:

```env
# Twilio Configuration (Optional - can be set per-tenant)
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=your_phone_number

# Database
DATABASE_URL=your_database_url

# JWT Secret
JWT_SECRET=your_jwt_secret

# CORS Origins
CORS_ORIGINS=http://localhost:5173,https://binhaulerpro.com
```

## 📱 Mobile App Considerations

For the driver's mobile app GPS tracking:

### Option 1: PWA (Progressive Web App)
- Works in mobile browsers
- Can access GPS location
- No app store required
- Easy to deploy

### Option 2: React Native App
- Better GPS accuracy
- Background location tracking
- Push notifications
- Native mobile experience

### Option 3: Hybrid Solution
- Use PWA for now
- Upgrade to React Native later
- Keep same backend APIs

## 🔐 Security Considerations

1. **API Authentication**: Use JWT tokens
2. **Rate Limiting**: Prevent API abuse
3. **Input Validation**: Sanitize all inputs
4. **CORS**: Restrict to your domain
5. **HTTPS**: Always use SSL/TLS
6. **Twilio Webhooks**: Verify webhook signatures

## 📊 Database Schema

### Driver Locations Table
```sql
CREATE TABLE driver_locations (
  id SERIAL PRIMARY KEY,
  driver_id INTEGER REFERENCES users(id),
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  speed DECIMAL(5, 2),
  heading DECIMAL(5, 2),
  accuracy DECIMAL(6, 2),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Notification Logs Table
```sql
CREATE TABLE notification_logs (
  id SERIAL PRIMARY KEY,
  job_id INTEGER REFERENCES jobs(id),
  customer_id INTEGER REFERENCES users(id),
  type VARCHAR(20) NOT NULL, -- 'sms' or 'voice'
  message TEXT NOT NULL,
  recipient VARCHAR(20) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  twilio_sid VARCHAR(100),
  sent_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🚀 Deployment

### Frontend (Static Hosting)
- **Vercel**: Recommended for React apps
- **Netlify**: Great for static sites
- **AWS S3 + CloudFront**: Enterprise solution

### Backend (API Server)
- **Heroku**: Easy deployment
- **Railway**: Modern alternative
- **AWS EC2**: Full control
- **DigitalOcean**: Simple VPS

### Database
- **PostgreSQL**: Recommended
- **MySQL**: Alternative
- **MongoDB**: NoSQL option

## 📞 Support

For implementation help:
1. Check the frontend notification context
2. Test Twilio credentials in their console
3. Verify API endpoints with Postman
4. Monitor server logs for errors
```