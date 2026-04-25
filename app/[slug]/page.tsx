// app/[slug]/page.tsx
import { client } from '@/sanity/client'
import { urlFor } from '@/lib/sanity'
import Image from 'next/image'
import { PortableText } from '@portabletext/react'
import { notFound } from 'next/navigation'
import { Calendar, Clock, ArrowLeft } from 'lucide-react'
import { ShareButton, BookmarkButton } from '@/components/ShareButton'
import Link from 'next/link'
import QuizBlock from '@/components/QuizBlock'   // ← Import the Quiz component

interface Post {
  _id: string
  title: string
  slug: { current: string }
  category: string
  featuredImage?: any
  excerpt?: string
  body: any[]                     // Portable Text array
  publishedAt: string
  seoTitle?: string
  seoDescription?: string
}

async function getPost(slug: string): Promise<Post | null> {
  const query = `*[_type == "post" && slug.current == $slug][0]{
    _id,
    title,
    slug,
    category,
    featuredImage,
    excerpt,
    body,
    publishedAt,
    seoTitle,
    seoDescription
  }`

  return client.fetch(query, { slug }, {
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
  return category.replace('-', ' ').toUpperCase()
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) notFound()

  // Structured Data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: post.title,
    description: post.seoDescription || post.excerpt,
    image: post.featuredImage ? [urlFor(post.featuredImage).width(1200).url()] : [],
    datePublished: post.publishedAt,
    author: [{
      '@type': 'Organization',
      name: 'StatsUpdate',
      url: 'https://statsupdate.vercel.app'
    }]
  }

  const publishedDate = new Date(post.publishedAt)
  const readingTime = Math.ceil((post.body?.length || 0) / 5) || 5

  const shareUrl = `/${post.slug.current}`
  const shareTitle = post.title

  // Custom components for PortableText
  const portableComponents = {
    types: {
      // Render Quiz Block
      quiz: ({ value }: any) => {
        if (!value) return null
        return (
          <QuizBlock
            title={value.title}
            description={value.description}
            questions={value.questions || []}
          />
        )
      },

      // Optional: Better image rendering inside body
      image: ({ value }: any) => {
        if (!value?.asset) return null
        return (
          <div className="my-10">
            <Image
              src={urlFor(value).width(800).auto('format').quality(85).url()}
              alt={value.alt || 'Article image'}
              width={800}
              height={500}
              className="rounded-2xl w-full object-cover"
            />
          </div>
        )
      },
    },

    block: {
      normal: ({ children }: any) => <p className="mb-6 leading-relaxed">{children}</p>,
      h2: ({ children }: any) => <h2 className="text-3xl font-bold mt-12 mb-6">{children}</h2>,
      h3: ({ children }: any) => <h3 className="text-2xl font-semibold mt-10 mb-4">{children}</h3>,
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="bg-white">
      {/* Back Link */}
      <div className="border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-4">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-news-dark transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>

      {/* Article Header */}
      <header className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="flex items-center gap-4 mb-6 flex-wrap">
          <span className={`category-badge ${getCategoryStyle(post.category)} px-4 py-1 rounded-full text-sm font-medium`}>
            {formatCategory(post.category)}
          </span>
          <span className="text-gray-500 text-sm flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            {publishedDate.toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </span>
          <span className="text-gray-400">|</span>
          <span className="text-gray-500 text-sm flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            {readingTime} min read
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-news-dark leading-tight mb-6">
          {post.title}
        </h1>

        {post.excerpt && (
          <p className="text-xl text-news-gray leading-relaxed border-l-4 border-news-accent pl-6 py-1">
            {post.excerpt}
          </p>
        )}
      </header>

      {/* Featured Image */}
      {post.featuredImage && (
        <div className="max-w-5xl mx-auto px-4 md:px-6 mb-12">
          <div className="relative aspect-[16/9] md:aspect-[21/9] rounded-xl overflow-hidden">
            <Image
              src={urlFor(post.featuredImage)
                .width(1400)
                .height(600)
                .auto('format')
                .quality(90)
                .url()}
              alt={post.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1200px) 100vw, 1200px"
            />
          </div>
        </div>
      )}

      {/* Article Body */}
      <div className="max-w-3xl mx-auto px-4 md:px-6 pb-16">
        {/* Share & Bookmark */}
        <div className="flex items-center justify-between py-6 border-y border-gray-100 mb-10">
          <div className="flex items-center gap-4">
            <ShareButton title={shareTitle} url={shareUrl} />
            <BookmarkButton />
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>By</span>
            <span className="font-medium text-news-dark">StatsUpdate Staff</span>
          </div>
        </div>

        {/* Main Content with Quiz Support */}
        <div className="prose-news">
          <PortableText 
            value={post.body} 
            components={portableComponents} 
          />
        </div>

        {/* Tags */}
        <div className="mt-16 pt-8 border-t border-gray-100">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-500 mr-2">Tags:</span>
            <Link 
              href={`/category/${post.category}`}
              className="text-sm text-news-blue hover:underline"
            >
              {formatCategory(post.category)}
            </Link>
          </div>
        </div>
      </div>
    </article>
  </>
)
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return {}

  const metaTitle = post.seoTitle || post.title
  const metaDesc = post.seoDescription || post.excerpt

  return {
    title: metaTitle,
    description: metaDesc,
    alternates: {
      canonical: `/${post.slug.current}`,
    },
    openGraph: {
      title: metaTitle,
      description: metaDesc,
      type: 'article',
      publishedTime: post.publishedAt,
      images: post.featuredImage 
        ? [{ url: urlFor(post.featuredImage).width(1200).url() }] 
        : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDesc,
    }
  }
}