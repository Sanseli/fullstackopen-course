import { useState } from 'react'

const Button = ({ title, onClick }) => <button onClick={onClick}>{title}</button>

const Statistic = ({ title, value }) => (
	<p>
		{title} {value}
	</p>
)

const App = () => {
	// save clicks of each button to its own state
	const [good, setGood] = useState(0)
	const [neutral, setNeutral] = useState(0)
	const [bad, setBad] = useState(0)

	return (
		<>
			<h1>give feedback</h1>
			<Button title='good' onClick={() => setGood(good + 1)} />
			<Button title='neutral' onClick={() => setNeutral(neutral + 1)} />
			<Button title='bad' onClick={() => setBad(bad + 1)} />

			<h1>statistics</h1>
			<Statistic title='good' value={good} />
			<Statistic title='neutral' value={neutral} />
			<Statistic title='bad' value={bad} />
		</>
	)
}

export default App
