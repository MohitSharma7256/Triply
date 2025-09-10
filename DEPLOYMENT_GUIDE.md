# Triply - Deployment Guide

## 🚀 Production Deployment URLs

- **Frontend**: https://triply-frontend.onrender.com
- **Backend**: https://triply-backend-4p5t.onrender.com
- **Database**: MongoDB Atlas (Triply database)

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account
- Render.com account (or similar hosting platform)

## 🔧 Environment Configuration

### Frontend Environment Variables

**Development (.env.development)**
```env
VITE_API_BASE_URL=http://localhost:8000
VITE_APP_ENV=development
```

**Production (.env.production)**
```env
VITE_API_BASE_URL=https://triply-backend-4p5t.onrender.com
VITE_APP_ENV=production
```

### Backend Environment Variables

**Development (.env.development)**
```env
MONGODB_URI=mongodb://localhost:27017/travel-story-app
ACCESS_TOKEN_SECRET=triply_jwt_secret_development_key_2024
NODE_ENV=development
```

**Production (.env.production)**
```env
MONGODB_URI=mongodb+srv://Mohit:uXDskTF9VKGzeWGY@cluster0.aqgwjgh.mongodb.net/Triply
ACCESS_TOKEN_SECRET=triply_jwt_secret_production_key_2024_secure
NODE_ENV=production
```

## 🏗️ Build Commands

### Frontend
```bash
# Development build
npm run build:dev

# Production build
npm run build

# Development server
npm run dev

# Preview production build
npm run preview
```

### Backend
```bash
# Development mode
npm run dev

# Production mode
npm run prod

# Standard start
npm start

# Test Atlas connection
npm run test-atlas

# Migrate data to Atlas
npm run migrate
```

## 📊 Database Migration

### Step 1: Test Atlas Connection
```bash
cd backend
npm run test-atlas
```

### Step 2: Migrate Data from Local to Atlas
```bash
npm run migrate
```

### Step 3: Verify Migration
The migration script will show a summary of migrated data:
- Users migrated
- Travel Stories migrated  
- Future Trips migrated

## 🔐 Authentication Flow

1. **Registration**: User creates account → JWT token stored as "token" in localStorage
2. **Login**: User authenticates → JWT token stored as "token" in localStorage
3. **Protected Routes**: Token automatically attached to requests via axios interceptor
4. **Token Expiry**: 401 responses automatically clear token and redirect to login

## 🌐 CORS Configuration

Backend allows requests from:
- `https://triply-frontend.onrender.com` (Production)
- `http://localhost:3000` (Development)
- `http://localhost:5173` (Vite dev server)

## 📁 Project Structure

```
Triply Story (Full Stack)/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── utils/
│   │   │   ├── constants.js      # API base URL configuration
│   │   │   ├── axiosInstance.js  # HTTP client with interceptors
│   │   │   └── authUtils.js      # Authentication utilities
│   │   └── App.jsx
│   ├── .env.development
│   ├── .env.production
│   └── package.json
├── backend/
│   ├── models/
│   ├── uploads/
│   ├── .env.development
│   ├── .env.production
│   ├── environment.js            # Environment loader
│   ├── migrate-data.js          # Data migration script
│   ├── index.js                 # Main server file
│   └── package.json
└── DEPLOYMENT_GUIDE.md
```

## 🚨 Troubleshooting

### Common Issues

**1. 401 Authentication Errors**
- Ensure JWT secret is set in environment variables
- Check token storage key consistency ("token")
- Verify CORS configuration includes your frontend URL

**2. Database Connection Issues**
- Test Atlas connection: `npm run test-atlas`
- Verify MongoDB URI format and credentials
- Check network access in Atlas dashboard

**3. Frontend-Backend Communication**
- Verify BASE_URL in constants.js
- Check environment variables are loaded correctly
- Ensure CORS allows your frontend domain

**4. Build Issues**
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version compatibility
- Verify all environment variables are set

### Debug Commands

```bash
# Check environment loading
node -e "require('./environment').loadEnvironment(); console.log(process.env.MONGODB_URI)"

# Test API endpoints
curl https://triply-backend-4p5t.onrender.com/

# Check frontend build
npm run build && npm run preview
```

## 📝 Deployment Checklist

- [ ] Environment variables configured for production
- [ ] MongoDB Atlas connection tested
- [ ] Data migrated from local to Atlas
- [ ] Frontend built for production
- [ ] Backend deployed with production environment
- [ ] CORS configured for production frontend URL
- [ ] Authentication flow tested end-to-end
- [ ] All API endpoints responding correctly

## 🔄 Continuous Deployment

For automatic deployments, ensure your hosting platform:
1. Uses the correct build commands
2. Sets environment variables properly
3. Handles environment-specific configurations
4. Has proper health checks configured

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Verify all environment variables are set correctly
3. Test individual components (database, backend, frontend) separately
4. Check browser console and server logs for detailed error messages
