const axios = require("axios");
const pLimit = require("p-limit").default;
const cheerio = require("cheerio");
const { logAgent } = require("../services/agentLogger.service");

const limit = pLimit(3);

const isPDF = (url) => url.toLowerCase().endsWith(".pdf");

const fetchAndClean = async (url) => {
  const response = await axios.get(url, {
    timeout: 8000,
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; ResearchBot/1.0)",
    },
  });

  const $ = cheerio.load(response.data);

  $(
    "script, style, nav, footer, header, iframe, noscript, img, svg, " +
    ".nav, .menu, .sidebar, .cookie, .banner, .ad"
  ).remove();

  const text = $("body")
    .text()
    .replace(/\s+/g, " ")
    .trim();

  return text;
};

const chunkText = (text, chunkSize = 500) => {
  const words = text.split(" ");
  const chunks = [];

  for (let i = 0; i < words.length; i += chunkSize) {
    const chunk = words.slice(i, i + chunkSize).join(" ");
    if (chunk.trim()) {
      chunks.push(chunk.trim());
    }
  }

  return chunks;
};

const readerAgent = async (sessionId, searchResults) => {
  const start = Date.now();

  await logAgent(
    sessionId,
    "reader",
    `Reading ${searchResults.length} sources...`,
    "started"
  );

  const sources = await Promise.allSettled(
    searchResults.map(({ url, title, score }) =>
      limit(async () => {
        try {
          if (isPDF(url)) {
            console.warn(`Skipping PDF: ${url}`);
            return null;
          }

          const rawText = await fetchAndClean(url);

          if (rawText.length < 200) {
            console.warn(`Skipping thin content: ${url}`);
            return null;
          }

          const chunks = chunkText(rawText);

          return { url, title, score, chunks, rawText: rawText.slice(0, 3000) };

        } catch (error) {
          console.warn(`Failed to read ${url}: ${error.message}`);
          return null;
        }
      })
    )
  );

  const validSources = sources
    .filter((r) => r.status === "fulfilled" && r.value !== null)
    .map((r) => r.value);

  if (validSources.length === 0) {
    await logAgent(
      sessionId,
      "reader",
      "Failed to read any sources",
      "failed",
      {},
      Date.now() - start
    );
    throw new Error("Reader agent: no valid sources could be fetched");
  }

  await logAgent(
    sessionId,
    "reader",
    `Successfully read ${validSources.length}/${searchResults.length} sources`,
    "completed",
    {
      totalSources: searchResults.length,
      validSources: validSources.length,
      skipped: searchResults.length - validSources.length,
    },
    Date.now() - start
  );

  return validSources;
};

module.exports = { readerAgent };