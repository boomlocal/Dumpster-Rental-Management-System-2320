# Google Maps Setup Instructions for BinHauler

## 📋 Complete Setup Guide

### Step 1: Get Google Maps API Key
1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/

2. **Create or Select a Project**
   - Click "Select a project" → "New Project"
   - Name: "BinHauler Maps" (or any name you prefer)
   - Click "Create"

3. **Enable APIs**
   - Go to "APIs & Services" → "Library"
   - Search for and enable these APIs:
     - ✅ **Maps JavaScript API** (Required)
     - ✅ **Geocoding API** (Recommended)
     - ✅ **Places API** (Optional - for address autocomplete)

4. **Create API Key**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "API key"
   - Copy your API key (looks like: `AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`)

### Step 2: Secure Your API Key (Important!)
1. **Restrict Your API Key**
   - In Credentials, click on your API key
   - Under "Application restrictions":
     - Select "HTTP referrers (web sites)"
     - Add these referrers:
       - `http://localhost:*` (for development)
       - `https://www.app.binhauler.com/*` (for production)

2. **Restrict APIs**
   - Under "API restrictions":
     - Select "Restrict key"
     - Choose: Maps JavaScript API, Geocoding API, Places API

### Step 3: Add API Key to Your Project
1. **Update index.html**
   ```html
   <!-- Replace YOUR_API_KEY with your actual key -->
   <script async defer src="https://maps.googleapis.com/maps/api/js?key=YOUR_ACTUAL_API_KEY&libraries=places">
   </script>
   ```

2. **Alternative: Environment Variable Method**
   - Create `.env` file in project root:
     ```env
     VITE_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
     ```
   - Update index.html:
     ```html
     <script async defer src="https://maps.googleapis.com/maps/api/js?key=%VITE_GOOGLE_MAPS_API_KEY%&libraries=places">
     </script>
     ```

### Step 4: Set Your Business Location
In `src/components/tracking/MapView.jsx`, update the default center:

```javascript
// Replace with your business coordinates
const defaultCenter = {
  lat: 40.7128, // Your latitude
  lng: -74.0060  // Your longitude
};
```

**Find Your Coordinates:**
- Go to Google Maps
- Right-click your business location
- Click the coordinates that appear
- Copy the lat, lng values

### Step 5: Test the Integration
1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Navigate to Dumpster Tracking**
   - Login with any demo account
   - Go to "Tracking" in the sidebar
   - Switch to "Map" view

3. **Verify Features:**
   - ✅ Map loads correctly
   - ✅ Dumpster markers appear
   - ✅ Click markers to see info windows
   - ✅ Map auto-fits to show all dumpsters

## 🔧 Troubleshooting

### Common Issues:
1. **"This page can't load Google Maps correctly"**
   - Check if API key is correct
   - Ensure Maps JavaScript API is enabled
   - Check API restrictions

2. **Map shows gray area**
   - Verify API key has proper permissions
   - Check browser console for errors
   - Ensure billing is enabled in Google Cloud

3. **Markers not appearing**
   - Check dumpster data has valid lat/lng coordinates
   - Verify coordinates are numbers, not strings

### Error Messages:
- **"RefererNotAllowedMapError"**: Add your domain to API restrictions
- **"ApiNotActivatedMapError"**: Enable Maps JavaScript API
- **"QuotaExceededError"**: Check your usage limits or billing

## 💰 Pricing Information

- **Free Tier**: 28,000 map loads per month
- **After Free Tier**: $7 per 1,000 loads
- **Typical Usage**: Small business ~$10-30/month

## 🚀 Production Deployment

1. **Update API restrictions** to include your production domain
2. **Enable billing** in Google Cloud Console
3. **Monitor usage** in Google Cloud Console
4. **Set up usage alerts** to avoid unexpected charges

## 📞 Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify your API key in Google Cloud Console
3. Test with a fresh API key if needed
4. Check Google Maps Platform documentation

---

**Your map should now be working! 🗺️**