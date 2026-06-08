const mongoose = require("mongoose");

const citationSchema = new mongoose.Schema({
    index: {
        type: Number,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    title: {
        type: String
    },
    valid: {
        type: Boolean,
        default: true
    },
}, { _id: false });

const nodeSchema = new mongoose.Schema({
    id: String,
    label: String,
    type: {
        type: String,
        enum: ['concept', 'person', 'organization', 'event', "source"]
    },
    weight: {
        type: Number,
        default: 1
    },
}, { _id: false });

const edgeSchema = new mongoose.Schema({
    source: String,
    target: String,
    relation: String,
    weight: {
        type: Number,
        default: 1
    },
}, { _id: false });

const reportSchema = new mongoose.Schema({
    sessionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ResearchSession',
        required: true,
        unique: true
    },
    markdown: {
        type: String,
        required: true
    },
    citations: [citationSchema],
    wordCount: {
        type: Number
    },
    knowledgeGraph: {
        nodes: [nodeSchema],
        edges: [edgeSchema],
    },
}, { timestamps: true });

const reportModel = mongoose.model("Report", reportSchema);
module.exports = reportModel;