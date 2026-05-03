'use client'

import { useState } from 'react'
import { ArrowRight, Mail, MapPin, Send } from 'lucide-react'

export default function ContactPage() {
  const [status, setStatus] = useState<'' | 'success' | 'error'>('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you'd send this to an API route
    // For now, we'll simulate a success and point to the email
    setStatus('success')
  }

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-indigo-600 selection:text-white">
      <div className="max-w-7xl mx-auto px-6 py-32">
        <div className="grid lg:grid-cols-2 gap-24 items-start">
          <div className="space-y-12">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <span className="w-12 h-[1px] bg-indigo-600" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-600">Connect with Us</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-heading font-black tracking-tighter text-slate-900 leading-[0.95]">
                GET IN <br />
                <span className="text-slate-400">TOUCH.</span>
              </h1>
              <p className="text-xl text-slate-500 font-medium max-w-md leading-relaxed">
                Whether you have a tip, a career inquiry, or just want to say hello, our team is listening.
              </p>
            </div>

            <div className="space-y-8">
               <div className="flex items-center gap-6 group">
                  <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-indigo-600 transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Direct Email</p>
                    <p className="text-lg font-bold text-slate-900">royal9gorkhali@gmail.com</p>
                  </div>
               </div>
               <div className="flex items-center gap-6 group">
                  <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-indigo-600 transition-colors">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">HQ</p>
                    <p className="text-lg font-bold text-slate-900">Kathmandu, Nepal</p>
                  </div>
               </div>
            </div>
          </div>

          <div className="bg-slate-50 p-12 rounded-[40px] border border-slate-100 shadow-premium relative overflow-hidden">
             <div className="absolute inset-0 noise-bg opacity-5" />
             {status === 'success' ? (
               <div className="text-center py-24 space-y-6 relative z-10 animate-fadeIn">
                  <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <Send className="w-8 h-8" />
                  </div>
                  <h2 className="text-3xl font-heading font-black text-slate-900">Message Received.</h2>
                  <p className="text-slate-500 font-medium">We'll get back to you within 24 hours.</p>
                  <button onClick={() => setStatus('')} className="text-xs font-black uppercase tracking-widest text-indigo-600">Send Another</button>
               </div>
             ) : (
               <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                 <div className="grid md:grid-cols-2 gap-8">
                   <div className="space-y-3">
                     <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Full Name</label>
                     <input required type="text" className="w-full bg-white border border-slate-200 rounded-xl px-6 py-4 outline-none focus:border-indigo-600 transition-colors" />
                   </div>
                   <div className="space-y-3">
                     <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email Address</label>
                     <input required type="email" className="w-full bg-white border border-slate-200 rounded-xl px-6 py-4 outline-none focus:border-indigo-600 transition-colors" />
                   </div>
                 </div>
                 <div className="space-y-3">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Subject</label>
                   <select className="w-full bg-white border border-slate-200 rounded-xl px-6 py-4 outline-none focus:border-indigo-600 transition-colors appearance-none">
                     <option>General Inquiry</option>
                     <option>Career Application</option>
                     <option>Advertising</option>
                     <option>News Tip</option>
                   </select>
                 </div>
                 <div className="space-y-3">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Message</label>
                   <textarea required rows={5} className="w-full bg-white border border-slate-200 rounded-xl px-6 py-4 outline-none focus:border-indigo-600 transition-colors resize-none" />
                 </div>
                 <button className="w-full py-5 bg-slate-950 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg flex items-center justify-center gap-3">
                   Dispatch Message <ArrowRight className="w-4 h-4" />
                 </button>
               </form>
             )}
          </div>
        </div>
      </div>
    </div>
  )
}
