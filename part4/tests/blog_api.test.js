const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const assert = require('node:assert')
const Blog = require('../models/blog')
const User = require('../models/user')
const app = require('../app')
const helper = require('./test_helper')

const api = supertest(app)

let token

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)

  await User.deleteMany({})
  await api
    .post('/api/users')
    .send({
      username: 'username1',
      password: 'password1',
      name: 'name1'
    })

  const res = await api
    .post('/api/login')
    .send({
      username: "username1",
      password: "password1"
    })
  token = res.body.token
})

test('all blogs are returned', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('_id is modified to id by toJSON', async () => {
  const response = await api.get('/api/blogs')
  assert(response.body[0].id)
})

test('a vaild blog can be added', async () => {
  const newBlog = {
    title: 'Why I program',
    author: 'Jinri Park',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 408, 
  }
  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await Blog.find({})
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)  
  const titles = blogsAtEnd.map(b => b.title)
  assert(titles.includes('Why I program'))
})

test('if likes property is missing, it defaults to 0', async () => {
  const blogWithoutLikes = {
    title: 'Why I program',
    author: 'Jinri Park',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
  }
  const response = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(blogWithoutLikes)
    .expect(201)
  assert.strictEqual(response.body.likes, 0)
})

test('missing title results to status code 400', async () => {
  const blogWithoutTitle = {
    author: 'Jinri Park',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 408, 
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(blogWithoutTitle)
    .expect(400)

  const blogsAtEnd = await Blog.find({})
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

test('missing url results to status code 400', async () => {
  const blogWithoutUrl = {
    title: 'Why I program',
    author: 'Jinri Park',
    likes: 408, 
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(blogWithoutUrl)
    .expect(400)

  const blogsAtEnd = await Blog.find({})
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

test('a blog post can be deleted', async () => {
  const blog = {
    title: 'todelete',
    author: 'jin',
    url: 'blog.jinri.com',
    likes: 1232
  }
  const blogsAtStart = await helper.blogsInDb()

  const response = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(blog)

  const blogsAfterAdd = await helper.blogsInDb()
  assert.strictEqual(blogsAfterAdd.length, blogsAtStart.length + 1)

  await api
    .delete(`/api/blogs/${response.body.id}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(204)
  
  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
})

test('likes of a blog can be updated', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToUpdate = blogsAtStart[0]

  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send({ ...blogToUpdate, likes: blogToUpdate.likes + 1 })
    .expect(200)

  const updatedBlog = await Blog.findById(blogToUpdate.id)

  assert.strictEqual(updatedBlog.likes, blogToUpdate.likes + 1)
})

test('Adding a new blog fails with 401 if a token is not provided', async () => {
  const newBlog = {
    title: 'Why I program',
    author: 'Jinri Park',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 408, 
  }
  const blogsAtStart = await helper.blogsInDb()

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtStart.length, blogsAtEnd.length)
})

after(async () => {
  await mongoose.connection.close()
})