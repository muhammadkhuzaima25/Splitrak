const express = require('express')
const router = express.Router()
const protect = require('../middleware/authMiddleware')
const {
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
} = require('../controllers/quotationController')

router.use(protect)

// Dashboard
router.get('/dashboard/stats', getDashboardStats)
router.get('/dashboard/top-vendors', getTopVendors)
router.get('/dashboard/monthly-activity', getMonthlyActivity)

// Quotation Requests
router.route('/quotation-requests').get(getQuotationRequests).post(createQuotationRequest)
router.get('/quotation-requests/:id/history', getRequestHistory)
router.route('/quotation-requests/:id').put(updateQuotationRequest).delete(deleteQuotationRequest)

// Quotation Responses
router.route('/quotation-responses').get(getQuotationResponses).post(createQuotationResponse)
router.get('/quotation-responses/by-request/:requestId', getResponsesByRequest)
router.route('/quotation-responses/:id').put(updateQuotationResponse).delete(deleteQuotationResponse)

module.exports = router
