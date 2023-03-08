var _ = require('lodash')

// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item
  }

  return blogs.length === 0 ? 0 : blogs.map(blog => blog.likes).reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  const reducer = (prev, current) => {
    return (prev.likes > current.likes) ? prev : current
  }

  const favoriteBlog = blogs.reduce(reducer, 0)

  return { title: favoriteBlog.title, author: favoriteBlog.author, likes: favoriteBlog.likes }
}

const mostBlogs = (blogs) => {
  const blogCountByAuthor = Object
    .entries(_.countBy(blogs, 'author'))
    .map((authorArr) => {
      return { 'author': authorArr[0], 'blogs': authorArr[1] }
    })

  return _.maxBy(blogCountByAuthor, 'blogs')
}

const mostLikes = (blogs) => {
  const likeCountByAuthor = Object
    .entries(_.groupBy(blogs, 'author'))
    .map(authorArr => {
      return { author: authorArr[0], likes: _.sumBy(authorArr[1], 'likes') }
    })

  return _.maxBy(likeCountByAuthor, 'likes')
}

module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}