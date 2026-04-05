// components/ShareButton.tsx
'use client'

import { Share2, Bookmark } from 'lucide-react'

interface ShareButtonProps {
  title: string
  url: string
}

export function ShareButton({ title, url }: ShareButtonProps) {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url })
      } catch (err) {
        // User cancelled or error
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(url)
    }
  }

  return (
    <button 
      onClick={handleShare}
      className="flex items-center gap-2 text-sm text-gray-500 hover:text-news-dark transition-colors"
    >
      <Share2 className="w-4 h-4" />
      Share
    </button>
  )
}

export function BookmarkButton() {
  const handleSave = () => {
    // For now, just show an alert - could integrate with local storage or user account
    alert('Article saved!')
  }

  return (
    <button 
      onClick={handleSave}
      className="flex items-center gap-2 text-sm text-gray-500 hover:text-news-dark transition-colors"
    >
      <Bookmark className="w-4 h-4" />
      Save
    </button>
  )
}