const mongoose = require("mongoose")


const nodeSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    label: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['concept', 'person', 'organization', 'event', 'place'],
        default: 'concept'
    },
    weight: {
        type: Number,
        default: 1
    },
}, { _id: false });

const edgeSchema = new mongoose.Schema({
    source: {
        type: String,
        required: true
    },
    target: {
        type: String,
        required: true
    },
    relation: {
        type: String,
        default: ''
    },
    weight: {
        type: Number,
        default: 1
    },
}, { _id: false });

const knowledgeGraphSchema = new mongoose.Schema({
    reportId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Report',
        required: true,
        unique: true
    },
    nodes: [nodeSchema],
    edges: [edgeSchema],
}, { timestamps: true });

const knowledgeGraphModel = mongoose.model("KnowledgeGraph", knowledgeGraphSchema)
module.exports = knowledgeGraphModel;