const request = require('supertest');
const app = require('../index');
const Task = require('../models/Task');

describe('Task Routes', () => {
  const userData = {
    username: 'taskuser',
    email: 'task@example.com',
    password: 'Task1234!'
  };
  let token;

  beforeEach(async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send(userData)
      .expect(201);
    token = res.body.token;
  });

  test('Should create a new task', async () => {
    const taskData = { title: 'Test Task', description: 'A task for testing' };
    const res = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send(taskData)
      .expect(201);

    expect(res.body.title).toBe(taskData.title);
    expect(res.body.description).toBe(taskData.description);
    expect(res.body).toHaveProperty('_id');
  });

  test('Should get all tasks for the user', async () => {
    await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'First' })
      .expect(201);
    await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Second' })
      .expect(201);

    const res = await request(app)
      .get('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body.length).toBe(2);
  });

  test('Should get a task by id', async () => {
    const create = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Lookup' })
      .expect(201);

    const id = create.body._id;
    const res = await request(app)
      .get(`/api/tasks/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body._id).toBe(id);
  });

  test('Should update a task', async () => {
    const { body } = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Old Title' })
      .expect(201);

    const res = await request(app)
      .patch(`/api/tasks/${body._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'New Title' })
      .expect(200);

    expect(res.body.title).toBe('New Title');
  });

  test('Should delete a task', async () => {
    const { body } = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'To Delete' })
      .expect(201);

    await request(app)
      .delete(`/api/tasks/${body._id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    const task = await Task.findById(body._id);
    expect(task).toBeNull();
  });

  test('Should require authentication for tasks', async () => {
    await request(app).get('/api/tasks').expect(401);
  });
});