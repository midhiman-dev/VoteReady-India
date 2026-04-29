import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../app.js';
import { APP_VERSION } from '@voteready/shared';

describe('API Routes', () => {
  describe('GET /', () => {
    it('should return API ready message', async () => {
      const response = await request(app).get('/');
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        message: "VoteReady India API Ready",
        version: APP_VERSION
      });
    });
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/health');
      expect(response.status).toBe(200);
      expect(response.body.ok).toBe(true);
      expect(response.body.service).toBe("voteready-api");
      expect(response.body.version).toBe(APP_VERSION);
      expect(response.body.timestamp).toBeDefined();
    });
  });

  describe('GET /metadata', () => {
    it('should return app metadata', async () => {
      const response = await request(app).get('/metadata');
      expect(response.status).toBe(200);
      expect(response.body.appName).toBeDefined();
      expect(response.body.apiVersion).toBe(APP_VERSION);
      expect(response.body.supportedLanguages).toBeDefined();
      expect(response.body.supportedExplanationModes).toBeDefined();
    });
  });

  describe('GET /source-registry', () => {
    it('should return source registry', async () => {
      const response = await request(app).get('/source-registry');
      expect(response.status).toBe(200);
      expect(response.body.sources).toBeInstanceOf(Array);
      expect(response.body.count).toBeGreaterThan(0);
    });
  });

  describe('POST /assistant/mock', () => {
    it('should return mock response for valid request', async () => {
      const validRequest = {
        question: "Can you confirm the assistant contract is connected?",
        language: "simple_english",
        explanationMode: "simple"
      };

      const response = await request(app)
        .post('/assistant/mock')
        .send(validRequest)
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body.answerBlocks).toBeInstanceOf(Array);
      expect(response.body.answerBlocks.length).toBeGreaterThan(0);
      expect(response.body.sources).toBeInstanceOf(Array);
      expect(response.body.generatedAt).toBeDefined();
      expect(response.body.disclaimer).toBeDefined();
    });

    it('should return 400 for empty request body', async () => {
      const response = await request(app)
        .post('/assistant/mock')
        .send({})
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('question is required');
    });

    it('should return 400 for missing language', async () => {
      const response = await request(app)
        .post('/assistant/mock')
        .send({
          question: "Test question?",
          explanationMode: "simple"
        })
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('language is missing or unsupported');
    });

    it('should return 400 for unsupported language', async () => {
      const response = await request(app)
        .post('/assistant/mock')
        .send({
          question: "Test question?",
          language: "invalid_lang",
          explanationMode: "simple"
        })
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('language is missing or unsupported');
    });

    it('should return 400 for unsupported explanationMode', async () => {
      const response = await request(app)
        .post('/assistant/mock')
        .send({
          question: "Test question?",
          language: "simple_english",
          explanationMode: "invalid_mode"
        })
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('explanationMode is missing or unsupported');
    });
  });

  describe('POST /assistant', () => {
    it('should return safe shell response for valid request', async () => {
      const validRequest = {
        question: "Can VoteReady India answer questions yet?",
        language: "simple_english",
        explanationMode: "simple"
      };

      const response = await request(app)
        .post('/assistant')
        .send(validRequest)
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body.id).toBeDefined();
      expect(response.body.status).toBe('cannot_verify');
      expect(response.body.language).toBe(validRequest.language);
      expect(response.body.explanationMode).toBe(validRequest.explanationMode);
      expect(response.body.answerBlocks).toBeInstanceOf(Array);
      expect(response.body.answerBlocks.length).toBeGreaterThan(0);
      expect(response.body.sources).toEqual([]);
      expect(response.body.freshnessSummary.status).toBe('review_due');

      // Check for non-guidance text
      const fullAnswerText = response.body.answerBlocks.map((b: any) => b.content).join(' ');
      expect(fullAnswerText).toContain('endpoint is connected');
      expect(fullAnswerText).toContain('source-backed election guidance is not active');
      expect(fullAnswerText).toContain('curated fragments');

      const forbiddenTerms = [
        'deadline', 
        'Form 6', 
        'eligible', 
        'eligibility', 
        'polling date', 
        'register by', 
        'voter ID required'
      ];
      for (const term of forbiddenTerms) {
        expect(fullAnswerText.toLowerCase()).not.toContain(term.toLowerCase());
      }
    });

    it('should return quick safe shell response', async () => {
      const quickRequest = {
        question: "Can VoteReady India answer questions yet?",
        language: "simple_english",
        explanationMode: "quick"
      };

      const response = await request(app)
        .post('/assistant')
        .send(quickRequest)
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body.explanationMode).toBe('quick');
      expect(response.body.answerBlocks.length).toBe(1);
    });

    it('should return detailed safe shell response', async () => {
      const detailedRequest = {
        question: "Can VoteReady India answer questions yet?",
        language: "simple_english",
        explanationMode: "detailed"
      };

      const response = await request(app)
        .post('/assistant')
        .send(detailedRequest)
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body.explanationMode).toBe('detailed');
      expect(response.body.answerBlocks.length).toBe(4);
    });

    it('should return 400 for empty request body', async () => {
      const response = await request(app)
        .post('/assistant')
        .send({})
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('question is required');
    });

    it('should return 400 for unsupported language', async () => {
      const response = await request(app)
        .post('/assistant')
        .send({
          question: "Test question?",
          language: "invalid_lang",
          explanationMode: "simple"
        })
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('language is missing or unsupported');
    });

    it('should return 400 for unsupported explanationMode', async () => {
      const response = await request(app)
        .post('/assistant')
        .send({
          question: "Test question?",
          language: "simple_english",
          explanationMode: "invalid_mode"
        })
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('explanationMode is missing or unsupported');
    });
  });
});

