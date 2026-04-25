// app/category/[slug]/page.tsx
import { client } from '@/sanity/client'
import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/lib/sanity'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { notFound } from 'next/navigation'

interface CategoryPost {
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
}


const categoryLabels: Record<string, string> = {
  sports: 'Sports',
  politics: 'Politics',
  'pop-culture': 'Pop Culture',
  games: 'Games',
}

async function getCategoryPosts(category: string): Promise<CategoryPost[]> {
  const query = `*[_type == "post" && category == $category] | order(publishedAt desc) {
    _id, title, slug, category, excerpt, featuredImage, publishedAt
  }`

  return client.fetch(query, { category }, { next: { revalidate: 60 } })
}


export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const categoryName = categoryLabels[slug] || slug

  return {
    title: `${categoryName} News & Analytics`,
    description: `Read the latest stories, breaking news, and in-depth analytics in ${categoryName.toLowerCase()} on StatsUpdate.`,
    alternates: {
      canonical: `/category/${slug}`,
    }
  }
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const categoryName = categoryLabels[slug] || slug

  const items = await getCategoryPosts(slug)

  if (items.length === 0) notFound()

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-12">
          <h1 className="text-5xl font-bold tracking-tight">{categoryName}</h1>
          <p className="text-xl text-gray-600 mt-3">
            Latest stories in {categoryName.toLowerCase()}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item) => (
            <Card key={item._id} className="overflow-hidden hover:shadow-xl transition">
              {item.featuredImage && (
                <div className="relative aspect-[16/10]">
                  <Image
                    src={urlFor(item.featuredImage).width(700).auto('format').url()}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <CardContent className="p-6">
                <Badge className="mb-3">{categoryName}</Badge>
                <Link href={`/${item.slug.current}`}>
                  <h3 className="text-2xl font-semibold line-clamp-3 mb-4 hover:text-blue-600">
                    {item.title}
                  </h3>
                </Link>
                {item.excerpt && (
                  <p className="text-gray-600 line-clamp-3">{item.excerpt}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  )
}