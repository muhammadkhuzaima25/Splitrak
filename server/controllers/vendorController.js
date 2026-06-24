const Vendor = require('../models/Vendor')

const getVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find().sort({ createdAt: -1 })
    res.json(vendors)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const createVendor = async (req, res) => {
  try {
    const { name, companyName, email, phone, address } = req.body

    if (!name || !companyName || !email) {
      return res.status(400).json({ message: 'Name, company, and email are required' })
    }

    const vendor = await Vendor.create({ name, companyName, email, phone, address })
    res.status(201).json(vendor)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const updateVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id)
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' })
    }

    const updated = await Vendor.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(updated)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const deleteVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id)
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' })
    }

    await Vendor.findByIdAndDelete(req.params.id)
    res.json({ message: 'Vendor removed' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { getVendors, createVendor, updateVendor, deleteVendor }
