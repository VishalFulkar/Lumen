const mongoose = require("mongoose");

const agentLogSchema = new mongoose.Schema({
    sessionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ResearchSession',
        required: true
    },
    agentId: {
        type: String,
        required: true,
        enum: ['supervisor', 'search', 'reader', 'summarizer', 'citation', 'graph', 'synthesizer']
    },
    message: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['started', 'progress', 'completed', 'failed'],
        required: true
    },
    payload: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    durationMs: {
        type: Number,
        default: 0
    },
}, { timestamps: true });

agentLogSchema.index({ sessionId: 1, createdAt: 1 });

const agentLogModel = mongoose.model("AgentLog", agentLogSchema);
module.exports = agentLogModel;