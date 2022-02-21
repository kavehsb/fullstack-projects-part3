// Imports
require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const person = require('./models/person')

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
app.get('/api/persons/:id', (request, response, next) => {
    Person
    .findById(request.params.id)
    .then(person => {
        if (person) {
            response.json(person)
        } else {
            response.status(404).end()
        }
    })
    .catch(error => next(error))
})

// Delete a single person via the api
app.delete('/api/persons/:id', (request, response, next) => {
    Person
    .findByIdAndDelete(request.params.id)
    .then(result => {
        response.status(204).end()
    })
    .catch(error => next(error))
})

// Create a new person to be added to the dataset via the api
app.post('/api/persons', (request, response, next) => {
    const body = request.body

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person
    .save()
    .then(savedPerson => {
        response.json(savedPerson)
    })
    .catch(error => next(error))
})

// Update a persons information via the api
app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
    
    const updatedPerson = {
        name: body.name,
        number: body.number,
    }

    const options = {new: true, runValidators: true, context:'query'}

    Person
    .findByIdAndUpdate(
        request.params.id, 
        updatedPerson, 
        options,
    )
    .then(person => {
        response.json(person)
    })
    .catch(error => {
        next(error)
    })
})

// Get info for the phonebook and the time this info was processed
app.get('/info', (request, response) => {
    date = new Date()
    Person
    .collection.countDocuments()
    .then(result => {
        response.send(
            `<p>
                Phonebook has info for ${result} people. 
                <br/> Date processed: ${date}
            </p>`
        )
    })
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.log(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        console.log(error.message)
        return response.status(400).send(error.message)
    }
    next(error)
}

app.use(errorHandler)

// PORT
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
