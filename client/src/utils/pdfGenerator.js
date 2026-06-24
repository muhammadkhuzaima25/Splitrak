import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const loadLogo = () => {
  const img = new Image()
  img.src = '/splitrak.svg'
  return new Promise((resolve, reject) => {
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      canvas.getContext('2d').drawImage(img, 0, 0)
      resolve(canvas.toDataURL('image/png'))
    }
    img.onerror = () => reject(new Error('Failed to load logo'))
  })
}

const stampHeader = (doc, { base64, title, requestObj, ts }) => {
  const pageWidth = doc.internal.pageSize.getWidth()
  doc.addImage(base64, 'PNG', 14, 8, 18, 18)
  doc.setFontSize(16).setFont('helvetica', 'bold').setTextColor(8, 14, 13)
  doc.text('Splitrak', 35, 20)
  doc.setFont('helvetica', 'normal').setFontSize(10).setTextColor(120, 120, 120)
  doc.text(title, 200, 20)
  doc.setDrawColor(26, 48, 40).line(14, 26, 283, 26)
  doc.setFontSize(9).setTextColor(100, 100, 100)
  doc.text('Generated at: ' + ts, 14, 33)
  if (requestObj) {
    doc.setFont('helvetica', 'bold').setFontSize(10).setTextColor(30, 30, 30)
    doc.text('Request: ' + (requestObj.title || ''), 14, 40)
    if (requestObj.description) {
      doc.setFont('helvetica', 'normal').setFontSize(8).setTextColor(120, 120, 120)
      doc.text('Description: ' + requestObj.description, 14, 46)
    }
  }
  return requestObj?.description ? 50 : 46
}

const stampFooter = (doc, pageNum) => {
  const pageHeight = doc.internal.pageSize.getHeight()
  doc.setDrawColor(26, 48, 40).line(14, pageHeight - 14, 283, pageHeight - 14)
  doc.setFont('helvetica', 'normal').setFontSize(8).setTextColor(150, 150, 150)
  doc.text('Splitrak \u2014 Vendor Management & Quotation System', 14, pageHeight - 8)
  doc.text('Confidential | Page ' + pageNum, 240, pageHeight - 8)
}

const timestamp = () => {
  const now = new Date()
  const pad = n => String(n).padStart(2, '0')
  return `${pad(now.getDate())}-${pad(now.getMonth() + 1)}-${now.getFullYear()} ${pad(now.getHours())}:${pad(now.getMinutes())}`
}

const tableStyles = {
  rowHeight: 8,
  headStyles: { fillColor: [13, 26, 23], textColor: [0, 194, 122], fontSize: 9, fontStyle: 'bold', cellPadding: 3 },
  bodyStyles: { fontSize: 8, textColor: [30, 30, 30], cellPadding: 2 },
  alternateRowStyles: { fillColor: [240, 250, 245] },
  margin: { left: 14 },
}

export const generateStandardPDF = async ({ responses, requestObj }) => {
  if (!responses.length) throw new Error('No vendor responses to export.')

  const [base64, ts] = await Promise.all([loadLogo(), Promise.resolve(timestamp())])
  const doc = new jsPDF({ orientation: 'landscape', format: 'a4' })
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const yPos = stampHeader(doc, { base64, title: 'Vendor Comparison Report', requestObj, ts })

  doc.setFont('helvetica', 'bold').setFontSize(11).setTextColor(0, 194, 122)
  doc.text('VENDOR COMPARISON', 14, yPos)

  const standardTotals = responses.map(resp => ({
    vendor: resp.vendor,
    total: resp.totalAmount,
    status: resp.status,
  })).sort((a, b) => a.total - b.total)

  autoTable(doc, {
    startY: yPos + 4,
    head: [['Vendor Name', 'Company', 'Total Amount', 'Status']],
    body: standardTotals.map(v => [
      v.vendor?.name || 'Unknown',
      v.vendor?.companyName || '-',
      'Rs. ' + (v.total || 0).toLocaleString(),
      v.status || 'Pending',
    ]),
    ...tableStyles,
  })

  let summaryY = doc.lastAutoTable.finalY + 10
  if (summaryY > pageHeight - 45) { doc.addPage(); summaryY = 20 }
  const lowest = standardTotals[0]?.total || 0
  const highest = standardTotals[standardTotals.length - 1]?.total || 0
  const avg = standardTotals.length ? Math.round(standardTotals.reduce((s, v) => s + v.total, 0) / standardTotals.length) : 0

  const bx = pageWidth - 14 - 130, by = summaryY
  doc.setFillColor(240, 250, 245).rect(bx, by, 130, 38, 'F')
  doc.setFont('helvetica', 'normal').setFontSize(8).setTextColor(100, 100, 100)
  doc.text('Total Vendors: ' + standardTotals.length, bx + 6, by + 8)
  doc.text('Lowest Quote: Rs. ' + lowest.toLocaleString(), bx + 6, by + 16)
  doc.text('Highest Quote: Rs. ' + highest.toLocaleString(), bx + 6, by + 24)
  doc.text('Average Quote: Rs. ' + avg.toLocaleString(), bx + 6, by + 32)

  stampFooter(doc, 1)
  const title = requestObj?.title?.replace(/\s+/g, '-').toLowerCase() || 'report'
  doc.save(`splitrak-${title}-comparison-${new Date().toISOString().split('T')[0]}.pdf`)
}

export const generateSmartPDF = async ({ responses, requestObj, smartSplit }) => {
  if (!smartSplit?.length) throw new Error('No smart split data to export.')

  const [base64, ts] = await Promise.all([loadLogo(), Promise.resolve(timestamp())])
  const doc = new jsPDF({ orientation: 'landscape', format: 'a4' })
  const pageWidth = doc.internal.pageSize.getWidth()
  const yPos = stampHeader(doc, { base64, title: 'Optimized Procurement Order', requestObj, ts })

  doc.setFont('helvetica', 'bold').setFontSize(11).setTextColor(0, 194, 122)
  doc.text('OPTIMIZED SPLIT ORDER', 14, yPos)

  autoTable(doc, {
    startY: yPos + 4,
    head: [['Item', 'Qty', 'Best Vendor', 'Company', 'Unit Price', 'Total', 'Savings']],
    body: smartSplit.map(item => [
      item.itemName,
      item.quantity,
      item.bestVendor?.name || 'Unknown',
      item.bestVendor?.companyName || '-',
      'Rs. ' + item.bestUnitPrice.toLocaleString(),
      'Rs. ' + item.bestTotal.toLocaleString(),
      'Rs. ' + item.saved.toLocaleString(),
    ]),
    ...tableStyles,
    columnStyles: { 0: { cellWidth: 36 }, 1: { cellWidth: 14 }, 5: { cellWidth: 30 }, 6: { cellWidth: 28 } },
  })

  let summaryY = doc.lastAutoTable.finalY + 10
  const optimizedTotalPdf = smartSplit.reduce((s, i) => s + i.bestTotal, 0)
  const bestSingle = responses.length ? Math.min(...responses.map(r => r.totalAmount)) : 0
  const savings = bestSingle - optimizedTotalPdf

  const bx = pageWidth - 14 - 120, by = summaryY
  doc.setFillColor(240, 250, 245).rect(bx, by, 120, 34, 'F')
  doc.setFont('helvetica', 'normal').setFontSize(9).setTextColor(100, 100, 100)
  doc.text('Best Single Vendor: Rs. ' + bestSingle.toLocaleString(), bx + 6, by + 8)
  doc.text('Optimized Total: Rs. ' + optimizedTotalPdf.toLocaleString(), bx + 6, by + 17)
  doc.setFont('helvetica', 'bold').setFontSize(10).setTextColor(0, 194, 122)
  doc.text('YOU SAVE: Rs. ' + savings.toLocaleString(), bx + 6, by + 28)

  stampFooter(doc, 1)
  const title = requestObj?.title?.replace(/\s+/g, '-').toLowerCase() || 'report'
  doc.save(`splitrak-${title}-split-${new Date().toISOString().split('T')[0]}.pdf`)
}

export const generateComparisonPDF = async ({ responses, requestObj, activeTab, smartSplit }) => {
  if (activeTab === 'smart') {
    return generateSmartPDF({ responses, requestObj, smartSplit })
  }
  return generateStandardPDF({ responses, requestObj })
}
