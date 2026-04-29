import { BrowserRouter, Routes, Route, useLocation, Link } from 'react-router-dom'
import { UserPlus } from 'lucide-react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import WhatsAppButton from './components/WhatsAppButton'
import ScrollToTop from './components/ScrollToTop'
import ChatBot from './components/ChatBot'
import Home from './pages/Home'
import AboutUs from './pages/AboutUs'
import AboutJCI from './pages/AboutJCI'
import PresidentMessage from './pages/PresidentMessage'
import JCICreed from './pages/JCICreed'
import Vertical from './pages/Vertical'
import Membership from './pages/Membership'
import Contact from './pages/Contact'
import MembersLogin from './pages/MembersLogin'
import MembershipValidation from './pages/MembershipValidation'
import EventDetail from './pages/EventDetail'

import PortalLayout from './pages/portal/PortalLayout'
import Dashboard from './pages/portal/Dashboard'
import Profile from './pages/portal/Profile'
import Events from './pages/portal/Events'
import Projects from './pages/portal/Projects'
import Resources from './pages/portal/Resources'
import BrandShowcase from './pages/BrandShowcase'

function AppLayout() {
  const location = useLocation()
  const isLoginPage = location.pathname.startsWith('/login')
  const isPortal = location.pathname.startsWith('/portal')

  return (
    <div className="min-h-screen flex flex-col font-jakarta bg-white text-slate-900">
      {!isPortal && <Navbar />}

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/about/jci" element={<AboutJCI />} />
          <Route path="/about/president-message" element={<PresidentMessage />} />
          <Route path="/about/creed" element={<JCICreed />} />
          
          <Route path="/vertical" element={<Vertical />} />
          <Route path="/membership" element={<Membership />} />
          <Route path="/check-membership" element={<MembershipValidation />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/event/:id" element={<EventDetail />} />
          <Route path="/login" element={<MembersLogin />} />
          <Route path="/brand" element={<BrandShowcase />} />

          <Route path="/portal" element={<PortalLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="events" element={<Events />} />
            <Route path="events/:id" element={<EventDetail />} />
            <Route path="projects" element={<Projects />} />
            <Route path="settings" element={<Profile />} />
          </Route>
        </Routes>
      </main>

      {!isLoginPage && !isPortal && <Footer />}

      {!isLoginPage && !isPortal && (
        <>
          <ChatBot />
          <WhatsAppButton />
          <Link
            to="/membership"
            className="fixed bottom-6 right-6 lg:bottom-10 lg:right-10 z-50 bg-jci-yellow hover:bg-jci-blue hover:text-white text-jci-black flex items-center gap-2 px-5 py-3 lg:px-6 lg:py-4 rounded-full font-bold shadow-xl transition-all hover:scale-105 hover:-translate-y-1 active:scale-95 group border border-black/10"
          >
            <UserPlus size={18} className="lg:w-5 lg:h-5 group-hover:rotate-12 transition-transform" />
            <span className="uppercase tracking-widest text-xs lg:text-sm hidden sm:inline">Become a Member</span>
            <span className="uppercase tracking-widest text-xs sm:hidden">Join Us</span>
          </Link>
        </>
      )}
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppLayout />
    </BrowserRouter>
  )
}

export default App
