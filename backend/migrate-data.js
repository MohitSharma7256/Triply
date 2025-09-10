const mongoose = require('mongoose');
const User = require('./models/user.model');
const TravelStory = require('./models/travelStory.model');
const FutureTrip = require('./models/futureTrip.model');

// Connection URIs
const LOCAL_URI = 'mongodb://localhost:27017/travel-story-app';
const ATLAS_URI = 'mongodb+srv://Mohit:uXDskTF9VKGzeWGY@cluster0.aqgwjgh.mongodb.net/Triply';

async function migrateData() {
    let localConnection, atlasConnection;
    
    try {
        console.log('🔄 Starting data migration from localhost to Atlas...');
        
        // Connect to local MongoDB
        console.log('📡 Connecting to local MongoDB...');
        localConnection = await mongoose.createConnection(LOCAL_URI);
        console.log('✅ Connected to local MongoDB');
        
        // Connect to Atlas MongoDB
        console.log('📡 Connecting to Atlas MongoDB...');
        atlasConnection = await mongoose.createConnection(ATLAS_URI);
        console.log('✅ Connected to Atlas MongoDB');
        
        // Create models for both connections
        const LocalUser = localConnection.model('User', User.schema);
        const LocalTravelStory = localConnection.model('TravelStory', TravelStory.schema);
        const LocalFutureTrip = localConnection.model('FutureTrip', FutureTrip.schema);
        
        const AtlasUser = atlasConnection.model('User', User.schema);
        const AtlasTravelStory = atlasConnection.model('TravelStory', TravelStory.schema);
        const AtlasFutureTrip = atlasConnection.model('FutureTrip', FutureTrip.schema);
        
        // Migrate Users
        console.log('👥 Migrating users...');
        const localUsers = await LocalUser.find({});
        console.log(`Found ${localUsers.length} users to migrate`);
        
        for (const user of localUsers) {
            const existingUser = await AtlasUser.findOne({ email: user.email });
            if (!existingUser) {
                await AtlasUser.create(user.toObject());
                console.log(`✅ Migrated user: ${user.email}`);
            } else {
                console.log(`⚠️ User already exists: ${user.email}`);
            }
        }
        
        // Migrate Travel Stories
        console.log('📖 Migrating travel stories...');
        const localStories = await LocalTravelStory.find({});
        console.log(`Found ${localStories.length} travel stories to migrate`);
        
        for (const story of localStories) {
            const existingStory = await AtlasTravelStory.findOne({ 
                title: story.title, 
                userId: story.userId 
            });
            if (!existingStory) {
                await AtlasTravelStory.create(story.toObject());
                console.log(`✅ Migrated story: ${story.title}`);
            } else {
                console.log(`⚠️ Story already exists: ${story.title}`);
            }
        }
        
        // Migrate Future Trips
        console.log('🗓️ Migrating future trips...');
        const localTrips = await LocalFutureTrip.find({});
        console.log(`Found ${localTrips.length} future trips to migrate`);
        
        for (const trip of localTrips) {
            const existingTrip = await AtlasFutureTrip.findOne({ 
                title: trip.title, 
                userId: trip.userId 
            });
            if (!existingTrip) {
                await AtlasFutureTrip.create(trip.toObject());
                console.log(`✅ Migrated trip: ${trip.title}`);
            } else {
                console.log(`⚠️ Trip already exists: ${trip.title}`);
            }
        }
        
        console.log('🎉 Data migration completed successfully!');
        
        // Summary
        const atlasUsers = await AtlasUser.countDocuments();
        const atlasStories = await AtlasTravelStory.countDocuments();
        const atlasTrips = await AtlasFutureTrip.countDocuments();
        
        console.log('\n📊 Migration Summary:');
        console.log(`Users in Atlas: ${atlasUsers}`);
        console.log(`Travel Stories in Atlas: ${atlasStories}`);
        console.log(`Future Trips in Atlas: ${atlasTrips}`);
        
    } catch (error) {
        console.error('❌ Migration failed:', error);
        throw error;
    } finally {
        // Close connections
        if (localConnection) {
            await localConnection.close();
            console.log('🔌 Local connection closed');
        }
        if (atlasConnection) {
            await atlasConnection.close();
            console.log('🔌 Atlas connection closed');
        }
    }
}

// Test Atlas connection only
async function testAtlasConnection() {
    try {
        console.log('🧪 Testing Atlas connection...');
        const connection = await mongoose.connect(ATLAS_URI);
        console.log('✅ Atlas connection successful!');
        
        // Test basic operations
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log(`📁 Available collections: ${collections.map(c => c.name).join(', ')}`);
        
        await mongoose.disconnect();
        console.log('🔌 Atlas connection closed');
        
    } catch (error) {
        console.error('❌ Atlas connection failed:', error);
        throw error;
    }
}

// Run migration or test based on command line argument
const command = process.argv[2];

if (command === 'test') {
    testAtlasConnection()
        .then(() => process.exit(0))
        .catch(() => process.exit(1));
} else if (command === 'migrate') {
    migrateData()
        .then(() => process.exit(0))
        .catch(() => process.exit(1));
} else {
    console.log('Usage:');
    console.log('  node migrate-data.js test     - Test Atlas connection');
    console.log('  node migrate-data.js migrate  - Migrate data from local to Atlas');
    process.exit(1);
}
