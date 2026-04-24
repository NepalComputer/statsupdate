// app/games/page.tsx
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Trophy, Users, Timer, ArrowRight } from 'lucide-react'

const ALL_GAMES = [
  {
    id: 'npat',
    title: 'Name Place Animal Thing',
    description: 'A classic real-time multiplayer game where you race against others to fill categories starting with a random letter.',
    slug: 'npat',
    maxPlayers: 8,
    roundTime: 60,
    icon: <Trophy className="w-8 h-8 text-amber-500" />
  }
]

export default function GamesPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-24 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center mb-20 animate-slideUp">
          <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 border-none px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
            Interactive Zone
          </Badge>
          <h1 className="text-5xl md:text-7xl font-heading font-black text-slate-900 mb-6 tracking-tighter leading-tight">
            The Game <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Arena</span>
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium">
            Step into the next generation of social gaming. Real-time, multiplayer, and built for fun.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {ALL_GAMES.map((game, index) => (
            <Link href={`/games/${game.slug}`} key={game.id} className="group" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="relative h-full animate-scaleIn">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[2rem] blur-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
                <Card className="h-full border-white/50 shadow-2xl shadow-slate-200/50 hover:shadow-indigo-500/20 transition-all duration-700 hover:-translate-y-3 overflow-hidden bg-white/70 backdrop-blur-xl rounded-[2rem]">
                  <CardHeader className="p-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-slate-50 to-white rounded-2xl flex items-center justify-center mb-6 shadow-lg border border-white group-hover:scale-110 transition-transform duration-700">
                      {game.icon}
                    </div>
                    <CardTitle className="text-3xl font-heading font-bold text-slate-900 group-hover:text-indigo-600 transition-colors tracking-tight">
                      {game.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-8 pb-10">
                    <p className="text-slate-500 mb-8 line-clamp-3 leading-relaxed text-lg">
                      {game.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-3">
                      <Badge variant="secondary" className="bg-white/80 text-slate-700 border-slate-100 px-4 py-1.5 rounded-xl font-bold flex items-center gap-2">
                        <Users className="w-4 h-4 text-indigo-500" />
                        {game.maxPlayers} Max
                      </Badge>
                      <Badge variant="secondary" className="bg-white/80 text-slate-700 border-slate-100 px-4 py-1.5 rounded-xl font-bold flex items-center gap-2">
                        <Timer className="w-4 h-4 text-purple-500" />
                        {game.roundTime}s
                      </Badge>
                    </div>

                    <div className="mt-8 flex items-center justify-between">
                       <span className="text-indigo-600 font-bold flex items-center gap-2 group-hover:gap-3 transition-all">
                          Play Now
                          <ArrowRight className="w-4 h-4" />
                       </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-20 text-center p-10 bg-indigo-600 rounded-3xl text-white shadow-2xl shadow-indigo-500/20">
          <h2 className="text-3xl font-bold mb-4">Coming Soon</h2>
          <p className="text-indigo-100 max-w-xl mx-auto">
            We are working on more real-time games. Have a suggestion? Let us know!
          </p>
        </div>
      </div>
    </main>
  )
}
