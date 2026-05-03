import { Logo } from '@/components/Logo'
import { TrendingUp, Zap, BrainCircuit, Globe } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-indigo-600 selection:text-white">
      <div className="max-w-5xl mx-auto px-6 py-32">
        <div className="space-y-24">
          {/* Hero Section */}
          <div className="space-y-12">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <span className="w-12 h-[1px] bg-indigo-600" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-600">Our Manifesto</span>
              </div>
              <h1 className="text-6xl md:text-[8rem] font-heading font-black tracking-tighter text-slate-900 leading-[0.8] uppercase italic">
                Data With <br />
                <span className="text-slate-400">Soul.</span>
              </h1>
              <p className="text-2xl md:text-3xl text-slate-500 font-medium max-w-3xl leading-tight">
                StatsUpdate was founded on a simple premise: in an age of information overload, clarity is the ultimate luxury.
              </p>
            </div>
          </div>

          {/* Mission Grid */}
          <div className="grid md:grid-cols-2 gap-16 border-t border-slate-100 pt-24">
            <div className="space-y-8">
              <h2 className="text-3xl font-heading font-black tracking-tight text-slate-900">THE VISION.</h2>
              <p className="text-lg text-slate-600 leading-relaxed font-medium">
                We don't just report stats; we decode the narratives hidden within them. Whether it's the subtle shift in an AI agent's efficiency or the analytical depth of a championship cricket match, we provide the context that matters.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8">
               {[
                 { label: 'Precision', icon: Zap },
                 { label: 'Global Reach', icon: Globe },
                 { label: 'Integrity', icon: TrendingUp },
                 { label: 'Innovation', icon: BrainCircuit }
               ].map((item) => (
                 <div key={item.label} className="space-y-4">
                   <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-indigo-600">
                     <item.icon className="w-6 h-6" />
                   </div>
                   <p className="text-xs font-black uppercase tracking-widest text-slate-900">{item.label}</p>
                 </div>
               ))}
            </div>
          </div>

          {/* Brand Identity Section */}
          <div className="bg-slate-950 rounded-[40px] p-20 text-white relative overflow-hidden">
             <div className="absolute inset-0 noise-bg opacity-10" />
             <div className="grid lg:grid-cols-2 gap-16 items-center relative z-10">
                <div className="space-y-8">
                  <h2 className="text-5xl font-heading font-black tracking-tighter uppercase italic">The SU Mark.</h2>
                  <p className="text-slate-400 text-lg leading-relaxed">
                    Our monogram represents the architectural balance between <strong>Stats</strong> and <strong>Update</strong>. It is a symbol of our commitment to high-fidelity reporting and constant evolution.
                  </p>
                </div>
                <div className="flex justify-center">
                   <Logo className="w-48 h-48 scale-150 shadow-[0_0_100px_rgba(79,70,229,0.2)]" />
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}
