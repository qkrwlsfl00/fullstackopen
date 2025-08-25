const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        username: 'username1',
        name: 'name1',
        password: 'password'
      }
    })
    await request.post('/api/users', {
      data: {
        username: 'username2',
        name: 'name2',
        password: 'password'
      }
    })
    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('Log in to application')).toBeVisible()
    const textboxes = await page.getByRole('textbox').all()
    expect(textboxes).toHaveLength(2)
  })

  describe('login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'username1', 'password')

      await expect(page.getByText('name1 logged in')).toBeVisible()
    })
    
    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'username1', 'wrongpw')

      const errorDiv = page.locator('.noti')
      await expect(errorDiv).toHaveText('wrong username or password')
      await expect(errorDiv).toHaveCSS('border-style', 'solid')
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')
    })
  })

  describe('when logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'username1', 'password')
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'test blog', 'author', 'test.com')

      const notiDiv = page.locator('.noti')
      await expect(notiDiv).toHaveText('a new blog test blog by author added')
      await expect(notiDiv).toHaveCSS('color', 'rgb(0, 128, 0)')

      await expect(page.getByText('test blog author')).toBeVisible()
    })

    describe('and a blog exists', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, 'test blog', 'author', 'test.com')
      })

      test('a blog can be liked', async ({ page }) => {
        const blog = page.getByText('test blog author').locator('..')
        await blog.getByRole('button', { name: 'view' }).click()
        await blog.getByRole('button', { name: 'like' }).click()

        await expect(blog.getByText('likes 1')).toBeVisible()
      })

      test('a blog can be removed', async ({ page }) => {
        page.on('dialog', async (dialog) => {
          await dialog.accept()
        })

        const blog = page.getByText('test blog author').locator('..')
        await blog.getByRole('button', { name: 'view' }).click()
        await blog.getByRole('button', { name: 'remove' }).click()

        await expect(blog).not.toBeVisible()
      })

      test('only the user who added blog can see remove button', async ({ page }) => {
        const blog = page.getByText('test blog author').locator('..')
        await blog.getByRole('button', { name: 'view' }).click()
        await expect(blog.getByRole('button', { name: 'remove' })).toBeVisible()

        await page.getByRole('button', { name: 'logout' }).click()

        await loginWith(page, 'username2', 'password')

        await blog.getByRole('button', { name: 'view' }).click()
        await expect(blog.getByRole('button', { name: 'remove' })).not.toBeVisible()
      })
    })

    describe('several notes exist', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, 'test blog1', 'author1', 'test1.com')
        await createBlog(page, 'test blog2', 'author2', 'test2.com')
        await createBlog(page, 'test blog3', 'author3', 'test3.com')
      })
      test('blogs are arranged in the order of likes', async ({ page }) => {
        const blog3 = page.getByText('test blog3 author3').locator('..')
        const blog2 = page.getByText('test blog2 author2').locator('..')

        await blog3.getByRole('button', { name: 'view' }).click()
        await blog3.getByRole('button', { name: 'like' }).click()
        await blog3.getByText('likes 1').waitFor()
        await blog3.getByRole('button', { name: 'like' }).click()
        await blog3.getByText('likes 2').waitFor()
        await blog2.getByRole('button', { name: 'view' }).click()
        await blog2.getByRole('button', { name: 'like' }).click()
        await blog2.getByText('likes 1').waitFor()

        const blogs = await page.locator('.blog').all() 
        
        await expect(blogs[0]).toContainText('test blog3')
        await expect(blogs[1]).toContainText('test blog2')
        await expect(blogs[2]).toContainText('test blog1')
      })
    })
  })
})