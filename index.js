// Imports
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

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

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

// Default display at root 
app.get('/', (request, response) => {
    response.send('<h1>Homepage</h1>')
})

// Retrieve all the persons data via the api
app.get('/api/persons', (request, response) => {
    response.json(persons)
})

// Retrieve a single person via the api
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => id === person.id) 

    if (!person) {
        response.status(404).end()
    } else {
        response.json(person)
    }
})

// Delete a single person via the api
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    
    response.status(204).end()
})

// Helper function to generate an id for each created person data
const generateId = () => {
    return Math.floor(Math.random() * 100000)
}

// Create a new person to be added to the dataset via the api
app.post('/api/persons', (request, response) => {
    const id = generateId()
    const body = request.body

    if (!body.name) {
        return response.status(400).json({
            error: 'name missing'
        })
    } else if (!body.number) {
        return response.status(400).json({
            error: 'number missing'
        })
    } else if (persons.find(person => body.name === person.name)) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person)
    response.json(person)
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
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
