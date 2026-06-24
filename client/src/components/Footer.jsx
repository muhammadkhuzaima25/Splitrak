import { NavLink } from 'react-router-dom'
import { RiLinkedinBoxFill, RiGithubFill } from 'react-icons/ri'

const quickLinks = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/vendors', label: 'Vendors' },
  { to: '/quotation-requests', label: 'Quotation Requests' },
  { to: '/smart-comparison', label: 'Smart Comparison' },
]

const platform = [
  'Vendor Management',
  'Quotation Tracking',
  'Smart Split Optimizer',
  'PDF Export',
]

const Footer = () => {
  return (
    <footer className="w-full mt-auto border-t border-gray-200 dark:border-[#1A3028]">
      {/* Main Footer */}
      <div className="bg-gray-100 dark:bg-[#080E0D] px-10 py-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Column 1: Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src="/splitrak.svg" alt="Splitrak" className="w-8 h-8 rounded-lg" />
              <span className="text-[15px] font-bold text-gray-900 dark:text-[#DFF5EE] tracking-tight">Splitrak</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-[#4D7A6C] leading-[1.7] max-w-[200px]">
              Streamline your vendor management and quotation process with smart procurement tools.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-xs font-semibold text-gray-900 dark:text-[#DFF5EE] uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {quickLinks.map(link => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    className="text-xs text-gray-500 dark:text-[#4D7A6C] hover:text-[#00C27A] transition-colors duration-200"
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Platform */}
          <div>
            <h4 className="text-xs font-semibold text-gray-900 dark:text-[#DFF5EE] uppercase tracking-wider mb-4">Platform</h4>
            <ul className="space-y-2.5">
              {platform.map(item => (
                <li key={item} className="text-xs text-gray-500 dark:text-[#4D7A6C]">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Connect */}
          <div>
            <h4 className="text-xs font-semibold text-gray-900 dark:text-[#DFF5EE] uppercase tracking-wider mb-4">Connect</h4>
            <div className="flex items-center gap-3">
              <a
                href="https://www.linkedin.com/in/muhammad-khuzaima-991a08313"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-gray-200 dark:border-[#1A3028] text-gray-400 dark:text-[#4D7A6C] hover:text-[#0077B5] hover:border-[#0077B5] hover:bg-[#0077B5]/10 hover:scale-110 transition-all duration-200"
              >
                <RiLinkedinBoxFill size={18} />
              </a>
              <a
                href="https://github.com/muhammadkhuzaima25"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-gray-200 dark:border-[#1A3028] text-gray-400 dark:text-[#4D7A6C] hover:text-gray-900 dark:hover:text-[#DFF5EE] hover:border-gray-900 dark:hover:border-[#DFF5EE] hover:bg-gray-900/10 dark:hover:bg-white/10 hover:scale-110 transition-all duration-200"
              >
                <RiGithubFill size={18} />
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-200 dark:bg-[#060B0A] border-t border-gray-200 dark:border-[#1A3028] px-10 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <p className="text-[11px] text-gray-400 dark:text-[#2A4A42]">
            &copy; 2026 Splitrak. All rights reserved.
          </p>
          <p className="text-[11px] text-gray-400 dark:text-[#2A4A42]">
            Built by{' '}
            <span className="text-gray-600 dark:text-[#4D7A6C] font-medium">Muhammad Khuzaima</span>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
