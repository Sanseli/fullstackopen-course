require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const app = express()
const Person = require('./models/persons')

morgan.token('body', function (req, res) {
	return JSON.stringify(req.body)
})

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(express.static('build'))

app.get('/', (request, response) => {
	response.send(`<p>Phonebook has info for ${persons.length} people</p> <p>${new Date()}</p>`)
})

app.get('/api/persons', (request, response) => {
	Person.find({}).then((persons) => {
		response.json(persons)
	})
})

app.get('/api/persons/:id', (request, response) => {
	Person.findById(request.params.id).then((person) => {
		response.json(person)
	})
})

app.post('/api/persons', (request, response) => {
	const body = request.body

	if (!body.name || !body.number) {
		return response.status(400).json({
			error: 'name of number is missing',
		})
	}

	const person = new Person({
		name: body.name,
		number: body.number,
	})

	morgan.token('body', (request) => JSON.stringify(request.body))

	person.save().then((savedNote) => {
		response.json(savedNote)
	})
})

app.delete('/api/persons/:id', (request, response) => {
	const id = Number(request.params.id)
	persons = persons.filter((person) => person.id !== id)

	response.status(204).end()
})

const PORT = process.env.PORT
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})
