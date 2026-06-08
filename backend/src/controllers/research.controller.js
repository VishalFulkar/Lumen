const sessionModel = require('../models/session.model');
const { researchOrchestrator } = require('../agents/orchestrator');
const reportModel = require('../models/reports.model');

const VALID_DEPTHS = ['quick', 'standard', 'deep'];

async function createSession(req, res) {
    try {
        const topic = req.body.topic?.trim();
        const depth = req.body.depth || 'standard';

        if (!topic)
            return res.status(400).json({
                message: 'Topic is required'
            });

        if (topic.length > 200)
            return res.status(400).json({
                message: 'Topic must be under 200 characters'
            });

        if (!VALID_DEPTHS.includes(depth))
            return res.status(400).json({
                message: 'Depth must be quick, standard, or deep'
            });

        const session = await sessionModel.create({
            userId: req.user._id,
            topic,
            depth,
            status: 'pending',
        });

        researchOrchestrator(session._id, topic, depth).catch((error) => {
            console.error(`Error in researchOrchestrator for session ${session._id}:`, error);
        });

        res.status(201).json({
            sessionId: session._id,
            message: 'Session created successfully',
        });
    } catch (error) {
        res.status(500).json({
            message: error.message || 'Internal server error'
        });
    }
}

async function getSessions(req, res) {
    try {
        const sessions = await sessionModel
            .find({ userId: req.user._id })
            .sort({ createdAt: -1 })
            .select('topic depth status completedAt createdAt');

        res.status(200).json({ sessions });
    } catch (error) {
        res.status(500).json({
            message: error.message || 'Internal server error'
        });
    }
}

async function getSession(req, res) {
    try {
        const session = await sessionModel.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (!session)
            return res.status(404).json({
                message: 'Session not found'
            });

        res.status(200).json({ session });
    } catch (error) {
        res.status(500).json({
            message: error.message || 'Internal server error'
        });
    }
}

async function getReport(req, res) {
  try {
    const report = await reportModel.findOne({
      sessionId: req.params.id,
    });

    if (!report)
      return res.status(404).json({ message: "Report not found" });

    // Make sure user owns this session
    const session = await sessionModel.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!session)
      return res.status(403).json({ message: "Unauthorized" });

    res.status(200).json({ report });

  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
}

module.exports = { createSession, getSessions, getSession, getReport };