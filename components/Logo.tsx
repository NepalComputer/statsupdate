import React from 'react'

export function Logo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <div className={`${className} relative flex items-center justify-center bg-slate-950 rounded-xl overflow-hidden group transition-all duration-500 hover:rotate-[360deg] hover:bg-indigo-600`}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full p-2"
      >
        {/* Abstract S and U with Stats Vibe */}
        <path
          d="M30 35C30 28 35 25 40 25H60C65 25 70 28 70 35V45C70 52 65 55 60 55H40C35 55 30 58 30 65V75C30 82 35 85 40 85H60"
          stroke="white"
          strokeWidth="12"
          strokeLinecap="round"
          className="opacity-90"
        />
        <path
          d="M75 25V70C75 80 70 85 60 85C50 85 45 80 45 70V55"
          stroke="white"
          strokeWidth="12"
          strokeLinecap="round"
          className="mix-blend-overlay opacity-50"
        />
        {/* Stats Bars Integration */}
        <rect x="52" y="30" width="6" height="15" fill="white" className="opacity-40" />
        <rect x="62" y="40" width="6" height="15" fill="white" className="opacity-60" />
      </svg>
    </div>
  )
}
