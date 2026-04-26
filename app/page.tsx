// app/page.tsx
import { client } from '@/sanity/client'
import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/lib/sanity'
import { Calendar, Clock, Star, Quote, ChevronRight, TrendingUp } from 'lucide-react'

interface Post {
  _id: string
  title: string
  slug: { current: string }
  category: string
  excerpt?: string
  featuredImage?: {
    _type: string
    asset: {
      _ref: string
      _type: string
    }
    hotspot?: {
      x: number
      y: number
      height: number
      width: number
    }
  }
  publishedAt: string
  body?: {
    _type: string
    children: Array<{
      _type: string
      text: string
      marks?: string[]
    }>
    markDefs?: Array<{
      _key: string
      _type: string
      href?: string
    }>
    style?: string
  }[]
  readTime?: number
}

async function getPosts(): Promise<Post[]> {
  const query = `*[_type == "post"] | order(publishedAt desc) [0...12] {
    _id,
    title,
    slug,
    category,
    excerpt,
    featuredImage,
    publishedAt,
    "readTime": length(body) / 5
  }`

  return client.fetch(query, {}, {
    next: { revalidate: 60 },
  })
}

function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    sports: 'Sports',
    politics: 'Politics',
    'pop-culture': 'Pop Culture',
  }
  return labels[category] || category
}

export default async function Home() {
  const posts = await getPosts()
  const featuredPost = posts[0]
  const latestPosts = posts.slice(1, 7)
  const trendingPosts = posts.slice(0, 4)
  const editorPick = posts.find(p => p.category === 'politics') || posts[0]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      {/* Breaking News Banner */}
      <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-indigo-50 border-b border-indigo-100/50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-indigo-700 uppercase tracking-wider">Breaking News</span>
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="flex space-x-8 animate-marquee">
                <Link href="#" className="text-sm text-slate-600 hover:text-indigo-700 transition-colors duration-300 whitespace-nowrap">
                  Election 2026: Latest updates from the campaign trail
                </Link>
                <Link href="#" className="text-sm text-slate-600 hover:text-indigo-700 transition-colors duration-300 whitespace-nowrap">
                  Arjun Kumal makes history with fastest 1000 runs
                </Link>
                <Link href="#" className="text-sm text-slate-600 hover:text-indigo-700 transition-colors duration-300 whitespace-nowrap">
                  Bollywood Awards 2026: Full winners list revealed
                </Link>
                <Link href="#" className="text-sm text-slate-600 hover:text-indigo-700 transition-colors duration-300 whitespace-nowrap">
                  Election 2026: Latest updates from the campaign trail
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
       {featuredPost && (
        <section className="relative pt-20 pb-16">
          <div className="max-w-7xl mx-auto px-4 lg:px-6">
            <div className="grid lg:grid-cols-[45%_55%] gap-12 items-center">
              {/* Image */}
              <div className="hidden lg:block relative">
                <div className="relative h-96 overflow-hidden rounded-3xl shadow-2xl shadow-indigo-500/10">
                  {featuredPost.featuredImage ? (
                    <Image
                      src={urlFor(featuredPost.featuredImage)
                        .width(800)
                        .height(500)
                        .auto('format')
                        .quality(90)
                        .url()}
                      alt={featuredPost.title}
                      width={800}
                      height={500}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent rounded-3xl" />
                </div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full opacity-20 animate-pulse"></div>
              </div>

              {/* Content */}
              <div className="space-y-8 animate-fadeIn">
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full animate-pulse"></div>
                  <span className="text-sm font-bold uppercase tracking-widest text-slate-600">
                    {getCategoryLabel(featuredPost.category)}
                  </span>
                </div>

                <Link href={`/${featuredPost.slug.current}`}>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-slate-900 mb-6 leading-tight hover:text-indigo-700 transition-colors duration-300">
                    {featuredPost.title}
                  </h1>
                </Link>

                {featuredPost.excerpt && (
                  <p className="text-slate-600 text-lg leading-relaxed mb-8 line-clamp-4 max-w-2xl">
                    {featuredPost.excerpt}
                  </p>
                )}

                <div className="flex items-center gap-6 text-sm text-slate-500">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <time dateTime={featuredPost.publishedAt}>
                      {new Date(featuredPost.publishedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </time>
                  </div>
                  <div className="w-px h-4 bg-slate-300" />
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{Math.ceil(featuredPost.readTime || 5)} min read</span>
                  </div>
                </div>

                <Link
                  href={`/${featuredPost.slug.current}`}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-2xl hover:from-indigo-700 hover:to-purple-700 shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-300 hover:scale-105 hover:-translate-y-1"
                >
                  Read Full Story
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Editor's Pick */}
       {editorPick && (
        <section className="py-20 bg-gradient-to-r from-slate-50 via-white to-slate-50">
          <div className="max-w-7xl mx-auto px-4 lg:px-6">
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/25 animate-pulseGlow">
                  <Star className="w-6 h-6" />
                </div>
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-slate-900">
                  Editor&apos;s Pick
                </h2>
              </div>
              <Link href="/editor-picks" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-all duration-300 hover:scale-105 flex items-center gap-2">
                View All
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Link href={`/${editorPick.slug.current}`} className="group block">
                <article className="relative overflow-hidden rounded-3xl shadow-2xl shadow-slate-900/10 hover:shadow-indigo-500/20 transition-all duration-500 group-hover:scale-105">
                  {editorPick.featuredImage && (
                    <Image
                      src={urlFor(editorPick.featuredImage)
                        .width(800)
                        .height(400)
                        .auto('format')
                        .quality(85)
                        .url()}
                      alt={editorPick.title}
                      width={800}
                      height={400}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="inline-block px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold rounded-full shadow-lg">
                      EDITOR&apos;S PICK
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <h3 className="text-2xl md:text-3xl font-heading font-bold text-white mb-4 leading-tight">
                      {editorPick.title}
                    </h3>
                    {editorPick.excerpt && (
                      <p className="text-slate-200 text-base line-clamp-3 leading-relaxed">
                        {editorPick.excerpt}
                      </p>
                    )}
                  </div>
                </article>
              </Link>

              <div className="space-y-6">
                {posts.slice(1, 4).map((post, index) => (
                  <Link key={post._id} href={`/${post.slug.current}`} className="group block" style={{animationDelay: `${index * 0.1}s`}}>
                    <article className="flex gap-5 p-5 rounded-2xl bg-white/80 backdrop-blur-sm hover:bg-white/90 shadow-lg shadow-slate-900/5 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-500 hover:scale-102 animate-scaleIn">
                      <div className="w-20 h-20 relative flex-shrink-0 rounded-2xl overflow-hidden shadow-md">
                        {post.featuredImage && (
                          <Image
                            src={urlFor(post.featuredImage)
                              .width(150)
                              .height(150)
                              .auto('format')
                              .quality(70)
                              .url()}
                            alt={post.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                            sizes="96px"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">
                          {getCategoryLabel(post.category)}
                        </span>
                        <h4 className="text-base font-semibold text-slate-900 group-hover:text-indigo-700 transition-colors duration-300 line-clamp-3 leading-tight">
                          {post.title}
                        </h4>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Latest Stories */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-4">
              <div className="w-2 h-12 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full shadow-lg shadow-indigo-500/25" />
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-slate-900">
                Latest Stories
              </h2>
            </div>
            <Link href="/category" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-all duration-300 hover:scale-105 flex items-center gap-2">
              View All Stories
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid gap-8">
            {latestPosts.map((post, index) => (
              <article key={post._id} className="group bg-white/60 backdrop-blur-sm rounded-3xl shadow-lg shadow-slate-900/5 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-500 hover:scale-102 overflow-hidden animate-slideUp" style={{animationDelay: `${index * 0.1}s`}}>
                <Link href={`/${post.slug.current}`} className="block">
                  <div className="relative overflow-hidden rounded-t-3xl">
                    {post.featuredImage && (
                      <Image
                        src={urlFor(post.featuredImage)
                          .width(index === 0 ? 800 : 400)
                          .height(index === 0 ? 400 : 250)
                          .auto('format')
                          .quality(80)
                          .url()}
                        alt={post.title}
                        fill
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    <div className="absolute top-4 left-4">
                      <span className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-bold rounded-full shadow-lg">
                        {getCategoryLabel(post.category)}
                      </span>
                    </div>
                  </div>
                  <div className="p-8">
                    <h3 className={`mb-4 line-clamp-3 hover:text-indigo-700 transition-colors duration-300 ${
                      index === 0 ? 'text-2xl md:text-3xl font-bold' : 'text-xl md:text-2xl font-semibold'
                    } text-slate-900 leading-tight`}>
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="text-slate-600 text-base line-clamp-4 mb-6 leading-relaxed">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="flex items-center justify-between text-sm text-slate-500">
                      <time dateTime={post.publishedAt}>
                        {new Date(post.publishedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </time>
                      <span className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {Math.ceil(post.readTime || 5)} min read
                      </span>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Quote/Highlight Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-50 via-purple-50 to-indigo-50">
        <div className="max-w-4xl mx-auto px-4 lg:px-6 text-center">
          <div className="relative">
            <Quote className="mx-auto h-16 mb-8 text-indigo-300 animate-float" />
            <blockquote className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-slate-900 mb-8 leading-tight animate-fadeIn">
              &ldquo;News is what somebody somewhere wants to suppress; everything else is advertising.&rdquo;
            </blockquote>
            <p className="text-slate-600 text-lg font-medium">— Michael B. Jordan, Media critic</p>
            <div className="absolute -top-8 -left-8 w-16 h-16 bg-gradient-to-br from-indigo-200 to-purple-200 rounded-full opacity-30 animate-pulse"></div>
            <div className="absolute -bottom-8 -right-8 w-12 h-12 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full opacity-30 animate-pulse" style={{animationDelay: '1s'}}></div>
          </div>
        </div>
      </section>

      {/* Trending Section */}
      <section className="py-16 bg-gradient-to-br from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/25 animate-pulseGlow">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-slate-900">
                Trending Now
              </h2>
            </div>
            <Link href="/trending" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-all duration-300 hover:scale-105 flex items-center gap-2">
              View All
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid gap-6">
            {trendingPosts.map((post, index) => (
              <article key={post._id} className="flex items-center gap-6 p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg shadow-slate-900/5 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-500 hover:scale-102 animate-slideUp" style={{animationDelay: `${index * 0.1}s`}}>
                <div className="flex-shrink-0 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-lg">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">
                    {getCategoryLabel(post.category)}
                  </span>
                  <h3 className="mb-3 font-semibold text-slate-900 hover:text-indigo-700 transition-colors duration-300 line-clamp-2 text-lg leading-tight">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="text-slate-600 text-sm line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Quick Links */}
      <section className="border-t border-slate-200/50 bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-16">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-heading font-bold text-slate-900 mb-4">
              Explore Categories
            </h3>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Dive deep into stories that matter to you across our curated categories
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { label: 'Sports', href: '/category/sports', gradient: 'from-emerald-400 to-teal-600', hover: 'hover:shadow-emerald-500/20' },
              { label: 'Politics', href: '/category/politics', gradient: 'from-red-400 to-pink-600', hover: 'hover:shadow-red-500/20' },
              { label: 'Pop Culture', href: '/category/pop-culture', gradient: 'from-purple-400 to-indigo-600', hover: 'hover:shadow-purple-500/20' },
              { label: 'Games', href: '/games', gradient: 'from-amber-400 to-orange-600', hover: 'hover:shadow-amber-500/20' },
            ].map((category, index) => (
              <Link
                key={category.label}
                href={category.href}
                className={`group relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 text-center shadow-lg shadow-slate-900/5 hover:shadow-2xl ${category.hover} transition-all duration-500 hover:-translate-y-2 overflow-hidden animate-scaleIn`}
                style={{animationDelay: `${index * 0.2}s`}}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                <span className="relative text-2xl md:text-3xl font-bold text-slate-900 group-hover:text-slate-700 inline-block transition-all duration-300 group-hover:scale-110">
                  {category.label}
                </span>
                <ChevronRight className="relative w-6 h-6 text-slate-400 group-hover:text-slate-600 ml-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300 inline-block" />
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-600 group-hover:w-16 transition-all duration-500"></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Empty State */}
      {posts.length === 0 && (
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-20 text-center">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-slate-900/10">
              <Quote className="w-12 h-12 text-slate-400" />
            </div>
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-br from-indigo-200 to-purple-200 rounded-full opacity-60 animate-pulse"></div>
          </div>
          <h3 className="text-3xl font-heading font-bold text-slate-900 mb-4">No stories yet.</h3>
          <p className="text-slate-600 text-lg mb-6">Publish articles in Sanity Studio to get started!</p>
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-2xl shadow-lg shadow-indigo-500/25">
            <TrendingUp className="w-5 h-5" />
            Start Writing
          </div>
        </div>
      )}
    </div>
  )
}