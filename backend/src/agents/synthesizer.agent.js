const Groq = require("groq-sdk");
const { logAgent } = require("../services/agentLogger.service");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const synthesizeReport = async (topic, summarizedSources) => {
    const sourcesContext = summarizedSources.map(
        (s, idx) =>
            `[[Source ${idx + 1}] ${s.title} (${s.url}) Summary: ${s.summary}]`
    ).join("\n\n")

    const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        max_tokens: 2000,
        messages: [
            {
                role: "system",
                content: `You are an expert research synthesizer. Your task is to write a comprehension research report on the given topic using provided sources
                Rules:
                1. Write in clear, academic prose
                2. Use [Source N] citations inline when referencing information
                3. Organize the report into these sections: Overview, Key Concepts, Current State, Challenges, and Future Outlook
                4. Be factual and avoid speculation beyond what the sources say
                5. Aim for 800-1200 words total`,
            },
            {
                role: "user",
                content: `Research topic: "${topic}"
                            Available sources with summaries:
                            ${sourcesContext}
                            Please write a comprehensive research report that synthesizes all this information.
                        `
            }
        ]
    })
    return completion.choices[0].message.content.trim();
}

const synthesizerAgent = async (sessionId, summarizedSources, topic) => {
    const start = Date.now();

    await logAgent(
        sessionId,
        "synthesizer",
        "Synthesizing research report...",
        "started"
    )
    try {
        const report = await synthesizeReport(topic, summarizedSources);

        await logAgent(
            sessionId,
            "synthesizer",
            "Research report completed",
            "completed",
            { wordCount: report.split(" ").length },
            Date.now() - start
        );

        return report;

    } catch (error) {
        await logAgent(
            sessionId,
            "synthesizer",
            `Synthesis failed: ${error.message}`,
            "failed",
            { error: error.message },
            Date.now() - start
        )
        throw error
    }
}

module.exports = { synthesizerAgent }