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
  { label: 'Games', value: 'games', isStatic: true },
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
        className={`sticky top-0 z-50 transition-all duration-500 ${
          scrolled ? 'glass shadow-2xl shadow-indigo-500/10 h-16' : 'bg-white/80 backdrop-blur-xl h-20'
        } border-b border-white/50`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-full">
          <div className="flex items-center h-full">
            {/* Mobile Menu */}
            <div className="md:hidden">
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-slate-900 hover:bg-indigo-50 rounded-xl">
                    <MenuIcon className="w-6 h-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[320px] p-0 border-none glass-morphism text-white">
                  <div className="flex flex-col h-full">
                    <div className="p-8 border-b border-white/10 flex items-center justify-between">
                      <Link href="/" className="text-2xl font-heading font-bold" onClick={() => setMobileMenuOpen(false)}>
                        StatsUpdate
                      </Link>
                      <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)} className="text-white hover:bg-white/10">
                        <X className="w-6 h-6" />
                      </Button>
                    </div>
                    <nav className="flex flex-col p-8 gap-4">
                      {categories.map((cat) => (
                        <Link
                          key={cat.value}
                          href={cat.isStatic ? `/${cat.value}` : `/category/${cat.value}`}
                          className="block px-6 py-4 rounded-2xl text-lg font-medium hover:bg-white/10 transition-all duration-300 hover:translate-x-3"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {cat.label}
                        </Link>
                      ))}
                    </nav>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group mr-12">
              <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[12px] shadow-lg shadow-indigo-500/25 group-hover:shadow-indigo-500/40 transition-all duration-500 group-hover:rotate-12 group-hover:scale-110">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-heading font-black text-slate-900 group-hover:text-indigo-600 transition-colors duration-300 tracking-tighter">
                StatsUpdate
              </span>
            </Link>

            {/* Desktop Navigation - Centered */}
            <nav className="hidden md:flex md:flex-1 md:justify-center md:items-center md:space-x-10">
              {categories.map((cat) => (
                <Link
                  key={cat.value}
                  href={cat.isStatic ? `/${cat.value}` : `/category/${cat.value}`}
                  className="relative text-[15px] font-bold text-slate-500 hover:text-indigo-600 transition-all duration-300 group"
                >
                  {cat.label}
                  <span className="absolute -bottom-2 left-0 w-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-300 group-hover:w-full rounded-full" />
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <Link href="/search">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all duration-300 hover:scale-110"
                >
                  <Search className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/newsletter" className="hidden sm:block">
                <Button
                  className="text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-8 py-3 rounded-2xl shadow-xl shadow-indigo-500/20 transition-all duration-500 hover:scale-105 hover:shadow-indigo-500/40"
                >
                  Join News
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