import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const validate = () => {
    const errs = {}
    if (!email) errs.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Invalid email format'
    if (!password) errs.password = 'Password is required'
    else if (password.length < 8) errs.password = 'Password must be at least 8 characters'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await login(email, password)
      toast.success('Welcome back!')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed')
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
            Smarter vendor<br />decisions, faster.
          </h2>
          <p className="text-gray-500 dark:text-[#4D7A6C] text-lg">
            Compare quotations, split orders automatically, and save more on every purchase.
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
          {/* Mobile Logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <img src="/splitrak.svg" alt="Splitrak" className="w-10 h-10 rounded-lg" />
            <span className="text-xl font-bold text-gray-900 dark:text-[#DFF5EE]">Splitrak</span>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-[#DFF5EE] mb-2">Sign in</h2>
          <p className="text-gray-500 dark:text-[#4D7A6C] mb-8">Welcome back to Splitrak</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm text-gray-500 dark:text-[#4D7A6C] mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white dark:bg-[#080E0D] border border-gray-200 dark:border-[#1A3028] rounded-lg text-gray-900 dark:text-[#DFF5EE] focus:outline-none focus:border-primary transition-colors"
                placeholder="you@example.com"
              />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm text-gray-500 dark:text-[#4D7A6C] mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white dark:bg-[#080E0D] border border-gray-200 dark:border-[#1A3028] rounded-lg text-gray-900 dark:text-[#DFF5EE] focus:outline-none focus:border-primary transition-colors"
                placeholder="••••••••"
              />
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-500 dark:text-[#4D7A6C] cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-200 dark:border-[#1A3028] bg-white dark:bg-[#080E0D] accent-primary" />
                Remember me
              </label>
              <a href="#" className="text-primary hover:text-primary-light transition-colors">Forgot password?</a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary hover:bg-primary-light text-base font-semibold rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <div className="spinner"></div> : 'Sign in'}
            </button>
          </form>

          <p className="text-center text-gray-500 dark:text-[#4D7A6C] text-sm mt-6">
            No account?{' '}
            <Link to="/register" className="text-primary hover:text-primary-light transition-colors">
              Register here →
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
