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

const App = () => {
	const [persons, setPersons] = useState([])
	const [newName, setNewName] = useState('')
	const [newNumber, setNewNumber] = useState('')
	const [personsFilter, setPersonsFilter] = useState('')

	useEffect(() => {
		personsService.getAll().then((initialPersons) => setPersons(initialPersons))
	}, [])

	const handleNewNameChange = (event) => setNewName(event.target.value)

	const handleNewNumberChange = (event) => setNewNumber(event.target.value)

	const handleFilterChange = (event) => setPersonsFilter(event.target.value)

	const addPerson = (event) => {
		event.preventDefault()

		if (persons.find((person) => person.name === newName)) {
			alert(`${newName} is already added to phonebook`)
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
			})
		}
	}

	const deletePerson = (person) => {
		if (window.confirm(`Delete ${person.name}?`)) {
			personsService.remove(person.id).then(() => {
				setPersons(persons.filter((p) => p.id !== person.id))
			})
		}
	}

	return (
		<div>
			<h2>Phonebook</h2>
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
			{persons && persons.length && (
				<Persons persons={persons} personsFilter={personsFilter} deletePerson={deletePerson} />
			)}
		</div>
	)
}

export default App
