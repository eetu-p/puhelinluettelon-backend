const mongoose = require("mongoose")

if (process.argv.length<3) {
  console.log("give password as argument")
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url =
  `mongodb+srv://test:${password}@cluster0.ikyvj6c.mongodb.net/puhelinluettelo?retryWrites=true&w=majority`

mongoose.connect(url)

const phoneNumberSchema = new mongoose.Schema({
  name: String,
  number: String
})

const PhoneNumber = mongoose.model("Phone number", phoneNumberSchema)

const phoneNumber = new PhoneNumber({
  name,
  number
})

if (name === undefined && number === undefined) {
  console.log("Phone book:")
  PhoneNumber.find({}).then(result => {
    result.forEach(phoneNumber => console.log(`${phoneNumber.name} ${phoneNumber.number}`))
    mongoose.connection.close()
  })
} else {
  phoneNumber.save().then(() => {
    console.log(`Added ${name} number ${number} to phone book.`)
    mongoose.connection.close()
  })
}