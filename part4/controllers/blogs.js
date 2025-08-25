const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const { userExtractor } = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', 'username name')  //populate는 promise 안 기다리고 바로 붙임
  response.json(blogs)
})

blogsRouter.post('/', userExtractor, async (request, response) => {
  const user = request.user

  const blog = new Blog({
    ...request.body,
    likes: request.body.likes || 0,
    user: user._id
  })
  
  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog)
  await user.save()

  const populatedBlog = await savedBlog.populate('user', 'username name')
  response.status(201).json(populatedBlog)
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const user = request.user

  const blogToDelete = await Blog.findById(request.params.id)
  if (!blogToDelete) { //404 when blog not exist
    return response.status(404).end()
  }

  if (blogToDelete.user.toString() !== user._id.toString()) {
    return response.status(403).json({ error: 'you are not the creator of this blog' })
  }

  await blogToDelete.deleteOne()
  user.blogs = user.blogs.filter(b => b.toString() !== blogToDelete._id.toString())
  await user.save()
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const blogToUpdate = await Blog.findById(request.params.id)
  if (!blogToUpdate) {
    return response.status(404).end()
  }

  blogToUpdate.likes = request.body.likes

  const updatedBlog = await blogToUpdate.save()
  const populatedBlog = await updatedBlog.populate('user', 'username name')
  response.json(populatedBlog)
})

module.exports = blogsRouter