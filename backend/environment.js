const path = require('path');

// Load environment variables based on NODE_ENV
function loadEnvironment() {
    const env = process.env.NODE_ENV || 'production';
    
    let envFile;
    if (env === 'development') {
        envFile = '.env.development';
    } else {
        envFile = '.env.production';
    }
    
    const envPath = path.resolve(__dirname, envFile);
    
    try {
        require('dotenv').config({ path: envPath });
        console.log(`✅ Loaded environment from ${envFile}`);
        console.log(`🌍 Environment: ${env}`);
        console.log(`🗄️ Database: ${process.env.MONGODB_URI ? 'Atlas' : 'Local'}`);
    } catch (error) {
        console.warn(`⚠️ Could not load ${envFile}, using default .env`);
        require('dotenv').config();
    }
    
    // Validate required environment variables
    const required = ['MONGODB_URI', 'ACCESS_TOKEN_SECRET'];
    const missing = required.filter(key => !process.env[key]);
    
    if (missing.length > 0) {
        console.error(`❌ Missing required environment variables: ${missing.join(', ')}`);
        process.exit(1);
    }
}

module.exports = { loadEnvironment };
