const request = require('supertest');
const app = require('../server'); // Assuming your main app file is server.js in the backend folder
const mongoose = require('mongoose');

describe('GET /', () => {
  it('should return "Hello World!"', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual('Hello World!');
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });
});