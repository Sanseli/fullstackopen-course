const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response, next) => {
  User
    .find({})
    .populate('blogs', { url: 1, title: 1, author: 1 })
    .then(blogs => {
      response.json(blogs)
    })
    .catch(error => next(error))
})

usersRouter.post('/', (request, response, next) => {
  const { username, name, password } = request.body

  if (password && password.length >= 3) {
    const saltRounds = 10
    bcrypt.hash(password, saltRounds).then(passwordHash => {
      const user = new User({
        username,
        name,
        passwordHash,
      })

      user
        .save()
        .then((savedUser) => {
          response.status(201).json(savedUser)
        })
        .catch(error => next(error))
    })
  }
  else if (!password) {
    return response.status(400).json({ error: 'User validation failed: password: Path `password` is required.' })

  } else if (password.length < 3) {
    return response.status(400).json({ error: 'password must be at least 3 characters long' })
  }
})



module.exports = usersRouter