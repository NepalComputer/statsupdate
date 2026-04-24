// components/Footer.tsx
import Link from 'next/link'
import { Rss, TrendingUp, ArrowRight } from 'lucide-react'

const categories = [
  { label: 'Sports', value: 'sports' },
  { label: 'Politics', value: 'politics' },
  { label: 'Pop Culture', value: 'pop-culture' },
  { label: 'Games', value: 'games', isStatic: true },
]

const company = [
  { label: 'About Us', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'Careers', href: '/careers' },
  { label: 'Advertise', href: '/advertise' },
]

const legal = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Cookie Policy', href: '/cookies' },
  { label: 'Accessibility', href: '/accessibility' },
]

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gradient-to-br from-slate-50 to-slate-100 border-t border-slate-200/50 text-slate-800">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-16">
          {/* Brand */}
          <div className="lg:col-span-4">
            <Link href="/" className="inline-flex items-center gap-3 mb-6 group">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center rounded-2xl shadow-xl shadow-indigo-500/25 group-hover:shadow-indigo-500/40 group-hover:scale-110 transition-all duration-300">
                <TrendingUp className="w-6 h-6" />
              </div>
              <span className="text-2xl font-heading font-bold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors duration-300">
                StatsUpdate
              </span>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed mb-6 max-w-xs">
              Your trusted source for breaking news, in-depth analysis, and stories that matter.
              Independent coverage of sports, politics, and pop culture.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="w-12 h-12 bg-white/80 backdrop-blur-sm hover:bg-gradient-to-br hover:from-indigo-50 hover:to-purple-50 flex items-center justify-center rounded-xl shadow-lg shadow-slate-900/10 hover:shadow-indigo-500/20 transition-all duration-300 hover:scale-110 group">
                <svg className="w-5 h-5 text-slate-600 group-hover:text-indigo-600" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="#" className="w-12 h-12 bg-white/80 backdrop-blur-sm hover:bg-gradient-to-br hover:from-indigo-50 hover:to-purple-50 flex items-center justify-center rounded-xl shadow-lg shadow-slate-900/10 hover:shadow-indigo-500/20 transition-all duration-300 hover:scale-110 group">
                <svg className="w-5 h-5 text-slate-600 group-hover:text-indigo-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
              </a>
              <a href="#" className="w-12 h-12 bg-white/80 backdrop-blur-sm hover:bg-gradient-to-br hover:from-indigo-50 hover:to-purple-50 flex items-center justify-center rounded-xl shadow-lg shadow-slate-900/10 hover:shadow-indigo-500/20 transition-all duration-300 hover:scale-110 group">
                <svg className="w-5 h-5 text-slate-600 group-hover:text-indigo-600" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
              <a href="#" className="w-12 h-12 bg-white/80 backdrop-blur-sm hover:bg-gradient-to-br hover:from-indigo-50 hover:to-purple-50 flex items-center justify-center rounded-xl shadow-lg shadow-slate-900/10 hover:shadow-indigo-500/20 transition-all duration-300 hover:scale-110 group">
                <svg className="w-5 h-5 text-slate-600 group-hover:text-indigo-600" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
              </a>
            </div>
          </div>

           {/* Categories */}
          <div className="lg:col-span-2">
            <h4 className="font-heading font-bold mb-6 text-sm uppercase tracking-widest text-slate-700">Categories</h4>
            <ul className="space-y-4">
              {categories.map((cat) => (
                <li key={cat.value}>
                  <Link
                    href={cat.isStatic ? `/${cat.value}` : `/category/${cat.value}`}
                    className="text-slate-600 text-sm hover:text-indigo-600 hover:translate-x-2 inline-block transition-all duration-300 relative before:absolute before:bottom-0 before:left-0 before:w-0 before:h-0.5 before:bg-gradient-to-r before:from-indigo-500 before:to-purple-600 before:transition-all before:duration-300 hover:before:w-full"
                  >
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="lg:col-span-2">
            <h4 className="font-heading font-bold mb-6 text-sm uppercase tracking-widest text-slate-700">Company</h4>
            <ul className="space-y-4">
              {company.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-slate-600 text-sm hover:text-indigo-600 hover:translate-x-2 inline-block transition-all duration-300 relative before:absolute before:bottom-0 before:left-0 before:w-0 before:h-0.5 before:bg-gradient-to-r before:from-indigo-500 before:to-purple-600 before:transition-all before:duration-300 hover:before:w-full"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

           {/* Newsletter */}
          <div className="lg:col-span-4">
            <h4 className="font-heading font-bold mb-6 text-sm uppercase tracking-widest text-slate-700">Stay Updated</h4>
            <p className="text-slate-600 text-sm mb-5">Get the latest stories in your inbox.</p>
            <form className="flex gap-3 mb-4">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-5 py-3.5 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
              />
              <button
                type="submit"
                className="px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-300 hover:scale-105"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
            <p className="text-xs text-slate-500">No spam. Unsubscribe anytime.</p>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-16 pt-8 border-t border-slate-200/50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500">
              <p>© {currentYear} StatsUpdate. All rights reserved.</p>
              <Link href="/rss" className="flex items-center gap-1.5 hover:text-slate-700 transition-colors duration-300">
                <Rss className="w-4 h-4" />
                RSS Feed
              </Link>
              <Link href="/sitemap" className="hover:text-slate-700 transition-colors duration-300">
                Sitemap
              </Link>
            </div>
            <div className="flex items-center gap-4">
              {legal.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-xs text-slate-500 hover:text-slate-700 transition-colors duration-300"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}