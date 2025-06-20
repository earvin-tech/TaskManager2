const request = require('supertest');
const app = require('../index');
const User = require('../models/User');

describe('User Routes', () => {
  const userData = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'Test1234!',
  };

  test('Should sign up a new user', async () => {
    const response = await request(app)
      .post('/api/users/register')
      .send(userData)
      .expect(201);

    expect(response.body).toHaveProperty('user');
    expect(response.body).toHaveProperty('token');
    expect(response.body.user.email).toBe(userData.email.toLowerCase());
    expect(response.body.user.username).toBe(userData.username);
  });

  test('Should not sign up a user with an email that is already in use', async () => {
    await request(app).post('/api/users/register').send(userData).expect(201);
    await request(app).post('/api/users/register').send(userData).expect(409);
  });

  test('Should login an existing user', async () => {
    await request(app).post('/api/users/register').send(userData).expect(201);
    const response = await request(app)
      .post('/api/users/login')
      .send({ email: userData.email, password: userData.password })
      .expect(200);

    expect(response.body).toHaveProperty('token');
  });

  test('Should not login non-existent user', async () => {
    await request(app)
      .post('/api/users/login')
      .send({ email: 'nouser@example.com', password: 'irrelevant' })
      .expect(401);
  });

  test('Should not login with incorrect password', async () => {
    await request(app).post('/api/users/register').send(userData).expect(201);
    await request(app)
      .post('/api/users/login')
      .send({ email: userData.email, password: 'WrongPassword123!' })
      .expect(401);
  });

  test('Should get profile for authenticated user', async () => {
    const signup = await request(app).post('/api/users/register').send(userData).expect(201);
    const token = signup.body.token;

    const profile = await request(app)
      .get('/api/users/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(profile.body.email).toBe(userData.email.toLowerCase());
    expect(profile.body.username).toBe(userData.username);
  });

  test('Should not get profile without authentication', async () => {
    await request(app).get('/api/users/me').expect(401);
  });

  test('Should update user password for authenticated user', async () => {
    const signup = await request(app).post('/api/users/register').send(userData).expect(201);
    const token = signup.body.token;

    await request(app)
      .patch('/api/users/me')
      .set('Authorization', `Bearer ${token}`)
      .send({ oldPassword: userData.password, newPassword: 'NewPass456!' })
      .expect(200);
  });

  test('Should not update password with invalid data', async () => {
    const signup = await request(app).post('/api/users/register').send(userData).expect(201);
    const token = signup.body.token;

    await request(app)
      .patch('/api/users/me')
      .set('Authorization', `Bearer ${token}`)
      .send({ oldPassword: userData.password }) // missing newPassword
      .expect(400);
  });

  test('Should delete account for authenticated user', async () => {
    const signup = await request(app).post('/api/users/register').send(userData).expect(201);
    const token = signup.body.token;

    await request(app)
      .delete('/api/users/me')
      .set('Authorization', `Bearer ${token}`)
      .send({ password: userData.password })
      .expect(200);

    const user = await User.findOne({ email: userData.email });
    expect(user).toBeNull();
  });

  test('Should not delete account without authentication', async () => {
    await request(app).delete('/api/users/me').expect(401);
  });
});