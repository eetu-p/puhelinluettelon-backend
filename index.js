const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
require("dotenv/config")
const app = express()
const PhoneNumber = require("./models/phone-number")

app.use(express.json())
app.use(express.static("build"))
app.use(cors())
app.use(morgan((tokens, req, res) => {
  morgan.token("body", req => { return JSON.stringify(req.body) })
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, "content-length"), "-",
    tokens["response-time"](req, res), "ms",
    tokens["body"](req)
  ].join(" ")
}))

app.get("/api/persons", (req, res) => {
  PhoneNumber.find({}).then(phoneNumbers => res.json(phoneNumbers))
})

app.get("/api/persons/:id", (req, res, next) => {
  const id = req.params.id
  PhoneNumber.findById(id)
    .then(phoneNumber => {
      if (phoneNumber) res.json(phoneNumber)
      else res.status(404).end()
    })
    .catch(error => next(error))
})

app.get("/info", async (req, res) => {
  const amount = await PhoneNumber.countDocuments({})
  res.send(`
    Phonebook has info for ${amount} people.
    ${Date()}
  `)
})

app.post("/api/persons", (req, res, next) => {
  const newPerson = new PhoneNumber({ ...req.body })
  newPerson.save()
    .then(savedPerson => res.json(savedPerson))
    .catch(error => next(error))
})

app.put("/api/persons/:id", (req, res, next) => {
  const id = req.params.id
  PhoneNumber.findByIdAndUpdate(id, { ...req.body }, { new: true })
    .then(phoneNumber => res.json(phoneNumber))
    .catch(error => next(error))
})

app.delete("/api/persons/:id", (req, res, next) => {
  const id = req.params.id
  PhoneNumber.findByIdAndRemove(id)
    .then(() => res.status(204).end())
    .catch(error => next(error))
})

const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" })
  } else if (["CustomError", "ValidationError"].includes(error.name)) {
    return res.status(400).json({ error: error.message })
  }

  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, "0.0.0.0", () => console.log(`Server running on port ${PORT}`))