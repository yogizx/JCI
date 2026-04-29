import { useState, useRef, useEffect } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, User, Calendar, FolderHeart, Library,
  Settings, HelpCircle, Search, Bell, Menu, X, LogOut,
  ChevronDown, Users, BookOpen, CreditCard, Trophy,
  CheckCircle2, AlertCircle, Info, Megaphone, ShieldCheck
} from 'lucide-react'

const navLinks = [
  { name: 'Dashboard', to: '/portal', icon: <LayoutDashboard size={20} /> },
  { name: 'My Profile', to: '/portal/profile', icon: <User size={20} /> },
  { name: 'Events', to: '/portal/events', icon: <Calendar size={20} /> },
  { name: 'Impact Projects', to: '/portal/projects', icon: <FolderHeart size={20} /> },
  { name: 'Settings', to: '/portal/settings', icon: <Settings size={20} /> },
];

const NOTIFICATIONS = [
  {
    id: 1,
    type: 'event',
    icon: <Calendar size={16} />,
    iconBg: 'bg-blue-50 text-blue-600',
    title: 'Leadership Summit tomorrow',
    desc: 'Regional Leadership Summit starts at 10:00 AM at JCI HQ.',
    time: '2 hours ago',
    read: false,
  },
  {
    id: 2,
    type: 'dues',
    icon: <CreditCard size={16} />,
    iconBg: 'bg-amber-50 text-amber-600',
    title: 'Membership dues reminder',
    desc: 'Your annual dues of ₹2,500 are due by Oct 30th.',
    time: '1 day ago',
    read: false,
  },
  {
    id: 3,
    type: 'achievement',
    icon: <Trophy size={16} />,
    iconBg: 'bg-emerald-50 text-emerald-600',
    title: 'New certificate earned',
    desc: 'You earned the Public Speaking Advanced certificate.',
    time: '2 days ago',
    read: true,
  },
  {
    id: 4,
    type: 'announcement',
    icon: <Megaphone size={16} />,
    iconBg: 'bg-purple-50 text-purple-600',
    title: 'Annual Convention 2024 dates',
    desc: 'Early bird registrations open next week. Save ₹500.',
    time: '3 days ago',
    read: true,
  },
]

export default function PortalLayout() {
  const location = useLocation()
  const navigate = useNavigate()

  const [member, setMember] = useState(null)
  const [authChecking, setAuthChecking] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [notifications, setNotifications] = useState(NOTIFICATIONS)

  const notifRef = useRef(null)
  const userMenuRef = useRef(null)

  const unreadCount = notifications.filter(n => !n.read).length

  useEffect(() => {
    const clearSession = () => {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }

    const fetchMember = async () => {
      const token = localStorage.getItem('token')

      if (!token) {
        clearSession()
        navigate('/login', { replace: true })
        return
      }

      const controller = new AbortController()
      const timeoutId = window.setTimeout(() => controller.abort(), 8000)

      try {
        const response = await fetch('/api/member/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          },
          signal: controller.signal,
        })
        const data = await response.json()

        if (response.ok) {
          setMember(data.member)
          localStorage.setItem('user', JSON.stringify(data.member))
        } else if (response.status === 401) {
          // Only redirect on actual authentication failure
          clearSession()
          navigate('/login', { replace: true })
        } else {
          // For other errors (500, etc.), use the cached user data if available
          const cachedUser = localStorage.getItem('user')
          if (cachedUser) setMember(JSON.parse(cachedUser))
          console.warn('Backend error, using cached session:', response.status)
        }
      } catch (err) {
        if (err?.name !== 'AbortError') {
          console.error('Network or fetch error:', err)
          // Don't log out on network glitches if we have a token
          const cachedUser = localStorage.getItem('user')
          if (cachedUser) setMember(JSON.parse(cachedUser))
        }
      } finally {
        window.clearTimeout(timeoutId)
        setAuthChecking(false)
      }
    }

    fetchMember()
  }, [navigate])

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false)
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  const markRead = (id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  const handleLogout = () => { 
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUserMenuOpen(false)
    navigate('/login', { replace: true })
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="p-6 lg:p-8 flex-1 overflow-y-auto no-scrollbar">
        <h2 className="text-[10px] font-black tracking-[0.25em] text-[#A0813D] mb-8 mt-0 uppercase text-center opacity-80">
          JCI Madurai Central
        </h2>

        {/* Member Info (Image Style) */}
        <div className="mb-10 flex flex-col items-center">
          <div className="relative mb-4">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-slate-700 shadow-2xl bg-white">
              <img 
                src={member?.profile?.profileImage || "https://img.freepik.com/premium-vector/avatar-man-short-hair-dark-skin_113065-517.jpg"} 
                alt={member?.name || "Member"}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[#00153D]"></div>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-bold text-white leading-tight">{member?.name || "Loading..."}</h3>
            <p className="text-[10px] text-slate-400 mt-2 uppercase tracking-widest font-black flex flex-col gap-1 items-center">
              <span>MEMBERSHIP ID:</span> 
              <span className="text-[#A0813D] text-xs tracking-wider bg-white/10 px-3 py-1 rounded-md">{member?.memberId || "---"}</span>
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          {navLinks.map((link) => {
            const active = location.pathname === link.to ||
              (link.to === '/portal' && location.pathname === '/portal') ||
              (link.name === 'Events' && location.pathname.startsWith('/portal/events')) ||
              (link.name === 'Settings' && location.pathname.startsWith('/portal/settings'))
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  active
                    ? 'bg-[#A0813D]/20 text-white border-l-4 border-[#A0813D] pl-3'
                    : 'text-slate-400 hover:text-white hover:bg-white/5 border-l-4 border-transparent pl-3'
                }`}
              >
                <span className={active ? 'text-[#A0813D]' : ''}>{link.icon}</span>
                {link.name}
              </Link>
            )
          })}
        </nav>

        {/* Join Event CTA */}
        <div className="mt-6 px-2">
          <Link
            to="/portal/events"
            className="w-full bg-[#A0813D] hover:bg-[#8b6d31] text-white py-3 rounded-xl font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2"
          >
            <Calendar size={16} />
            Join New Event
          </Link>
        </div>
      </div>

      {/* Bottom Links (Fixed structure) */}
      <div className="p-4 space-y-1 mt-auto">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-semibold text-red-400 hover:text-white hover:bg-red-500/20 transition-all font-jakarta"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>
    </div>
  )

  if (authChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-4 text-slate-900">
        <div className="w-full max-w-md rounded-[28px] border border-slate-200 bg-white px-8 py-10 text-center shadow-[0_24px_60px_rgba(0,21,61,0.08)]">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#00153D] text-[#A0813D]">
            <ShieldCheck size={24} />
          </div>
          <h1 className="mt-4 text-2xl font-black text-[#00153D]">Verifying your access</h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-500">
            We&apos;re checking your member session before loading the portal.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex bg-[#F8FAFC] min-h-screen font-jakarta text-slate-900">

      {/* ── DESKTOP SIDEBAR ── */}
      <aside className="w-64 bg-[#00153D] text-white flex-col fixed inset-y-0 z-50 hidden lg:flex">
        <SidebarContent />
      </aside>

      {/* ── MOBILE SIDEBAR OVERLAY ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── MOBILE SIDEBAR DRAWER ── */}
      <aside
        className={`fixed inset-y-0 left-0 w-72 bg-[#00153D] text-white flex flex-col z-50 lg:hidden transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Close button */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-all"
        >
          <X size={16} />
        </button>
        <SidebarContent />
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 lg:ml-64 min-h-screen flex flex-col overflow-x-hidden relative">

        {/* ── HEADER ── */}
        <header className="h-16 lg:h-20 bg-white/90 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-4 lg:px-10 sticky top-0 z-40 shadow-sm">

          {/* Left: Hamburger (mobile) + Title + Nav Links */}
          <div className="flex items-center gap-3 lg:gap-8">
            {/* Mobile hamburger */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden w-9 h-9 rounded-xl bg-[#00153D] text-white flex items-center justify-center shrink-0 shadow-md"
            >
              <Menu size={18} />
            </button>

            <span className="font-black text-[#00153D] text-base lg:text-lg tracking-tight hidden sm:block">
              JCI Madurai Central
            </span>


          </div>

          {/* Right: Search + Bell + User */}
          <div className="flex items-center gap-2 lg:gap-4">

            {/* Search — desktop only */}
            <div className="relative hidden lg:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
              <input
                type="text"
                placeholder="Search..."
                className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#A0813D]/20 focus:border-[#A0813D] transition-all w-52"
              />
            </div>

            {/* Notification Bell */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => { setNotifOpen(!notifOpen); setUserMenuOpen(false) }}
                className="relative w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:text-[#00153D] hover:bg-slate-100 transition-all"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
                )}
              </button>

              {/* Notification Drawer */}
              {notifOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50">
                  <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                    <div>
                      <h3 className="font-black text-[#00153D] text-sm">Notifications</h3>
                      {unreadCount > 0 && (
                        <p className="text-[11px] text-slate-400 mt-0.5">{unreadCount} unread</p>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllRead}
                        className="text-[11px] font-bold text-[#A0813D] hover:text-[#8B6D31] flex items-center gap-1 transition-colors"
                      >
                        <CheckCircle2 size={13} /> Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markRead(n.id)}
                        className={`flex gap-3 px-5 py-4 border-b border-slate-50 cursor-pointer transition-colors hover:bg-slate-50 ${!n.read ? 'bg-[#F5F2EA]/50' : ''}`}
                      >
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${n.iconBg}`}>
                          {n.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className={`text-sm font-bold text-[#00153D] leading-tight ${!n.read ? '' : 'opacity-70'}`}>
                              {n.title}
                            </p>
                            {!n.read && (
                              <span className="w-2 h-2 bg-[#A0813D] rounded-full shrink-0 mt-1.5"></span>
                            )}
                          </div>
                          <p className="text-[12px] text-slate-500 mt-1 leading-relaxed">{n.desc}</p>
                          <p className="text-[11px] text-slate-400 mt-1.5 font-medium">{n.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="px-5 py-3 border-t border-slate-100 text-center">
                    <button className="text-[12px] font-bold text-[#A0813D] hover:text-[#8B6D31] transition-colors">
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User Menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => { setUserMenuOpen(!userMenuOpen); setNotifOpen(false) }}
                className="flex items-center gap-2 hover:bg-slate-50 px-2 py-1.5 rounded-xl transition-all"
              >
                <div className="w-8 h-8 lg:w-9 lg:h-9 rounded-full bg-gradient-to-br from-[#A0813D] to-[#8B6D31] flex items-center justify-center border-2 border-white shadow-sm text-white text-xs font-bold shrink-0">
                  {member?.name ? member.name.substring(0, 2).toUpperCase() : "U"}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs lg:text-sm font-bold text-slate-700 leading-none">{member?.name || "Loading..."}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{member?.role || "Member"}</p>
                </div>
                <ChevronDown size={14} className={`text-slate-400 hidden sm:block transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* User Dropdown */}
              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 py-2">
                  <Link
                    to="/portal/profile"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-[#00153D] transition-colors"
                  >
                    <User size={16} /> View Profile
                  </Link>
                  <Link
                    to="#"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-[#00153D] transition-colors"
                  >
                    <Settings size={16} /> Settings
                  </Link>
                  <div className="my-1.5 border-t border-slate-100"></div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ── PAGE CONTENT ── */}
        <div className="flex-1 p-4 lg:p-10 mt-2 lg:mt-4">
          {member?.isTempPassword && (
            <div className="mb-6 rounded-[28px] border border-amber-200 bg-amber-50 px-5 py-4 text-amber-900 shadow-sm">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                    <AlertCircle size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-700">Temporary Password</p>
                    <p className="mt-1 text-sm leading-relaxed text-amber-800">
                      Your account is still using the temporary password sent by the admin. Change it now to secure your portal access.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/portal/profile?changePassword=1')}
                  className="rounded-2xl bg-amber-600 px-5 py-3 text-xs font-black uppercase tracking-[0.16em] text-white transition hover:bg-amber-700"
                >
                  Change Password
                </button>
              </div>
            </div>
          )}

          <Outlet context={{ member }} />
        </div>
      </main>
    </div>
  )
}
