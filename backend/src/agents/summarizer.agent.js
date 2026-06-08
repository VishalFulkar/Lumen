const Groq = require("groq-sdk")
const { logAgent } = require("../services/agentLogger.service")

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

const summarizeSource = async (source, topic) => {
    const completion = await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        max_tokens: 300,
        messages: [
            {
                role: "system",
                content: `You are a research assistant. Summarize the given text into exactly 3 bullet points relevant to the research topic. Be concise and factual. Respond ONLY with the 3 bullet points, nothing else. Format:
                - point one,
                - point two,
                - point three`
            },
            {
                role: "user",
                content: `Research topic: "${topic}"\n\nSource title: ${source.title}\n\nContent:\n${source.rawText}`
            }
        ]
    })
    return completion.choices[0].message.content.trim();
}

const summarizerAgent = async (sessionId, sources, topic) => {
    const start = Date.now();

    await logAgent(
        sessionId,
        "summarizer",
        `Summarizing ${sources.length} sources...`,
        "started",
    )

    const summarized = []

    for (let i = 0; i < sources.length; i++) {
        const source = sources[i]
        try {
            await logAgent(
                sessionId,
                "summarizer",
                `Summarizing source ${i + 1}/${sources.length}: ${source.title}`,
                "progress"
            )

            const summary = await summarizeSource(source, topic);

            summarized.push({
                url: source.url,
                title: source.title,
                score: source.score,
                summary,
                chunks: source.chunks, // passed forward to synthesizer
            });
        } catch (error) {
            console.warn(`Failed to summarize ${source.url}: ${error.message}`);

            summarized.push({
                url: source.url,
                title: source.title,
                score: source.score,
                summary: source.rawText.slice(0, 500), // fallback: use raw text
                chunks: source.chunks,
            });
        }
    }

    await logAgent(
        sessionId,
        "summarizer",
        `Summarized ${summarized.length} sources`,
        "completed",
        { summarized: summarized.map(s => ({ url: s.url, title: s.title })) },
        Date.now() - start
    );

    return summarized;
}

module.exports = { summarizerAgent }