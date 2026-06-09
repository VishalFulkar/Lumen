const { tavily } = require("@tavily/core")
const { logAgent } = require("../services/agentLogger.service")

const client = tavily({
    apiKey: process.env.TAVILY_API_KEY
})

const searchAgent = async (sessionId, topic, depth = "standard") => {
    const start = Date.now();

    // Map depth values to Tavily API settings
    const maxResults = depth === "quick" ? 4 : depth === "deep" ? 15 : 8;
    const searchDepth = depth === "quick" ? "basic" : "advanced";

    await logAgent(
        sessionId,
        "search",
        `Starting web search (${depth} depth)...`,
        "started")

    try {
        const response = await client.search(topic, {
            maxResults,
            searchDepth,
            includeAnswer: true,
            includeRawContent: false
        });

        const results = response.results.map((r) => ({
            url: r.url,
            title: r.title,
            snippet: r.content,
            score: r.score
        }))

        await logAgent(
            sessionId,
            "search",
            `Found ${results.length} sources for "${topic}"`,
            "completed",
            { results, tavilyAnswer: response.answer, },
            Date.now() - start
        );

        return {
            results,
            tavilyAnswer: response.answer
        }
    } catch (error) {
        await logAgent(
            sessionId,
            "search",
            `Search failed: ${error.message}`,
            "failed",
            { error: error.message },
            Date.now() - start
        );

        throw error;
    }
};

module.exports = { searchAgent };