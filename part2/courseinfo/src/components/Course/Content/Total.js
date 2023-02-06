const Total = ({ parts }) => {
	return (
		<p style={{ fontWeight: 'bold' }}>
			total of {parts.map((part) => part.exercises).reduce((a, b) => a + b, 0)} exercises
		</p>
	)
}

export default Total
