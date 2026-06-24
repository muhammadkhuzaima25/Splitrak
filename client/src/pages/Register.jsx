import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const Register = () => {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const validate = () => {
    const errs = {}
    if (!form.firstName) errs.firstName = 'First name is required'
    if (!form.lastName) errs.lastName = 'Last name is required'
    if (!form.email) errs.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email format'
    if (!form.password) errs.password = 'Password is required'
    else if (form.password.length < 8) errs.password = 'Password must be at least 8 characters'
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value })
    if (errors[field]) setErrors({ ...errors, [field]: '' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const name = `${form.firstName} ${form.lastName}`
      await register(name, form.email, form.password)
      toast.success('Account created!')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-50 dark:bg-[#080E0D] flex-col justify-between p-12">
        <div className="flex items-center gap-3">
          <img src="/splitrak.svg" alt="Splitrak" className="w-12 h-12 rounded-xl" />
          <span className="text-2xl font-bold text-gray-900 dark:text-[#DFF5EE]">Splitrak</span>
        </div>
        <div>
          <h2 className="text-4xl font-bold text-gray-900 dark:text-[#DFF5EE] leading-tight mb-4">
            Start smarter<br />procurement today.
          </h2>
          <p className="text-gray-500 dark:text-[#4D7A6C] text-lg">
            Create your account and begin comparing vendor quotations in minutes.
          </p>
        </div>
        <div className="text-gray-400 dark:text-[#2A4A42]">
          <p className="italic">"The best price isn't always from one vendor."</p>
          <p className="text-primary mt-2">— Splitrak</p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 bg-gray-100 dark:bg-[#0D1A17] flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <img src="/splitrak.svg" alt="Splitrak" className="w-10 h-10 rounded-lg" />
            <span className="text-xl font-bold text-gray-900 dark:text-[#DFF5EE]">Splitrak</span>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-[#DFF5EE] mb-2">Create account</h2>
          <p className="text-gray-500 dark:text-[#4D7A6C] mb-8">Join Splitrak and optimize your vendor management</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-500 dark:text-[#4D7A6C] mb-1.5">First name</label>
                <input
                  type="text"
                  value={form.firstName}
                  onChange={handleChange('firstName')}
                  className="w-full px-4 py-3 bg-white dark:bg-[#080E0D] border border-gray-200 dark:border-[#1A3028] rounded-lg text-gray-900 dark:text-[#DFF5EE] focus:outline-none focus:border-primary transition-colors"
                  placeholder="John"
                />
                {errors.firstName && <p className="text-red-400 text-xs mt-1">{errors.firstName}</p>}
              </div>
              <div>
                <label className="block text-sm text-gray-500 dark:text-[#4D7A6C] mb-1.5">Last name</label>
                <input
                  type="text"
                  value={form.lastName}
                  onChange={handleChange('lastName')}
                  className="w-full px-4 py-3 bg-white dark:bg-[#080E0D] border border-gray-200 dark:border-[#1A3028] rounded-lg text-gray-900 dark:text-[#DFF5EE] focus:outline-none focus:border-primary transition-colors"
                  placeholder="Doe"
                />
                {errors.lastName && <p className="text-red-400 text-xs mt-1">{errors.lastName}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-500 dark:text-[#4D7A6C] mb-1.5">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={handleChange('email')}
                className="w-full px-4 py-3 bg-white dark:bg-[#080E0D] border border-gray-200 dark:border-[#1A3028] rounded-lg text-gray-900 dark:text-[#DFF5EE] focus:outline-none focus:border-primary transition-colors"
                placeholder="you@example.com"
              />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm text-gray-500 dark:text-[#4D7A6C] mb-1.5">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={handleChange('password')}
                className="w-full px-4 py-3 bg-white dark:bg-[#080E0D] border border-gray-200 dark:border-[#1A3028] rounded-lg text-gray-900 dark:text-[#DFF5EE] focus:outline-none focus:border-primary transition-colors"
                placeholder="••••••••"
              />
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-sm text-gray-500 dark:text-[#4D7A6C] mb-1.5">Confirm password</label>
              <input
                type="password"
                value={form.confirmPassword}
                onChange={handleChange('confirmPassword')}
                className="w-full px-4 py-3 bg-white dark:bg-[#080E0D] border border-gray-200 dark:border-[#1A3028] rounded-lg text-gray-900 dark:text-[#DFF5EE] focus:outline-none focus:border-primary transition-colors"
                placeholder="••••••••"
              />
              {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary hover:bg-primary-light text-base font-semibold rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <div className="spinner"></div> : 'Create account'}
            </button>
          </form>

          <p className="text-center text-gray-500 dark:text-[#4D7A6C] text-sm mt-6">
            Already registered?{' '}
            <Link to="/login" className="text-primary hover:text-primary-light transition-colors">
              Sign in →
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
