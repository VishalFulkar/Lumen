const { searchAgent } = require("./search.agent");
const { readerAgent } = require("./reader.agent");
const { summarizerAgent } = require("./summarizer.agent");
const { synthesizerAgent } = require("./synthesizer.agent");
const { extractEntities } = require("./graph.agent");
const { validateCitations } = require("./citation.agent");
const { logAgent } = require("../services/agentLogger.service");
const sessionModel = require("../models/session.model");
const reportModel = require("../models/reports.model");

const researchOrchestrator = async (sessionId, topic, depth = "standard") => {
    try {
        const { results } = await searchAgent(sessionId, topic);

        const sources = await readerAgent(sessionId, results);

        const summarized = await summarizerAgent(sessionId, sources, topic);

        const report = await synthesizerAgent(sessionId, summarized, topic);

        const citationResult = await validateCitations(sessionId, report, summarized);

        let knowledgeGraph = { nodes: [], edges: [] };
        try {
            knowledgeGraph = await extractEntities(sessionId, report, topic);
        } catch (graphError) {
            console.error("Knowledge graph extraction failed, falling back to empty graph:", graphError);
            // We logged "failed" inside extractEntities itself, but let's log to supervisor that we are continuing
            await logAgent(
                sessionId,
                "graph",
                `Graph extraction failed: ${graphError.message}. Continuing with empty graph.`,
                "failed",
                { error: graphError.message },
                0
            );
        }

        const finalReport = await reportModel.create({
            sessionId,
            markdown: report,
            citations: citationResult.validCitations,
            wordCount: report.split(" ").length,
            knowledgeGraph,
        });

        await sessionModel.findByIdAndUpdate(sessionId, {
            status: "completed",
            completedAt: new Date(),
        });

        await logAgent(
            sessionId,
            "supervisor",
            "Research completed successfully",
            "completed",
            { reportId: finalReport._id },
            0
        );

        return finalReport;

    } catch (error) {
        await sessionModel.findByIdAndUpdate(sessionId, {
            status: "failed",
        });

        await logAgent(
            sessionId,
            "supervisor",
            `Research failed: ${error.message}`,
            "failed",
            { error: error.message },
            0
        );

        throw error;
    }
};

module.exports = { researchOrchestrator };