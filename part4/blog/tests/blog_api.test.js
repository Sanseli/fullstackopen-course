const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const api = supertest(app)

test('correct amount of blog posts are returned', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(3)
})

test('unique identifier property is named id', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body[0].id).toBeDefined()
})

afterAll(async () => {
  await mongoose.connection.close()
})
