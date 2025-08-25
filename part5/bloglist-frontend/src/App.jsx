import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Nofitication'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [noti, setNoti] = useState(null)

  const blogFormRef = useRef()

  const byLikes = (a, b) => b.likes - a.likes

  useEffect(() => {
    blogService.getAll().then(blogs => {
      blogs.sort(byLikes)
      setBlogs( blogs )
    }

    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const showNoti = (message, isError) => {
    setNoti({ message, isError })
    setTimeout(() => {
      setNoti(null)
    }, 5000)
  }

  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login({ username, password })
      setUser(user)
      showNoti(`${user.name} has successfully logged in`, false)
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
    } catch {
      console.error('wrong credentials')
      showNoti('wrong username or password', true)
    }
  }

  const handleLogout = event => {
    event.preventDefault()
    showNoti(`${user.name} has logged out`, false)
    setUser(null)
    blogService.setToken(null)
    window.localStorage.removeItem('loggedBlogappUser')
  }

  const createBlog = async (blogObject) => {
    try {
      const createdBlog = await blogService.create(blogObject)
      showNoti(`a new blog ${createdBlog.title} by ${createdBlog.author} added`, false)
      const blogsAddedNew = blogs.concat(createdBlog).sort(byLikes)
      setBlogs(blogsAddedNew)
      blogFormRef.current.toggleVisibility()
    } catch (error) {
      console.error(error.response.data.error)
      showNoti('error adding new blog', true)
    }
  }

  const updateBlog = async (id, blogObject) => {
    try {
      const updatedBlog = await blogService.update(id, blogObject)
      const blogsUpdated = blogs.map(b => b.id !== id
        ? b
        : updatedBlog
      ).sort(byLikes)
      setBlogs(blogsUpdated)
    } catch {
      console.error('error updating a blog')
      showNoti('error updating a blog', true)
    }
  }

  const deleteBlog = async (id) => {
    try {
      await blogService.del(id)
      setBlogs(blogs.filter(b => b.id !== id))
    } catch (error) {
      console.error(error.response.data.error)
      if (error.response.status === 403) {
        showNoti('You are not the creator of this blog', true)
      } else {
        showNoti('error deleting a blog', true)
      }
    }
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification noti={noti} />
        <LoginForm handleLogin={handleLogin} />
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>

      <Notification noti={noti} />

      <div>
        {user.name} logged in
        <button onClick={handleLogout}>logout</button>
      </div>

      <Togglable buttonLabel='new blog' ref={blogFormRef}>
        <BlogForm createBlog={createBlog} />
      </Togglable>

      {blogs.map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          updateBlog={updateBlog}
          deleteBlog={deleteBlog}
          user={user}
        />
      )}

    </div>
  )
}

export default App