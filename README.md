# Triply - Travel Story & Trip Planner

A full-stack web application for documenting travel experiences and planning future trips.

## 🌟 Features

- **Travel Stories**: Create, edit, and manage your travel memories with photos
- **Future Trip Planning**: Plan and organize upcoming adventures
- **User Authentication**: Secure login and registration system
- **Search & Filter**: Find your stories by location, title, or content
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Image Upload**: Add photos to your travel stories

## 🚀 Live Demo

- **Frontend**: https://triply-frontend.onrender.com
- **Backend API**: https://triply-backend-4p5t.onrender.com

## 🛠️ Tech Stack

### Frontend
- **React** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling framework
- **Axios** - HTTP client
- **React Router** - Navigation
- **Framer Motion** - Animations

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB Atlas** - Cloud database
- **JWT** - Authentication
- **Multer** - File upload handling
- **bcrypt** - Password hashing

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account
- Git

### Clone Repository
```bash
git clone https://github.com/MohitSharma7256/Triply.git
cd Triply
```

### Backend Setup
```bash
cd backend
npm install

# Create environment files
cp .env.development.example .env.development
cp .env.production.example .env.production

# Update environment variables with your MongoDB URI and JWT secret

# Start development server
npm run dev

# Or start production server
npm run prod
```

### Frontend Setup
```bash
cd frontend
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🔧 Environment Variables

### Backend (.env.production)
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/Triply
ACCESS_TOKEN_SECRET=your_jwt_secret_key
NODE_ENV=production
```

### Frontend (.env.production)
```env
VITE_API_BASE_URL=https://your-backend-url.com
VITE_APP_ENV=production
```

## 📊 Database Migration

If migrating from local MongoDB to Atlas:

```bash
cd backend
npm run test-atlas    # Test Atlas connection
npm run migrate       # Migrate data from local to Atlas
```

## 🚀 Deployment

### Backend (Render/Heroku)
1. Connect your repository
2. Set environment variables
3. Use build command: `npm install`
4. Use start command: `npm run prod`

### Frontend (Vercel/Netlify)
1. Connect your repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables

## 📱 API Endpoints

### Authentication
- `POST /create-account` - Register new user
- `POST /login` - User login
- `GET /get-user` - Get user profile

### Travel Stories
- `GET /get-all-stories` - Get all user stories
- `POST /add-travel-story` - Create new story
- `PUT /edit-travel-story/:id` - Update story
- `DELETE /delete-travel-story/:id` - Delete story
- `PUT /update-favourite/:id` - Toggle favorite status
- `GET /search/filter` - Search stories
- `GET /travel-stories/filter` - Filter by date range

### Future Trips
- `GET /future-trips` - Get all future trips
- `POST /future-trips` - Create new trip
- `PUT /future-trips/:id` - Update trip
- `DELETE /future-trips/:id` - Delete trip

### File Upload
- `POST /image-upload` - Upload image
- `DELETE /delete-image` - Delete image

## 🎨 UI Components

- **Navbar** - Navigation with search functionality
- **ProfileInfo** - User profile dropdown
- **TravelStoryCard** - Story display component
- **AddEditTravelStory** - Story creation/editing modal
- **SearchBar** - Story search component
- **PasswordInput** - Secure password input
- **EmptyCard** - Empty state component

## 🔐 Authentication Flow

1. User registers/logs in
2. JWT token stored in localStorage
3. Token automatically attached to API requests
4. Protected routes redirect to login if unauthenticated
5. Automatic logout on token expiry

## 🐛 Troubleshooting

### Common Issues

**Authentication Errors (401)**
- Check JWT secret in environment variables
- Verify token storage consistency
- Ensure CORS configuration includes frontend URL

**Database Connection Issues**
- Test MongoDB Atlas connection
- Verify connection string format
- Check network access settings in Atlas

**Build Errors**
- Clear node_modules: `rm -rf node_modules && npm install`
- Check Node.js version compatibility
- Verify all dependencies are installed

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For support or questions, please open an issue on GitHub or contact the development team.

---

Built with ❤️ by Mohit Sharma
