const mockGroqInstance = {
  chat: {
    completions: {
      create: jest.fn(),
    },
  },
};

jest.mock('../services/agentLogger.service');
jest.mock('groq-sdk', () => {
  return jest.fn(() => mockGroqInstance);
});

const { synthesizerAgent } = require('../agents/synthesizer.agent');
const { logAgent } = require('../services/agentLogger.service');

describe('Synthesizer Agent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should synthesize sources into a research report', async () => {
    const Groq = require('groq-sdk');
    const mockGroq = new Groq();

    const mockReport = `# Quantum Error Correction: A Comprehensive Overview

## Overview
Quantum error correction is a fundamental technique...

[Source 1] shows that QEC is critical for building practical quantum computers.

[Source 2] explains the concept of logical qubits...

## Conclusion
The future of quantum computing depends on solving error correction challenges.`;

    mockGroq.chat.completions.create.mockResolvedValue({
      choices: [{ message: { content: mockReport } }],
    });

    const sessionId = 'test-session-123';
    const topic = 'quantum error correction';
    const summarizedSources = [
      {
        url: 'https://example.com/1',
        title: 'QEC Basics',
        score: 0.95,
        summary: '• Point 1\n• Point 2\n• Point 3',
      },
      {
        url: 'https://example.com/2',
        title: 'Advanced QEC',
        score: 0.88,
        summary: '• Point 1\n• Point 2\n• Point 3',
      },
    ];

    const result = await synthesizerAgent(sessionId, summarizedSources, topic);

    expect(result).toContain('[Source 1]');
    expect(result).toContain('[Source 2]');
    expect(result).toContain('Overview');

    expect(logAgent).toHaveBeenCalledWith(
      sessionId,
      'synthesizer',
      expect.stringContaining('completed'),
      'completed',
      { wordCount: expect.any(Number) },
      expect.any(Number)
    );
  });

  it('should handle synthesis errors', async () => {
    const Groq = require('groq-sdk');
    const mockGroq = new Groq();

    mockGroq.chat.completions.create.mockRejectedValue(
      new Error('Model overloaded')
    );

    const sessionId = 'test-session-123';
    const topic = 'quantum error correction';
    const summarizedSources = [];

    await expect(
      synthesizerAgent(sessionId, summarizedSources, topic)
    ).rejects.toThrow('Model overloaded');

    expect(logAgent).toHaveBeenCalledWith(
      sessionId,
      'synthesizer',
      expect.stringContaining('failed'),
      'failed',
      expect.any(Object),
      expect.any(Number)
    );
  });
});