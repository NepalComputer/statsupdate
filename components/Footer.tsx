// components/Footer.tsx
import Link from 'next/link'
import { X, Rss, Globe, Share2, ExternalLink } from 'lucide-react'

const categories = [
  { label: 'Sports', value: 'sports' },
  { label: 'Politics', value: 'politics' },
  { label: 'Pop Culture', value: 'pop-culture' },
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
    <footer className="bg-news-dark text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Brand */}
          <div className="lg:col-span-4">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-news-accent flex items-center justify-center">
                <span className="text-xl font-bold">S</span>
              </div>
              <span className="text-2xl font-heading font-bold">
                StatsUpdate
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-xs">
              Your trusted source for breaking news, in-depth analysis, and stories that matter. 
              Independent coverage of sports, politics, and pop culture.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="w-9 h-9 bg-white/10 rounded flex items-center justify-center hover:bg-news-accent transition-colors">
                <X className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 bg-white/10 rounded flex items-center justify-center hover:bg-news-accent transition-colors">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 bg-white/10 rounded flex items-center justify-center hover:bg-news-accent transition-colors">
                <Share2 className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 bg-white/10 rounded flex items-center justify-center hover:bg-news-accent transition-colors">
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div className="lg:col-span-2">
            <h4 className="font-heading font-bold mb-4">Categories</h4>
            <ul className="space-y-3">
              {categories.map((cat) => (
                <li key={cat.value}>
                  <Link 
                    href={`/category/${cat.value}`}
                    className="text-gray-400 text-sm hover:text-white transition-colors"
                  >
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="lg:col-span-2">
            <h4 className="font-heading font-bold mb-4">Company</h4>
            <ul className="space-y-3">
              {company.map((item) => (
                <li key={item.label}>
                  <Link 
                    href={item.href}
                    className="text-gray-400 text-sm hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Newsletter */}
          <div className="lg:col-span-4">
            <h4 className="font-heading font-bold mb-4">Legal</h4>
            <ul className="space-y-3 mb-8">
              {legal.map((item) => (
                <li key={item.label}>
                  <Link 
                    href={item.href}
                    className="text-gray-400 text-sm hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Newsletter */}
            <h4 className="font-heading font-bold mb-3">Newsletter</h4>
            <p className="text-gray-400 text-xs mb-3">Get the latest stories in your inbox.</p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-3 py-2 bg-white/10 border border-gray-700 rounded text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-white"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-news-accent hover:bg-news-accent-hover text-white text-sm font-medium rounded transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">
              © {currentYear} StatsUpdate. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <Link href="/rss" className="flex items-center gap-1.5 hover:text-white transition-colors">
                <Rss className="w-4 h-4" />
                RSS Feed
              </Link>
              <Link href="/sitemap" className="hover:text-white transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}