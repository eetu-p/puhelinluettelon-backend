const express = require('express')
const app = express()
app.use(express.json())

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
  console.log(req.body)
  const id = parseInt((Math.random() * (99999 - 1) + 1).toFixed(0))
  const newPerson = {
    ...req.body, 
    id
  }
  persons.push(newPerson)
  res.json(newPerson)
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

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})