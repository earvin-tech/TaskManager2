const request = require('supertest');
const app = require('../index');
const Subtask = require('../models/Subtask');

describe('Subtask Routes', () => {
  const userData = {
    username: 'subtaskuser',
    email: 'subtask@example.com',
    password: 'Subtask123!'
  };
  let token;
  let taskId;

  beforeEach(async () => {
    const userRes = await request(app)
      .post('/api/users/register')
      .send(userData)
      .expect(201);
    token = userRes.body.token;

    const taskRes = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Parent Task' })
      .expect(201);
    taskId = taskRes.body._id;
  });

  test('Should create a new subtask', async () => {
    const subtaskData = { title: 'Test Subtask' };
    const res = await request(app)
      .post(`/api/tasks/${taskId}/subtasks`)
      .set('Authorization', `Bearer ${token}`)
      .send(subtaskData)
      .expect(201);

    expect(res.body.title).toBe(subtaskData.title);
    expect(res.body.task).toBe(taskId);
    expect(res.body).toHaveProperty('_id');
  });

  test('Should get all subtasks for the task', async () => {
    await request(app)
      .post(`/api/tasks/${taskId}/subtasks`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'First' })
      .expect(201);
    await request(app)
      .post(`/api/tasks/${taskId}/subtasks`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Second' })
      .expect(201);

    const res = await request(app)
      .get(`/api/tasks/${taskId}/subtasks`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body.length).toBe(2);
  });

  test('Should update a subtask', async () => {
    const { body } = await request(app)
      .post(`/api/tasks/${taskId}/subtasks`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Old Title' })
      .expect(201);

    const res = await request(app)
      .patch(`/api/subtasks/${body._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'New Title', completed: true })
      .expect(200);

    expect(res.body.title).toBe('New Title');
    expect(res.body.completed).toBe(true);
  });

  test('Should delete a subtask', async () => {
    const { body } = await request(app)
      .post(`/api/tasks/${taskId}/subtasks`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'To Delete' })
      .expect(201);

    await request(app)
      .delete(`/api/subtasks/${body._id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    const subtask = await Subtask.findById(body._id);
    expect(subtask).toBeNull();
  });

  test('Should require authentication for subtasks', async () => {
    await request(app)
      .get(`/api/tasks/${taskId}/subtasks`)
      .expect(401);
  });
});