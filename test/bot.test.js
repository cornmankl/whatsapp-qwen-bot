// test/bot.test.js
const request = require('supertest');
const express = require('express');
const { requireAuth } = require('../middleware/auth');

// Mock Express app untuk test
const app = express();
app.use(express.json());
app.use(requireAuth);

app.get('/test', (req, res) => {
    res.send('OK');
});

describe('Auth Middleware', () => {
    it('should block unauthenticated access', async () => {
        const res = await request(app).get('/test');
        expect(res.status).toBe(401);
    });
});