import NPATGame from '@/components/NPATGame'
import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/badge'


const GAMES_CONFIG: Record<string, { title: string; description: string; maxPlayers: number; roundTime: number }> = {
  npat: {
    title: 'Name Place Animal Thing',
    description: 'A classic real-time multiplayer game where you race against others to fill categories starting with a random letter.',
    maxPlayers: 8,
    roundTime: 60,
  }
}

export default async function GamePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const game = GAMES_CONFIG[slug]

  if (!game) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-24 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="mb-12 animate-slideUp text-center">
          <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 border-none px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
            Live Multiplayer
          </Badge>
          <h1 className="text-5xl md:text-7xl font-heading font-black tracking-tighter mb-6 text-slate-900 leading-tight">
            {game.title}
          </h1>
          {game.description && (
            <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium">{game.description}</p>
          )}
        </div>

        <div className="animate-scaleIn">
          <NPATGame
            maxPlayers={game.maxPlayers}
            roundTime={game.roundTime}
            gameId={slug === 'npat' ? undefined : undefined} 
          />
        </div>
      </div>
    </main>
  )
}