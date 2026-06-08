const mongoose = require("mongoose")

const sourceSchema = new mongoose.Schema({
    sessionId: {
        type: mongoose.Schema.Types,
        ref: "ResearchSession"
    },
    url: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    summary: {
        type: String,
        default: null
    },
    rawChunks: {
        type: [String],
        default: [],
        required: true
    },
    credibilityScore: {
        type: Number,
        default: 0.5,
        min: 0,
        max: 1,
        required: true
    },
    pineconeId: {
        type: String,
        default: null
    },
    isDuplicate: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })


sourceSchema.index({ sessionId: 1 });
sourceSchema.index({ pineconeId: 1 });

const sourceModel = mongoose.model("Source", sourceSchema)
module.exports = sourceModel;