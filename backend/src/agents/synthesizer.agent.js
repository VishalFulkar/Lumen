const Groq = require("groq-sdk");
const { logAgent } = require("../services/agentLogger.service");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const synthesizeReport = async (topic, summarizedSources, depth = "standard") => {
    const sourcesContext = summarizedSources.map(
        (s, idx) =>
            `[[Source ${idx + 1}] ${s.title} (${s.url}) Summary: ${s.summary}]`
    ).join("\n\n")

    // Configure layout/constraints based on depth
    let maxTokens = 2000;
    let systemInstruction = "";

    if (depth === "quick") {
        maxTokens = 1000;
        systemInstruction = `You are an expert research synthesizer. Your task is to write a concise research report on the given topic using provided sources.
                Rules:
                1. Write in clear, academic prose
                2. Use [Source N] citations inline when referencing information
                3. Organize the report into these sections: Overview, Key Findings, and Summary
                4. Be factual and avoid speculation beyond what the sources say
                5. Aim for 300-500 words total`;
    } else if (depth === "deep") {
        maxTokens = 4000;
        systemInstruction = `You are an expert research synthesizer. Your task is to write a highly comprehensive and detailed research report on the given topic using provided sources.
                Rules:
                1. Write in clear, academic prose
                2. Use [Source N] citations inline when referencing information
                3. Organize the report into these detailed sections: Overview, Detailed Background & Context, Key Concepts, Current State & Case Studies, Deep Challenges & Gaps, and Future Outlook & Strategic Recommendations
                4. Be factual and avoid speculation beyond what the sources say
                5. Aim for 1500-2500 words total`;
    } else {
        // standard
        maxTokens = 2000;
        systemInstruction = `You are an expert research synthesizer. Your task is to write a comprehensive research report on the given topic using provided sources.
                Rules:
                1. Write in clear, academic prose
                2. Use [Source N] citations inline when referencing information
                3. Organize the report into these sections: Overview, Key Concepts, Current State, Challenges, and Future Outlook
                4. Be factual and avoid speculation beyond what the sources say
                5. Aim for 800-1200 words total`;
    }

    const completion = await groq.chat.completions.create({
        model: "openai/gpt-oss-120b",
        max_tokens: maxTokens,
        messages: [
            {
                role: "system",
                content: systemInstruction,
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

const synthesizerAgent = async (sessionId, summarizedSources, topic, depth = "standard") => {
    const start = Date.now();

    await logAgent(
        sessionId,
        "synthesizer",
        `Synthesizing research report (${depth} depth)...`,
        "started"
    )
    try {
        const report = await synthesizeReport(topic, summarizedSources, depth);

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