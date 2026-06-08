const { logAgent } = require("../services/agentLogger.service");

const validateCitations = async (sessionId, report, sources) => {
    const start = Date.now();

    await logAgent(
        sessionId,
        "citation",
        "Validating citations...",
        "started"
    );

    // Extract all [Source N] references from report
    const citationRegex = /\[Source (\d+)\]/g;
    const citations = [];
    let match;

    while ((match = citationRegex.exec(report)) !== null) {
        const sourceNum = parseInt(match[1]);
        citations.push(sourceNum);
    }

    // Validate each citation
    const validCitations = [];
    const invalidCitations = [];

    citations.forEach((sourceNum) => {
        if (sourceNum > 0 && sourceNum <= sources.length) {
            validCitations.push({
                index: sourceNum,
                url: sources[sourceNum - 1].url,
                title: sources[sourceNum - 1].title,
                valid: true,
            });
        } else {
            invalidCitations.push({
                index: sourceNum,
                valid: false,
                reason: `Source ${sourceNum} does not exist (only ${sources.length} sources available)`,
            });
        }
    });

    await logAgent(
        sessionId,
        "citation",
        `Validated ${validCitations.length} citations, flagged ${invalidCitations.length} invalid`,
        "completed",
        {
            valid: validCitations.length,
            invalid: invalidCitations.length,
            citations: validCitations,
        },
        Date.now() - start
    );

    return {
        validCitations,
        invalidCitations,
        allValid: invalidCitations.length === 0,
    };
};

module.exports = { validateCitations };