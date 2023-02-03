import { useState } from 'react'

const Button = ({ title, onClick }) => <button onClick={onClick}>{title}</button>

const Statistics = ({ good, neutral, bad }) => {
	const all = good + neutral + bad

	return (
		<>
			<div>good {good}</div>
			<div>neutral {neutral}</div>
			<div>bad {bad}</div>
			<div>all {all}</div>
			<div>average {all ? (good - bad) / all : 0}</div>
			<div>positive {all ? (100 * good) / all + '%' : 'no percentage available'}</div>
		</>
	)
}

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
			<Statistics good={good} neutral={neutral} bad={bad} />
		</>
	)
}

export default App
