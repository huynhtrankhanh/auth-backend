const request = require('supertest');
const app = require('./index');

describe('POST /signup', () => {
  it('should create a new user', async () => {
    const res = await request(app)
      .post('/signup')
      .send({ username: 'testuser', password: 'testpassword' });
    expect(res.statusCode).toEqual(201);
    expect(res.text).toEqual('User created successfully');
  });

  it('should return an error if user already exists', async () => {
    const res = await request(app)
      .post('/signup')
      .send({ username: 'testuser', password: 'testpassword' });
    expect(res.statusCode).toEqual(500);
    expect(res.text).toEqual('Error saving user to database');
  });
});

describe('POST /signin', () => {
  it('should authenticate a user with correct credentials', async () => {
    const res = await request(app)
      .post('/signin')
      .send({ username: 'testuser', password: 'testpassword' });
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual('Authentication successful');
  });

  it('should not authenticate a user with incorrect password', async () => {
    const res = await request(app)
      .post('/signin')
      .send({ username: 'testuser', password: 'wrongpassword' });
    expect(res.statusCode).toEqual(401);
    expect(res.text).toEqual('Authentication failed');
  });

  it('should return an error if user does not exist', async () => {
    const res = await request(app)
      .post('/signin')
      .send({ username: 'nonexistentuser', password: 'testpassword' });
    expect(res.statusCode).toEqual(401);
    expect(res.text).toEqual('User not found');
  });
});
