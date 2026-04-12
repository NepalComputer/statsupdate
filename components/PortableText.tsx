// components/PortableText.tsx
'use client'

import { PortableText as PortableTextReact } from '@portabletext/react'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity'

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

interface BlockProps {
  children?: React.ReactNode
}

interface ImageProps {
  value?: {
    _type: string
    asset?: {
      _ref: string
      _type: string
    }
    alt?: string
  }
}

interface LinkProps {
  children?: React.ReactNode
  value?: {
    href?: string
  }
}

const portableTextComponents = {
  block: {
    h1: ({ children }: BlockProps) => (
      <h1 className="text-4xl font-bold mt-12 mb-6 tracking-tight">{children}</h1>
    ),
    h2: ({ children }: BlockProps) => (
      <h2 className="text-3xl font-semibold mt-10 mb-5 tracking-tight">{children}</h2>
    ),
    h3: ({ children }: BlockProps) => (
      <h3 className="text-2xl font-semibold mt-8 mb-4">{children}</h3>
    ),
    normal: ({ children }: BlockProps) => (
      <p className="text-[17px] leading-relaxed mb-6 text-gray-700">{children}</p>
    ),
    blockquote: ({ children }: BlockProps) => (
      <blockquote className="border-l-4 border-gray-300 pl-6 italic my-8 text-gray-600">
        {children}
      </blockquote>
    ),
  },
  types: {
    image: ({ value }: ImageProps) => {
      if (!value?.asset) return null
      return (
        <div className="my-10 relative rounded-xl overflow-hidden">
          <Image
            src={urlFor(value as SanityImageSource).width(900).auto('format').quality(85).url()}
            alt={value?.alt || ''}
            width={900}
            height={600}
            className="rounded-xl"
          />
        </div>
      )
    },
  },
  marks: {
    strong: ({ children }: BlockProps) => <strong className="font-semibold">{children}</strong>,
    em: ({ children }: BlockProps) => <em className="italic">{children}</em>,
    link: ({ children, value }: LinkProps) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline font-medium"
      >
        {children}
      </a>
    ),
  },
}

interface PortableTextProps {
  value: {
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
}

export default function PortableText({ value }: PortableTextProps) {
  return <PortableTextReact value={value} components={portableTextComponents} />
}