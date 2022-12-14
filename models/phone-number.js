const mongoose = require("mongoose")

const url = process.env.MONGODB_URI
mongoose.connect(url)

const phoneNumberSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true
  },
  number: {
    type: String,
    minlength: 8,
    validate: {
      validator: phoneNumber => { return /\d{2,3}-\d+/.test(phoneNumber) },
      message: props => `Invalid phone number: ${props.value}`
    },
    required: true
  }
})

phoneNumberSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const PhoneNumber = mongoose.model("Phone number", phoneNumberSchema)

module.exports = PhoneNumber