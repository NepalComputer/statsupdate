import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Logo } from './Logo'

const categories = [
  { label: 'Sports', value: 'sports' },
  { label: 'Technology', value: 'tech' },
  { label: 'Pop Culture', value: 'pop-culture' },
  { label: 'Games', value: 'games', isStatic: true },
]

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 font-sans relative overflow-hidden">
      <div className="absolute inset-0 noise-bg opacity-5 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Brand */}
          <div className="lg:col-span-5 space-y-10">
            <div>
               <Link href="/" className="inline-flex items-center gap-3 group">
                <Logo className="w-12 h-12 bg-white" />
                <span className="text-3xl font-heading font-black tracking-tighter text-white uppercase italic">
                  StatsUpdate
                </span>
              </Link>
              <p className="mt-6 text-lg font-medium leading-relaxed max-w-sm text-slate-400">
                A refined digital publication at the intersection of data, tech, and global culture.
              </p>
            </div>

            <div className="flex items-center gap-6">
              {['Twitter', 'LinkedIn', 'Instagram', 'Github'].map((social) => (
                <a key={social} href="#" className="text-[10px] uppercase tracking-[0.2em] font-bold hover:text-indigo-400 transition-colors">
                  {social}
                </a>
              ))}
            </div>
          </div>

          {/* Links Grid */}
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12">
            <div className="space-y-6">
              <h4 className="text-white text-[10px] font-bold uppercase tracking-[0.3em] opacity-50">Sections</h4>
              <ul className="space-y-3">
                {categories.map((cat) => (
                  <li key={cat.value}>
                    <Link
                      href={cat.isStatic ? `/${cat.value}` : `/category/${cat.value}`}
                      className="text-sm hover:text-white transition-colors"
                    >
                      {cat.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-white text-[10px] font-bold uppercase tracking-[0.3em] opacity-50">Resources</h4>
              <ul className="space-y-3">
                {['About', 'Careers', 'Contact'].map((item) => (
                  <li key={item}>
                    <Link href={`/${item.toLowerCase()}`} className="text-sm hover:text-white transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-2 md:col-span-1 space-y-6">
              <h4 className="text-white text-[10px] font-bold uppercase tracking-[0.3em] opacity-50">Legal</h4>
              <ul className="space-y-3">
                {[
                  { label: 'Privacy Policy', path: 'privacy-policy' },
                  { label: 'Terms of Service', path: 'terms-of-service' },
                  { label: 'Cookie Policy', path: 'cookie-policy' }
                ].map((item) => (
                  <li key={item.path}>
                    <Link href={`/${item.path}`} className="text-sm hover:text-white transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-24 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-600">
          <div className="flex gap-8">
            <p>© {currentYear} STATSUPDATE INC.</p>
            <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
          <div className="flex items-center gap-3">
             <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
             <span className="text-slate-400">OPERATIONAL</span>
          </div>
        </div>
      </div>
    </footer>
  )
}