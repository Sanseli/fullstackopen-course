const Header = ({ name }) => {
	return <h2>{name}</h2>
}

const Content = ({ parts }) => {
	return (
		<>
			{parts.map((part) => (
				<Part key={part.id} part={part} />
			))}

			<Total parts={parts} />
		</>
	)
}

const Part = ({ part }) => {
	return (
		<p>
			{part.name} {part.exercises}
		</p>
	)
}

const Total = ({ parts }) => {
	return (
		<p style={{ fontWeight: 'bold' }}>
			total of {parts.map((part) => part.exercises).reduce((a, b) => a + b, 0)} exercises
		</p>
	)
}

const Course = ({ course }) => {
	return (
		<>
			<Header name={course.name} />
			<Content parts={course.parts} />
		</>
	)
}

export default Course
