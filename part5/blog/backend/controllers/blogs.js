const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const { userExtractor } = require( '../utils/middleware' )

blogsRouter.get('/', (request, response, next) => {
  Blog
    .find({})
    .populate('user', { username: 1, name: 1 })
    .then(blogs => {
      response.json(blogs)
    })
    .catch(error => next(error))
})

blogsRouter.post('/', userExtractor, (request, response, next) => {
  const body = request.body

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: request.user._id
  })

  if (!blog.likes) {
    blog.likes = 0
  }

  blog
    .save()
    .then(result => {
      request.user.blogs = request.user.blogs.concat(result._id)
      request.user.save().then(() => {
        response.status(201).json(result)
      })
    })
    .catch(error => next(error))
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

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const blog = await Blog.findById(request.params.id)

  console.log('bloguser',blog.user)
  if (blog && blog.user.toString() === request.user.id.toString()) {
    await Blog.findByIdAndRemove(request.params.id)
  }
  else return response.status(401).json({ error: 'wrong user' })
  response.status(204).end()
})

module.exports = blogsRouter