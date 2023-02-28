const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', (request, response, next) => {
  Blog
    .find({})
    .populate('user', { username: 1, name: 1 })
    .then(blogs => {
      response.json(blogs)
    })
    .catch(error => next(error))
})

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

blogsRouter.post('/', (request, response, next) => {
  const body = request.body

  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  User.findById(decodedToken.id).then((user) => {
    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.author,
      likes: body.likes,
      user: user.id
    })

    if (!blog.likes) {
      blog.likes = 0
    }

    blog
      .save()
      .then(result => {
        user.blogs = user.blogs.concat(result._id)
        user.save().then(() => {
          response.status(201).json(result)
        })
      })
      .catch(error => next(error))
  })
})

blogsRouter.put('/:id', async (request, response, next) => {
  const body = request.body
  const blog = {
    title: body.title,
    author: body.author,
    likes: body.likes,
    url: body.url
  }

  await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    .then(updatedBlog => {
      response.json(updatedBlog)
    })
    .catch(error => next(error))
})

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

module.exports = blogsRouter