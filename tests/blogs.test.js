// tests/blog.test.js
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/User');
const Blog = require('../models/Blog');
require('dotenv').config({ path: '.env.test' });

let token = '';
let blogId = '';

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);

  // Clear test database
  await User.deleteMany({});
  await Blog.deleteMany({});

  // Register user
  await request(app).post('/api/auth/signup').send({
    first_name: 'Test',
    last_name: 'User',
    email: 'test@example.com',
    password: 'password123'
  });

  // Login user
  const res = await request(app).post('/api/auth/login').send({
    email: 'test@example.com',
    password: 'password123'
  });

  token = res.body.token;
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('Blog API Tests', () => {
  it('should create a blog (draft)', async () => {
    const res = await request(app)
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Blog',
        description: 'A simple test blog',
        tags: ['test', 'api'],
        body: 'This is the content of the blog.'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.state).toBe('draft');
    blogId = res.body._id;
  });

  it('should list user blogs (default all)', async () => {
    const res = await request(app)
      .get('/api/blogs/user/blogs')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  it('should update a blog', async () => {
    const res = await request(app)
      .patch(`/api/blogs/${blogId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Updated Title'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.blog.title).toBe('Updated Title');
  });

  it('should publish a blog', async () => {
    const res = await request(app)
      .patch(`/api/blogs/${blogId}/publish`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.blog.state).toBe('published');
  });

  it('should list public published blogs', async () => {
    const res = await request(app)
      .get('/api/blogs?page=1&limit=10');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  it('should get single published blog and increment read_count', async () => {
    const res1 = await request(app).get(`/api/blogs/${blogId}`);
    const res2 = await request(app).get(`/api/blogs/${blogId}`);

    expect(res2.body.read_count).toBe(res1.body.read_count + 1);
    expect(res2.body.author.email).toBe('test@example.com');
  });

  it('should delete blog', async () => {
    const res = await request(app)
      .delete(`/api/blogs/${blogId}`)
      .set('Authorization', `Bearer ${token}`);

      console.log(res.body);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Blog deleted successfully');
  });
});