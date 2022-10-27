const express = require('express')
const morgan = require('morgan')
const cors = require("cors")
const app = express()

app.use(express.static('build'))
app.use(cors())
app.use(express.json())
app.use(morgan((tokens, req, res) => {
  morgan.token("body", req => { return JSON.stringify(req.body) })
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    tokens["body"](req)
  ].join(' ')
}))

let persons = [
  { 
    "name": "Arto Hellas", 
    "number": "040-123456",
    "id": 1
  },
  { 
    "name": "Ada Lovelace", 
    "number": "39-44-5323523",
    "id": 2
  },
  { 
    "name": "Dan Abramov", 
    "number": "12-43-234345",
    "id": 3
  },
  { 
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122",
    "id": 4
  }
]

app.get('/api/persons', (req, res) => res.send(persons))

app.get("/api/persons/:id", (req, res) => {
  const id = parseInt(req.params.id)
  const person = persons.find(person => person.id === id)
  if (person) res.send(person)
  else res.send("Person not found.")
})

app.get("/info", (req, res) => {
  res.send(`
    Phonebook has info for ${persons.length} people.
    ${Date()}
  `)
})

app.post("/api/persons", (req, res) => {
  const id = parseInt((Math.random() * (99999 - 1) + 1).toFixed(0))
  let newPerson

  if (!req.body.name) res.status(400).json({"error": "Missing name."})
  else if (!req.body.number) res.status(400).json({"error": "Missing number."})
  else if (persons.map(person => person.name).includes(req.body.name)) res.status(400).json({"error": "Name must be unique."})
  else {
    newPerson = {
      ...req.body, 
      id
    }
    persons.push(newPerson)
    res.json(newPerson)
  }
})

app.delete("/api/persons/:id", (req, res) => {
  const id = parseInt(req.params.id)
  const person = persons.find(person => person.id === id)
  if (person) {
    persons = persons.filter(person => person.id !== id)
    res.status(204).end()
  } else {
    res.status(404).send("Person not found.")
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, "0.0.0.0", (req, res) => {
  console.log(`Server running on port ${PORT}`)
})