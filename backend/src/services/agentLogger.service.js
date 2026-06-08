const agentModel = require('../models/agent.model');
const { getIO } = require('./socket.service');

const VALID_STATUSES = ['started', 'progress', 'completed', 'failed'];

const logAgent = async (sessionId, agentId, message, status, payload = {}, durationMs = 0) => {
    if (!VALID_STATUSES.includes(status)) {
        console.warn(`Invalid agent status "${status}" — defaulting to "progress"`);
        status = 'progress';
    }

    // Emit to frontend first — never let DB block UI updates
    try {
        getIO().to(sessionId.toString()).emit('agent:update', {
            agentId,
            status,
            message,
            payload,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error('Socket emit failed:', error.message);
    }

    // Persist to DB — secondary, non-blocking
    try {
        await agentModel.create({
            sessionId,
            agentId,
            message,
            status,
            payload,
            durationMs
        });
    } catch (error) {
        console.error('AgentLog DB write failed:', error.message);
    }
};

module.exports = { logAgent };