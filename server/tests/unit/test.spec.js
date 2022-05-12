import request from 'supertest';
import { app } from '../../src/app';

describe('Test the root path', () => {
  it('should response the GET method', async () => {
    const res = await request(app).post('/api/v1');
    expect(res.statusCode).toBe(200);
  });
  it('should return 404 code for non existant url path', async () => {
    const res = await request(app).get('/nonexistantpathgive');
    expect(res.statusCode).toBe(404);
  });
});
