import React from 'react'
import { Link } from 'react-router-dom'
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-jci-black pb-10 pt-24 text-white font-jakarta">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        <div className="grid grid-cols-1 gap-16 pb-16 lg:grid-cols-12 border-b border-white/10">
          
          {/* Brand & Description */}
          <div className="lg:col-span-4">
            <h3 className="mb-8 text-3xl font-black tracking-tighter text-white">JCI Madurai Central</h3>
            <p className="mb-10 text-slate-400 leading-relaxed font-medium">
              JCI India is the largest youth organization providing leadership and development opportunities for youngsters within the age of 18 to 40.
            </p>
            <div className="flex gap-4">
              {[
                { Icon: Facebook, url: 'https://www.facebook.com/JCIMaduraiCentral23' },
                { Icon: Instagram, url: 'https://www.instagram.com/jcimaduraicentral' },
                { Icon: Twitter, url: '#' },
                { Icon: Linkedin, url: '#' }
              ].map((item, i) => (
                <a key={i} href={item.url} target="_blank" rel="noopener noreferrer" className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 border border-white/10 transition hover:bg-jci-blue hover:border-jci-blue">
                  <item.Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links 1 */}
          <div className="lg:col-span-2">
            <h4 className="mb-8 text-sm font-black uppercase tracking-[0.2em] text-jci-blue">Quick Links</h4>
            <ul className="space-y-4 text-sm text-slate-400 font-bold">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/about/jci" className="hover:text-white transition-colors">About JCI</Link></li>
              <li><Link to="/about/creed" className="hover:text-white transition-colors">JCI Creed</Link></li>
              {/* <li><Link to="/about" className="hover:text-white transition-colors">About JCI India</Link></li> */}
              <li><Link to="/membership" className="hover:text-white transition-colors">Benefits for Members</Link></li>
              <li><Link to="/membership" className="hover:text-white transition-colors">Join JCI Madurai Central</Link></li>
            </ul>
          </div>

          {/* Quick links 2 */}
          <div className="lg:col-span-2">
            <h4 className="mb-8 text-sm font-black uppercase tracking-[0.2em] text-jci-blue">Resources</h4>
            <ul className="space-y-4 text-sm text-slate-400 font-bold">
              <li><Link to="/about" className="hover:text-white transition-colors">TOYP Information</Link></li>
              <li><Link to="/vertical" className="hover:text-white transition-colors">Verticals</Link></li>
              <li><Link to="/check-membership" className="hover:text-white transition-colors">Validate Membership</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Member Login</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Return and Refund Policy</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-4">
            <h4 className="mb-8 text-sm font-black uppercase tracking-[0.2em] text-jci-blue">Contact Info</h4>
            <div className="space-y-6 text-slate-400 font-medium">
              <div className="flex gap-4">
                <MapPin className="shrink-0 text-jci-blue" size={20} />
                <p className="text-sm">4691, Villapuram Housing Board, Jaihindpuram Main Road, Madurai, Tamil Nadu 625011</p>
              </div>
              <div className="flex items-center gap-4">
                <Phone className="shrink-0 text-jci-blue" size={20} />
                <a href="tel:+919943364066" className="text-sm hover:text-white transition-colors">+91-9943364066</a>
              </div>
              <div className="flex items-center gap-4">
                <Mail className="shrink-0 text-jci-blue" size={20} />
                <a href="mailto:maduraicentraljci@gmail.com" className="text-sm hover:text-white transition-colors">maduraicentraljci@gmail.com</a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-slate-500 font-bold">© Copyright 2026, All Rights Reserved by JCI Madurai Central</p>
          <div className="flex gap-8">
             <Link to="#" className="text-[10px] uppercase font-black tracking-widest text-slate-600 hover:text-white transition-colors">Designed with Excellence</Link>
             {/* <Link to="#" className="text-[10px] uppercase font-black tracking-widest text-slate-600 hover:text-white transition-colors">Sitemap</Link> */}
          </div>
        </div>
      </div>
    </footer>
  )
}
