const mongoose = require('mongoose')

const historyEntrySchema = new mongoose.Schema({
  action: { type: String, required: true },
  performedBy: { type: String, required: true },
  details: { type: String },
  timestamp: { type: Date, default: Date.now }
}, { _id: false })

const quotationRequestSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  items: [{
    itemName: { type: String, required: true },
    quantity: { type: Number, required: true }
  }],
  status: { type: String, enum: ['Open', 'Closed'], default: 'Open' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  history: [historyEntrySchema]
}, { timestamps: true })

module.exports = mongoose.model('QuotationRequest', quotationRequestSchema)
