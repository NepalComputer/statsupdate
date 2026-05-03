import { ArrowRight, PenTool, TrendingUp, Zap } from 'lucide-react'
import Link from 'next/link'

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-indigo-600 selection:text-white">
      <div className="max-w-4xl mx-auto px-6 py-32">
        <div className="space-y-12">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <span className="w-12 h-[1px] bg-indigo-600" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-600">Join the Collective</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-heading font-black tracking-tighter text-slate-900 leading-[0.95]">
              WRITE THE <br />
              <span className="text-slate-400">FUTURE.</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-500 font-medium max-w-2xl leading-relaxed">
              We are expanding our editorial team. StatsUpdate is looking for specialized voices in Technology and Sports analytics.
            </p>
          </div>

          <div className="grid gap-8 pt-12">
            {[
              {
                role: 'Technical Content Writer',
                type: 'Contract / Remote',
                focus: 'AI Agents, LLMs, Developer Tools, Emerging Tech',
                icon: Zap,
                color: 'text-indigo-600 bg-indigo-50'
              },
              {
                role: 'Sports Data Journalist',
                type: 'Contract / Remote',
                focus: 'Global Football, Cricket Analytics, Performance Stats',
                icon: TrendingUp,
                color: 'text-emerald-600 bg-emerald-50'
              }
            ].map((job) => (
              <div key={job.role} className="p-10 border border-slate-100 rounded-3xl bg-slate-50 space-y-6 group hover:border-indigo-600 transition-all">
                <div className="flex justify-between items-start">
                  <div className={`w-14 h-14 rounded-2xl ${job.color} flex items-center justify-center`}>
                    <job.icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{job.type}</span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-slate-900">{job.role}</h3>
                  <p className="text-sm font-medium text-slate-500">Focus: {job.focus}</p>
                </div>
                <Link href="/contact" className="inline-flex items-center gap-3 text-xs font-black uppercase tracking-widest text-indigo-600 group-hover:gap-5 transition-all">
                  Apply Now <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>

          <div className="pt-24 border-t border-slate-100">
             <div className="bg-slate-950 rounded-[40px] p-16 text-center space-y-8 text-white relative overflow-hidden">
                <div className="absolute inset-0 noise-bg opacity-10" />
                <h2 className="text-4xl font-heading font-black tracking-tight relative z-10">Don't see your niche?</h2>
                <p className="text-slate-400 max-w-lg mx-auto font-medium relative z-10">We're always looking for brilliant minds in pop culture and gaming. Send us your portfolio.</p>
                <Link href="mailto:royal9gorkhali@gmail.com" className="inline-block px-12 py-5 bg-white text-slate-950 rounded-full text-xs font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all relative z-10">
                  General Inquiry
                </Link>
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}
