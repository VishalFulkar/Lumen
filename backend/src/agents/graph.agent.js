const { logAgent } = require("../services/agentLogger.service");
const Groq = require("groq-sdk");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const extractEntities = async (sessionId, report, topic) => {
  const start = Date.now();

  await logAgent(sessionId, "graph", "Extracting knowledge graph...", "started");

  try {
    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",
      max_tokens: 2000,
      messages: [
        {
          role: "system",
          content: `Extract the top 10-15 most important entities and relationships from the research report. Return ONLY valid JSON in this format:
{
  "nodes": [{"id": "unique_id", "label": "Entity Name", "type": "concept"}],
  "edges": [{"source": "id1", "target": "id2", "relation": "relationship type"}]
}
Allowed values for "type" are exactly: 'concept', 'person', 'organization', 'event', 'source'. You MUST choose exactly one of these options for each node's type.`,
        },
        {
          role: "user",
          content: `Topic: ${topic}\n\nReport:\n"""\n${report.slice(0, 2000)}\n"""\n\nBased on the report above, extract the knowledge graph. You MUST respond with ONLY raw JSON and no other text or markdown.`,
        },
      ],
    });

    const responseText = completion.choices[0]?.message?.content?.trim();

    if (!responseText) throw new Error("Empty response from graph agent");

    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error(`Invalid JSON response from graph agent. Response was: ${responseText}`);

    const graph = JSON.parse(jsonMatch[0]);

    // Validate structure
    if (
      !graph.nodes ||
      !graph.edges ||
      !Array.isArray(graph.nodes) ||
      !Array.isArray(graph.edges)
    ) {
      throw new Error("Invalid graph structure: missing nodes or edges arrays");
    }

    // Sanitize and validate node types to prevent DB validation failure
    const allowedTypes = ['concept', 'person', 'organization', 'event', 'source'];
    graph.nodes = graph.nodes.map(node => {
      let nodeType = String(node.type || 'concept').toLowerCase().trim();
      
      if (nodeType.includes('|')) {
        const parts = nodeType.split('|').map(p => p.trim());
        const matched = parts.find(p => allowedTypes.includes(p));
        nodeType = matched || 'concept';
      }
      
      if (!allowedTypes.includes(nodeType)) {
        nodeType = 'concept';
      }
      
      return {
        ...node,
        type: nodeType
      };
    });

    await logAgent(
      sessionId,
      "graph",
      `Extracted ${graph.nodes.length} entities and ${graph.edges.length} relationships`,
      "completed",
      { nodes: graph.nodes.length, edges: graph.edges.length },
      Date.now() - start
    );

    return graph;

  } catch (error) {
    await logAgent(
      sessionId,
      "graph",
      `Graph extraction failed: ${error.message}`,
      "failed",
      { error: error.message },
      Date.now() - start
    );

    throw error;
  }
};

module.exports = { extractEntities };