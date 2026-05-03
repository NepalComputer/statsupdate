import { client } from '@/sanity/client'
import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/lib/sanity'
import { Calendar, Clock, Star, Quote, ChevronRight, TrendingUp, Zap, Trophy, BrainCircuit, Gamepad2, ArrowRight } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface Post {
  _id: string
  title: string
  slug: { current: string }
  category: string
  excerpt?: string
  featuredImage?: any
  publishedAt: string
  readTime?: number
}

async function getPosts(): Promise<Post[]> {
  const query = `*[_type == "post"] | order(_createdAt desc) [0...6] {
    _id,
    title,
    slug,
    category,
    excerpt,
    featuredImage,
    publishedAt,
    _createdAt,
    "readTime": length(body) / 5
  }`

  return client.fetch(query, {}, {
    next: { revalidate: 60 },
  })
}

function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    sports: 'Sports',
    tech: 'Technology',
    'pop-culture': 'Pop Culture',
  }
  return labels[category] || category
}

export default async function Home() {
  const posts = await getPosts()
  const featuredPost = posts[0]
  const latestPosts = posts.slice(1, 5)

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-indigo-600 selection:text-white">
      {/* Refined Editorial Hero Section */}
      <section className="relative pt-24 pb-32 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col gap-16">
            <div className="max-w-4xl space-y-8 animate-fadeIn">
              <div className="flex items-center gap-4">
                <span className="w-12 h-[1px] bg-indigo-600" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-600">Established 2024</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-heading font-black tracking-tighter text-slate-900 leading-[0.95]">
                REFINE YOUR <br />
                <span className="text-slate-400">PERSPECTIVE.</span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-500 font-medium max-w-2xl leading-relaxed">
                A curated intersection of high-fidelity data, emerging technology, and global culture.
              </p>
            </div>

            <div className="grid lg:grid-cols-12 gap-12 items-start">
              <div className="lg:col-span-8 group relative overflow-hidden rounded-2xl shadow-premium hover:shadow-hover transition-all duration-700">
                <Link href={featuredPost ? `/${featuredPost.slug.current}` : '#'}>
                  <div className="aspect-[16/9] relative overflow-hidden bg-slate-50">
                    {featuredPost?.featuredImage && (
                      <Image
                        src={urlFor(featuredPost.featuredImage).width(1200).height(675).url()}
                        alt={featuredPost.title}
                        fill
                        priority
                        className="object-cover group-hover:scale-105 transition-transform duration-1000"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-12 text-white">
                    <div className="max-w-2xl space-y-4">
                       <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">Top Story Today</p>
                       <h2 className="text-3xl md:text-5xl font-heading font-black leading-tight group-hover:text-indigo-300 transition-colors">
                         {featuredPost?.title}
                       </h2>
                    </div>
                  </div>
                </Link>
              </div>

              <div className="lg:col-span-4 space-y-12">
                <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100 space-y-8">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Discover More</h3>
                  <div className="grid gap-6">
                    {[
                      { label: 'Technology', href: '/category/tech', desc: 'AI, Agents, and the Future.' },
                      { label: 'Sports', href: '/category/sports', desc: 'Global stats and analytics.' },
                      { label: 'Pop Culture', href: '/category/pop-culture', desc: 'The pulse of entertainment.' },
                      { label: 'Games', href: '/games', desc: 'Competitive multiplayer arena.' }
                    ].map((item) => (
                      <Link key={item.label} href={item.href} className="group/item">
                        <h4 className="text-sm font-black uppercase tracking-widest group-hover/item:text-indigo-600 transition-colors">{item.label}</h4>
                        <p className="text-xs text-slate-500 font-medium mt-1">{item.desc}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Toned Down Arena Section */}
      <section className="bg-slate-950 text-white py-32 overflow-hidden relative">
        <div className="absolute inset-0 noise-bg opacity-5" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-20">
            <div className="space-y-4 text-center md:text-left">
              <h2 className="text-5xl font-heading font-black tracking-tight">The Arena.</h2>
              <p className="text-slate-400 font-medium">Competitive environments for the modern mind.</p>
            </div>
            <Link href="/games" className="px-8 py-3 bg-white/10 hover:bg-white/20 rounded-full text-xs font-black uppercase tracking-widest transition-all">
              Launch Arena
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
             {[
              { 
                title: 'WORD CHAIN', 
                href: '/games/word-chain', 
                desc: 'Competitive linguistics at scale.',
                color: 'bg-white text-slate-950'
              },
              { 
                title: 'NPAT ARENA', 
                href: '/games/npat', 
                desc: 'Real-time entity discovery engine.',
                color: 'bg-slate-900 text-white border border-white/5'
              }
             ].map((game, i) => (
               <Link key={i} href={game.href} className={`p-12 rounded-2xl group transition-all ${game.color} hover:scale-[1.02]`}>
                  <div className="flex flex-col h-full space-y-12">
                    <div className="flex justify-between items-start">
                      <div className="w-12 h-12 rounded-xl bg-indigo-600/10 flex items-center justify-center text-indigo-500">
                         <Zap className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Live Multiplayer</span>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-3xl font-heading font-black tracking-tighter uppercase">{game.title}</h3>
                      <p className="text-sm font-medium opacity-60 tracking-wide">{game.desc}</p>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest group-hover:gap-6 transition-all">
                       <span>Connect</span>
                       <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
               </Link>
             ))}
          </div>
        </div>
      </section>

      {/* Streamlined Content Stream */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-20">
            <h2 className="text-4xl font-heading font-black tracking-tight text-slate-900 uppercase">Latest Insights</h2>
            <Link href="/category" className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-black transition-colors">
              Explore All
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {latestPosts.map((post) => (
              <article key={post._id} className="group flex flex-col space-y-6">
                <Link href={`/${post.slug.current}`} className="block overflow-hidden rounded-2xl bg-slate-50 aspect-[4/5] relative shadow-sm group-hover:shadow-premium transition-all duration-500">
                  {post.featuredImage && (
                    <Image
                      src={urlFor(post.featuredImage).width(600).height(750).url()}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  )}
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-white/90 backdrop-blur-md text-slate-950 border-none rounded-lg px-3 py-1 font-black uppercase text-[8px] tracking-widest shadow-sm">
                      {getCategoryLabel(post.category)}
                    </Badge>
                  </div>
                </Link>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <span>{new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full" />
                    <span>{Math.ceil(post.readTime || 5)} MIN READ</span>
                  </div>
                  <Link href={`/${post.slug.current}`}>
                    <h3 className="text-xl font-heading font-black leading-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {post.title}
                    </h3>
                  </Link>
                  <p className="text-sm font-medium text-slate-500 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Subtler Quiz Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-5 space-y-6">
               <h2 className="text-4xl font-heading font-black tracking-tight text-slate-900">Brain Trust.</h2>
               <p className="text-lg font-medium text-slate-600 leading-relaxed">Engage with meticulously crafted challenges designed for the high-IQ community.</p>
               <Link href="/quizzes" className="inline-flex items-center gap-4 px-8 py-3 bg-white rounded-full shadow-sm text-xs font-black uppercase tracking-widest border border-slate-100 hover:shadow-premium transition-all">
                 Launch Hub <ArrowRight className="w-4 h-4" />
               </Link>
            </div>
            <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-4">
               {[
                { label: 'Cricket IQ', icon: '🏏' },
                { label: 'Movie Buff', icon: '🎬' },
                { label: 'Tech Titan', icon: '💻' },
                { label: 'History', icon: '🌍' },
              ].map((q, i) => (
                <Link key={i} href="/quizzes" className="bg-white p-8 rounded-2xl border border-slate-100 flex flex-col items-center justify-center space-y-4 hover:-translate-y-1 transition-all group">
                   <span className="text-3xl grayscale group-hover:grayscale-0 transition-all">{q.icon}</span>
                   <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-900 transition-colors">{q.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-none border border-black px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}>
      {children}
    </span>
  )
}