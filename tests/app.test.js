import request from 'supertest';

import app from '../src/app.js';

describe('app bootstrap', () => {
	it('responds to /health successfully', async () => {
		const res = await request(app).get('/health');

		expect(res.status).toBe(200);
		expect(res.body).toEqual({ status: 'ok' });
	});
});
