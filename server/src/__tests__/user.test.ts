import supertest from 'supertest';

import createServer from '../utils/server';

const app = createServer();

describe('user', () => {
	describe('get user route', () => {
		describe('given the user is not authenticated', () => {
			it('should return a 403', async () => {
				await supertest(app).get('/user/me').expect(403);
			});
		});
	});
});
