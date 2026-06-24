import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { useNotifications } from '../context/NotificationContext'
import NotificationPanel from './NotificationPanel'
import {
  RiMoonLine,
  RiSunLine,
  RiNotification3Line,
  RiDashboardLine,
  RiSettingsLine,
  RiLogoutBoxLine
} from 'react-icons/ri'

const Navbar = ({ title }) => {
  const { user } = useUser()
  const { logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { unreadCount } = useNotifications()
  const navigate = useNavigate()
  const darkMode = theme === 'dark'
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const dropdownRef = useRef(null)
  const notifRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : 'U'

  const menuItems = [
    { icon: RiDashboardLine, label: 'Dashboard', action: () => { navigate('/dashboard'); setDropdownOpen(false) } },
    { icon: RiSettingsLine, label: 'Profile Settings', action: () => { navigate('/profile-settings'); setDropdownOpen(false) } },
    { icon: darkMode ? RiSunLine : RiMoonLine, label: 'Toggle Theme', action: () => toggleTheme() },
  ]

  return (
    <header className="h-16 bg-white dark:bg-[#080E0D] border-b border-gray-200 dark:border-[#1A3028] flex items-center justify-between px-6 sticky top-0 z-20">
      <h1 className="text-lg font-semibold text-gray-900 dark:text-[#DFF5EE]">{title}</h1>
      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#0D1A17] text-gray-500 dark:text-[#4D7A6C] hover:text-gray-900 dark:hover:text-[#DFF5EE] transition-colors"
          title="Toggle theme"
        >
          {darkMode ? <RiSunLine className="text-lg" /> : <RiMoonLine className="text-lg" />}
        </button>
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#0D1A17] text-gray-500 dark:text-[#4D7A6C] hover:text-gray-900 dark:hover:text-[#DFF5EE] transition-colors relative"
          >
            <RiNotification3Line className="text-lg" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#00C27A] rounded-full"></span>
            )}
          </button>
          <NotificationPanel isOpen={notifOpen} onClose={() => setNotifOpen(false)} />
        </div>
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <span className="text-sm text-gray-500 dark:text-[#4D7A6C] hidden sm:inline">{user?.name}</span>
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.name} className="w-9 h-9 rounded-full object-cover ring-2 ring-primary" />
            ) : (
              <div className="w-9 h-9 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-bold ring-2 ring-primary">
                {initials}
              </div>
            )}
          </button>
          <div
            className={`absolute top-full right-0 mt-2 w-[220px] bg-[#0D1A17] border border-[#1A3028] rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.4)] overflow-hidden transition-all duration-200 origin-top-right ${
              dropdownOpen
                ? 'opacity-100 translate-y-0 pointer-events-auto'
                : 'opacity-0 -translate-y-2 pointer-events-none'
            }`}
          >
            <div className="px-4 pt-4 pb-3 flex items-center gap-3">
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-primary" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">
                  {initials}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-[#DFF5EE] truncate">{user?.name || 'User'}</p>
                <p className="text-xs text-[#4D7A6C] truncate">{user?.email || ''}</p>
              </div>
            </div>
            <div className="h-px bg-[#1A3028]" />
            <div className="py-1">
              {menuItems.map((item) => (
                <button
                  key={item.label}
                  onClick={item.action}
                  className="w-full flex items-center gap-[10px] px-[14px] py-[10px] text-[13px] text-[#DFF5EE] hover:bg-[#1A3028] transition-colors"
                >
                  <item.icon className="text-[#00C27A] text-base" />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
            <div className="h-px bg-[#1A3028]" />
            <div className="py-1">
              <button
                onClick={() => { logout(); navigate('/login') }}
                className="w-full flex items-center gap-[10px] px-[14px] py-[10px] text-[13px] text-[#DFF5EE] hover:bg-[#2A0D0D] hover:text-[#FF6B6B] transition-colors"
              >
                <RiLogoutBoxLine className="text-[#00C27A] text-base" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
