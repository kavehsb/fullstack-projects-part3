// Imports
require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

// Start server
const app = express()

// Log requests to console
morgan.token('body', function getBody(req) {
    return JSON.stringify(req.body)
})

// Middleware
app.use(express.json())
app.use(express.static('build'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())

// Retrieve all the persons data via the api
app.get('/api/persons', (request, response) => {
    Person
    .find({})
    .then(person => {
        response.json(person)
    })
})

// Retrieve a single person via the api
app.get('/api/persons/:id', (request, response) => {
    Person
    .findById(request.params.id)
    .then(person => {
        response.json(person)
    })
    .catch(error => {
        console.log(`Error retrieving person of id ${request.params.id}`, error.message)
    })
})

// Delete a single person via the api
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    
    response.status(204).end()
})

// Create a new person to be added to the dataset via the api
app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name) {
        return response.status(400).json({
            error: 'name missing'
        })
    } else if (!body.number) {
        return response.status(400).json({
            error: 'number missing'
        })
    }

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person
    .save()
    .then(savedPerson => {
        response.json(savedPerson)
    })
})

// Update a persons information via the api
app.put('/api/persons/:id', (request, response) => {
    let body = request.body
    persons = persons.map(person => person.name !== body.name ? person : (body = {
        id: person.id,
        name: body.name,
        number: body.number
    }))
    console.log(persons)
    response.send(body)
})

// Get info for the phonebook and the time this info was processed
app.get('/info', (request, response) => {
    const date = new Date()
    response.send(
        `<p>
            Phonebook has info for ${persons.length} people. 
            <br/> Date processed: ${date}
        </p>`
    )
})

// PORT
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
