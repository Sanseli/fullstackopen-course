import { useState } from 'react'

const Button = ({ title, onClick }) => <button onClick={onClick}>{title}</button>

const Statistics = ({ good, neutral, bad }) => {
	const all = good + neutral + bad

	return (
		<table>
			<tbody>
				<StatisticLine title='good' value={good} />
				<StatisticLine title='neutral' value={neutral} />
				<StatisticLine title='bad' value={bad} />
				<StatisticLine title='all' value={all} />
				<StatisticLine title='average' value={all ? (good - bad) / all : 0} />
				<StatisticLine
					title='positive'
					value={all ? (100 * good) / all + '%' : 'no percentage available'}
				/>
			</tbody>
		</table>
	)
}

const StatisticLine = ({ title, value }) => (
	<tr>
		<td>{title}</td>
		<td>{value}</td>
	</tr>
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
			<Statistics good={good} neutral={neutral} bad={bad} />
		</>
	)
}

export default App
