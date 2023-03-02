const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')
const User = require('../models/user')
const Blog = require('../models/blog')

beforeEach(async () => {
  await User.deleteMany({})
  const passwordHash = await bcrypt.hash('test', 10)
  const user = new User({ username: 'testuser', passwordHash })
  await user.save()

  await Blog.deleteMany({})
  const blogObjects = helper.initialBlogs
    .map(blog => {
      blog.user = user._id
      return new Blog(blog)
    })
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})

describe('adding a blog', () => {
  test('correct amount of blog posts are returned', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(6)
  })

  test('unique identifier property is named id', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
  })

  test('making a HTTP POST request successfully creates a new blog post', async () => {
    const login = await api
      .post('/api/login')
      .send({ username: 'testuser', password: 'test' })

    const newBlog = {
      title: 'New blog',
      author: 'Test',
      likes: 0,
      url: 'url'
    }

    await api
      .post('/api/blogs')
      .set('Authorization', 'Bearer ' + JSON.parse(login.text).token)
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
    const login = await api
      .post('/api/login')
      .send({ username: 'testuser', password: 'test' })

    const newBlog = {
      title: 'New blog',
      author: 'Test',
      url: 'url'
    }

    await api
      .post('/api/blogs')
      .set('Authorization', 'Bearer ' + JSON.parse(login.text).token)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blog = await (await helper.blogsInDb()).find(blog => blog.title === 'New blog')
    expect(blog.likes).toBe(0)
  })

  test('responds with 400 when title or url are missing', async () => {
    const login = await api
      .post('/api/login')
      .send({ username: 'testuser', password: 'test' })

    const newBlogWithoutTitle = {
      author: 'Test',
      url: 'url'
    }

    await api
      .post('/api/blogs')
      .set('Authorization', 'Bearer ' + JSON.parse(login.text).token)
      .send(newBlogWithoutTitle)
      .expect(400)

    const newBlogWithoutUrl = {
      title: 'New blog',
      author: 'Test',
      url: undefined
    }

    await api
      .post('/api/blogs')
      .set('Authorization', 'Bearer ' + JSON.parse(login.text).token)
      .send(newBlogWithoutUrl)
      .expect(400)
  })

  test('fails with status code 401 Unauthorized if a token is not provided', async () => {
    const newBlog = {
      title: 'New blog',
      author: 'Test',
      likes: 0,
      url: 'url'
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
  })
})


describe('updating the information of a blog', () => {
  test('succeeds with status code of 200 and has the updated value of likes', async () => {
    const editedBlog ={
      id: '5a422a851b54a676234d17f7',
      title: 'React patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
      likes: 10,
    }

    await api
      .put('/api/blogs/5a422a851b54a676234d17f7')
      .send(editedBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const updatedBlog = await (await helper.blogsInDb()).find(blog => blog.id === '5a422a851b54a676234d17f7')
    expect(updatedBlog.likes).toBe(10)
  })
})

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => { //TODO
    const login = await api
      .post('/api/login')
      .send({ username: 'testuser', password: 'test' })

    const blogToDelete = await Blog.find({ title: 'New blog' })
    console.log('blogtodelete', blogToDelete)

    await api
      .delete('/api/blogs/5a422a851b54a676234d17f7')
      .set('Authorization', 'Bearer ' + JSON.parse(login.text).token)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(
      helper.initialBlogs.length - 1
    )

    const titles = blogsAtEnd.map(r => r.title)

    expect(titles).not.toContain(blogToDelete.title)
  })
})

describe('creation of a user', () => {
  test('user should have a username', async () => {
    const newUser = {
      name: 'user',
      password: 'test',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('{"error":"User validation failed: username: Path `username` is required."}')
  })

  test('user should have a password', async () => {
    const newUser = {
      username: 'test',
      name: 'user',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('{"error":"User validation failed: password: Path `password` is required."}')
  })

  test('doesn\'t succeed when a username has less than 3 characters', async () => {
    const newUser1 = {
      username: 'qq',
      name: 'user',
      password: 'test',
    }

    await api
      .post('/api/users')
      .send(newUser1)
      .expect(400)
      .expect('{"error":"User validation failed: username: Path `username` (`qq`) is shorter than the minimum allowed length (3)."}')
  })

  test('doesn\'t succeed when a password has less than 3 characters', async () => {
    const newUser2 = {
      username: 'user',
      name: 'user',
      password: 'qq',
    }

    await api
      .post('/api/users')
      .send(newUser2)
      .expect(400)
      .expect('{"error":"password must be at least 3 characters long"}')
  })

  test('username should be unique', async () => {
    const newUser = {
      username: 'test',
      name: 'user',
      password: 'test'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)

    await api
      .post('/api/users')
      .send(newUser)
      .expect(500)
      .expect('{"error":"Username is not unique"}')
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
