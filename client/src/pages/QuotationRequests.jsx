import { useState, useEffect } from 'react'
import { RiAddLine, RiDeleteBinLine, RiEditLine, RiHistoryLine, RiCloseLine, RiTimeLine } from 'react-icons/ri'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import api from '../api/axios'
import toast from 'react-hot-toast'

const QuotationRequests = () => {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingRequest, setEditingRequest] = useState(null)
  const [form, setForm] = useState({ title: '', description: '', items: [{ itemName: '', quantity: '' }] })
  const [errors, setErrors] = useState({})
  const [showHistory, setShowHistory] = useState(false)
  const [historyData, setHistoryData] = useState(null)
  const [historyLoading, setHistoryLoading] = useState(false)
  const [historyRequestTitle, setHistoryRequestTitle] = useState('')

  const fetchRequests = async () => {
    try {
      const res = await api.get('/quotation-requests')
      setRequests(res.data)
    } catch (err) {
      toast.error('Failed to load requests')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchRequests() }, [])

  const addItem = () => {
    setForm({ ...form, items: [...form.items, { itemName: '', quantity: '' }] })
  }

  const removeItem = (index) => {
    if (form.items.length <= 1) return
    setForm({ ...form, items: form.items.filter((_, i) => i !== index) })
  }

  const handleItemChange = (index, field, value) => {
    const items = [...form.items]
    items[index] = { ...items[index], [field]: value }
    setForm({ ...form, items })
  }

  const validate = () => {
    const errs = {}
    if (!form.title) errs.title = 'Title is required'
    const validItems = form.items.filter(i => i.itemName && i.quantity)
    if (validItems.length === 0) errs.items = 'At least one item is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    try {
      const items = form.items.filter(i => i.itemName && i.quantity).map(i => ({
        itemName: i.itemName,
        quantity: parseInt(i.quantity)
      }))
      await api.post('/quotation-requests', { title: form.title, description: form.description, items })
      toast.success('Request created')
      setShowModal(false)
      setForm({ title: '', description: '', items: [{ itemName: '', quantity: '' }] })
      fetchRequests()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create')
    }
  }

  const handleEdit = (req) => {
    setEditingRequest(req)
    setForm({
      title: req.title,
      description: req.description || '',
      items: req.items.length > 0 ? req.items.map(i => ({ itemName: i.itemName, quantity: String(i.quantity) })) : [{ itemName: '', quantity: '' }]
    })
    setErrors({})
    setShowModal(true)
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    if (!validate()) return
    try {
      const items = form.items.filter(i => i.itemName && i.quantity).map(i => ({
        itemName: i.itemName,
        quantity: parseInt(i.quantity)
      }))
      await api.put(`/quotation-requests/${editingRequest._id}`, { title: form.title, description: form.description, items })
      toast.success('Request updated')
      setShowModal(false)
      setEditingRequest(null)
      setForm({ title: '', description: '', items: [{ itemName: '', quantity: '' }] })
      fetchRequests()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this request and all responses?')) return
    try {
      await api.delete(`/quotation-requests/${id}`)
      toast.success('Request deleted')
      fetchRequests()
    } catch (err) {
      toast.error('Delete failed')
    }
  }

  const handleViewHistory = async (req) => {
    setHistoryRequestTitle(req.title)
    setShowHistory(true)
    setHistoryLoading(true)
    setHistoryData(null)
    try {
      const res = await api.get(`/quotation-requests/${req._id}/history`)
      setHistoryData(res.data)
    } catch (err) {
      toast.error('Failed to load history')
    } finally {
      setHistoryLoading(false)
    }
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingRequest(null)
    setForm({ title: '', description: '', items: [{ itemName: '', quantity: '' }] })
    setErrors({})
  }

  const statusBadge = (status) => (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${status === 'Open' ? 'bg-primary/20 text-primary' : 'bg-gray-200 dark:bg-[#2A4A42] text-gray-500 dark:text-[#4D7A6C]'}`}>
      {status}
    </span>
  )

  const formatHistoryDate = (date) => {
    return new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="flex min-h-screen pb-14 bg-gray-50 dark:bg-[#080E0D]">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar title="Quotation Requests" />
        <main className="p-6">
          <div className="flex justify-end mb-6">
            <button
              onClick={() => { setEditingRequest(null); setForm({ title: '', description: '', items: [{ itemName: '', quantity: '' }] }); setShowModal(true) }}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-light text-base font-semibold rounded-lg transition-colors"
            >
              <RiAddLine /> Create Request
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-20"><div className="spinner-lg"></div></div>
          ) : requests.length === 0 ? (
            <div className="bg-gray-50 dark:bg-[#0D1A17] border border-gray-200 dark:border-[#1A3028] rounded-xl p-16 text-center">
              <p className="text-gray-500 dark:text-[#4D7A6C] text-lg">No quotation requests yet</p>
            </div>
          ) : (
            <div className="bg-gray-50 dark:bg-[#0D1A17] border border-gray-200 dark:border-[#1A3028] rounded-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-500 dark:text-[#4D7A6C] border-b border-gray-200 dark:border-[#1A3028]">
                    <th className="px-6 py-3">Title</th>
                    <th className="px-6 py-3">Description</th>
                    <th className="px-6 py-3">Items</th>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((req) => (
                    <tr key={req._id} className="border-b border-gray-200/50 dark:border-[#1A3028]/50 hover:bg-gray-100 dark:hover:bg-[#0D1A17]/50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-[#DFF5EE] font-medium">{req.title}</td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-[#4D7A6C]">{req.description || '-'}</td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-[#4D7A6C]">{req.items.length}</td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-[#4D7A6C]">{new Date(req.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4">{statusBadge(req.status)}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleViewHistory(req)}
                            className="p-2 text-gray-500 dark:text-[#4D7A6C] hover:text-primary transition-colors"
                            title="View History"
                          >
                            <RiHistoryLine />
                          </button>
                          <button
                            onClick={() => handleEdit(req)}
                            className="p-2 text-gray-500 dark:text-[#4D7A6C] hover:text-primary transition-colors"
                            title="Edit Request"
                          >
                            <RiEditLine />
                          </button>
                          <button
                            onClick={() => handleDelete(req._id)}
                            className="p-2 text-gray-500 dark:text-[#4D7A6C] hover:text-red-400 transition-colors"
                            title="Delete Request"
                          >
                            <RiDeleteBinLine />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
        <Footer />
      </div>

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-50 dark:bg-[#0D1A17] border border-gray-200 dark:border-[#1A3028] rounded-xl w-full max-w-lg p-6 max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-[#DFF5EE] mb-4">
              {editingRequest ? 'Edit Quotation Request' : 'Create Quotation Request'}
            </h3>
            <form onSubmit={editingRequest ? handleUpdate : handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-500 dark:text-[#4D7A6C] mb-1">Title</label>
                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-2.5 bg-white dark:bg-[#080E0D] border border-gray-200 dark:border-[#1A3028] rounded-lg text-gray-900 dark:text-[#DFF5EE] focus:outline-none focus:border-primary" placeholder="e.g. Office Supplies Q4" />
                {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
              </div>
              <div>
                <label className="block text-sm text-gray-500 dark:text-[#4D7A6C] mb-1">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-4 py-2.5 bg-white dark:bg-[#080E0D] border border-gray-200 dark:border-[#1A3028] rounded-lg text-gray-900 dark:text-[#DFF5EE] focus:outline-none focus:border-primary resize-none" rows="3" placeholder="Optional description..." />
              </div>

              <div>
                <label className="block text-sm text-gray-500 dark:text-[#4D7A6C] mb-2">Items</label>
                {errors.items && <p className="text-red-400 text-xs mb-2">{errors.items}</p>}
                <div className="space-y-3">
                  {form.items.map((item, index) => (
                    <div key={index} className="flex gap-3">
                      <input
                        type="text"
                        value={item.itemName}
                        onChange={(e) => handleItemChange(index, 'itemName', e.target.value)}
                        className="flex-1 px-4 py-2.5 bg-white dark:bg-[#080E0D] border border-gray-200 dark:border-[#1A3028] rounded-lg text-gray-900 dark:text-[#DFF5EE] focus:outline-none focus:border-primary"
                        placeholder="Item name"
                      />
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                        className="w-24 px-4 py-2.5 bg-white dark:bg-[#080E0D] border border-gray-200 dark:border-[#1A3028] rounded-lg text-gray-900 dark:text-[#DFF5EE] focus:outline-none focus:border-primary"
                        placeholder="Qty"
                        min="1"
                      />
                      {form.items.length > 1 && (
                        <button type="button" onClick={() => removeItem(index)} className="p-2 text-gray-500 dark:text-[#4D7A6C] hover:text-red-400">
                          <RiDeleteBinLine />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button type="button" onClick={addItem} className="mt-3 flex items-center gap-1 text-primary hover:text-primary-light text-sm transition-colors">
                  <RiAddLine /> Add Row
                </button>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={closeModal} className="px-5 py-2.5 border border-gray-200 dark:border-[#1A3028] text-gray-500 dark:text-[#4D7A6C] hover:text-gray-900 dark:hover:text-[#DFF5EE] rounded-lg transition-colors">Cancel</button>
                <button type="submit" className="px-5 py-2.5 bg-primary hover:bg-primary-light text-base font-semibold rounded-lg transition-colors">
                  {editingRequest ? 'Save Changes' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* History Slide-Over Panel */}
      {showHistory && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowHistory(false)} />
          <div className="relative w-full max-w-md bg-gray-50 dark:bg-[#0D1A17] border-l border-gray-200 dark:border-[#1A3028] shadow-2xl overflow-y-auto animate-slide-in">
            <div className="sticky top-0 bg-gray-50 dark:bg-[#0D1A17] border-b border-gray-200 dark:border-[#1A3028] px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-[#DFF5EE]">Activity History</h3>
                <p className="text-sm text-gray-500 dark:text-[#4D7A6C] mt-0.5 truncate max-w-[280px]">{historyRequestTitle}</p>
              </div>
              <button
                onClick={() => setShowHistory(false)}
                className="p-2 text-gray-500 dark:text-[#4D7A6C] hover:text-gray-900 dark:hover:text-[#DFF5EE] hover:bg-gray-100 dark:hover:bg-[#080E0D] rounded-lg transition-colors"
              >
                <RiCloseLine className="text-xl" />
              </button>
            </div>

            <div className="p-6">
              {historyLoading ? (
                <div className="flex justify-center py-12"><div className="spinner-lg"></div></div>
              ) : !historyData?.history?.length ? (
                <div className="text-center py-12">
                  <RiTimeLine className="text-4xl text-gray-300 dark:text-[#1A3028] mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-[#4D7A6C]">No history entries yet</p>
                </div>
              ) : (
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-200 dark:bg-[#1A3028]" />
                  <div className="space-y-6">
                    {historyData.history.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).map((entry, idx) => (
                      <div key={idx} className="relative flex gap-4">
                        <div className="relative z-10 flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center">
                          <RiTimeLine className="text-primary text-sm" />
                        </div>
                        <div className="flex-1 pb-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-[#DFF5EE]">{entry.action}</p>
                          <p className="text-sm text-gray-500 dark:text-[#4D7A6C] mt-0.5">{entry.details}</p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-xs text-primary font-medium">{entry.performedBy}</span>
                            <span className="text-xs text-gray-400 dark:text-[#2A4A42]">·</span>
                            <span className="text-xs text-gray-400 dark:text-[#2A4A42]">{formatHistoryDate(entry.timestamp)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default QuotationRequests
