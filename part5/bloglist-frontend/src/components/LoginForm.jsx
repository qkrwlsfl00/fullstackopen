import { useState } from 'react'

const LoginForm = ({ handleLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const onLogin = async (event) => {
    event.preventDefault()

    await handleLogin(username, password)
  }

  return (
    <form onSubmit={onLogin}>
      <div>
        <label>
          username
          <input
            type='text'
            value={username}
            onChange={({ target }) => setUsername(target.value)}
            name='Username'
          />
        </label>
      </div>
      <div>
        <label>
          password
          <input
            type='password'
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            name='Password'
          />
        </label>
      </div>
      <button type='submit'>login</button>
    </form>
  )
}

export default LoginForm