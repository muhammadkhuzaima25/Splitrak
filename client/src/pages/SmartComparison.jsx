import { useState, useEffect, useMemo } from 'react'
import { RiExchangeLine, RiCheckLine, RiFilePdfLine, RiArrowGoBackLine } from 'react-icons/ri'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import api from '../api/axios'
import toast from 'react-hot-toast'
import { generateComparisonPDF } from '../utils/pdfGenerator'

const SmartComparison = () => {
  const [requests, setRequests] = useState([])
  const [selectedRequest, setSelectedRequest] = useState('')
  const [responses, setResponses] = useState([])
  const [loading, setLoading] = useState(true)
  const [fetching, setFetching] = useState(false)
  const [activeTab, setActiveTab] = useState('standard')
  const [approving, setApproving] = useState(null)
  const [approvedItems, setApprovedItems] = useState({})

  useEffect(() => {
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
    fetchRequests()
  }, [])

  useEffect(() => {
    if (!selectedRequest) { setResponses([]); return }
    const fetchResponses = async () => {
      setFetching(true)
      try {
        const res = await api.get(`/quotation-responses/by-request/${selectedRequest}`)
        setResponses(res.data)
      } catch (err) {
        toast.error('Failed to load responses')
      } finally {
        setFetching(false)
      }
    }
    fetchResponses()
  }, [selectedRequest])

  useEffect(() => {
    if (!responses.length || !selectedRequest) { setApprovedItems({}); return }
    const initial = {}
    responses.forEach(resp => {
      resp.items.forEach(item => {
        const key = `${resp._id}_${item.itemName}`
        initial[key] = item.status === 'Approved'
      })
    })
    setApprovedItems(initial)
  }, [responses, selectedRequest])

  const smartSplit = useMemo(() => {
    if (!responses.length) return null
    const request = requests.find(r => r._id === selectedRequest)
    if (!request) return null
    return request.items.map(reqItem => {
      const candidates = responses.map(resp => {
        const found = resp.items.find(i => i.itemName === reqItem.itemName)
        return found ? { vendor: resp.vendor, unitPrice: found.unitPrice, responseId: resp._id } : null
      }).filter(Boolean)
      if (candidates.length === 0) return null
      const sorted = [...candidates].sort((a, b) => a.unitPrice - b.unitPrice)
      const best = sorted[0]
      const worst = sorted[sorted.length - 1]
      return {
        itemName: reqItem.itemName,
        quantity: reqItem.quantity,
        bestVendor: best.vendor,
        bestUnitPrice: best.unitPrice,
        bestTotal: best.unitPrice * reqItem.quantity,
        saved: (worst.unitPrice - best.unitPrice) * reqItem.quantity,
        responseId: best.responseId
      }
    }).filter(Boolean)
  }, [responses, requests, selectedRequest])

  const standardTotals = useMemo(() => {
    return responses.map(resp => {
      const totalItems = resp.items.length
      const approvedCount = resp.items.filter(i => (i.status || '').toLowerCase() === 'approved').length
      return {
        vendor: resp.vendor,
        total: resp.totalAmount,
        status: resp.status,
        date: resp.submissionDate,
        responseId: resp._id,
        totalItems,
        approvedCount,
        allApproved: totalItems > 0 && approvedCount === totalItems,
      }
    }).sort((a, b) => a.total - b.total)
  }, [responses])

  const singleVendorTotal = useMemo(() => standardTotals.length > 0 ? Math.min(...standardTotals.map(s => s.total)) : 0, [standardTotals])
  const optimizedTotal = useMemo(() => smartSplit ? smartSplit.reduce((sum, item) => sum + item.bestTotal, 0) : 0, [smartSplit])
  const totalSaved = singleVendorTotal - optimizedTotal

  const handleApproveAllItems = async (responseId, items) => {
    try {
      const newApprovedItems = { ...approvedItems }
      const updatedItems = items.map(item => {
        const key = `${responseId}_${item.itemName}`
        newApprovedItems[key] = true
        return { ...item, status: 'Approved' }
      })
      await api.put(`/quotation-responses/${responseId}`, { items: updatedItems, status: 'Approved' })
      setApprovedItems(newApprovedItems)
      toast.success('All items approved!')
      const res = await api.get(`/quotation-responses/by-request/${selectedRequest}`)
      setResponses(res.data)
    } catch (err) {
      toast.error('Failed to approve items')
    }
  }

  const handleRevertAllItems = async (responseId, items) => {
    try {
      const newApprovedItems = { ...approvedItems }
      const updatedItems = items.map(item => {
        const key = `${responseId}_${item.itemName}`
        newApprovedItems[key] = false
        return { ...item, status: 'Pending' }
      })
      await api.put(`/quotation-responses/${responseId}`, { items: updatedItems, status: 'Pending' })
      setApprovedItems(newApprovedItems)
      toast.success('All approvals reverted to Pending')
      const res = await api.get(`/quotation-responses/by-request/${selectedRequest}`)
      setResponses(res.data)
    } catch (err) {
      toast.error('Failed to revert items')
    }
  }

  const handleApproveSplit = async () => {
    if (!smartSplit) return
    try {
      const ids = [...new Set(smartSplit.map(s => s.responseId))]
      await Promise.all(ids.map(id => api.put(`/quotation-responses/${id}`, { status: 'Approved' })))
      toast.success('Split order approved!')
      const res = await api.get(`/quotation-responses/by-request/${selectedRequest}`)
      setResponses(res.data)
    } catch (err) {
      toast.error('Failed to approve')
    }
  }

  const loadLogoAndGeneratePDF = async () => {
    if (!selectedRequest) { alert('No request selected.'); return }

    let freshResponses, freshRequests
    try {
      const [resRes, reqRes] = await Promise.all([
        api.get(`/quotation-responses/by-request/${selectedRequest}`),
        api.get('/quotation-requests')
      ])
      freshResponses = resRes.data
      freshRequests = reqRes.data
      setResponses(resRes.data)
      setRequests(reqRes.data)
    } catch {
      toast.error('Failed to fetch latest data')
      return
    }
    if (!freshResponses.length) { alert('No vendor responses to export.'); return }

    const freshSmartSplit = (() => {
      const request = freshRequests.find(r => r._id === selectedRequest)
      if (!request) return null
      return request.items.map(reqItem => {
        const candidates = freshResponses.map(resp => {
          const found = resp.items.find(i => i.itemName === reqItem.itemName)
          return found ? { vendor: resp.vendor, unitPrice: found.unitPrice, responseId: resp._id } : null
        }).filter(Boolean)
        if (!candidates.length) return null
        const sorted = [...candidates].sort((a, b) => a.unitPrice - b.unitPrice)
        const best = sorted[0]
        const worst = sorted[sorted.length - 1]
        return {
          itemName: reqItem.itemName,
          quantity: reqItem.quantity,
          bestVendor: best.vendor,
          bestUnitPrice: best.unitPrice,
          bestTotal: best.unitPrice * reqItem.quantity,
          saved: (worst.unitPrice - best.unitPrice) * reqItem.quantity,
          responseId: best.responseId
        }
      }).filter(Boolean)
    })()

    const requestObj = freshRequests.find(r => r._id === selectedRequest)

    try {
      await generateComparisonPDF({
        responses: freshResponses,
        requestObj,
        activeTab,
        smartSplit: freshSmartSplit,
      })
      toast.success('PDF exported successfully!')
    } catch (err) {
      console.error('PDF error:', err)
      alert('PDF export failed: ' + err.message)
    }
  }

  return (
    <div className="flex min-h-screen pb-14 bg-gray-50 dark:bg-[#080E0D]">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar title="Smart Comparison" />
        <main className="p-6">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div className="flex-1 max-w-md">
              <label className="block text-sm text-gray-500 dark:text-[#4D7A6C] mb-2">Select Quotation Request</label>
              <select
                value={selectedRequest}
                onChange={(e) => setSelectedRequest(e.target.value)}
                className="w-full px-4 py-2.5 bg-white dark:bg-[#0D1A17] border border-gray-200 dark:border-[#1A3028] rounded-lg text-gray-900 dark:text-[#DFF5EE] focus:outline-none focus:border-primary"
              >
                <option value="">Choose a request...</option>
                {requests.map(r => (
                  <option key={r._id} value={r._id}>{r.title} ({r.items.length} items)</option>
                ))}
              </select>
            </div>
            {selectedRequest && responses.length > 0 && (
              <button onClick={loadLogoAndGeneratePDF} className="h-fit px-4 py-2.5 bg-[#00C27A] text-[#080E0D] rounded-lg text-sm font-medium flex items-center gap-2 hover:opacity-90 transition-opacity">
                <RiFilePdfLine className="text-base" /> Export PDF
              </button>
            )}
          </div>

          {fetching ? (
            <div className="flex justify-center py-20"><div className="spinner-lg"></div></div>
          ) : selectedRequest && responses.length === 0 ? (
            <div className="bg-gray-50 dark:bg-[#0D1A17] border border-gray-200 dark:border-[#1A3028] rounded-xl p-16 text-center">
              <RiExchangeLine className="text-4xl text-gray-400 dark:text-[#2A4A42] mx-auto mb-4" />
              <p className="text-gray-500 dark:text-[#4D7A6C] text-lg">No vendor responses for this request yet</p>
            </div>
          ) : responses.length > 0 && (
            <>
              <div className="flex gap-1 mb-6 bg-gray-50 dark:bg-[#0D1A17] border border-gray-200 dark:border-[#1A3028] rounded-lg p-1 w-fit">
                <button onClick={() => setActiveTab('standard')} className={`px-5 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'standard' ? 'bg-primary text-base' : 'text-gray-500 dark:text-[#4D7A6C] hover:text-gray-900 dark:hover:text-[#DFF5EE]'}`}>Standard View</button>
                <button onClick={() => setActiveTab('smart')} className={`px-5 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'smart' ? 'bg-primary text-base' : 'text-gray-500 dark:text-[#4D7A6C] hover:text-gray-900 dark:hover:text-[#DFF5EE]'}`}>Smart Split View</button>
              </div>

              {activeTab === 'standard' && (
                <div className="bg-gray-50 dark:bg-[#0D1A17] border border-gray-200 dark:border-[#1A3028] rounded-xl overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-sm text-gray-500 dark:text-[#4D7A6C] border-b border-gray-200 dark:border-[#1A3028]">
                        <th className="px-6 py-3">Vendor</th>
                        <th className="px-6 py-3">Total Amount</th>
                        <th className="px-6 py-3">Progress</th>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3">Submitted</th>
                        <th className="px-6 py-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {standardTotals.map((item, i) => (
                        <tr key={i} className={`border-b border-gray-200/50 dark:border-[#1A3028]/50 transition-colors ${i === 0 ? 'bg-primary/5' : 'hover:bg-gray-100 dark:hover:bg-[#0D1A17]/50'}`}>
                          <td className="px-6 py-4 text-sm text-gray-900 dark:text-[#DFF5EE] font-medium">
                            {item.vendor?.name || 'Unknown'}
                            {i === 0 && <span className="ml-2 text-xs text-primary">(Lowest)</span>}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 dark:text-[#DFF5EE]">Rs. {item.total?.toLocaleString()}</td>
                          <td className="px-6 py-4 text-xs text-slate-400">
                            <span className="text-[#00C27A] font-semibold">{item.approvedCount || 0}</span>/{item.totalItems || 0} Items Approved
                          </td>
                          <td className="px-6 py-4">
                            <span className={`text-xs font-medium ${item.status === 'Approved' ? 'text-[#00C27A]' : item.status === 'Rejected' ? 'text-red-500' : 'text-gray-400 dark:text-[#4D7A6C]'}`}>
                              {item.status || 'Pending'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 dark:text-[#4D7A6C]">{new Date(item.date).toLocaleDateString()}</td>
                          <td className="px-6 py-4 text-right">
                            {item.allApproved ? (
                              <button
                                onClick={() => handleRevertAllItems(item.responseId, responses.find(r => r._id === item.responseId)?.items || [])}
                                disabled={approving === item.responseId}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-400 border border-red-400/30 rounded-lg hover:bg-red-400/10 transition-colors disabled:opacity-50"
                              >
                                {approving === item.responseId ? <span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }}></span> : <RiArrowGoBackLine />}
                                Undo Approval
                              </button>
                            ) : (
                              <button
                                onClick={() => handleApproveAllItems(item.responseId, responses.find(r => r._id === item.responseId)?.items || [])}
                                disabled={approving === item.responseId}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary border border-primary/30 rounded-lg hover:bg-primary/10 transition-colors disabled:opacity-50"
                              >
                                {approving === item.responseId ? <span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }}></span> : <RiCheckLine />}
                                Approve All
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === 'smart' && smartSplit && (
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    {smartSplit.map((item, i) => (
                      <div key={i} className="bg-gray-50 dark:bg-[#0D1A17] border border-primary/40 rounded-xl p-5">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-gray-900 dark:text-[#DFF5EE] font-semibold">{item.itemName}</h4>
                          <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded">Best Price</span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-[#4D7A6C] mb-1">Vendor: <span className="text-primary">{item.bestVendor?.name || 'Unknown'}</span></p>
                        <p className="text-sm text-gray-500 dark:text-[#4D7A6C] mb-1">Qty: {item.quantity}</p>
                        <p className="text-sm text-gray-500 dark:text-[#4D7A6C] mb-1">Unit Price: Rs. {item.bestUnitPrice?.toLocaleString()}</p>
                        <div className="border-t border-gray-200 dark:border-[#1A3028] mt-3 pt-3 flex justify-between">
                          <span className="text-sm text-gray-500 dark:text-[#4D7A6C]">Total</span>
                          <span className="text-sm text-gray-900 dark:text-[#DFF5EE] font-semibold">Rs. {item.bestTotal?.toLocaleString()}</span>
                        </div>
                        {item.saved > 0 && <p className="text-xs text-primary mt-2">Saved Rs. {item.saved?.toLocaleString()} vs highest</p>}
                      </div>
                    ))}
                  </div>
                  <div className="bg-gray-50 dark:bg-[#0D1A17] border border-gray-200 dark:border-[#1A3028] rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-[#DFF5EE] mb-4">Cost Summary</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-[#4D7A6C] mb-1">Single Vendor Cost</p>
                        <p className="text-xl text-gray-900 dark:text-[#DFF5EE] font-bold">Rs. {singleVendorTotal?.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-[#4D7A6C] mb-1">Optimized Total</p>
                        <p className="text-xl text-primary font-bold">Rs. {optimizedTotal?.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-[#4D7A6C] mb-1">You Save</p>
                        <p className="text-2xl text-primary-light font-bold">Rs. {totalSaved > 0 ? totalSaved?.toLocaleString() : '0'}</p>
                      </div>
                    </div>
                    <button onClick={handleApproveSplit} className="mt-6 px-6 py-3 bg-primary hover:bg-primary-light text-base font-semibold rounded-lg transition-colors">Approve Split</button>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
        <Footer />
      </div>
    </div>
  )
}

export default SmartComparison
