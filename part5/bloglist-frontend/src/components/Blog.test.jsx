import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from'./Blog'

describe('Blog', () => {
  const blog = {
    title: 'test title',
    author: 'Jin',
    url: 'http://test.com',
    likes: 5,
    user: {
      name: 'name1',
      id: 'userid1'
    }
  }

  let updateBlog = null
  let deleteBlog = null

  beforeEach(() => {
    updateBlog = vi.fn()
    deleteBlog = vi.fn()
    render(<Blog blog={blog} updateBlog={updateBlog} deleteBlog={deleteBlog} />)
  })

  test('at first, only title and authors are rendered', () => {
    screen.getByText(blog.title, { exact: false })
    screen.getByText(blog.author, { exact: false })

    const urlElement = screen.queryByText(blog.url)
    const likesElement = screen.queryByText(blog.likes)
    expect(urlElement).toBeNull()
    expect(likesElement).toBeNull()
  })

  test('when button is clicked, url and likes are shown', async () => {
    const user = userEvent.setup()

    const button = screen.getByText('view')
    await user.click(button)

    screen.getByText(blog.url)
    screen.getByText(blog.likes)
  })

  test('when like button is clicked twice, updateBlog props is called twice', async () => {
    const user = userEvent.setup()

    const button = screen.getByText('view')
    await user.click(button)

    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(updateBlog.mock.calls).toHaveLength(2)
  })
})