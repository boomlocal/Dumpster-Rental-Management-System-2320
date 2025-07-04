# Twilio Setup Guide for BinHaulerPro

## 📋 Complete Setup Instructions

### Step 1: Create Twilio Account
1. Go to https://www.twilio.com/
2. Click "Sign up for free"
3. Complete account verification
4. Get $15 free credit for testing

### Step 2: Get Your Credentials
1. **Login to Twilio Console**: https://console.twilio.com/
2. **Find Your Credentials**:
   - Account SID: `ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - Auth Token: Click "Show" to reveal
   - Copy both values

### Step 3: Get a Phone Number
1. **Go to Phone Numbers**: Console → Phone Numbers → Manage → Buy a number
2. **Choose Capabilities**:
   - ✅ SMS
   - ✅ Voice
   - ✅ MMS (optional)
3. **Select Number**: Choose a number in your area
4. **Purchase**: Usually $1/month

### Step 4: Configure in BinHaulerPro
1. **Login as Admin**: Use `admin@binhaulerpro.com`
2. **Go to Notifications**: Click "Notifications" in sidebar
3. **Enter Twilio Settings**:
   - Account SID: `ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - Auth Token: `your_auth_token`
   - Phone Number: `+1234567890`
4. **Save Configuration**

### Step 5: Test Your Setup
1. **Create a Test Job** with customer phone number
2. **Set Notification Rules**:
   - SMS: "Your delivery is coming in 1 hour"
   - Voice: "This is a delivery reminder"
3. **Schedule Test Notifications**

## 💰 Pricing Information

### SMS Pricing (US)
- **Outbound SMS**: $0.0075 per message
- **Inbound SMS**: $0.0075 per message
- **Example**: 1,000 SMS = $7.50

### Voice Pricing (US)
- **Outbound Calls**: $0.0085 per minute
- **Inbound Calls**: $0.0085 per minute
- **Example**: 100 calls × 1 min = $0.85

### Phone Number
- **Monthly Cost**: $1.00 per number
- **Setup Fee**: $0.00

## 🔧 Advanced Configuration

### Webhook Setup (Optional)
1. **Go to Phone Numbers**: Console → Phone Numbers → Manage
2. **Select Your Number**
3. **Configure Webhooks**:
   - SMS: `https://yourdomain.com/api/sms-webhook`
   - Voice: `https://yourdomain.com/api/voice-webhook`

### Message Templates
Create reusable templates for:
- Delivery confirmations
- Pickup reminders
- Schedule changes
- Payment notifications

### Compliance Features
- **Opt-out Support**: Automatic STOP/START handling
- **Carrier Filtering**: Prevent spam
- **Message Validation**: Check phone numbers

## 🛡️ Security Best Practices

1. **Never Expose Credentials**: Keep Auth Token secret
2. **Use Environment Variables**: Store in backend only
3. **Webhook Validation**: Verify Twilio signatures
4. **Rate Limiting**: Prevent abuse
5. **Monitor Usage**: Set up alerts

## 📱 Testing Tips

### Test Phone Numbers
Twilio provides test numbers for development:
- Test SMS: Use verified numbers
- Test Voice: Use Twilio test numbers
- No charges for test numbers

### Debugging
1. **Check Logs**: Console → Monitor → Logs
2. **Error Codes**: https://www.twilio.com/docs/api/errors
3. **Status Callbacks**: Track message delivery

## 🚀 Production Checklist

Before going live:
- [ ] Account verified and upgraded
- [ ] Phone number purchased
- [ ] Webhook endpoints configured
- [ ] Error handling implemented
- [ ] Usage monitoring setup
- [ ] Compliance features enabled

## 📊 Usage Monitoring

### Set Up Alerts
1. **Usage Alerts**: Console → Usage → Alerts
2. **Budget Limits**: Set monthly spending limits
3. **Notification Emails**: Get usage reports

### Analytics
- **Message Delivery**: Track success rates
- **Call Quality**: Monitor voice metrics
- **Cost Analysis**: Review spending patterns

## 🔄 Integration Code Examples

### Backend SMS Function
```javascript
const twilio = require('twilio');

async function sendSMS(to, message, config) {
  const client = twilio(config.accountSid, config.authToken);
  
  try {
    const result = await client.messages.create({
      body: message,
      from: config.phoneNumber,
      to: to
    });
    
    return { success: true, sid: result.sid };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
```

### Backend Voice Function
```javascript
async function makeVoiceCall(to, message, config) {
  const client = twilio(config.accountSid, config.authToken);
  
  try {
    const call = await client.calls.create({
      twiml: `<Response><Say voice="alice">${message}</Say></Response>`,
      to: to,
      from: config.phoneNumber
    });
    
    return { success: true, sid: call.sid };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
```

## 🆘 Troubleshooting

### Common Issues
1. **"Unverified Number"**: Add to verified numbers in console
2. **"Invalid Phone Number"**: Use E.164 format (+1234567890)
3. **"Insufficient Balance"**: Add funds to account
4. **"Webhook Timeout"**: Check endpoint response time

### Getting Help
- **Documentation**: https://www.twilio.com/docs
- **Support**: Console → Help → Contact Support
- **Community**: https://community.twilio.com/

---

**Your SMS and Voice notifications are now ready! 📱📞**