// components/Navbar.tsx
'use client'

import Link from 'next/link'
import { Search, TrendingUp, Menu as MenuIcon, X } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'

const categories = [
  { label: 'Sports', value: 'sports' },
  { label: 'Politics', value: 'politics' },
  { label: 'Pop Culture', value: 'pop-culture' },
]

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      {/* Main Navigation */}
      <header
        className={`sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 transition-all duration-500 ${
          scrolled ? 'bg-white/90 shadow-lg shadow-slate-900/5' : ''
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center h-20">
            {/* Mobile Menu */}
            <div className="md:hidden">
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-gray-900 hover:bg-gray-50">
                    <MenuIcon className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[320px] p-4">
                  <div className="flex flex-col h-full">
                    <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                      <Link href="/" className="text-xl font-heading font-bold text-gray-900" onClick={() => setMobileMenuOpen(false)}>
                        StatsUpdate
                      </Link>
                      <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
                        <X className="w-5 h-5" />
                      </Button>
                    </div>
                    <nav className="flex flex-col p-6 gap-3">
                      {categories.map((cat) => (
                        <Link
                          key={cat.value}
                          href={`/category/${cat.value}`}
                          className="block px-4 py-3 rounded-xl text-sm font-medium text-slate-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:text-indigo-700 transition-all duration-300 hover:translate-x-2"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {cat.label}
                        </Link>
                      ))}
                      <Link
                        href="/search"
                        className="block px-4 py-3 rounded-xl text-sm font-medium text-slate-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:text-indigo-700 transition-all duration-300 hover:translate-x-2"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Search
                      </Link>
                    </nav>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group mr-8">
              <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/25 group-hover:shadow-indigo-500/40 transition-all duration-300 group-hover:scale-110">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-heading font-bold text-slate-900 group-hover:text-indigo-600 transition-colors duration-300">
                StatsUpdate
              </span>
            </Link>

            {/* Desktop Navigation - Centered */}
            <nav className="hidden md:flex md:flex-1 md:justify-center md:items-center md:space-x-8">
              {categories.map((cat) => (
                <Link
                  key={cat.value}
                  href={`/category/${cat.value}`}
                  className="relative text-sm font-medium text-slate-600 hover:text-slate-900 transition-all duration-300 hover:scale-105 before:absolute before:bottom-0 before:left-0 before:w-0 before:h-0.5 before:bg-gradient-to-r before:from-indigo-500 before:to-purple-600 before:transition-all before:duration-300 hover:before:w-full"
                >
                  {cat.label}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <Link href="/search">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-slate-500 hover:text-slate-900 hover:bg-slate-100/50 backdrop-blur-sm rounded-xl transition-all duration-300 hover:scale-110"
                >
                  <Search className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/newsletter">
                <Button
                  className="text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 px-6 py-2.5 rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-300 hover:scale-105 hover:shadow-xl"
                >
                  Subscribe
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}

export default Navbar