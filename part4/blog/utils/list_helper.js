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

module.exports = {
  dummy, totalLikes, favoriteBlog
}