// components/PortableText.tsx
'use client'

import { PortableText as PortableTextReact } from '@portabletext/react'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity'

const portableTextComponents = {
  block: {
    h1: ({ children }: any) => (
      <h1 className="text-4xl font-bold mt-12 mb-6 tracking-tight">{children}</h1>
    ),
    h2: ({ children }: any) => (
      <h2 className="text-3xl font-semibold mt-10 mb-5 tracking-tight">{children}</h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-2xl font-semibold mt-8 mb-4">{children}</h3>
    ),
    normal: ({ children }: any) => (
      <p className="text-[17px] leading-relaxed mb-6 text-gray-700">{children}</p>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-gray-300 pl-6 italic my-8 text-gray-600">
        {children}
      </blockquote>
    ),
  },
  types: {
    image: ({ value }: any) => {
      if (!value?.asset) return null
      return (
        <div className="my-10 relative rounded-xl overflow-hidden">
          <Image
            src={urlFor(value).width(900).auto('format').quality(85).url()}
            alt={value.alt || ''}
            width={900}
            height={600}
            className="rounded-xl"
          />
        </div>
      )
    },
  },
  marks: {
    strong: ({ children }: any) => <strong className="font-semibold">{children}</strong>,
    em: ({ children }: any) => <em className="italic">{children}</em>,
    link: ({ children, value }: any) => (
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

export default function PortableText({ value }: { value: any }) {
  return <PortableTextReact value={value} components={portableTextComponents} />
}