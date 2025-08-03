const mongoose = require("mongoose");

const futureTripSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    destination: {
        type: String,
        required: true,
        trim: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    description: {
        type: String,
        trim: true
    },
    budget: {
        type: Number
    },
    accommodation: {
        type: String,
        trim: true
    },
    activities: [{
        type: String,
        trim: true
    }],
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("FutureTrip", futureTripSchema);