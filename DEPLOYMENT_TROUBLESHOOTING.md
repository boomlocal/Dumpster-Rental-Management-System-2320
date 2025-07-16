# Deployment Troubleshooting Guide

## 🚨 Common URL/Routing Issues

### 1. **Hash Router vs Browser Router**
- ✅ **Using HashRouter**: URLs will have `#` (e.g., `domain.com/#/dashboard`)
- ❌ **Browser Router**: Requires server configuration for SPA routing

### 2. **Build and Serve Commands**
```bash
# Development
npm run dev
# Opens: http://localhost:5173

# Production Build
npm run build
npm run preview
# Opens: http://localhost:4173
```

### 3. **Static Hosting Deployment**

#### **Vercel**
```json
// vercel.json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

#### **Netlify**
```
// public/_redirects
/*    /index.html   200
```

#### **GitHub Pages**
- Use HashRouter (already configured)
- Set base path in vite.config.js if needed

### 4. **Local Testing**
```bash
# After building
npm run build
cd dist
python -m http.server 8000
# or
npx serve -s .
```

## 🔧 Quick Fixes

### If URLs don't work:
1. **Check the console** for JavaScript errors
2. **Verify build output** - check if `dist/` folder exists
3. **Test locally first** with `npm run preview`
4. **Check base path** in vite.config.js

### If routes redirect incorrectly:
1. **Clear browser cache**
2. **Check for typos** in route paths
3. **Verify authentication logic**

### If assets don't load:
1. **Check base path** configuration
2. **Verify asset paths** are relative
3. **Check build output** structure

## 🌐 Deployment URLs

### Expected URL Structure:
- **Root**: `domain.com/` → Login page
- **Dashboard**: `domain.com/#/app/dashboard`
- **Inventory**: `domain.com/#/app/inventory`
- **Customer Portal**: `domain.com/#/customer-portal`

### Demo Access:
```
Admin: admin@binhauler.com / password
Office: office@binhauler.com / password
Driver: driver@binhauler.com / password
Customer: customer@binhauler.com / password
```

## 📱 Testing Checklist

- [ ] Login page loads at root URL
- [ ] Authentication redirects work
- [ ] Dashboard loads after login
- [ ] Navigation between pages works
- [ ] Inventory page displays correctly
- [ ] All assets (CSS, JS, images) load
- [ ] Mobile responsive design works
- [ ] Browser back/forward buttons work

## 🆘 Still Having Issues?

1. **Check browser developer console** for errors
2. **Test in incognito/private mode**
3. **Try different browsers**
4. **Verify hosting platform requirements**
5. **Check if HTTPS is required**

The app should now work correctly with proper routing and deployment configuration!
```