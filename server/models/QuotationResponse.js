const mongoose = require('mongoose')

const quotationResponseSchema = new mongoose.Schema({
  quotationRequest: { type: mongoose.Schema.Types.ObjectId, ref: 'QuotationRequest', required: true },
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  items: [{
    itemName: { type: String, required: true },
    unitPrice: { type: Number, required: true },
    quantity: { type: Number, required: true },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' }
  }],
  totalAmount: { type: Number, required: true },
  submissionDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' }
}, { timestamps: true })

module.exports = mongoose.model('QuotationResponse', quotationResponseSchema)
