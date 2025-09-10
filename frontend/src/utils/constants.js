// Use environment variable for API base URL, fallback to production URL
export const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://triply-backend-4p5t.onrender.com'

// Environment detection
export const IS_DEVELOPMENT = import.meta.env.VITE_APP_ENV === 'development'
export const IS_PRODUCTION = import.meta.env.VITE_APP_ENV === 'production'