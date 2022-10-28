const express = require('express')
const morgan = require('morgan')
const cors = require("cors")
require('dotenv/config')
const app = express()
const PhoneNumber = require("./models/phone-number")
const { response } = require('express')

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

app.get('/api/persons', (req, res) => {
  PhoneNumber.find({}).then(phoneNumbers => res.json(phoneNumbers))
})

app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id
  PhoneNumber.findById(id).then(phoneNumber => res.json(phoneNumber))
})

app.get("/info", (req, res) => {
  res.send(`
    Phonebook has info for ${persons.length} people.
    ${Date()}
  `)
})

app.post("/api/persons", (req, res) => {
  if (!req.body.name) res.status(400).json({"error": "Missing name."})
  else if (!req.body.number) res.status(400).json({"error": "Missing number."})
  
  const newPerson = new PhoneNumber({...req.body})
  newPerson.save().then(savedPerson => res.json(savedPerson))
})

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id
  PhoneNumber.findByIdAndRemove(id)
    .then(() => res.status(204).end())
    .catch(error => next(error))
})

const PORT = process.env.PORT || 3001
app.listen(PORT, "0.0.0.0", (req, res) => {
  console.log(`Server running on port ${PORT}`)
})