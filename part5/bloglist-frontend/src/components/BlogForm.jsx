import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = async (event) => {
    event.preventDefault()

    await createBlog({ title, author, url })

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <div>
          <label>
            title:
            <input
              id='title'
              type='text'
              value={title}
              onChange={({ target }) => setTitle(target.value)}
              name='Title'
            />
          </label>
        </div>
        <div>
          <label>
            author:
            <input
              id='author'
              type='text'
              value={author}
              onChange={({ target }) => setAuthor(target.value)}
              name='Author'
            />
          </label>
        </div>
        <div>
          <label>
            url:
            <input
              id='url'
              type='text'
              value={url}
              onChange={({ target }) => setUrl(target.value)}
              name='Url'
            />
          </label>
        </div>
        <button type='submit'>create</button>
      </form>
    </div>
  )
}

export default BlogForm