const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObjects = helper.initialBlogs
    .map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})

test('correct amount of blog posts are returned', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(6)
})

test('unique identifier property is named id', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body[0].id).toBeDefined()
})

test('making a HTTP POST request successfully creates a new blog post', async () => {
  const newBlog = {
    title: 'New blog',
    author: 'Test',
    likes: 0,
    url: 'url'
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogs = await helper.blogsInDb()
  expect(blogs).toHaveLength(helper.initialBlogs.length + 1)

  const blogContents = blogs.map(n => n.title)
  expect(blogContents).toContain(
    'New blog'
  )
})

test('likes property is defaulted to value 0', async () => {
  const newBlog = {
    title: 'New blog',
    author: 'Test',
    url: 'url'
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blog = await (await helper.blogsInDb()).find(blog => blog.title === 'New blog')
  expect(blog.likes).toBe(0)
})

test('responds with 400 when title or url are missing', async () => {
  const newBlogWithoutTitle = {
    author: 'Test',
    url: 'url'
  }

  await api
    .post('/api/blogs')
    .send(newBlogWithoutTitle)
    .expect(400)

  const newBlogWithoutUrl = {
    title: 'New blog',
    author: 'Test',
  }

  await api
    .post('/api/blogs')
    .send(newBlogWithoutUrl)
    .expect(400)
})

afterAll(async () => {
  await mongoose.connection.close()
})
