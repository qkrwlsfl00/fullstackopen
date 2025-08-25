import { useState } from 'react'

const Blog = ({ blog, updateBlog, deleteBlog, user }) => {
  const [detailView, setDetailView] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const toggleDetailView = () => {
    setDetailView(!detailView)
  }

  const increaseLikes = () => {
    const newBlog = {
      user: blog.user?.id,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url,
    }

    updateBlog(blog.id, newBlog)
  }

  const handleRemove = () => {
    if (window.confirm(`remove blog ${blog.title} by ${blog.author}`)) {
      deleteBlog(blog.id)
    }
  }

  return (
    <div className='blog' style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button onClick={toggleDetailView}>
          {detailView ? 'hide' : 'view'}
        </button>
      </div>
      {detailView && <div>
        <div>{blog.url}</div>
        <div>
          likes {blog.likes}
          <button onClick={increaseLikes}>like</button>
        </div>
        <div>{blog.user.name}</div>
        {(blog.user?.username === user.username) &&
        <button onClick={handleRemove}>remove</button>
        }
      </div>
      }
    </div>
  )
}

export default Blog