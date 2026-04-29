import { useState, useEffect } from 'react'
import { AlertCircle, Calendar, CheckCircle, Rocket, ShieldCheck, ChevronRight, Activity, ArrowUpRight, Megaphone, MapPin, Headset, Info } from 'lucide-react'
import { Link, useOutletContext } from 'react-router-dom'

const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const monthValues = [40, 55, 70, 85, 60, 75, 50, 90, 65, 80, 45, 70]
const AUG_INDEX = 7 // August is index 7 (0-based)

const verticalBreakdown = {
  Management: 1,
  Training: 1,
  Business: 1,
  'Community Development': 0,
  'Growth & Development': 2,
  Internationalism: 0,
  'Junior Jaycee': 1,
}

const FALLBACK_DASHBOARD_EVENTS = [
  {
    id: null,
    title: 'Regional Leadership Summit',
    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop',
    month: 'Oct',
    day: '15',
    category: 'Flagship',
    time: '10:00 AM',
    venue: 'JCI HQ',
  },
  {
    id: null,
    title: 'Impact Networking Night',
    image: 'https://images.unsplash.com/photo-1515169067868-5387ec356754?q=80&w=2070&auto=format&fit=crop',
    month: 'Oct',
    day: '22',
    category: 'Networking',
    time: '06:30 PM',
    venue: 'Grand Plaza',
  },
]

function getEventDateParts(dateValue) {
  const eventDate = dateValue ? new Date(dateValue) : null
  if (!eventDate || Number.isNaN(eventDate.getTime())) {
    return { month: 'TBD', day: '--' }
  }

  return {
    month: eventDate.toLocaleString('en-US', { month: 'short' }),
    day: String(eventDate.getDate()).padStart(2, '0'),
  }
}

function mapDashboardEvent(event) {
  const dateParts = getEventDateParts(event.date)
  return {
    id: event._id,
    title: event.eventName || 'Untitled Event',
    image: event.banner || 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop',
    month: dateParts.month,
    day: dateParts.day,
    category: event.vertical || 'Event',
    time: event.time || 'TBD',
    venue: event.venue || 'TBD',
  }
}

export default function Dashboard() {
  const { member } = useOutletContext();
  const [hoveredMonth, setHoveredMonth] = useState(null)
  const [welcomeMessage, setWelcomeMessage] = useState("Loading your updates...");
  const [bannerImage, setBannerImage] = useState("https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop");
  const [publicEvents, setPublicEvents] = useState([]);
  const [monthlyContent, setMonthlyContent] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const now = new Date();
  const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const currentMonthReport = member?.monthlyReports?.find(r => r.month === currentMonthKey);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // Fetch Welcome Message
        const welcomeRes = await fetch('/api/settings/dashboard_welcome_message', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (welcomeRes.ok) {
          const data = await welcomeRes.json();
          setWelcomeMessage(data.value);
        }

        // Fetch Banner Image
        const bannerRes = await fetch('/api/settings/dashboard_banner_image', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (bannerRes.ok) {
          const data = await bannerRes.json();
          setBannerImage(data.value);
        }
      } catch (err) {
        console.error('Error fetching settings:', err);
      }
    };

    fetchSettings();
  }, []);

  useEffect(() => {
    const fetchPublicEvents = async () => {
      try {
        const token = localStorage.getItem('token')
        const res = await fetch('/api/events', {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) return
        const data = await res.json()
        setPublicEvents(Array.isArray(data.events) ? data.events : [])
      } catch (err) {
        console.error('Error fetching public events:', err)
      }
    }

    fetchPublicEvents()
  }, [])

  const handleMonthlySubmit = async (e) => {
    e.preventDefault();
    if (!monthlyContent.trim()) return;
    
    setSubmitLoading(true);
    setSubmitError('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/member/monthly-reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: monthlyContent })
      });
      
      const data = await res.json();
      if (res.ok) {
        setSuccessMessage('Monthly report submitted successfully! Refreshing...');
        setMonthlyContent('');
        setTimeout(() => window.location.reload(), 1500);
      } else {
        setSubmitError(data.message || 'Failed to submit report');
      }
    } catch (err) {
      setSubmitError('Connection error');
    } finally {
      setSubmitLoading(false);
    }
  };

  const dashboardEvents = publicEvents.length
    ? publicEvents.slice(0, 2).map(mapDashboardEvent)
    : FALLBACK_DASHBOARD_EVENTS;

  return (
    <div className="max-w-[1200px] mx-auto pb-12">
      <div className="bg-[#00153D] rounded-[2.5rem] p-10 mb-10 relative overflow-hidden group shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-[#00153D] via-[#00153D]/80 to-transparent z-10"></div>
        <div className="absolute top-0 right-0 w-1/2 h-full z-0 opacity-40 group-hover:scale-110 transition-transform duration-1000">
           <img src={bannerImage} className="w-full h-full object-cover" alt="Banner" />
        </div>
        <div className="relative z-20 max-w-lg">
           <h1 className="text-4xl font-black text-white mb-4 tracking-tight leading-tight">Welcome back, <br/><span className="text-[#A0813D]">{member?.name || "Member"}</span></h1>
           <p className="text-slate-300 text-sm font-medium leading-relaxed mb-8">
             {welcomeMessage}
           </p>
           <div className="flex gap-4">
              <button className="bg-[#A0813D] text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-[#8B6D31] transition-all shadow-lg hover:-translate-y-0.5"
             onClick={() => window.location.href = '/portal/events'}
           >Explore Events</button>
              <button className="bg-white/10 text-white border border-white/20 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-white/20 transition-all backdrop-blur-md">View Analytics</button>
           </div>
        </div>
      </div>

      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-xl font-black text-[#00153D] tracking-tight">Overview Performance</h2>
        </div>
        <div className="flex gap-4">
          <button className="px-5 py-2.5 rounded-full border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all hover:-translate-y-0.5 shadow-sm hover:shadow-md hover:border-slate-300">
            Export Report
          </button>
          <button className="px-5 py-2.5 rounded-full bg-[#A0813D] text-sm font-bold text-white hover:bg-[#8B6D31] transition-all shadow-[0_4px_14px_rgba(160,129,61,0.3)] hover:shadow-[0_8px_20px_rgba(160,129,61,0.4)] hover:-translate-y-0.5">
            New Project
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-8">
        <div className="space-y-8">
          {/* Overview Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {/* Events — shows total count */}
            <div className="bg-white rounded-[2rem] p-7 shadow-sm border border-slate-100 flex flex-col min-h-[220px] group hover:-translate-y-1.5 hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] hover:border-[#A0813D]/20 transition-all duration-300 cursor-default overflow-hidden relative">
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br from-[#A0813D]/5 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              <Calendar strokeWidth={2.5} size={20} className="text-[#8B7355] mb-5 group-hover:scale-110 transition-transform duration-300" />
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 group-hover:text-[#00153D] transition-colors">Events</p>
              <div className="text-[34px] font-black text-[#00153D] mb-auto tracking-tight relative z-10">{publicEvents.length}</div>
              <p className="text-[11px] text-[#A0813D] font-semibold mt-1 relative z-10">Public Events Available</p>
            </div>

            {/* Projects */}
            <div className="bg-white rounded-[2rem] p-7 shadow-sm border border-slate-100 flex flex-col min-h-[220px] group hover:-translate-y-1.5 hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] hover:border-[#A0813D]/20 transition-all duration-300 cursor-default overflow-hidden relative">
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br from-emerald-500/5 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              <Rocket strokeWidth={2.5} size={20} className="text-[#8B7355] mb-5 group-hover:scale-110 transition-transform duration-300" />
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 group-hover:text-[#00153D] transition-colors">Projects</p>
              <div className="text-[34px] font-black text-[#00153D] mb-auto tracking-tight relative z-10">92%</div>
              <div className="w-full bg-slate-100 rounded-full h-[6px] mt-6 overflow-hidden relative z-10">
                 <div className="bg-[#8B7355] h-[6px] rounded-full w-[92%] relative group-hover:bg-[#A0813D] transition-colors duration-500"></div>
              </div>
            </div>

            {/* Role (was Status) */}
            <div className="bg-white rounded-[2rem] p-7 shadow-sm border border-slate-100 flex flex-col min-h-[220px] group hover:-translate-y-1.5 hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] hover:border-[#A0813D]/20 transition-all duration-300 cursor-default overflow-hidden relative">
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br from-[#A0813D]/10 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              <ShieldCheck strokeWidth={2.5} size={20} className="text-[#A0813D] mb-5 group-hover:scale-110 transition-transform duration-300" />
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2 group-hover:text-[#00153D] transition-colors">Role</p>
              <div className="flex flex-col gap-0 mb-auto relative z-10">
                 <div className="text-[22px] leading-tight font-black text-[#00153D]">{member?.membershipCategory || 'Category'}</div>
                 <div className="text-[22px] leading-tight font-black text-[#00153D]">{member?.role || 'Member'}</div>
              </div>
              <p className="text-[11px] text-[#A0813D] font-semibold mt-4 w-4/5 leading-snug relative z-10">
                 Member since {member?.joinDate ? new Date(member.joinDate).getFullYear() : '2024'}
              </p>
            </div>
          </div>

          {/* Upcoming Events */}
          <div>
            <div className="flex justify-between items-end mb-6 border-b border-slate-200 pb-4">
              <h2 className="text-lg font-bold text-[#00153D] relative after:absolute after:-bottom-[17px] after:left-0 after:w-12 after:h-1 after:bg-[#A0813D] after:rounded-full">Upcoming Events</h2>
              <button className="text-sm font-semibold text-slate-500 hover:text-[#00153D] flex items-center gap-1 transition-colors"
                onClick={() => window.location.href = '/portal/events'}
              >Explore All <ChevronRight size={14} /></button>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {dashboardEvents.map((event) => (
                <Link key={event.id || event.title} to={event.id ? `/portal/events/${event.id}` : '/portal/events'} className="bg-white rounded-[2rem] p-5 shadow-sm border border-slate-100 flex flex-col h-full group hover:shadow-md transition-shadow cursor-pointer">
                  <div className="relative rounded-2xl overflow-hidden h-40 mb-5 bg-[#00153D]">
                    <img src={event.image} className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50 group-hover:scale-105 transition-transform duration-700" alt={event.title} />
                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md rounded-xl text-center px-3 py-1.5 shadow-md border border-white/50">
                      <p className="text-[10px] font-black text-[#A0813D] uppercase tracking-wider">{event.month}</p>
                      <p className="text-xl font-black text-[#00153D] leading-none mt-0.5">{event.day}</p>
                    </div>
                    <div className="absolute bottom-4 left-4"><span className="bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">{event.category}</span></div>
                  </div>
                  <h3 className="text-lg font-bold text-[#00153D] px-2 leading-tight mb-4 group-hover:text-[#A0813D] transition-colors">{event.title}</h3>
                  <div className="flex justify-between px-2 text-[11px] text-slate-500 font-bold mb-6 tracking-wide">
                    <span className="flex items-center gap-1.5"><Calendar size={12} className="text-[#A0813D]"/> {event.time}</span>
                    <span className="flex items-center gap-1.5 whitespace-nowrap"><MapPin size={12} className="text-[#A0813D]"/> {event.venue}</span>
                  </div>
                  <button className="mt-auto w-full border border-slate-200 text-[#00153D] py-3.5 rounded-xl font-bold text-sm hover:bg-[#F5F2EA] hover:border-[#A0813D]/30 transition-colors">Secure Spot</button>
                </Link>
              ))}
            </div>
          </div>

          {/* Event Index — full 12 months with vertical breakdown tooltip */}
          <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 flex flex-col justify-between cursor-default">
            <h3 className="font-bold text-[#00153D] text-[15px] mb-6">Event Index</h3>
            <div className="flex items-end justify-between gap-1.5 h-40 px-1 mt-auto">
              {months.map((month, i) => (
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center gap-2 relative group h-[130px] justify-end"
                  onMouseEnter={() => setHoveredMonth(i)}
                  onMouseLeave={() => setHoveredMonth(null)}
                >
                  <div className="w-full bg-slate-50 rounded-xl overflow-hidden relative h-full">
                    <div
                      className={`absolute bottom-0 w-full rounded-xl transition-all duration-700 ease-out ${
                    i === AUG_INDEX
                      ? 'bg-gradient-to-t from-[#A0813D] to-[#FBC764]'
                      : 'bg-slate-200 group-hover:bg-slate-300'
                  }`}
                      style={{ height: `${monthValues[i]}%`, transitionDelay: `${i * 60}ms` }}
                    >
                      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white/20 group-hover:bg-white/40 transition-colors"></div>
                    </div>
                  </div>
                  <span className={`text-[8px] font-black uppercase tracking-widest ${
                    i === AUG_INDEX ? 'text-[#00153D]' : 'text-slate-400'
                  }`}>
                    {month}
                  </span>

                  {/* Hover Tooltip — vertical breakdown */}
                  {hoveredMonth === i && (
                    <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 bg-[#00153D] text-white rounded-xl shadow-2xl z-50 p-3 min-w-[180px]">
                      <p className="text-[9px] font-black uppercase tracking-widest text-[#FBC764] mb-2">{month} — Events</p>
                      <div className="space-y-1">
                        {Object.entries(verticalBreakdown).map(([key, val]) => (
                          <div key={key} className="flex justify-between items-center gap-4">
                            <span className="text-[10px] text-white/80 font-medium">{key}</span>
                            <span className={`text-[10px] font-black ${val > 0 ? 'text-[#FBC764]' : 'text-white/30'}`}>{val}</span>
                          </div>
                        ))}
                      </div>
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#00153D]"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Section — READ ONLY ONCE SUBMITTED */}
          <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 flex flex-col cursor-default">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-[#00153D] text-[15px]">Monthly Progress Report</h3>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                {now.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </span>
            </div>

            {currentMonthReport ? (
              <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-100 relative group overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <ShieldCheck size={40} className="text-[#A0813D]" />
                </div>
                <p className="text-[10px] font-black text-[#A0813D] uppercase tracking-widest mb-3 flex items-center gap-2">
                   <CheckCircle size={12} /> Data Locked & Verified
                </p>
                <div className="text-slate-700 text-sm leading-relaxed font-medium whitespace-pre-wrap">
                  {currentMonthReport.content}
                </div>
                <div className="mt-6 pt-4 border-t border-slate-200/60 flex justify-between items-center text-[10px] font-bold text-slate-400 italic">
                  <span>Submitted on: {new Date(currentMonthReport.submittedAt).toLocaleDateString()}</span>
                  <span className="text-[#A0813D] uppercase tracking-tighter">Read Only Mode</span>
                </div>
              </div>
            ) : (
              <form onSubmit={handleMonthlySubmit} className="space-y-4">
                <div className="relative">
                  <textarea
                    value={monthlyContent}
                    onChange={(e) => setMonthlyContent(e.target.value)}
                    placeholder="Enter your progress, achievements, or goals for this month... (Once submitted, this cannot be edited)"
                    className="w-full min-h-[140px] bg-white border border-slate-200 rounded-2xl p-5 text-sm focus:outline-none focus:ring-4 focus:ring-[#A0813D]/10 focus:border-[#A0813D] transition-all resize-none placeholder:text-slate-300 font-medium"
                  />
                  <div className="absolute bottom-4 right-4 flex items-center gap-2">
                    <span className={`text-[10px] font-bold ${monthlyContent.length > 500 ? 'text-amber-500' : 'text-slate-300'}`}>
                      {monthlyContent.length} chars
                    </span>
                  </div>
                </div>

                {submitError && (
                  <div className="flex items-center gap-2 text-red-500 text-[11px] font-bold bg-red-50 p-3 rounded-xl border border-red-100 animate-shake">
                    <AlertCircle size={14} /> {submitError}
                  </div>
                )}

                {successMessage && (
                  <div className="flex items-center gap-2 text-emerald-600 text-[11px] font-bold bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                    <CheckCircle size={14} /> {successMessage}
                  </div>
                )}

                <div className="flex items-center justify-between gap-4 pt-2">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Info size={14} />
                    <span className="text-[10px] font-medium leading-tight">Data will be visible to administrators for performance audit.</span>
                  </div>
                  <button
                    type="submit"
                    disabled={submitLoading || !monthlyContent.trim()}
                    className="bg-[#00153D] text-white px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-[#001a4d] transition-all shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:translate-y-0 shrink-0"
                  >
                    {submitLoading ? 'Submitting...' : 'Lock & Submit'}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Leadership Growth — now below Event Index */}
          <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 relative overflow-hidden flex flex-col cursor-default">
            <div className="absolute top-0 right-0 w-40 h-40 bg-[#FAF9F6] rounded-bl-[4rem] -z-0"></div>
            <h3 className="font-bold text-[#00153D] text-[15px] mb-6 relative z-10">Leadership Growth</h3>
            <div className="flex flex-col items-center justify-center relative z-10 flex-1">
              <div className="relative flex items-center justify-center filter drop-shadow-sm">
                <svg width="120" height="120" viewBox="0 0 128 128" className="-rotate-90">
                  <circle cx="64" cy="64" r="54" fill="none" stroke="#f8fafc" strokeWidth="10" />
                  <circle cx="64" cy="64" r="54" fill="none" stroke="#A0813D" strokeWidth="10" strokeDasharray="339.29" strokeDashoffset="84.82" strokeLinecap="round" className="transition-all duration-1000" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-black text-[#00153D] leading-none mt-2">75%</span>
                  <span className="text-[8px] font-bold text-slate-400 tracking-widest uppercase mt-1">Efficiency</span>
                </div>
              </div>
              <p className="text-[12px] font-medium text-slate-500 text-center mt-6 leading-relaxed">Top 5% performer in the <br/>Madurai region this quarter.</p>
            </div>
          </div>

          {/* Recent Accreditations */}
          <div>
            <div className="flex justify-between items-end mb-6 border-b border-slate-200 pb-4">
              <h2 className="text-lg font-bold text-[#00153D] relative after:absolute after:-bottom-[17px] after:left-0 after:w-12 after:h-1 after:bg-[#A0813D] after:rounded-full">Recent Accreditations</h2>
              <button className="text-[11px] font-bold text-[#8B7355] uppercase tracking-wider hover:text-[#00153D] transition-colors">Repository</button>
            </div>
            <div className="grid grid-cols-2 gap-5">
              <div className="bg-white rounded-[1.5rem] p-5 shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md hover:border-slate-200 cursor-pointer transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#FAF9F6] flex items-center justify-center text-[#A0813D] group-hover:bg-[#A0813D] group-hover:text-white transition-colors"><ShieldCheck size={20} /></div>
                  <div><h4 className="font-bold text-[14px] text-[#00153D] mb-0.5">Effective Leadership</h4><p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Cred ID: 94021</p></div>
                </div>
                <div className="w-8 h-8 rounded-full border border-slate-100 flex items-center justify-center text-slate-300 group-hover:bg-[#00153D] group-hover:text-white group-hover:border-[#00153D] transition-all"><ArrowUpRight size={14} /></div>
              </div>
              <div className="bg-white rounded-[1.5rem] p-5 shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md hover:border-slate-200 cursor-pointer transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#FAF9F6] flex items-center justify-center text-[#A0813D] group-hover:bg-[#A0813D] group-hover:text-white transition-colors"><Activity size={20} /></div>
                  <div><h4 className="font-bold text-[14px] text-[#00153D] mb-0.5">Management 101</h4><p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Cred ID: 88302</p></div>
                </div>
                <div className="w-8 h-8 rounded-full border border-slate-100 flex items-center justify-center text-slate-300 group-hover:bg-[#00153D] group-hover:text-white group-hover:border-[#00153D] transition-all"><ArrowUpRight size={14} /></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-[#00153D] via-[#00102e] to-[#000a1f] rounded-[2rem] p-8 shadow-[0_20px_50px_-20px_rgba(0,21,61,0.5)] text-white relative overflow-hidden group">
            <div className="absolute -right-10 -top-10 w-48 h-48 bg-[#A0813D]/20 rounded-full blur-3xl pointer-events-none group-hover:scale-150 group-hover:bg-[#A0813D]/30 transition-all duration-1000 ease-out"></div>
            <h3 className="font-bold text-lg mb-8 flex items-center gap-3 text-white">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/10 shadow-inner group-hover:-translate-y-1 transition-transform"><Megaphone size={18} className="text-[#FBC764]" /></div>
              <span className="tracking-wide">Latest Updates</span>
            </h3>
            <div className="space-y-6 relative z-10">
              <div className="border-l-2 border-[#FBC764] pl-5 py-1 relative">
                <span className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-[#FBC764] shadow-[0_0_8px_#FBC764] animate-pulse"></span>
                <h4 className="font-bold text-[#FBC764] mb-2 tracking-wide text-sm">Annual Convention 2024</h4>
                <p className="text-[12px] text-white/70 leading-relaxed font-medium">
                  Dates announced for the National Convention. Early bird registrations open next week.
                </p>
              </div>
              <div className="pl-[22px] py-1 border-l-2 border-transparent">
                <h4 className="font-bold text-white mb-2 tracking-wide text-sm">Membership Deadline</h4>
                <p className="text-[12px] text-white/70 leading-relaxed font-medium">
                  Membership fee deadline has been extended to Oct 30th. Kindly clear dues.
                </p>
              </div>
              <button className="w-full mt-4 py-4 rounded-xl bg-white/10 text-white text-xs font-bold transition-all hover:bg-white hover:text-[#00153D] border border-white/20 backdrop-blur-md">
                Read All Announcements
              </button>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
            <h3 className="font-bold text-[#00153D] text-[16px] mb-8">Activity Timeline</h3>
            <div className="relative border-l-[1.5px] border-slate-200 ml-4 space-y-10 pb-4">
              <div className="relative pl-8 group">
                <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full border-[3px] border-[#8B7355] bg-white ring-[5px] ring-white shadow-sm group-hover:scale-125 transition-transform duration-300"></div>
                <div className="absolute -left-[3px] top-[10px] w-1 h-1 rounded-full bg-[#8B7355] animate-ping opacity-75"></div>
                <p className="text-[10px] font-black tracking-widest text-slate-400 mb-1.5 uppercase transition-colors group-hover:text-[#8B7355]">Today, 09:45 AM</p>
                <h4 className="text-[14px] font-bold text-[#00153D] leading-tight mb-1.5 transition-colors group-hover:text-[#A0813D]">Earned Certificate for Public Speaking</h4>
                <p className="text-[12px] font-medium text-slate-500 leading-snug">Advanced module completed with distinction.</p>
              </div>
              <div className="relative pl-8 group">
                <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full border-[3px] border-slate-300 bg-white ring-[5px] ring-white shadow-sm group-hover:border-[#00153D] group-hover:scale-125 transition-all duration-300"></div>
                <p className="text-[10px] font-black tracking-widest text-slate-400 mb-1.5 uppercase transition-colors group-hover:text-[#00153D]">Yesterday</p>
                <h4 className="text-[14px] font-bold text-[#00153D] leading-tight mb-1.5 transition-colors">Joined Project: Clean City</h4>
                <p className="text-[12px] font-medium text-slate-500 leading-snug">Volunteered for the upcoming weekend drive.</p>
              </div>
              <div className="relative pl-8 group">
                <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full border-[3px] border-slate-300 bg-white ring-[5px] ring-white shadow-sm group-hover:border-[#00153D] group-hover:scale-125 transition-all duration-300"></div>
                <p className="text-[10px] font-black tracking-widest text-slate-400 mb-1.5 uppercase transition-colors group-hover:text-[#00153D]">Oct 02, 2024</p>
                <h4 className="text-[14px] font-bold text-[#00153D] leading-tight mb-1.5 transition-colors">Attended Monthly Meetup</h4>
                <p className="text-[12px] font-medium text-slate-500 leading-snug">Networked with 15 new members at the HQ.</p>
              </div>
            </div>
          </div>

          {/* Concierge Support — Connect Now → /contact */}
          <div className="bg-gradient-to-tr from-[#FAF9F6] to-white rounded-[2rem] p-8 border border-[#EBE3CD]/80 text-center shadow-[0_15px_40px_-15px_rgba(139,115,85,0.05)] cursor-default group hover:border-[#8B7355]/40 hover:-translate-y-1 transition-all">
            <div className="w-14 h-14 bg-white rounded-[1.25rem] flex items-center justify-center text-[#8B7355] mx-auto mb-5 shadow-[0_10px_30px_-10px_rgba(139,115,85,0.3)] border border-[#EBE3CD] group-hover:scale-110 group-hover:bg-[#8B7355] group-hover:text-white transition-all duration-300">
              <Headset strokeWidth={2.5} size={24} />
            </div>
            <h3 className="font-bold text-[#00153D] mb-3">Concierge Support</h3>
            <p className="text-[12px] font-medium text-slate-500 leading-relaxed mb-8 px-2">Our team is available 24/7 to assist with your membership journey.</p>
            <Link
              to="/contact"
              className="block bg-white w-full py-4 rounded-xl text-xs font-bold text-[#00153D] shadow-sm border border-slate-200 hover:bg-[#00153D] hover:text-white transition-all tracking-wide"
            >
              Connect Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
