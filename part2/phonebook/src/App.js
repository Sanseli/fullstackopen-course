import { useState, useEffect } from 'react'
import personsService from './services/persons'

const Filter = ({ personsFilter, handleFilterChange }) => {
	return (
		<div>
			filter shown with <input value={personsFilter} onChange={handleFilterChange} />
		</div>
	)
}

const PersonForm = ({
	newName,
	newNumber,
	handleNewNameChange,
	handleNewNumberChange,
	addPerson,
}) => {
	return (
		<form onSubmit={addPerson}>
			<div>
				name: <input value={newName} onChange={handleNewNameChange} />
			</div>
			<div>
				number: <input value={newNumber} onChange={handleNewNumberChange} />
			</div>
			<div>
				<button type='submit'>add</button>
			</div>
		</form>
	)
}

const Persons = ({ persons, personsFilter, deletePerson }) => {
	return persons
		.filter((person) =>
			personsFilter.length > 0
				? person.name.toLowerCase().includes(personsFilter.toLowerCase())
				: true
		)
		.map((person) => (
			<div key={person.id}>
				{person.name} {person.number} <button onClick={() => deletePerson(person)}>delete</button>
			</div>
		))
}

const Notification = ({ message, errorMessage }) => {
	const notificationStyle = {
		background: 'lightgrey',
		fontSize: '20px',
		borderStyle: 'solid',
		borderRadius: '5px',
		padding: '10px',
		marginBottom: '10px',
	}

	if (message === null && errorMessage === null) {
		return null
	}

	return (
		<div style={{ ...notificationStyle, color: message ? 'green' : 'red' }}>
			{message || errorMessage}
		</div>
	)
}

const App = () => {
	const [persons, setPersons] = useState([])
	const [newName, setNewName] = useState('')
	const [newNumber, setNewNumber] = useState('')
	const [personsFilter, setPersonsFilter] = useState('')
	const [message, setMessage] = useState(null)
	const [errorMessage, setErrorMessage] = useState(null)

	useEffect(() => {
		personsService.getAll().then((initialPersons) => setPersons(initialPersons))
	}, [])

	const handleNewNameChange = (event) => setNewName(event.target.value)

	const handleNewNumberChange = (event) => setNewNumber(event.target.value)

	const handleFilterChange = (event) => setPersonsFilter(event.target.value)

	const addPerson = (event) => {
		event.preventDefault()

		if (persons.find((person) => person.name === newName)) {
			const person = persons.find((person) => person.name === newName)
			if (
				window.confirm(
					`${newName} is already added to phonebook, replace the old number with a new one?`
				)
			) {
				personsService
					.update(person.id, { ...person, number: newNumber })
					.then((returnedPerson) => {
						setPersons(
							persons.map((person) => (person.id === returnedPerson.id ? returnedPerson : person))
						)
						setMessage(`Edited ${returnedPerson.name}`)
						setTimeout(() => {
							setMessage(null)
						}, 5000)
					})
					.catch(() => {
						setErrorMessage(`Information of ${person.name} has already been removed from server`)
						setTimeout(() => {
							setErrorMessage(null)
						}, 5000)
					})
			}
		} else {
			const personObject = {
				name: newName,
				number: newNumber,
				id: persons.length + 1,
			}

			personsService.create(personObject).then((returnedPerson) => {
				setPersons(persons.concat(returnedPerson))
				setNewName('')
				setNewNumber('')
				setMessage(`Added ${returnedPerson.name}`)
				setTimeout(() => {
					setMessage(null)
				}, 5000)
			})
		}
	}

	const deletePerson = (person) => {
		if (window.confirm(`Delete ${person.name}?`)) {
			personsService
				.remove(person.id)
				.then(() => {
					setPersons(persons.filter((p) => p.id !== person.id))
				})
				.catch(() => {
					setErrorMessage(`Information of ${person.name} has already been removed from server`)
					setTimeout(() => {
						setErrorMessage(null)
					}, 5000)
				})
		}
	}

	return (
		<div>
			<h2>Phonebook</h2>
			<Notification message={message} errorMessage={errorMessage} />
			<Filter personsFilter={personsFilter} handleFilterChange={handleFilterChange} />
			<h2>add a new</h2>
			<PersonForm
				newName={newName}
				newNumber={newNumber}
				handleNewNameChange={handleNewNameChange}
				handleNewNumberChange={handleNewNumberChange}
				addPerson={addPerson}
			/>
			<h2>Numbers</h2>
			<Persons persons={persons} personsFilter={personsFilter} deletePerson={deletePerson} />
		</div>
	)
}

export default App
