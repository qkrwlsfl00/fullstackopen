const dummy = blogs => {
  return 1
}

const totalLikes = blogs =>
  blogs.reduce((sum, blog) => sum + blog.likes, 0)

const favoriteBlog = blogs =>
  blogs.length === 0
    ? null
    : blogs.reduce((favorite, blog) => 
      favorite.likes > blog.likes ? favorite : blog)

const mostBlogs = blogs => {
  const authors = {}
  blogs.forEach((blog) => {
    authors[blog.author] = ( authors[blog.author] || 0) + 1
  })

  const mostBlogArray = Object.entries(authors).reduce((max, author) => {
    return max[1] > author[1] ? max : author
  }, [])

  if(mostBlogArray.length === 0) {
    return null
  }
  return {
    author: mostBlogArray[0],
    blogs: mostBlogArray[1]
  }
}

const mostLikes = blogs => {
  const authors = {}
  blogs.forEach((blog) => {
    authors[blog.author] = ( authors[blog.author] || 0 ) + blog.likes
  })

  const mostLikesArray = Object.entries(authors).reduce((max, author) => {
    return max[1] > author[1] ? max : author
  }, [])

  if(mostLikesArray.length === 0) {
    return null
  }
  return {
    author: mostLikesArray[0],
    likes: mostLikesArray[1]
  }
}

module.exports = { dummy, totalLikes, 
  favoriteBlog, mostBlogs, mostLikes }