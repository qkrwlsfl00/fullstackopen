import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('when new blog is created, calls event handler with right details', async () => {
  const user = userEvent.setup()
  const createBlog = vi.fn()
  const { container } = render(<BlogForm createBlog={createBlog} />)

  const newBlog = {
    title: 'test title',
    author: 'jin',
    url:'http://testurl.com'
  }

  const titleInput = container.querySelector('#title')
  const authorInput = container.querySelector('#author')
  const urlInput = container.querySelector('#url')
  const createButton = screen.getByText('create')

  await user.type(titleInput, newBlog.title)
  await user.type(authorInput, newBlog.author)
  await user.type(urlInput, newBlog.url)
  await user.click(createButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0]).toStrictEqual(newBlog)
})