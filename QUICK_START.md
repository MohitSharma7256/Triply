# Triply - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### 1. Clone & Install
```bash
git clone https://github.com/MohitSharma7256/Triply.git
cd Triply

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### 2. Environment Setup
```bash
# Backend - Copy and update environment files
cd backend
cp .env.production .env
# Update MONGODB_URI and ACCESS_TOKEN_SECRET in .env

# Frontend - Copy and update environment files  
cd ../frontend
cp .env.production .env
# Update VITE_API_BASE_URL in .env
```

### 3. Database Migration (if needed)
```bash
cd backend
npm run test-atlas    # Test connection
npm run migrate       # Migrate local data to Atlas
```

### 4. Start Development
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

### 5. Production Build
```bash
# Backend
cd backend
npm run prod

# Frontend
cd frontend
npm run build
npm run preview
```

## 🔗 URLs

- **Development Frontend**: http://localhost:3000
- **Development Backend**: http://localhost:8000
- **Production Frontend**: https://triply-frontend.onrender.com
- **Production Backend**: https://triply-backend-4p5t.onrender.com

## ✅ Verification Checklist

- [ ] Backend starts without errors
- [ ] Frontend loads successfully
- [ ] User registration works
- [ ] User login persists
- [ ] Stories can be created/viewed
- [ ] Image upload functions
- [ ] Search functionality works

## 🆘 Need Help?

Check `DEPLOYMENT_GUIDE.md` for detailed troubleshooting and configuration options.
