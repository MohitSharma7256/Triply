// Load environment configuration
const { loadEnvironment } = require('./environment');
loadEnvironment();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const { authenticateToken } = require("./utilities");
const User = require("./models/user.model");
const TravelStory = require("./models/travelStory.model");
const FutureTrip = require("./models/futureTrip.model");

const app = express();

//multer and image upload connection
const upload = require("./multer");
const fs = require("fs");
const path = require("path");


// Middleware
app.use(express.json());
app.use(cors({
    origin: [
        "https://triply-frontend.onrender.com", // Production frontend URL
        "http://localhost:3000", // Local development
        "http://localhost:5173"  // Vite dev server default
    ],
    credentials: true
}));

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://Mohit:uXDskTF9VKGzeWGY@cluster0.aqgwjgh.mongodb.net/Triply";

mongoose.connect(MONGODB_URI)
    .then(() => console.log("✅ MongoDB connected"))
    .catch((err) => console.error("❌ MongoDB connection failed:", err));

// ✅ Create Account
app.post("/create-account", async (req, res) => {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }

    try {
        const isUser = await User.findOne({ email });
        if (isUser) {
            return res.status(400).json({ success: false, message: "User already exists. Please login." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ fullName, email, password: hashedPassword });
        await user.save();

        const accessToken = jwt.sign(
            { userId: user._id },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "72h" }
        );

        return res.status(201).json({
            success: true,
            message: "Signup successful",
            user: { fullName: user.fullName, email: user.email },
            accessToken
        });

    } catch (error) {
        console.error("❌ Error creating account:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
});

// ✅ Login
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password required" });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const accessToken = jwt.sign(
            { userId: user._id },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "72h" }
        );

        return res.status(200).json({
            message: "Login successful",
            accessToken,
            user: {
                fullName: user.fullName,
                email: user.email
            }
        });

    } catch (err) {
        console.error("❌ Login error:", err);
        return res.status(500).json({ message: "Server error" });
    }
});

// ✅ Get User (Protected)
app.get("/get-user", authenticateToken, async (req, res) => {
    console.log("get-user route hit"); // Debug log
    try {
        const { userId } = req.user;
        console.log("userId:", userId); // Debug log

        const user = await User.findById(userId).select("-password");

        if (!user) {
            return res.status(404).json({ error: true, message: "User not found" });
        }

        return res.status(200).json({
            error: false,
            user,
            message: "User fetched successfully"
        });
    } catch (error) {
        console.error("❌ Error fetching user:", error.message);
        return res.status(500).json({ error: true, message: "Internal server error" });
    }
});

// ==================== TRAVEL STORIES ====================

// Add Travel Story
app.post("/add-travel-story", authenticateToken, async (req, res) => {
    const { title, story, visitedLocation, imageUrl, visitedDate } = req.body;
    const { userId } = req.user;

    if (!title || !story || !visitedLocation || !imageUrl || !visitedDate) {
        return res.status(400).json({
            error: true,
            message: "All fields are required"
        });
    }

    try {
        const newStory = new TravelStory({
            title,
            story,
            visitedLocation,
            imageUrl,
            visitedDate,
            userId
        });

        await newStory.save();

        return res.status(201).json({
            error: false,
            message: "Travel story added successfully",
            story: newStory
        });
    } catch (err) {
        console.error("❌ Error adding travel story:", err);
        return res.status(500).json({
            error: true,
            message: "Internal server error"
        });
    }
});

// ✅ Edit Travel Story
app.put("/edit-travel-story/:id", authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { title, story, visitedLocation, imageUrl, visitedDate, isFavourite } = req.body;
    const userId = req.user?.userId;

    console.log("Edit request - ID:", id, "UserID:", userId); // Debug log

    if (!mongoose.Types.ObjectId.isValid(id)) {
        console.log("Invalid ObjectId:", id); // Debug log
        return res.status(400).json({ error: true, message: "Invalid story ID" });
    }

    try {
        const travelStory = await TravelStory.findOne({ _id: id, userId });
        console.log("Found story:", !!travelStory); // Debug log

        if (!travelStory) {
            return res.status(404).json({
                error: true,
                message: "Travel story not found or you are not authorized to edit it"
            });
        }

        if (title !== undefined) travelStory.title = title;
        if (story !== undefined) travelStory.story = story;
        if (visitedLocation !== undefined) travelStory.visitedLocation = visitedLocation;
        if (imageUrl !== undefined) travelStory.imageUrl = imageUrl;
        if (visitedDate !== undefined) travelStory.visitedDate = visitedDate;
        if (isFavourite !== undefined) travelStory.isFavourite = isFavourite;

        await travelStory.save();

        return res.status(200).json({
            error: false,
            message: "Travel story updated successfully",
            data: travelStory
        });

    } catch (err) {
        console.error("❌ Edit Travel Story Error:", err);
        return res.status(500).json({
            error: true,
            message: "Internal server error",
            details: err.message
        });
    }
});

// ✅ Delete Travel Story
app.delete("/delete-travel-story/:id", authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { userId } = req.user;

    try {
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ error: true, message: "Invalid story ID" });
        }

        const deletedStory = await TravelStory.findOneAndDelete({ _id: id, userId });

        if (!deletedStory) {
            return res.status(404).json({
                error: true,
                message: "Travel story not found or not authorized"
            });
        }

        return res.status(200).json({
            error: false,
            message: "Travel story deleted successfully",
            deletedId: deletedStory._id
        });

    } catch (err) {
        console.error("❌ Delete Travel Story Error:", err);
        return res.status(500).json({
            error: true,
            message: "Internal server error",
            details: err.message
        });
    }
});

// ✅ Update isFavourite status
app.put("/update-favourite/:id", authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { isFavourite } = req.body;
    const { userId } = req.user;

    try {
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ error: true, message: "Invalid story ID" });
        }

        const travelStory = await TravelStory.findOne({ _id: id, userId });

        if (!travelStory) {
            return res.status(404).json({ error: true, message: "Travel story not found or not authorized" });
        }

        travelStory.isFavourite = isFavourite;
        await travelStory.save();

        return res.status(200).json({
            error: false,
            message: "isFavourite updated successfully",
            updatedStory: travelStory
        });

    } catch (error) {
        console.error("❌ Error updating isFavourite:", error);
        return res.status(500).json({ error: true, message: "Internal server error", details: error.message });
    }
});


// 🔍 Search travel stories - Enhanced version with better debugging
app.get('/search/filter', authenticateToken, async (req, res) => {
    try {
        const { query } = req.query; // Changed from searchQuery to query
        const { userId } = req.user;

        console.log("Search query received:", query); // Debugging log

        if (!query || query.trim() === '') {
            return res.status(400).json({
                error: true,
                message: "Search query is required"
            });
        }

        const searchResults = await TravelStory.find({
            userId: userId,
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { story: { $regex: query, $options: 'i' } },
                { visitedLocation: { $regex: query, $options: 'i' } }
            ]
        }).sort({ createdAt: -1 });

        const message = `Found ${searchResults.length} ${searchResults.length === 1 ? 'story' : 'stories'} matching "${query}"`;

        return res.status(200).json({
            error: false,
            stories: searchResults,
            message
        });

    } catch (error) {
        console.error("Search error:", error);
        return res.status(500).json({
            error: true,
            message: "Internal server error"
        });
    }
});

// Get All Travel Stories
app.get("/get-all-stories", authenticateToken, async (req, res) => {
    try {
        const stories = await TravelStory.find({}).sort({ createdOn: -1 });

        return res.status(200).json({
            error: false,
            stories,
            message: "Fetched all travel stories successfully"
        });
    } catch (err) {
        console.error("❌ Error fetching stories:", err);
        return res.status(500).json({
            error: true,
            message: "Internal server error"
        });
    }
});

// 📅 Filter travel stories by date range
app.get("/travel-stories/filter", authenticateToken, async (req, res) => {
    const { startDate, endDate } = req.query;
    const { userId } = req.user;

    try {
        const start = new Date(parseInt(startDate));
        const end = new Date(parseInt(endDate));

        const filteredStories = await TravelStory.find({
            userId: userId,
            visitedDate: { $gte: start, $lte: end },
        }).sort({ isFavourite: -1 });

        return res.status(200).json({ error: false, stories: filteredStories });
    } catch (error) {
        return res.status(500).json({ error: true, message: error.message });
    }
});

// ==================== FUTURE TRIPS ====================

// ✅ Get all future trips for a user
app.get("/future-trips", authenticateToken, async (req, res) => {
    console.log("future-trips route hit"); // Debug log
    try {
        const { userId } = req.user;
        console.log("userId for future trips:", userId); // Debug log

        const trips = await FutureTrip.find({ userId }).sort({ startDate: 1 });

        return res.status(200).json({
            error: false,
            trips,
            message: "Fetched future trips successfully"
        });
    } catch (error) {
        console.error("❌ Error fetching future trips:", error);
        return res.status(500).json({
            error: true,
            message: "Internal server error"
        });
    }
});

// ✅ Add new future trip
app.post("/future-trips", authenticateToken, async (req, res) => {
    const { title, destination, startDate, endDate, description, budget, accommodation, activities } = req.body;
    const { userId } = req.user;

    if (!title || !destination || !startDate || !endDate) {
        return res.status(400).json({
            error: true,
            message: "Title, destination, start date, and end date are required"
        });
    }

    try {
        const newTrip = new FutureTrip({
            title,
            destination,
            startDate,
            endDate,
            description,
            budget,
            accommodation,
            activities: activities || [],
            userId
        });

        await newTrip.save();

        return res.status(201).json({
            error: false,
            message: "Future trip added successfully",
            trip: newTrip
        });
    } catch (error) {
        console.error("❌ Error adding future trip:", error);
        return res.status(500).json({
            error: true,
            message: "Internal server error"
        });
    }
});

// ✅ Update future trip
app.put("/future-trips/:id", authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { title, destination, startDate, endDate, description, budget, accommodation, activities } = req.body;
    const { userId } = req.user;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: true, message: "Invalid trip ID" });
    }

    try {
        const trip = await FutureTrip.findOne({ _id: id, userId });

        if (!trip) {
            return res.status(404).json({
                error: true,
                message: "Future trip not found or you are not authorized to edit it"
            });
        }

        if (title !== undefined) trip.title = title;
        if (destination !== undefined) trip.destination = destination;
        if (startDate !== undefined) trip.startDate = startDate;
        if (endDate !== undefined) trip.endDate = endDate;
        if (description !== undefined) trip.description = description;
        if (budget !== undefined) trip.budget = budget;
        if (accommodation !== undefined) trip.accommodation = accommodation;
        if (activities !== undefined) trip.activities = activities;

        await trip.save();

        return res.status(200).json({
            error: false,
            message: "Future trip updated successfully",
            trip
        });

    } catch (error) {
        console.error("❌ Error updating future trip:", error);
        return res.status(500).json({
            error: true,
            message: "Internal server error"
        });
    }
});

// ✅ Delete future trip
app.delete("/future-trips/:id", authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { userId } = req.user;

    try {
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ error: true, message: "Invalid trip ID" });
        }

        const deletedTrip = await FutureTrip.findOneAndDelete({ _id: id, userId });

        if (!deletedTrip) {
            return res.status(404).json({
                error: true,
                message: "Future trip not found or not authorized"
            });
        }

        return res.status(200).json({
            error: false,
            message: "Future trip deleted successfully",
            deletedId: deletedTrip._id
        });

    } catch (error) {
        console.error("❌ Error deleting future trip:", error);
        return res.status(500).json({
            error: true,
            message: "Internal server error"
        });
    }
});

// ==================== IMAGE UPLOAD ====================

// Serve static files from /uploads
app.use("/uploads", express.static("uploads"));

// ✅ Image Upload Route
app.post("/image-upload", upload.single("image"), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                error: true,
                message: "No file uploaded"
            });
        }

        const filename = req.file.filename;
        const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${filename}`;

        return res.status(200).json({
            error: false,
            message: "Image uploaded successfully",
            imageUrl,
            filename
        });

    } catch (err) {
        console.error("❌ Image Upload Error:", err);
        return res.status(500).json({
            error: true,
            message: "Internal server error",
            details: err.message
        });
    }
});

// ✅ Delete Image Route
app.delete("/delete-image", (req, res) => {
    const { imageUrl } = req.body;

    if (!imageUrl) {
        return res.status(400).json({ error: true, message: "Image URL is required" });
    }

    const imageName = path.basename(imageUrl);
    const imagePath = path.join(__dirname, "uploads", imageName);

    fs.unlink(imagePath, (err) => {
        if (err) {
            console.error("❌ Error deleting image:", err);
            return res.status(500).json({ error: true, message: "Failed to delete image" });
        }

        return res.status(200).json({ error: false, message: "Image deleted successfully" });
    });
});

// ✅ Test Route
app.get("/", (req, res) => {
    res.send("🚀 Travel Story & Planner backend is live!");
});

app.listen(8000, () => {
    console.log("✅ Server running at http://localhost:8000");
});