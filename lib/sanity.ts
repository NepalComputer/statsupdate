import { createClient } from 'next-sanity'
import { createImageUrlBuilder } from '@sanity/image-url'

export const client = createClient({
  projectId: 'buq7hmwv',
  dataset: 'production',
  apiVersion: '2025-04-04',
  useCdn: true,
})

const builder = createImageUrlBuilder(client)

interface SanityImageSource {
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
  crop?: {
    top: number
    bottom: number
    left: number
    right: number
  }
}

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}