import Link from 'next/link'
import { ArrowRight, Cpu, Trophy, Music, Gamepad2 } from 'lucide-react'

const categories = [
  { 
    label: 'Technology', 
    slug: 'tech', 
    desc: 'AI, Agentic Coding, and the future of Silicon Valley.',
    icon: Cpu,
    color: 'bg-indigo-50 text-indigo-600'
  },
  { 
    label: 'Sports', 
    slug: 'sports', 
    desc: 'Deep dives into global analytics, football, and cricket.',
    icon: Trophy,
    color: 'bg-emerald-50 text-emerald-600'
  },
  { 
    label: 'Pop Culture', 
    slug: 'pop-culture', 
    desc: 'The intersection of entertainment, data, and social trends.',
    icon: Music,
    color: 'bg-rose-50 text-rose-600'
  },
  { 
    label: 'Games', 
    slug: 'games', 
    desc: 'Competitive multiplayer arenas and the gaming economy.',
    icon: Gamepad2,
    color: 'bg-amber-50 text-amber-600'
  }
]

export default function CategoryIndexPage() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-indigo-600 selection:text-white">
      <div className="max-w-7xl mx-auto px-6 py-32">
        <div className="space-y-16">
          <div className="max-w-3xl space-y-8">
            <div className="flex items-center gap-4">
              <span className="w-12 h-[1px] bg-slate-900" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-900">Taxonomy</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-heading font-black tracking-tighter text-slate-900 leading-[0.95] uppercase italic">
              EXPLORE OUR <br />
              <span className="text-slate-400">CHANNELS.</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-500 font-medium max-w-2xl leading-relaxed">
              Select a vertical to dive into our curated editorial streams and real-time data analytics.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {categories.map((cat) => (
              <Link 
                key={cat.slug} 
                href={cat.slug === 'games' ? '/games' : `/category/${cat.slug}`}
                className="group p-12 bg-slate-50 rounded-[40px] border border-slate-100 hover:border-slate-900 transition-all duration-500 hover:shadow-premium"
              >
                <div className="flex flex-col h-full justify-between space-y-12">
                   <div className="flex justify-between items-start">
                      <div className={`w-16 h-16 rounded-2xl ${cat.color} flex items-center justify-center`}>
                        <cat.icon className="w-8 h-8" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">Channel 0{categories.indexOf(cat) + 1}</span>
                   </div>
                   <div className="space-y-4">
                      <h2 className="text-4xl font-heading font-black tracking-tight text-slate-900 uppercase italic group-hover:text-indigo-600 transition-colors">
                        {cat.label}
                      </h2>
                      <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-sm">
                        {cat.desc}
                      </p>
                   </div>
                   <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-slate-900 group-hover:gap-6 transition-all">
                      <span>Enter Channel</span>
                      <ArrowRight className="w-4 h-4" />
                   </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
