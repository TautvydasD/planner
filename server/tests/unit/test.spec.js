import request from 'supertest';
import { app } from '../../src/app';
import { formatDate } from '../../src/controllers/helper.js';

describe('Test the root path', () => {
  it('should return 404 code for non existant url path', async () => {
    const res = await request(app).get('/nonexistantpathgive');
    expect(res.statusCode).toBe(404);
  });
});

describe('Test format date helper', () => {
  it('should format simple date', () => {
    const result = formatDate('2022-04-20');

    expect(result).toBe('2022-04-20 00:00:00');
  });

  it('should format simple date to ISO string', () => {
    const result = formatDate('2022-04-20', true);

    expect(result).toBe('2022-04-20T00:00:00.000Z');
  });
});
