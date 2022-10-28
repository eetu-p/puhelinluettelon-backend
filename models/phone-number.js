const mongoose = require('mongoose')

const url = process.env.MONGODB_URI
mongoose.connect(url)

const phoneNumberSchema = new mongoose.Schema({
  name: String,
  number: String
})

phoneNumberSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const PhoneNumber = mongoose.model('Phone number', phoneNumberSchema)

module.exports = PhoneNumber