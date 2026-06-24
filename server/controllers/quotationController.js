const QuotationRequest = require('../models/QuotationRequest')
const QuotationResponse = require('../models/QuotationResponse')
const Vendor = require('../models/Vendor')

// Quotation Requests
const getQuotationRequests = async (req, res) => {
  try {
    const requests = await QuotationRequest.find().sort({ createdAt: -1 })
    res.json(requests)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const createQuotationRequest = async (req, res) => {
  try {
    const { title, description, items } = req.body

    if (!title || !items || items.length === 0) {
      return res.status(400).json({ message: 'Title and items are required' })
    }

    const userName = req.user?.name || 'Unknown User'
    const request = await QuotationRequest.create({
      title,
      description,
      items,
      createdBy: req.user?._id,
      history: [{
        action: 'Request Created',
        performedBy: userName,
        details: `Created with ${items.length} item(s)`,
        timestamp: new Date()
      }]
    })
    res.status(201).json(request)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const updateQuotationRequest = async (req, res) => {
  try {
    const request = await QuotationRequest.findById(req.params.id)
    if (!request) {
      return res.status(404).json({ message: 'Request not found' })
    }

    const userName = req.user?.name || 'Unknown User'
    const historyEntries = []

    if (req.body.status && req.body.status !== request.status) {
      historyEntries.push({
        action: 'Status Changed',
        performedBy: userName,
        details: `Status changed from ${request.status} to ${req.body.status}`,
        timestamp: new Date()
      })
    }

    if (req.body.items) {
      const oldItems = request.items.map(i => `${i.itemName} x${i.quantity}`).join(', ')
      const newItems = req.body.items.map(i => `${i.itemName} x${i.quantity}`).join(', ')
      if (oldItems !== newItems) {
        historyEntries.push({
          action: 'Items Updated',
          performedBy: userName,
          details: `Items list updated`,
          timestamp: new Date()
        })
      }
    }

    if (req.body.title && req.body.title !== request.title) {
      historyEntries.push({
        action: 'Title Updated',
        performedBy: userName,
        details: `Title changed from "${request.title}" to "${req.body.title}"`,
        timestamp: new Date()
      })
    }

    const updated = await QuotationRequest.findByIdAndUpdate(
      req.params.id,
      { ...req.body, $push: { history: { $each: historyEntries } } },
      { new: true }
    )
    res.json(updated)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const deleteQuotationRequest = async (req, res) => {
  try {
    const request = await QuotationRequest.findById(req.params.id)
    if (!request) {
      return res.status(404).json({ message: 'Request not found' })
    }

    await QuotationRequest.findByIdAndDelete(req.params.id)
    await QuotationResponse.deleteMany({ quotationRequest: req.params.id })
    res.json({ message: 'Request and associated responses removed' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Quotation Responses
const getQuotationResponses = async (req, res) => {
  try {
    const responses = await QuotationResponse.find()
      .populate('quotationRequest', 'title')
      .populate('vendor', 'name companyName')
      .sort({ createdAt: -1 })
    res.json(responses)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getResponsesByRequest = async (req, res) => {
  try {
    const responses = await QuotationResponse.find({ quotationRequest: req.params.requestId })
      .populate('vendor', 'name companyName phone email address')
      .sort({ submissionDate: -1 })
    res.json(responses)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const createQuotationResponse = async (req, res) => {
  try {
    const { quotationRequest, vendor, items } = req.body

    if (!quotationRequest || !vendor || !items || items.length === 0) {
      return res.status(400).json({ message: 'Request, vendor, and items are required' })
    }

    const totalAmount = items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0)

    const response = await QuotationResponse.create({
      quotationRequest,
      vendor,
      items,
      totalAmount
    })

    res.status(201).json(response)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const updateQuotationResponse = async (req, res) => {
  try {
    const response = await QuotationResponse.findById(req.params.id)
    if (!response) {
      return res.status(404).json({ message: 'Response not found' })
    }

    if (req.body.items) {
      response.items = req.body.items
      response.totalAmount = req.body.items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0)
    }

    if (req.body.status) {
      response.status = req.body.status
    }

    await response.save()
    const populated = await QuotationResponse.findById(response._id)
      .populate('vendor', 'name companyName phone email address')
    res.json(populated)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const deleteQuotationResponse = async (req, res) => {
  try {
    const response = await QuotationResponse.findById(req.params.id)
    if (!response) {
      return res.status(404).json({ message: 'Response not found' })
    }

    await QuotationResponse.findByIdAndDelete(req.params.id)
    res.json({ message: 'Response removed' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Dashboard Stats
const getRequestHistory = async (req, res) => {
  try {
    const request = await QuotationRequest.findById(req.params.id)
      .select('title history')
      .sort({ 'history.timestamp': -1 })
    if (!request) {
      return res.status(404).json({ message: 'Request not found' })
    }
    res.json(request)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getDashboardStats = async (req, res) => {
  try {
    const totalVendors = await Vendor.countDocuments()
    const activeRequests = await QuotationRequest.countDocuments({ status: 'Open' })
    const pendingResponses = await QuotationResponse.countDocuments({ status: 'Pending' })
    const approvedQuotations = await QuotationResponse.countDocuments({ status: 'Approved' })
    const rejectedQuotations = await QuotationResponse.countDocuments({ status: 'Rejected' })

    const recentRequests = await QuotationRequest.find().sort({ createdAt: -1 }).limit(5)
    const recentResponses = await QuotationResponse.find()
      .populate('vendor', 'name')
      .populate('quotationRequest', 'title')
      .sort({ createdAt: -1 })
      .limit(5)

    const recentActivity = [
      ...recentRequests.map(r => ({
        activity: `New request: ${r.title}`,
        vendor: '-',
        date: r.createdAt,
        status: r.status === 'Open' ? 'Pending' : 'Approved'
      })),
      ...recentResponses.map(r => ({
        activity: `Response for: ${r.quotationRequest?.title || 'Unknown'}`,
        vendor: r.vendor?.name || 'Unknown',
        date: r.submissionDate,
        status: r.status
      }))
    ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5)

    res.json({
      totalVendors,
      activeRequests,
      pendingResponses,
      approvedQuotations,
      rejectedQuotations,
      recentActivity
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getTopVendors = async (req, res) => {
  try {
    const topVendors = await QuotationResponse.aggregate([
      { $match: { status: 'Approved' } },
      { $group: { _id: '$vendor', approvals: { $sum: 1 } } },
      { $sort: { approvals: -1 } },
      { $limit: 5 },
      { $lookup: { from: 'vendors', localField: '_id', foreignField: '_id', as: 'vendor' } },
      { $unwind: '$vendor' },
      { $project: { vendorName: '$vendor.name', approvals: 1, _id: 0 } }
    ])
    res.json(topVendors)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getMonthlyActivity = async (req, res) => {
  try {
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5)
    sixMonthsAgo.setDate(1)
    sixMonthsAgo.setHours(0, 0, 0, 0)

    const requestsByMonth = await QuotationRequest.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      { $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          requests: { $sum: 1 }
      }},
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ])

    const approvedByMonth = await QuotationResponse.aggregate([
      { $match: { status: 'Approved', submissionDate: { $gte: sixMonthsAgo } } },
      { $group: {
          _id: { year: { $year: '$submissionDate' }, month: { $month: '$submissionDate' } },
          approved: { $sum: 1 }
      }},
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ])

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const result = []
    const now = new Date()
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const year = d.getFullYear()
      const month = d.getMonth() + 1
      const reqData = requestsByMonth.find(r => r._id.year === year && r._id.month === month)
      const appData = approvedByMonth.find(r => r._id.year === year && r._id.month === month)
      result.push({
        month: monthNames[month - 1],
        requests: reqData?.requests || 0,
        approved: appData?.approved || 0
      })
    }

    res.json(result)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
  getQuotationRequests,
  createQuotationRequest,
  updateQuotationRequest,
  deleteQuotationRequest,
  getRequestHistory,
  getQuotationResponses,
  getResponsesByRequest,
  createQuotationResponse,
  updateQuotationResponse,
  deleteQuotationResponse,
  getDashboardStats,
  getTopVendors,
  getMonthlyActivity
}
