import { useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useNotifications } from '../context/NotificationContext'
import { RiCheckDoubleLine } from 'react-icons/ri'

function timeAgo(timestamp) {
  const seconds = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000)
  if (seconds < 60) return 'Just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

const NotificationPanel = ({ isOpen, onClose }) => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications()
  const navigate = useNavigate()
  const panelRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        onClose()
      }
    }
    if (isOpen) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, onClose])

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id)
    if (notification.link) {
      navigate(notification.link)
    }
    onClose()
  }

  return (
    <div
      ref={panelRef}
      className={`absolute top-full right-0 mt-2 w-[360px] bg-white dark:bg-[#0D1A17] border border-gray-200 dark:border-[#1A3028] rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.25)] overflow-hidden transition-all duration-200 origin-top-right z-50 ${
        isOpen
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 -translate-y-2 pointer-events-none'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-[#1A3028]">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-[#DFF5EE]">Notifications</h3>
          {unreadCount > 0 && (
            <span className="px-1.5 py-0.5 text-[10px] font-bold bg-[#00C27A] text-[#080E0D] rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-1 text-[11px] text-[#00C27A] hover:text-[#00e694] font-medium transition-colors"
          >
            <RiCheckDoubleLine className="text-sm" />
            Mark all read
          </button>
        )}
      </div>

      {/* Notification List */}
      <div className="max-h-[360px] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-sm text-gray-400 dark:text-[#4D7A6C]">No notifications yet</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <button
              key={notification.id}
              onClick={() => handleNotificationClick(notification)}
              className={`w-full text-left px-4 py-3 flex items-start gap-3 border-b border-gray-100 dark:border-[#1A3028]/50 transition-colors ${
                notification.read
                  ? 'bg-white dark:bg-[#0D1A17] hover:bg-gray-50 dark:hover:bg-[#0D1A17]/50'
                  : 'bg-[#00C27A]/5 dark:bg-[#00C27A]/5 hover:bg-[#00C27A]/10 dark:hover:bg-[#00C27A]/10'
              }`}
            >
              {/* Unread dot */}
              <div className="mt-1.5 flex-shrink-0">
                {!notification.read && (
                  <span className="block w-2 h-2 bg-[#00C27A] rounded-full"></span>
                )}
                {notification.read && <span className="block w-2 h-2"></span>}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className={`text-[13px] font-medium truncate ${
                  notification.read
                    ? 'text-gray-600 dark:text-[#4D7A6C]'
                    : 'text-gray-900 dark:text-[#DFF5EE]'
                }`}>
                  {notification.title}
                </p>
                <p className="text-[12px] text-gray-400 dark:text-[#4D7A6C]/70 mt-0.5 line-clamp-2">
                  {notification.message}
                </p>
                <p className="text-[10px] text-gray-300 dark:text-[#2A4A42] mt-1">
                  {timeAgo(notification.timestamp)}
                </p>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  )
}

export default NotificationPanel
