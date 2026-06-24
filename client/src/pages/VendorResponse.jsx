import { useState, useEffect } from 'react'
import { RiDeleteBinLine } from 'react-icons/ri'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import api from '../api/axios'
import toast from 'react-hot-toast'

const VendorResponse = () => {
  const [requests, setRequests] = useState([])
  const [vendors, setVendors] = useState([])
  const [responses, setResponses] = useState([])
  const [selectedRequest, setSelectedRequest] = useState('')
  const [selectedVendor, setSelectedVendor] = useState('')
  const [prices, setPrices] = useState({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const fetchData = async () => {
    try {
      const [reqRes, venRes, respRes] = await Promise.all([
        api.get('/quotation-requests'),
        api.get('/vendors'),
        api.get('/quotation-responses')
      ])
      setRequests(reqRes.data)
      setVendors(venRes.data)
      setResponses(respRes.data)
    } catch (err) {
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const selectedReq = requests.find(r => r._id === selectedRequest)

  useEffect(() => {
    if (selectedReq) {
      const initial = {}
      selectedReq.items.forEach(item => {
        initial[item.itemName] = ''
      })
      setPrices(initial)
    }
  }, [selectedRequest])

  const handleSubmit = async () => {
    if (!selectedRequest || !selectedVendor) {
      toast.error('Select a request and vendor')
      return
    }

    const items = selectedReq.items.map(item => ({
      itemName: item.itemName,
      quantity: item.quantity,
      unitPrice: parseFloat(prices[item.itemName]) || 0
    }))

    if (items.some(i => i.unitPrice <= 0)) {
      toast.error('Enter valid prices for all items')
      return
    }

    setSubmitting(true)
    try {
      await api.post('/quotation-responses', {
        quotationRequest: selectedRequest,
        vendor: selectedVendor,
        items
      })
      toast.success('Response submitted')
      setSelectedRequest('')
      setSelectedVendor('')
      setPrices({})
      fetchData()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this response?')) return
    try {
      await api.delete(`/quotation-responses/${id}`)
      toast.success('Response deleted')
      fetchData()
    } catch (err) {
      toast.error('Delete failed')
    }
  }

  const statusBadge = (status) => {
    const styles = {
      Pending: 'bg-warning/20 text-warning',
      Approved: 'bg-primary/20 text-primary',
      Rejected: 'bg-red-500/20 text-red-400',
    }
    return <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}>{status}</span>
  }

  return (
    <div className="flex min-h-screen pb-14 bg-gray-50 dark:bg-[#080E0D]">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar title="Vendor Responses" />
        <main className="p-6">
          {loading ? (
            <div className="flex justify-center py-20"><div className="spinner-lg"></div></div>
          ) : (
            <>
              {/* Submit Form */}
              <div className="bg-gray-50 dark:bg-[#0D1A17] border border-gray-200 dark:border-[#1A3028] rounded-xl p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-[#DFF5EE] mb-4">Submit Vendor Response</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm text-gray-500 dark:text-[#4D7A6C] mb-1">Quotation Request</label>
                    <select
                      value={selectedRequest}
                      onChange={(e) => setSelectedRequest(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white dark:bg-[#080E0D] border border-gray-200 dark:border-[#1A3028] rounded-lg text-gray-900 dark:text-[#DFF5EE] focus:outline-none focus:border-primary"
                    >
                      <option value="">Select request...</option>
                      {requests.filter(r => r.status === 'Open').map(r => (
                        <option key={r._id} value={r._id}>{r.title}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 dark:text-[#4D7A6C] mb-1">Vendor</label>
                    <select
                      value={selectedVendor}
                      onChange={(e) => setSelectedVendor(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white dark:bg-[#080E0D] border border-gray-200 dark:border-[#1A3028] rounded-lg text-gray-900 dark:text-[#DFF5EE] focus:outline-none focus:border-primary"
                    >
                      <option value="">Select vendor...</option>
                      {vendors.map(v => (
                        <option key={v._id} value={v._id}>{v.name} ({v.companyName})</option>
                      ))}
                    </select>
                  </div>
                </div>

                {selectedReq && (
                  <div className="space-y-3 mb-4">
                    <p className="text-sm text-gray-500 dark:text-[#4D7A6C]">Enter unit prices for each item:</p>
                    {selectedReq.items.map((item, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <span className="text-sm text-gray-900 dark:text-[#DFF5EE] w-48">{item.itemName} × {item.quantity}</span>
                        <input
                          type="number"
                          value={prices[item.itemName] || ''}
                          onChange={(e) => setPrices({ ...prices, [item.itemName]: e.target.value })}
                          className="w-36 px-4 py-2 bg-white dark:bg-[#080E0D] border border-gray-200 dark:border-[#1A3028] rounded-lg text-gray-900 dark:text-[#DFF5EE] focus:outline-none focus:border-primary"
                          placeholder="Unit price"
                          min="0"
                          step="0.01"
                        />
                        <span className="text-sm text-gray-500 dark:text-[#4D7A6C]">
                          = Rs. {((prices[item.itemName] || 0) * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={submitting || !selectedRequest || !selectedVendor}
                  className="px-6 py-2.5 bg-primary hover:bg-primary-light text-base font-semibold rounded-lg transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit Response'}
                </button>
              </div>

              {/* Responses Table */}
              <div className="bg-gray-50 dark:bg-[#0D1A17] border border-gray-200 dark:border-[#1A3028] rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-[#1A3028]">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-[#DFF5EE]">All Responses</h3>
                </div>
                {responses.length === 0 ? (
                  <div className="p-12 text-center text-gray-500 dark:text-[#4D7A6C]">No responses submitted yet</div>
                ) : (
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-sm text-gray-500 dark:text-[#4D7A6C] border-b border-gray-200 dark:border-[#1A3028]">
                        <th className="px-6 py-3">Request</th>
                        <th className="px-6 py-3">Vendor</th>
                        <th className="px-6 py-3">Items</th>
                        <th className="px-6 py-3">Total</th>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3">Date</th>
                        <th className="px-6 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {responses.map((resp) => (
                        <tr key={resp._id} className="border-b border-gray-200/50 dark:border-[#1A3028]/50 hover:bg-gray-100 dark:hover:bg-[#0D1A17]/50 transition-colors">
                          <td className="px-6 py-4 text-sm text-gray-900 dark:text-[#DFF5EE]">{resp.quotationRequest?.title || 'Deleted'}</td>
                          <td className="px-6 py-4 text-sm text-gray-500 dark:text-[#4D7A6C]">{resp.vendor?.name || 'Unknown'}</td>
                          <td className="px-6 py-4 text-sm text-gray-500 dark:text-[#4D7A6C]">{resp.items.length}</td>
                          <td className="px-6 py-4 text-sm text-gray-900 dark:text-[#DFF5EE] font-medium">Rs. {resp.totalAmount?.toLocaleString()}</td>
                          <td className="px-6 py-4">{statusBadge(resp.status)}</td>
                          <td className="px-6 py-4 text-sm text-gray-500 dark:text-[#4D7A6C]">{new Date(resp.submissionDate).toLocaleDateString()}</td>
                          <td className="px-6 py-4 text-right">
                            <button onClick={() => handleDelete(resp._id)} className="p-2 text-gray-500 dark:text-[#4D7A6C] hover:text-red-400 transition-colors">
                              <RiDeleteBinLine />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </>
          )}
        </main>
        <Footer />
      </div>
    </div>
  )
}

export default VendorResponse
