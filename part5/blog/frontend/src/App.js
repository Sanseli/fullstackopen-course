import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
	const [blogs, setBlogs] = useState([])
	const [newBlogTitle, setNewBlogTitle] = useState('')
	const [newBlogAuthor, setNewBlogAuthor] = useState('')
	const [newBlogUrl, setNewBlogUrl] = useState('')

	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [user, setUser] = useState(null)

	const [notification, setNotification] = useState(null)

	useEffect(() => {
		blogService.getAll().then((blogs) => setBlogs(blogs))
	}, [])

	useEffect(() => {
		const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
		if (loggedUserJSON) {
			const user = JSON.parse(loggedUserJSON)
			setUser(user)
			blogService.setToken(user.token)
		}
	}, [])

	const handleLogin = async (event) => {
		event.preventDefault()

		try {
			const user = await loginService.login({
				username,
				password,
			})

			window.localStorage.setItem('loggedNoteappUser', JSON.stringify(user))

			blogService.setToken(user.token)
			setUser(user)
			setUsername('')
			setPassword('')
		} catch (exception) {
			setNotification('wrong username or password')
			setTimeout(() => {
				setNotification(null)
			}, 5000)
		}
	}

	const handleLogout = () => {
		window.localStorage.removeItem('loggedNoteappUser')
		setUser(null)
	}

	const addBlog = async (event) => {
		event.preventDefault()
		const blogObject = {
			title: newBlogTitle,
			author: newBlogAuthor,
			url: newBlogUrl,
		}

		const newBlog = await blogService.create(blogObject)
		setBlogs(blogs.concat(newBlog))
		setNewBlogAuthor('')
		setNewBlogTitle('')
		setNewBlogUrl('')

		setNotification(`a new blog ${newBlog.title} by ${newBlog.author} added`)
		setTimeout(() => {
			setNotification(null)
		}, 5000)
	}

	if (user === null) {
		return (
			<form onSubmit={handleLogin}>
				<h2>log in to application</h2>
				<Notification message={notification} error={true} />
				<div>
					username
					<input
						type='text'
						value={username}
						name='Username'
						onChange={({ target }) => setUsername(target.value)}
					/>
				</div>
				<div>
					password
					<input
						type='password'
						value={password}
						name='Password'
						onChange={({ target }) => setPassword(target.value)}
					/>
				</div>
				<button type='submit'>login</button>
			</form>
		)
	}

	return (
		<>
			<h2>blogs</h2>
			<Notification message={notification} />
			<div>
				{`${user.name} logged in`} <button onClick={handleLogout}>logout</button>
			</div>
			<br />

			{blogs.map((blog) => (
				<Blog key={blog.id} blog={blog} />
			))}

			<form onSubmit={addBlog}>
				<h2>create new</h2>
				<div>
					title:
					<input
						type='text'
						value={newBlogTitle}
						name='title'
						onChange={({ target }) => setNewBlogTitle(target.value)}
					/>
				</div>
				<div>
					author:
					<input
						type='text'
						value={newBlogAuthor}
						name='author'
						onChange={({ target }) => setNewBlogAuthor(target.value)}
					/>
				</div>
				<div>
					url:
					<input
						type='text'
						value={newBlogUrl}
						name='url'
						onChange={({ target }) => setNewBlogUrl(target.value)}
					/>
				</div>
				<button type='submit'>create</button>
			</form>
		</>
	)
}

export default App
