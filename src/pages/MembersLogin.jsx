import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Eye, EyeOff, Lock, Shield, User } from 'lucide-react'
import jciLogo from '../assets/JCI Madurai Central.png'

export default function MembersLogin() {
  const navigate = useNavigate()
  const [memberId, setMemberId] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [checkingSession, setCheckingSession] = useState(() => Boolean(localStorage.getItem('token')))

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (!token) {
      setCheckingSession(false)
      return undefined
    }

    let isActive = true

    const restoreSession = async () => {
      const controller = new AbortController()
      const timeoutId = window.setTimeout(() => controller.abort(), 8000)

      try {
        const response = await fetch('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        })

        const data = await response.json()

        if (!isActive) {
          return
        }

        if (response.ok) {
          localStorage.setItem('user', JSON.stringify(data.member))
          navigate('/portal', { replace: true })
          return
        } else if (response.status === 401) {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
        }
      } catch (err) {
        if (err?.name !== 'AbortError') {
          console.error('Unable to restore member session', err)
        }
      } finally {
        window.clearTimeout(timeoutId)
        if (isActive) {
          setCheckingSession(false)
        }
      }
    }

    restoreSession()

    return () => {
      isActive = false
    }
  }, [navigate])

  const handleLogin = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberId, password }),
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.member))
        navigate('/portal', { replace: true })
      } else {
        setError(data.message || 'Authentication failed')
      }
    } catch (err) {
      setError('Connection refused. Please check if the server is running.')
    } finally {
      setLoading(false)
    }
  }

  if (checkingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#eef1f9] px-4">
        <div className="w-full max-w-md rounded-3xl border border-[#A0813D]/20 bg-white px-8 py-10 text-center shadow-[0_24px_60px_rgba(0,21,61,0.12)]">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#00153D] text-[#A0813D]">
            <Shield size={24} />
          </div>
          <h1 className="text-2xl font-extrabold text-[#00153D]">Restoring your session</h1>
          <p className="mt-3 text-sm text-slate-500">
            Please wait while we confirm your access and open the dashboard.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#eef1f9] text-slate-900">
      <main className="flex flex-1 items-center justify-center px-4 py-10 pt-28 sm:px-6 lg:px-8">
        <div className="w-full max-w-xl rounded-3xl border border-[#A0813D]/30 bg-[#00153D] p-7 shadow-[0_24px_60px_rgba(0,21,61,0.28)] sm:p-10">
          <div className="mb-8 flex items-start justify-between gap-4">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white p-1.5 shadow-sm">
                  <img src={jciLogo} alt="JCI Madurai Central logo" className="h-full w-full object-contain" />
                </div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#A0813D]">JCI Madurai Central Portal</span>
              </div>

              <h1 className="text-4xl font-extrabold text-white">Member Access</h1>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-300">
                Welcome back. Enter your credentials to access the leadership dashboard.
              </p>
            </div>

            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-[#A0813D]">
              <Shield size={30} />
            </div>
          </div>
          
          {error && (
            <div className="mb-6 rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-red-400 text-sm font-medium animate-pulse">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="memberId" className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-300">
                Email, Username or Member ID
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#7a8190]">
                  <User size={16} />
                </span>
                <input
                  id="memberId"
                  value={memberId}
                  onChange={(event) => setMemberId(event.target.value)}
                  type="text"
                  required
                  placeholder="Enter your email or ID"
                  className="w-full rounded-xl border border-[#A0813D]/20 bg-[#F5F2EA] px-10 py-3.5 text-sm text-[#00153D] outline-none transition focus:border-[#A0813D] focus:ring-2 focus:ring-[#A0813D]/25"
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label htmlFor="password" className="block text-xs font-extrabold uppercase tracking-wider text-slate-300">
                  Password
                </label>
                <button type="button" className="text-xs font-semibold text-[#A0813D] hover:text-[#c9a864]">
                  Forgot Password?
                </button>
              </div>

              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#7a8190]">
                  <Lock size={16} />
                </span>
                <input
                  id="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="........"
                  className="w-full rounded-xl border border-[#A0813D]/20 bg-[#F5F2EA] px-10 py-3.5 text-sm text-[#00153D] outline-none transition focus:border-[#A0813D] focus:ring-2 focus:ring-[#A0813D]/25"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7a8190] transition hover:text-[#00153D]"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <label className="flex items-center gap-3 text-sm text-slate-300">
              <input
                type="checkbox"
                checked={remember}
                onChange={(event) => setRemember(event.target.checked)}
                className="h-4 w-4 rounded border-slate-300 accent-[#A0813D]"
              />
              Remember my session
            </label>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#A0813D] px-4 py-4 text-sm font-bold text-white transition hover:bg-[#8B6D31] disabled:cursor-not-allowed disabled:opacity-75"
            >
              {loading ? 'Authenticating...' : 'Login to Dashboard'}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-white/10" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#A0813D]">New Here?</span>
            <span className="h-px flex-1 bg-white/10" />
          </div>

          <Link
            to="/contact"
            className="block rounded-xl border border-[#A0813D]/35 bg-white/5 py-3.5 text-center text-sm font-bold text-[#F4E7C6] transition hover:border-[#A0813D] hover:bg-white/10"
          >
            Request Access
          </Link>

          <div className="mt-6 text-center text-[11px] font-bold uppercase tracking-wider text-slate-400">
            <p className="mt-1">Authorized JCI Madurai personnel only</p>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-5 text-xs font-semibold text-slate-500">
            <a href="#" className="transition hover:text-[#A0813D]">
              Privacy Policy
            </a>
            <a href="#" className="transition hover:text-[#A0813D]">
              Platform Status
            </a>
            <Link to="/contact" className="transition hover:text-[#A0813D]">
              Contact Support
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white py-5">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 text-xs text-slate-500 sm:flex-row sm:px-6 lg:px-8">
          {/* <p className="font-bold text-slate-800">Youth Leadership</p> */}
          <div className="flex flex-wrap items-center justify-center gap-4 font-semibold">
            <a href="#" className="transition hover:text-blue-700">
              Privacy Policy
            </a>
            <a href="#" className="transition hover:text-blue-700">
              Terms of Service
            </a>
            <a href="#" className="transition hover:text-blue-700">
              FAQ
            </a>
            <a href="#" className="transition hover:text-blue-700">
              Cookie Policy
            </a>
          </div>
          <p className="text-center sm:text-right">© 2026 JCI Madurai Central. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
