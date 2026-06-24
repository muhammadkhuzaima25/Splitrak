import { useState } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useUser } from '../context/UserContext'
import {
  RiDashboardLine,
  RiUserLine,
  RiFileListLine,
  RiFileTextLine,
  RiExchangeLine,
  RiLogoutBoxLine,
  RiArrowDownSLine,
  RiSettings3Line
} from 'react-icons/ri'

const navItems = [
  { to: '/dashboard', icon: RiDashboardLine, label: 'Dashboard' },
  { to: '/vendors', icon: RiUserLine, label: 'Vendors' },
  { to: '/quotation-requests', icon: RiFileListLine, label: 'Quotation Requests' },
  { to: '/vendor-response', icon: RiFileTextLine, label: 'Vendor Responses' },
  {
    icon: RiExchangeLine,
    label: 'Smart Comparison',
    children: [
      { to: '/smart-comparison', label: 'Standard View', dot: 'muted' },
      { to: '/smart-comparison', label: 'Splittrak Smart View', dot: 'emerald', hero: true },
    ],
  },
  { to: '/profile-settings', icon: RiSettings3Line, label: 'Profile Settings' },
]

const Sidebar = () => {
  const { logout } = useAuth()
  const { user } = useUser()
  const navigate = useNavigate()
  const location = useLocation()
  const [expandedGroup, setExpandedGroup] = useState(null)

  const isChildActive = (item) =>
    item.children?.some(child => location.pathname === child.to)

  const handleGroupClick = (label) => {
    setExpandedGroup(prev => (prev === label ? null : label))
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-gray-100 dark:bg-[#080E0D] border-r border-gray-200 dark:border-[#1A3028] flex flex-col z-30">
      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        <img src="/splitrak.svg" alt="Splitrak" className="w-10 h-10 rounded-lg" />
        <span className="text-xl font-bold text-gray-900 dark:text-[#DFF5EE]">Splitrak</span>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(item => {
          const hasChildren = !!item.children
          const isActive = hasChildren ? isChildActive(item) : false
          const isExpanded = expandedGroup === item.label

          if (hasChildren) {
            return (
              <div key={item.label}>
                <button
                  onClick={() => handleGroupClick(item.label)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all ${
                    isActive
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-gray-500 dark:text-[#4D7A6C] hover:text-gray-900 dark:hover:text-[#DFF5EE] hover:bg-gray-200 dark:hover:bg-[#0D1A17]'
                  }`}
                >
                  <item.icon className="text-lg" />
                  <span className="flex-1 text-left">{item.label}</span>
                  <RiArrowDownSLine
                    className={`text-base transition-transform duration-200 ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isExpanded && (
                  <div className="ml-4 mt-1 space-y-1 pl-5 border-l border-gray-200 dark:border-[#1A3028]">
                    {item.children.map(child => (
                      <NavLink
                        key={child.label}
                        to={child.to}
                        className={({ isActive: childActive }) =>
                          `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                            child.hero
                              ? childActive
                                ? 'bg-emerald-950/40 text-emerald-400 font-medium border border-emerald-500/20'
                                : 'bg-emerald-950/20 text-emerald-400 hover:bg-emerald-950/30 hover:border hover:border-emerald-500/10'
                              : childActive
                                ? 'bg-gray-200 dark:bg-[#0D1A17] text-gray-900 dark:text-[#DFF5EE] font-medium'
                                : 'text-gray-500 dark:text-[#4D7A6C] hover:text-gray-900 dark:hover:text-[#DFF5EE] hover:bg-gray-200 dark:hover:bg-[#0D1A17]/50'
                          }`
                        }
                      >
                        {child.dot === 'emerald' && (
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                          </span>
                        )}
                        {child.dot === 'muted' && (
                          <span className="flex h-2 w-2">
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-gray-400 dark:bg-[#2A4A42]"></span>
                          </span>
                        )}
                        <span>{child.label}</span>
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            )
          }

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all ${
                  isActive
                    ? 'bg-gray-100 dark:bg-[#0D1A17] border-l-4 border-primary text-primary font-medium'
                    : 'text-gray-500 dark:text-[#4D7A6C] hover:text-gray-900 dark:hover:text-[#DFF5EE] hover:bg-gray-200 dark:hover:bg-[#0D1A17]'
                }`
              }
            >
              <item.icon className="text-lg" />
              <span>{item.label}</span>
            </NavLink>
          )
        })}
      </nav>

      {/* User + Logout */}
      <div className="p-4 border-t border-gray-200 dark:border-[#1A3028]">
        <div className="flex items-center gap-3 mb-3">
          {user?.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.name} className="w-9 h-9 rounded-full object-cover ring-2 ring-primary" />
          ) : (
            <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-sm">
              {user?.name
                ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
                : 'U'}
            </div>
          )}
          <span className="text-sm text-gray-900 dark:text-[#DFF5EE] truncate">{user?.name || 'User'}</span>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-gray-500 dark:text-[#4D7A6C] hover:text-red-400 text-sm w-full px-2 py-2 rounded hover:bg-gray-200 dark:hover:bg-[#0D1A17] transition-colors"
        >
          <RiLogoutBoxLine />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
