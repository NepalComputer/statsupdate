// app/search/page.tsx
'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { client } from '@/sanity/client'
import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'

interface SearchResult {
  _id: string
  title: string
  slug: { current: string }
  category: string
  excerpt?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  featuredImage?: any
  publishedAt: string
}

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)

  const searchPosts = useCallback(async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setResults([])
      return
    }

    setLoading(true)
    const searchQuery = `*[_type == "post" && 
      (title match "${searchTerm}*" || excerpt match "${searchTerm}*" || pt(body[]).children[].text match "${searchTerm}*")
    ] | order(publishedAt desc) [0...20] {
      _id, title, slug, category, excerpt, featuredImage, publishedAt
    }`

    const data = await client.fetch<SearchResult[]>(searchQuery)
    setResults(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    const timeout = setTimeout(() => {
      searchPosts(query)
    }, 300)
    return () => clearTimeout(timeout)
  }, [query, searchPosts])

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-8">Search Articles</h1>
      
      <Input
        type="text"
        placeholder="Search for sports, politics, pop culture..."
        value={query}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
        className="text-lg py-6 mb-10"
      />

      {loading && <p className="text-center">Searching...</p>}

      <div className="space-y-6">
        {results.map((post) => (
          <Card key={post._id} className="overflow-hidden">
            <CardContent className="p-6 flex gap-6">
              {post.featuredImage && (
                <div className="w-40 h-28 relative flex-shrink-0">
                  <Image
                    src={urlFor(post.featuredImage).width(300).url()}
                    alt={post.title}
                    fill
                    className="object-cover rounded"
                  />
                </div>
              )}
              <div className="flex-1">
                <div className="uppercase text-xs text-blue-600 font-medium mb-2">
                  {post.category.replace('-', ' ')}
                </div>
                <Link href={`/${post.slug.current}`} className="text-2xl font-semibold hover:text-blue-600 block mb-3">
                  {post.title}
                </Link>
                {post.excerpt && <p className="text-gray-600 line-clamp-2">{post.excerpt}</p>}
              </div>
            </CardContent>
          </Card>
        ))}

        {!loading && query && results.length === 0 && (
          <p className="text-center text-gray-500 py-10">
            No results found for &quot;{query}&quot;
          </p>
        )}
      </div>
    </div>
  )
}