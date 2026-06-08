const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    topic: {
        type: String,
        required: true
    },
    depth: {
        type: String,
        enum: {
            values : ['quick', 'standard', 'deep'], 
            default: 'standard'
        }
    },
    status: {
        type : String,
        enum: {
            values : ['pending', 'running', 'completed', 'failed'],
            default: "pending"
        }
    },
    graphState: {
        type: mongoose.Schema.Types.Mixed,
        default : {}
    },
    completedAt: {
        type: Date,
        default: null
    }
},{timestamps : true})

sessionSchema.index({ userId: 1, createdAt: -1 });

const sessionModel = mongoose.model("ResearchSession",sessionSchema)
module.exports = sessionModel;