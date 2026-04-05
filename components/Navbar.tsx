// components/Navbar.tsx
'use client'

import Link from 'next/link'
import { Menu, Search, TrendingUp, Menu as MenuIcon } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'

const categories = [
  { label: 'Sports', value: 'sports', color: 'text-orange-600' },
  { label: 'Politics', value: 'politics', color: 'text-red-600' },
  { label: 'Pop Culture', value: 'pop-culture', color: 'text-purple-600' },
]

function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      {/* Top Bar */}
      <div className="hidden md:block bg-news-dark text-white text-xs py-2">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-gray-400">Friday, April 4, 2026</span>
            <span className="text-gray-600">|</span>
            <span className="text-gray-300">New York 72°F</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/about" className="hover:text-white text-gray-400 transition-colors">About</Link>
            <Link href="/contact" className="hover:text-white text-gray-400 transition-colors">Contact</Link>
            <Link href="/newsletter" className="hover:text-white text-gray-400 transition-colors">Newsletter</Link>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <header 
        className={`sticky top-0 z-50 bg-white transition-shadow duration-300 ${
          scrolled ? 'navbar-shadow' : 'border-b border-gray-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Mobile Menu */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-news-dark">
                    <MenuIcon className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px]">
                  <div className="flex flex-col gap-6 mt-8">
                    <Link href="/" className="text-2xl font-heading font-bold text-news-dark">
                      StatsUpdate
                    </Link>
                    <nav className="flex flex-col gap-4 text-base">
                      {categories.map((cat) => (
                        <Link
                          key={cat.value}
                          href={`/category/${cat.value}`}
                          className={`font-medium hover:${cat.color} transition-colors`}
                        >
                          {cat.label}
                        </Link>
                      ))}
                      <Link href="/search" className="font-medium hover:text-news-blue transition-colors">
                        Search
                      </Link>
                    </nav>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-news-accent flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl md:text-2xl font-heading font-bold text-news-dark tracking-tight">
                StatsUpdate
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {categories.map((cat) => (
                <Link
                  key={cat.value}
                  href={`/category/${cat.value}`}
                  className={`text-sm font-medium hover:${cat.color} transition-colors relative group`}
                >
                  {cat.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-current transition-all group-hover:w-full" />
                </Link>
              ))}
            </nav>

            {/* Search Button */}
            <div className="flex items-center gap-3">
              <Link href="/search">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-gray-500 hover:text-news-dark hover:bg-gray-100"
                >
                  <Search className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/search" className="hidden lg:block">
                <Button 
                  variant="outline" 
                  className="text-sm font-medium bg-news-dark hover:bg-news-dark/90 text-white border-news-dark"
                >
                  Subscribe
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Category Bar */}
      <div className="hidden md:block border-b border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-6 h-10 text-xs">
            <span className="text-gray-400 font-medium">TRENDING:</span>
            <Link href="/arjun-kumal-becomes-fastest-1000-runs" className="text-news-dark hover:text-news-accent transition-colors font-medium">
              Arjun Kumal fastest 1000 runs
            </Link>
            <span className="text-gray-300">|</span>
            <Link href="/election-2026" className="text-news-dark hover:text-news-accent transition-colors font-medium">
              Election 2026
            </Link>
            <span className="text-gray-300">|</span>
            <Link href="/bollywood-awards" className="text-news-dark hover:text-news-accent transition-colors font-medium">
              Bollywood Awards
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default Navbar