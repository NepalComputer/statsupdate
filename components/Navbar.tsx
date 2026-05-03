// components/Navbar.tsx
'use client'

import Link from 'next/link'
import { Search, Menu as MenuIcon, X } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import { Logo } from './Logo'

const categories = [
  { label: 'Sports', value: 'sports' },
  { label: 'Technology', value: 'tech' },
  { label: 'Pop Culture', value: 'pop-culture' },
  { label: 'Games', value: 'games', isStatic: true },
]

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-700 ${
          scrolled ? 'bg-white/95 backdrop-blur-xl h-16 border-b border-slate-100 shadow-premium' : 'bg-white h-20'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-full">
          <div className="flex items-center justify-between h-full">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <Logo className="w-10 h-10" />
              <span className="text-2xl font-heading font-black text-slate-900 tracking-tighter uppercase italic">
                StatsUpdate
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-10">
              {categories.map((cat) => (
                <Link
                  key={cat.value}
                  href={cat.isStatic ? `/${cat.value}` : `/category/${cat.value}`}
                  className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 transition-colors relative group py-2"
                >
                  {cat.label}
                  <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-indigo-600 transition-all duration-500 group-hover:w-full" />
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-5">
              <Link href="/search" className="text-slate-400 hover:text-slate-900 transition-colors">
                 <Search className="w-5 h-5" />
              </Link>
              
              {/* Mobile Menu Toggle */}
              <button 
                className="lg:hidden p-2 text-slate-900"
                onClick={() => setMobileMenuOpen(true)}
              >
                <MenuIcon className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="right" className="w-full sm:w-[400px] bg-slate-950 p-0 border-none">
          <div className="flex flex-col h-full text-white p-12">
             <div className="flex justify-between items-center mb-24">
                <span className="text-xl font-black italic tracking-tighter uppercase">StatsUpdate</span>
                <button onClick={() => setMobileMenuOpen(false)}>
                  <X className="w-8 h-8 text-slate-400 hover:text-white transition-colors" />
                </button>
             </div>
             <nav className="space-y-6">
               {categories.map((cat) => (
                 <Link
                   key={cat.value}
                   href={cat.isStatic ? `/${cat.value}` : `/category/${cat.value}`}
                   className="block text-4xl font-heading font-black uppercase tracking-tight hover:italic hover:text-indigo-400 transition-all"
                   onClick={() => setMobileMenuOpen(false)}
                 >
                   {cat.label}
                 </Link>
               ))}
             </nav>
             <div className="mt-auto pt-12 border-t border-white/5 space-y-4">
                <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Inquiries</p>
                <p className="text-xl font-medium">hello@statsupdate.com</p>
             </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}

export default Navbar