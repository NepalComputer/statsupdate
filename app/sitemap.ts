// app/sitemap.ts
import { MetadataRoute } from 'next'
import { client } from '@/sanity/client'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://statsupdate.com'

  // Fetch dynamic posts from Sanity
  const posts = await client.fetch(`*[_type == "post"] { slug, publishedAt }`)
  
  const postUrls = posts.map((post: any) => ({
    url: `${baseUrl}/${post.slug.current}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }))

  const categories = ['sports', 'politics', 'pop-culture']
  const categoryUrls = categories.map((cat) => ({
    url: `${baseUrl}/category/${cat}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }))

  const staticUrls = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'always' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/games`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/games/npat`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }
  ]

  return [...staticUrls, ...categoryUrls, ...postUrls]
}
