import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { useUser } from '../context/UserContext'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import toast from 'react-hot-toast'
import api from '../api/axios'
import {
  RiUserLine,
  RiLockLine,
  RiSettings3Line,
  RiSaveLine,
  RiMailLine,
  RiPhoneLine,
  RiShieldLine
} from 'react-icons/ri'

const tabs = [
  { id: 'account', label: 'Account', icon: RiUserLine },
  { id: 'security', label: 'Security', icon: RiShieldLine },
  { id: 'preferences', label: 'Preferences', icon: RiSettings3Line },
]

const ProfileSettings = () => {
  const { user } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { updateUser } = useUser()
  const [activeTab, setActiveTab] = useState('account')
  const [saving, setSaving] = useState(false)

  const [accountForm, setAccountForm] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    role: '',
  })

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const [notifications, setNotifications] = useState(true)

  const handleAccountChange = (field) => (e) => {
    setAccountForm({ ...accountForm, [field]: e.target.value })
  }

  const handlePasswordChange = (field) => (e) => {
    setPasswordForm({ ...passwordForm, [field]: e.target.value })
  }

  const handleSaveAccount = async () => {
    if (!accountForm.fullName.trim()) {
      toast.error('Full name is required')
      return
    }
    setSaving(true)
    try {
      await updateUser({
        name: accountForm.fullName,
        phone: accountForm.phone,
        role: accountForm.role,
      })
      toast.success('Account updated successfully')
    } catch {
      toast.error('Failed to update account')
    } finally {
      setSaving(false)
    }
  }

  const handleUpdatePassword = async () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      toast.error('Please fill in all password fields')
      return
    }
    if (passwordForm.newPassword.length < 8) {
      toast.error('New password must be at least 8 characters')
      return
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    setSaving(true)
    try {
      await api.put('/auth/password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      })
      toast.success('Password updated successfully')
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch {
      toast.error('Failed to update password')
    } finally {
      setSaving(false)
    }
  }

  const inputClasses =
    'w-full px-4 py-3 bg-white dark:bg-[#080E0D] border border-gray-200 dark:border-[#1A3028] rounded-lg text-gray-900 dark:text-[#DFF5EE] placeholder-gray-400 dark:placeholder-[#2A4A42] focus:outline-none focus:border-primary transition-colors'

  const disabledInputClasses =
    'w-full px-4 py-3 bg-gray-100 dark:bg-[#0D1A17] border border-gray-200 dark:border-[#1A3028] rounded-lg text-gray-500 dark:text-[#4D7A6C] cursor-not-allowed'

  const labelClasses = 'block text-sm font-medium text-gray-700 dark:text-[#4D7A6C] mb-1.5'

  return (
    <div className="flex min-h-screen pb-14 bg-gray-50 dark:bg-[#080E0D]">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar title="Profile Settings" />
        <main className="p-6 max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-[#DFF5EE]">Profile Settings</h2>
            <p className="text-sm text-gray-500 dark:text-[#4D7A6C] mt-1">
              Manage your account details and preferences
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-6 bg-gray-100 dark:bg-[#0D1A17] border border-gray-200 dark:border-[#1A3028] rounded-lg p-1 w-fit">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-gray-500 dark:text-[#4D7A6C] hover:text-gray-900 dark:hover:text-[#DFF5EE]'
                }`}
              >
                <tab.icon className="text-base" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Account Information */}
          {activeTab === 'account' && (
            <div className="bg-gray-50 dark:bg-[#0D1A17] border border-gray-200 dark:border-[#1A3028] rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200 dark:border-[#1A3028]">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <RiUserLine className="text-primary text-lg" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-[#DFF5EE]">Account Information</h3>
                  <p className="text-sm text-gray-500 dark:text-[#4D7A6C]">Update your personal details</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className={labelClasses}>Full Name</label>
                  <input
                    type="text"
                    value={accountForm.fullName}
                    onChange={handleAccountChange('fullName')}
                    className={inputClasses}
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className={labelClasses}>Email Address</label>
                  <div className="relative">
                    <input
                      type="email"
                      value={accountForm.email}
                      disabled
                      className={disabledInputClasses}
                    />
                    <RiMailLine className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-[#2A4A42]" />
                  </div>
                </div>

                <div>
                  <label className={labelClasses}>Phone Number</label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={accountForm.phone}
                      onChange={handleAccountChange('phone')}
                      className={inputClasses}
                      placeholder="+92 300 1234567"
                    />
                    <RiPhoneLine className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-[#2A4A42]" />
                  </div>
                </div>

                <div>
                  <label className={labelClasses}>Company Role</label>
                  <input
                    type="text"
                    value={accountForm.role}
                    onChange={handleAccountChange('role')}
                    className={inputClasses}
                    placeholder="e.g. Procurement Manager"
                  />
                </div>
              </div>

              <div className="flex justify-end mt-6 pt-4 border-t border-gray-200 dark:border-[#1A3028]">
                <button
                  onClick={handleSaveAccount}
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary-light text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
                >
                  <RiSaveLine className="text-lg" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          )}

          {/* Security & Password */}
          {activeTab === 'security' && (
            <div className="bg-gray-50 dark:bg-[#0D1A17] border border-gray-200 dark:border-[#1A3028] rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200 dark:border-[#1A3028]">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <RiLockLine className="text-primary text-lg" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-[#DFF5EE]">Security & Password</h3>
                  <p className="text-sm text-gray-500 dark:text-[#4D7A6C]">Keep your account secure</p>
                </div>
              </div>

              <div className="space-y-5 max-w-md">
                <div>
                  <label className={labelClasses}>Current Password</label>
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange('currentPassword')}
                    className={inputClasses}
                    placeholder="Enter current password"
                  />
                </div>

                <div>
                  <label className={labelClasses}>New Password</label>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange('newPassword')}
                    className={inputClasses}
                    placeholder="Enter new password"
                  />
                </div>

                <div>
                  <label className={labelClasses}>Confirm New Password</label>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange('confirmPassword')}
                    className={inputClasses}
                    placeholder="Confirm new password"
                  />
                </div>
              </div>

              <div className="flex justify-end mt-6 pt-4 border-t border-gray-200 dark:border-[#1A3028]">
                <button
                  onClick={handleUpdatePassword}
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary-light text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
                >
                  <RiLockLine className="text-lg" />
                  {saving ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </div>
          )}

          {/* Preferences */}
          {activeTab === 'preferences' && (
            <div className="bg-gray-50 dark:bg-[#0D1A17] border border-gray-200 dark:border-[#1A3028] rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200 dark:border-[#1A3028]">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <RiSettings3Line className="text-primary text-lg" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-[#DFF5EE]">Preferences</h3>
                  <p className="text-sm text-gray-500 dark:text-[#4D7A6C]">Customize your experience</p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Dark Mode Toggle */}
                <div className="flex items-center justify-between p-4 rounded-lg bg-white dark:bg-[#080E0D] border border-gray-200 dark:border-[#1A3028]">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <RiSettings3Line className="text-primary text-lg" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-[#DFF5EE]">Dark Mode</p>
                      <p className="text-xs text-gray-500 dark:text-[#4D7A6C]">
                        Use dark theme across the application
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={toggleTheme}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      theme === 'dark' ? 'bg-primary' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Email Notifications Toggle */}
                <div className="flex items-center justify-between p-4 rounded-lg bg-white dark:bg-[#080E0D] border border-gray-200 dark:border-[#1A3028]">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <RiMailLine className="text-primary text-lg" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-[#DFF5EE]">Email Notifications</p>
                      <p className="text-xs text-gray-500 dark:text-[#4D7A6C]">
                        Notify me when a vendor submits a response
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setNotifications(!notifications)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      notifications ? 'bg-primary' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notifications ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
        <Footer />
      </div>
    </div>
  )
}

export default ProfileSettings
