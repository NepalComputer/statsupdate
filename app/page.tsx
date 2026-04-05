// app/page.tsx
import { client } from '@/sanity/client'
import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/lib/sanity'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, ArrowRight, TrendingUp, Play, Zap, Star, Quote } from 'lucide-react'

interface Post {
  _id: string
  title: string
  slug: { current: string }
  category: string
  excerpt?: string
  featuredImage?: any
  publishedAt: string
  body?: any[]
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

function getCategoryStyle(category: string): string {
  const styles: Record<string, string> = {
    sports: 'category-sports',
    politics: 'category-politics',
    'pop-culture': 'category-pop-culture',
  }
  return styles[category] || 'bg-gray-100 text-gray-700 border border-gray-200'
}

function formatCategory(category: string): string {
  return category.replace('-', ' ')
}

function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    sports: 'SPORTS',
    politics: 'POLITICS',
    'pop-culture': 'POP CULTURE',
  }
  return labels[category] || category.toUpperCase()
}

function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    sports: 'bg-orange-500',
    politics: 'bg-red-600',
    'pop-culture': 'bg-purple-600',
  }
  return colors[category] || 'bg-gray-600'
}

export default async function Home() {
  const posts = await getPosts()
  const featuredPost = posts[0]
  const latestPosts = posts.slice(1, 7)
  const trendingPosts = posts.slice(0, 4)
  const editorPick = posts.find(p => p.category === 'politics') || posts[0]

  return (
    <div className="bg-white min-h-screen">
      {/* Breaking News Banner */}
      <div className="bg-news-accent text-white py-2.5">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center gap-4">
          <span className="flex items-center gap-1.5 font-bold text-sm uppercase tracking-wider">
            <Zap className="w-4 h-4" /> Breaking
          </span>
          <div className="flex-1 overflow-hidden">
            <div className="flex animate-marquee whitespace-nowrap">
              <Link href="#" className="text-sm hover:underline mr-8">
                Election 2026: Latest updates from the campaign trail
              </Link>
              <Link href="#" className="text-sm hover:underline mr-8">
                Arjun Kumal makes history with fastest 1000 runs
              </Link>
              <Link href="#" className="text-sm hover:underline mr-8">
                Bollywood Awards 2026: Full winners list revealed
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section with Featured Article */}
      {featuredPost && (
        <section className="relative">
          <div className="grid lg:grid-cols-2 min-h-[85vh]">
            {/* Image Side */}
            <div className="relative h-[50vh] lg:h-auto">
              {featuredPost.featuredImage ? (
                <Image
                  src={urlFor(featuredPost.featuredImage)
                    .width(1200)
                    .height(800)
                    .auto('format')
                    .quality(90)
                    .url()}
                  alt={featuredPost.title}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900" />
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 lg:from-transparent" />
            </div>

            {/* Content Side */}
            <div className="absolute lg:relative inset-0 lg:inset-auto flex items-center justify-center p-6 md:p-12 bg-news-dark lg:bg-white">
              <div className="max-w-xl">
                <div className="flex items-center gap-3 mb-4">
                  <span className={`w-2 h-2 rounded-full animate-pulse ${getCategoryColor(featuredPost.category)}`} />
                  <span className={`category-badge ${getCategoryStyle(featuredPost.category)}`}>
                    {getCategoryLabel(featuredPost.category)}
                  </span>
                </div>

                <Link href={`/${featuredPost.slug.current}`}>
                  <h1 className="text-2xl md:text-4xl lg:text-5xl font-heading font-bold text-white lg:text-news-dark leading-tight mb-4 hover:text-news-accent transition-colors">
                    {featuredPost.title}
                  </h1>
                </Link>

                {featuredPost.excerpt && (
                  <p className="text-gray-300 lg:text-gray-600 text-base md:text-lg leading-relaxed mb-6 line-clamp-3">
                    {featuredPost.excerpt}
                  </p>
                )}

                <div className="flex items-center gap-4 text-sm text-gray-400 lg:text-gray-500 mb-6">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    <time dateTime={featuredPost.publishedAt}>
                      {new Date(featuredPost.publishedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </time>
                  </div>
                  <span className="w-1 h-1 rounded-full bg-gray-400" />
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span>{Math.ceil(featuredPost.readTime || 5)} min read</span>
                  </div>
                </div>

                <Link 
                  href={`/${featuredPost.slug.current}`}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-news-accent hover:bg-news-accent-hover text-white font-semibold rounded-lg transition-colors"
                >
                  <Play className="w-4 h-4" fill="currentColor" />
                  Read Full Story
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Editor's Pick Section */}
      {editorPick && (
        <section className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
          <div className="flex items-center gap-3 mb-8">
            <Star className="w-6 h-6 text-yellow-500" />
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-news-dark">
              Editor&apos;s Pick
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href={`/${editorPick.slug.current}`} className="md:col-span-2 group">
              <article className="relative h-full min-h-[300px] rounded-2xl overflow-hidden">
                {editorPick.featuredImage && (
                  <Image
                    src={urlFor(editorPick.featuredImage)
                      .width(900)
                      .height(500)
                      .auto('format')
                      .quality(85)
                      .url()}
                    alt={editorPick.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 66vw"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <span className="category-badge bg-yellow-500 text-white mb-3">
                    EDITOR&apos;S PICK
                  </span>
                  <h3 className="text-xl md:text-2xl font-heading font-bold text-white mb-2">
                    {editorPick.title}
                  </h3>
                  {editorPick.excerpt && (
                    <p className="text-gray-300 text-sm line-clamp-2">
                      {editorPick.excerpt}
                    </p>
                  )}
                </div>
              </article>
            </Link>

            <div className="space-y-4">
              {posts.slice(1, 4).map((post) => (
                <Link key={post._id} href={`/${post.slug.current}`} className="group block">
                  <article className="flex gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="w-20 h-20 relative flex-shrink-0 rounded-lg overflow-hidden">
                      {post.featuredImage && (
                        <Image
                          src={urlFor(post.featuredImage)
                            .width(200)
                            .height(200)
                            .auto('format')
                            .quality(70)
                            .url()}
                          alt={post.title}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      )}
                    </div>
                    <div>
                      <span className={`category-badge text-[10px] ${getCategoryStyle(post.category)} mb-1`}>
                        {getCategoryLabel(post.category)}
                      </span>
                      <h4 className="text-sm font-semibold text-news-dark group-hover:text-news-accent transition-colors line-clamp-2">
                        {post.title}
                      </h4>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest Stories with Visual Grid */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16 bg-gray-50 -mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-news-accent rounded-full" />
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-news-dark">
              Latest Stories
            </h2>
          </div>
          <Link href="/category" className="hidden md:flex items-center gap-2 text-sm font-medium text-news-accent hover:text-news-accent-hover transition-colors">
            View All Stories <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {latestPosts.map((post, index) => (
            <article 
              key={post._id} 
              className={`bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${
                index === 0 ? 'md:col-span-2 md:row-span-2' : ''
              }`}
            >
              <Link 
                href={`/${post.slug.current}`}
                className={`block relative overflow-hidden ${
                  index === 0 ? 'aspect-[21/9]' : 'aspect-[16/10]'
                }`}
              >
                {post.featuredImage && (
                  <Image
                    src={urlFor(post.featuredImage)
                      .width(index === 0 ? 800 : 500)
                      .height(index === 0 ? 350 : 300)
                      .auto('format')
                      .quality(80)
                      .url()}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes={index === 0 ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 768px) 100vw, 25vw'}
                  />
                )}
                <div className="absolute top-3 left-3">
                  <span className={`category-badge ${getCategoryStyle(post.category)} bg-white/90 backdrop-blur-sm`}>
                    {getCategoryLabel(post.category)}
                  </span>
                </div>
              </Link>

              <CardContent className={`p-5 ${index === 0 ? 'p-6' : 'p-4'}`}>
                <Link href={`/${post.slug.current}`}>
                  <h3 className={`font-heading font-bold text-news-dark hover:text-news-accent transition-colors line-clamp-2 ${
                    index === 0 ? 'text-xl md:text-2xl mb-3' : 'text-base mb-2'
                  }`}>
                    {post.title}
                  </h3>
                </Link>
                {post.excerpt && (
                  <p className={`text-gray-600 leading-relaxed mb-4 ${
                    index === 0 ? 'text-sm line-clamp-3' : 'text-xs line-clamp-2'
                  }`}>
                    {post.excerpt}
                  </p>
                )}
                <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
                  <time dateTime={post.publishedAt}>
                    {new Date(post.publishedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </time>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {Math.ceil(post.readTime || 5)} min
                  </span>
                </div>
              </CardContent>
            </article>
          ))}
        </div>
      </section>

      {/* Quote/Highlight Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-20">
        <div className="bg-news-dark rounded-2xl p-8 md:p-12 text-center">
          <Quote className="w-12 h-12 text-news-accent mx-auto mb-6" />
          <blockquote className="text-2xl md:text-4xl font-heading font-bold text-white leading-tight max-w-3xl mx-auto mb-6">
            &ldquo;News is what somebody somewhere wants to suppress; everything else is advertising.&rdquo;
          </blockquote>
          <cite className="text-gray-400 text-lg">— Michael B. Jordan, Media critic</cite>
        </div>
      </section>

      {/* Trending Sidebar Style Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <div className="flex items-center gap-3 mb-8">
              <TrendingUp className="w-6 h-6 text-news-accent" />
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-news-dark">
                Trending Now
              </h2>
            </div>

            <div className="space-y-4">
              {trendingPosts.map((post, index) => (
                <Link key={post._id} href={`/${post.slug.current}`} className="group">
                  <article className="flex gap-6 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                    <span className="text-4xl font-heading font-bold text-gray-200 group-hover:text-news-accent transition-colors">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${getCategoryColor(post.category)}`} />
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {getCategoryLabel(post.category)}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-news-dark group-hover:text-news-accent transition-colors">
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                          {post.excerpt}
                        </p>
                      )}
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-news-accent group-hover:translate-x-1 transition-all self-center" />
                  </article>
                </Link>
              ))}
            </div>
          </div>

          {/* Newsletter Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 bg-gradient-to-br from-news-accent to-red-800 rounded-2xl p-6 md:p-8 text-white">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5" />
                <span className="font-bold uppercase tracking-wider text-sm">Daily Briefing</span>
              </div>
              <h3 className="text-2xl font-heading font-bold mb-3">
                Never Miss a Story
              </h3>
              <p className="text-white/80 text-sm mb-6">
                Get the day&apos;s top headlines delivered to your inbox every morning.
              </p>
              <form className="space-y-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 bg-white/15 border border-white/20 rounded-lg text-sm text-white placeholder:text-white/60 focus:outline-none focus:border-white focus:bg-white/20 transition-colors"
                />
                <button
                  type="submit"
                  className="w-full py-3 bg-white text-news-accent font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Subscribe Free
                </button>
              </form>
              <p className="text-xs text-white/60 mt-4 text-center">
                Already 10,000+ subscribers. No spam, ever.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Quick Links */}
      <section className="border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
            {[
              { label: 'Sports', href: '/category/sports', color: 'text-orange-600' },
              { label: 'Politics', href: '/category/politics', color: 'text-red-600' },
              { label: 'Pop Culture', href: '/category/pop-culture', color: 'text-purple-600' },
            ].map((category) => (
              <Link 
                key={category.label}
                href={category.href}
                className={`text-lg font-medium hover:text-news-accent transition-colors ${category.color}`}
              >
                {category.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Empty State */}
      {posts.length === 0 && (
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-20 text-center">
          <p className="text-2xl text-gray-500 mb-4">No stories yet.</p>
          <p className="text-gray-400">Publish articles in Sanity Studio to get started!</p>
        </div>
      )}
    </div>
  )
}