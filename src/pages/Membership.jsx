import { useState, useEffect } from 'react'
import { Calendar, MapPin, CheckCircle2, Briefcase, ChevronRight } from 'lucide-react'

const initialFormData = {
  name: '',
  email: '',
  phone: '',
  address: '',
  state: '',
  city: '',
  cityLocal: '',
  pincode: '',
  profession: ''
}

const successMessage = 'Interest submitted! Our team will contact you soon.'
const membershipSubmitMode = import.meta.env.VITE_MEMBERSHIP_SUBMIT_MODE || 'formsubmit'
const formSubmitEmail = import.meta.env.VITE_FORMSUBMIT_EMAIL || 'mdp.itme@gmail.com'

const readJsonSafely = async (response) => {
  try {
    return await response.json()
  } catch {
    return null
  }
}

const submitInterestToBackend = async (formData) => {
  const response = await fetch('/api/interest/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  })

  const data = await readJsonSafely(response)

  return {
    ok: response.ok,
    status: response.status,
    message: data?.message || 'Submission failed',
  }
}

const submitInterestToFormSubmit = async (formData) => {
  if (!formSubmitEmail) {
    return { ok: false, message: 'Email service is not configured yet.' }
  }

  const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(formSubmitEmail)}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      state: formData.state,
      district: formData.city,
      city: formData.cityLocal,
      pincode: formData.pincode,
      profession: formData.profession,
      _replyto: formData.email,
      _subject: `New Membership Interest: ${formData.name}`,
      _template: 'table',
      _captcha: 'false',
    }),
  })

  const data = await readJsonSafely(response)

  return {
    ok: response.ok && data?.success !== false,
    status: response.status,
    message: data?.message || 'Email delivery failed. Please try again later.',
  }
}

const heroSlides = [
  {
    src: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=2012&auto=format&fit=crop",
    alt: "Youth Leaders Networking"
  },
  {
    src: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=2070&auto=format&fit=crop",
    alt: "Community Service Project"
  },
  {
    src: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop",
    alt: "Leadership Awards Ceremony"
  },
  {
    src: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=2070&auto=format&fit=crop",
    alt: "Professional Development Workshop"
  },
  {
    src: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?q=80&w=2069&auto=format&fit=crop",
    alt: "Civic Action & Volunteering"
  },
]

export default function Membership() {
  const [activeSlide, setActiveSlide] = useState(0)
  const [fade, setFade] = useState(true)
  
  // Form State
  const [formData, setFormData] = useState(initialFormData)
  const [submitting, setSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' })

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setSubmitStatus({ type: '', message: '' })

    try {
      let result = membershipSubmitMode === 'api'
        ? await submitInterestToBackend(formData)
        : await submitInterestToFormSubmit(formData)

      if (membershipSubmitMode === 'api' && !result.ok && (result.status === 404 || result.status >= 500)) {
        result = await submitInterestToFormSubmit(formData)
      }

      if (result.ok) {
        setSubmitStatus({ type: 'success', message: successMessage })
        setFormData({ ...initialFormData })
      } else {
        setSubmitStatus({ type: 'error', message: result.message })
      }
    } catch {
      if (membershipSubmitMode === 'api') {
        try {
          const fallbackResult = await submitInterestToFormSubmit(formData)

          if (fallbackResult.ok) {
            setSubmitStatus({ type: 'success', message: successMessage })
            setFormData({ ...initialFormData })
          } else {
            setSubmitStatus({ type: 'error', message: fallbackResult.message })
          }
        } catch {
          setSubmitStatus({ type: 'error', message: 'Connection error. Please try again later.' })
        }
      } else {
        setSubmitStatus({ type: 'error', message: 'Connection error. Please try again later.' })
      }
    } finally {
      setSubmitting(false)
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false)
      setTimeout(() => {
        setActiveSlide(prev => (prev + 1) % heroSlides.length)
        setFade(true)
      }, 500)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative h-[550px] flex items-center overflow-hidden bg-[#00153D]">
        <img 
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop" 
          alt="Leadership Meeting" 
          className="absolute inset-0 w-full h-full object-cover brightness-[0.2]" 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#00153D] via-[#00153D]/70 to-transparent" />
        
        <div className="relative mx-auto max-w-[1440px] px-6 lg:px-12 w-full text-white">
          <div className="max-w-2xl">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#A0813D] mb-4 block">
              Future Leaders Wanted
            </span>
            <h1 className="text-6xl lg:text-8xl font-black mb-8 leading-[0.9] tracking-tighter">
              Join the <br /> <span className="text-[#A0813D]">Legacy of <br /> Leadership.</span>
            </h1>
            <p className="text-lg text-slate-300 mb-0 max-w-lg leading-relaxed">
              Become part of a global movement that empowers young people to create positive change. Excellence isn't just a goal; it's our heritage.
            </p>
          </div>
        </div>
        
        {/* Auto-cycling Overlap Image Slider */}
        <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-[40%] h-[80%] rounded-l-[40px] overflow-hidden shadow-2xl border-l-4 border-t-4 border-[#A0813D]/40">
          <img 
            src={heroSlides[activeSlide].src}
            alt={heroSlides[activeSlide].alt}
            className="w-full h-full object-cover transition-opacity duration-500"
            style={{ opacity: fade ? 1 : 0 }}
          />
          {/* Slide Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => { setFade(false); setTimeout(() => { setActiveSlide(i); setFade(true); }, 300) }}
                className={`h-1.5 rounded-full transition-all duration-300 ${i === activeSlide ? 'w-6 bg-[#A0813D]' : 'w-1.5 bg-white/40'}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Criteria Section */}
      <section className="py-24 bg-[#F8F9FA]">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-16">
            <div>
              <h2 className="text-4xl font-black text-[#00153D] mb-8 leading-tight">Are you the right fit?</h2>
              <p className="text-slate-500 mb-8 leading-relaxed">
                We look for visionaries, action-takers, and community-minded professionals ready to elevate their impact.
              </p>
              <div className="flex items-center gap-3 text-[#A0813D]">
                <CheckCircle2 size={20} />
                <span className="font-bold text-sm tracking-widest uppercase">Standard of Excellence</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { icon: <Calendar className="text-[#A0813D]" />, title: 'Age Eligibility', desc: 'Active membership is open to young citizens between the ages of 18 and 40.' },
                { icon: <MapPin className="text-[#A0813D]" />, title: 'Local Presence', desc: 'Residing or working within the Madurai region to ensure active community participation.' },
                { icon: <CheckCircle2 className="text-[#A0813D]" />, title: 'Commitment', desc: 'A dedication to attending meetings, projects, and local organization development programs.' },
                { icon: <Briefcase className="text-[#A0813D]" />, title: 'Professionalism', desc: 'A clean professional record and a desire to network with the elite leaders of the city.' }
              ].map((item, idx) => (
                <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all group">
                  <div className="mb-6 w-12 h-12 rounded-xl bg-[#F8F9FA] flex items-center justify-center group-hover:bg-[#A0813D]/10 transition-colors">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-[#00153D] mb-3">{item.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12">
            <div>
              <div className="flex flex-col mb-4">
                <span className="w-12 h-1.5 bg-[#A0813D] rounded-full mb-4"></span>
                <h2 className="text-4xl lg:text-5xl font-black text-[#00153D] uppercase tracking-tight">Express Your <span className="text-[#A0813D]">Interest</span></h2>
              </div>
              <p className="text-slate-500 mb-12 font-medium">Fill out the form below. Our membership committee reviews applications on a rolling basis.</p>
              
              {submitStatus.message && (
                <div className={`mb-8 p-6 rounded-2xl font-bold uppercase tracking-widest text-sm ${
                  submitStatus.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {submitStatus.message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div>
                  <label className="block text-xs font-black uppercase tracking-[0.2em] text-[#00153D]/60 mb-3">Full Name</label>
                  <input 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    type="text" required placeholder="John Doe" className="w-full bg-white border border-slate-200 rounded-xl py-4 px-6 focus:ring-2 focus:ring-[#A0813D]/20 focus:border-[#A0813D] transition-all outline-none font-semibold text-slate-700 placeholder:text-slate-300" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-[0.2em] text-[#00153D]/60 mb-3">Email Address</label>
                  <input 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    type="email" required placeholder="john@example.com" className="w-full bg-white border border-slate-200 rounded-xl py-4 px-6 focus:ring-2 focus:ring-[#A0813D]/20 focus:border-[#A0813D] transition-all outline-none font-semibold text-slate-700 placeholder:text-slate-300" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-[0.2em] text-[#00153D]/60 mb-3">Phone Number</label>
                  <input 
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    type="tel" required placeholder="+91 00000 00000" className="w-full bg-white border border-slate-200 rounded-xl py-4 px-6 focus:ring-2 focus:ring-[#A0813D]/20 focus:border-[#A0813D] transition-all outline-none font-semibold text-slate-700 placeholder:text-slate-300" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-[0.2em] text-[#00153D]/60 mb-3">Address</label>
                  <input 
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    type="text" required placeholder="Street Address" className="w-full bg-white border border-slate-200 rounded-xl py-4 px-6 focus:ring-2 focus:ring-[#A0813D]/20 focus:border-[#A0813D] transition-all outline-none font-semibold text-slate-700 placeholder:text-slate-300" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-[0.2em] text-[#00153D]/60 mb-3">State</label>
                  <input 
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    type="text" required placeholder="Tamil Nadu" className="w-full bg-white border border-slate-200 rounded-xl py-4 px-6 focus:ring-2 focus:ring-[#A0813D]/20 focus:border-[#A0813D] transition-all outline-none font-semibold text-slate-700 placeholder:text-slate-300" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-[0.2em] text-[#00153D]/60 mb-3">District</label>
                  <input 
                    name="city" // Using city for district in this context
                    value={formData.city}
                    onChange={handleInputChange}
                    type="text" required placeholder="Madurai" className="w-full bg-white border border-slate-200 rounded-xl py-4 px-6 focus:ring-2 focus:ring-[#A0813D]/20 focus:border-[#A0813D] transition-all outline-none font-semibold text-slate-700 placeholder:text-slate-300" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-[0.2em] text-[#00153D]/60 mb-3">City</label>
                  <input 
                    name="cityLocal"
                    value={formData.cityLocal}
                    onChange={handleInputChange}
                    type="text" required placeholder="Madurai City" className="w-full bg-white border border-slate-200 rounded-xl py-4 px-6 focus:ring-2 focus:ring-[#A0813D]/20 focus:border-[#A0813D] transition-all outline-none font-semibold text-slate-700 placeholder:text-slate-300" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-[0.2em] text-[#00153D]/60 mb-3">Pincode</label>
                  <input 
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    type="text" required placeholder="625016" className="w-full bg-white border border-slate-200 rounded-xl py-4 px-6 focus:ring-2 focus:ring-[#A0813D]/20 focus:border-[#A0813D] transition-all outline-none font-semibold text-slate-700 placeholder:text-slate-300" 
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-black uppercase tracking-[0.2em] text-[#00153D]/60 mb-3">Profession / Specialization</label>
                  <input 
                    name="profession"
                    value={formData.profession}
                    onChange={handleInputChange}
                    type="text" required placeholder="Entrepreneur / Architect / Business Owner" className="w-full bg-white border border-slate-200 rounded-xl py-4 px-6 focus:ring-2 focus:ring-[#A0813D]/20 focus:border-[#A0813D] transition-all outline-none font-semibold text-slate-700 placeholder:text-slate-300" 
                  />
                </div>
                <div className="md:col-span-2 pt-4">
                  <button 
                    type="submit"
                    disabled={submitting}
                    className="bg-[#00153D] hover:bg-[#8B6D31] text-white px-10 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all flex items-center justify-center gap-3 w-full sm:w-auto shadow-[0_15px_30px_-10px_rgba(0,21,61,0.3)] hover:shadow-[0_15px_30px_-10px_rgba(160,129,61,0.3)] border border-white/10 active:scale-95 disabled:opacity-50"
                  >
                    {submitting ? 'Sending...' : 'Submit Application'} <CheckCircle2 size={16} />
                  </button>
                </div>
              </form>
            </div>
            
            <div className="bg-[#00153D] rounded-[40px] p-10 text-white flex flex-col justify-between shadow-2xl">
              <div>
                <h3 className="text-2xl font-black mb-10 uppercase tracking-tight">Next Steps</h3>
                <div className="space-y-10">
                  <div className="flex gap-6">
                    <div className="w-8 h-8 rounded-full bg-[#A0813D] flex items-center justify-center text-white font-black flex-shrink-0">1</div>
                    <div>
                      <h4 className="font-bold mb-1">Initial Screening</h4>
                      <p className="text-slate-400 text-sm">Our team will review your professional profile and eligibility criteria.</p>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <div className="w-8 h-8 rounded-full border-2 border-[#A0813D] flex items-center justify-center text-[#A0813D] font-black flex-shrink-0">2</div>
                    <div>
                      <h4 className="font-bold mb-1">Invitation to GBO</h4>
                      <p className="text-slate-400 text-sm">Attend a General Body Orientation to understand JCI values and structure.</p>
                    </div>
                  </div>
                  <div className="flex gap-6 text-slate-500">
                    <div className="w-8 h-8 rounded-full border-2 border-slate-700 flex items-center justify-center font-black flex-shrink-0">3</div>
                    <div>
                      <h4 className="font-bold mb-1">Induction Ceremony</h4>
                      <p className="text-slate-400 text-sm">Official swearing-in during our monthly flagship event.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-12 bg-white/5 rounded-2xl p-6 border border-white/10 italic">
                <p className="text-slate-400 text-sm mb-4">
                  "Joining JCI Madurai Central was the single best decision for my professional growth."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-700 overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop" alt="Member" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest text-[#A0813D]">— Past President</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Display Section */}
      <section className="py-24 bg-[#F8F9FA]">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
           <div className="relative rounded-[40px] overflow-hidden bg-[#00153D] text-white p-12 lg:p-24 shadow-2xl">
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
               <div className="relative z-10">
                 <h2 className="text-5xl lg:text-7xl font-black mb-8 leading-[0.9] tracking-tighter">
                   Not just a <br /> member, <span className="text-[#A0813D]">a leader.</span>
                 </h2>
                 <p className="text-lg text-slate-400 mb-10 leading-relaxed max-w-lg">
                   Our members lead international projects, manage massive community budgets, and represent India at global summits. Are you ready for the world stage?
                 </p>
                 <button className="text-[#A0813D] font-bold border-b-2 border-[#A0813D] pb-1 hover:gap-3 transition-all flex items-center gap-2">
                   Explore our Impact <ChevronRight size={18} />
                 </button>
               </div>
               <div className="relative h-[300px] lg:h-[400px] w-full group">
                 <div className="absolute inset-0 border-2 border-[#A0813D] rounded-3xl -translate-x-6 translate-y-6" />
                 <img 
                   src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070&auto=format&fit=crop" 
                   alt="Leaders" 
                   className="w-full h-full object-cover rounded-3xl relative z-10 grayscale hover:grayscale-0 transition-all duration-700 shadow-2xl" 
                 />
               </div>
             </div>
           </div>
        </div>
      </section>
    </div>
  )
}
