const { test, describe, beforeEach, after } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const assert = require('node:assert')
const User = require('../models/user')
const app = require('../app')
const helper = require('./test_helper')

const api = supertest(app)

describe('4-d', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    await User.insertOne({
      username: 'username1',
      passwordHash: '$2b$10$almwLLkKPmbCGfgwWkRQ5udWTZPXXFVjoxC.fAivt3zRnOXEty1Xa',
      name: 'name1',
    })
    const users = await User.find({})
  })
  test('no username results to status code 400', async () => {
    const userWithoutUsername = {
      password: 'password2',
      name: 'name2',
    }
    const result = await api
      .post('/api/users')
      .send(userWithoutUsername)
      .expect(400)
      
    assert(result.body.error.includes('Path `username` is required'))

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, 1)
  })
  
  test('username shorter than 3 char', async () => {
    const userWithShortUsername = {
      username: 'u1',
      password: 'password2',
      name: 'name2',
    }
    const result = await api
      .post('/api/users')
      .send(userWithShortUsername)
      .expect(400)

    assert(result.body.error.includes('shorter than the minimum allowed length'))
    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, 1)
  })

  test('no password', async () => {
    const userWithoutPassword = {
      username: 'username2',
      name: 'name2',
    }

    const result = await api
      .post('/api/users')
      .send(userWithoutPassword)
      .expect(400)

    assert(result.body.error.includes('enter the password'))

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, 1)
  })

  test('password shorter than 3 characters', async () => {
    const userWithShortPassword = {
      username: 'username2',
      password: 'pw',
      name: 'name2',
    }

    const result = await api
      .post('/api/users')
      .send(userWithShortPassword)
      .expect(400)

    assert(result.body.error.includes('password must be at least 3 characters long'))

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, 1)
  })

  after(async () => {
    await mongoose.connection.close()
  })
})