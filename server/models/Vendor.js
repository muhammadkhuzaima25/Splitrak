const mongoose = require('mongoose')

const vendorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  companyName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  address: { type: String }
}, { timestamps: true })

module.exports = mongoose.model('Vendor', vendorSchema)
