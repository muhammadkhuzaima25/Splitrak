import { createContext, useContext, useState, useCallback } from 'react'

const NotificationContext = createContext()

const initialNotifications = [
  {
    id: 1,
    title: 'New Quotation Response',
    message: 'Al-Rashid Traders submitted a response to "Office Supplies Q1".',
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    read: false,
    link: '/vendor-response',
  },
  {
    id: 2,
    title: 'Quotation Approved',
    message: 'Your split order for "IT Equipment" has been approved.',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    read: false,
    link: '/smart-comparison',
  },
  {
    id: 3,
    title: 'New Vendor Added',
    message: 'Global Supplies Co. was added to your vendor list.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    read: true,
    link: '/vendors',
  },
  {
    id: 4,
    title: 'Response Deadline',
    message: '"Raw Materials Order" closes in 2 hours.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    read: true,
    link: '/quotation-requests',
  },
]

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(initialNotifications)

  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = useCallback((id) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    )
  }, [])

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }, [])

  const addNotification = useCallback((notification) => {
    setNotifications(prev => [
      { ...notification, id: Date.now(), read: false, timestamp: new Date().toISOString() },
      ...prev,
    ])
  }, [])

  const clearAll = useCallback(() => {
    setNotifications([])
  }, [])

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, markAsRead, markAllAsRead, addNotification, clearAll }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotifications = () => {
  const context = useContext(NotificationContext)
  if (!context) throw new Error('useNotifications must be used within NotificationProvider')
  return context
}
