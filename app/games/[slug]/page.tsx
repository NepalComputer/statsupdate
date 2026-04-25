import NPATGame from '@/components/NPATGame'
import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/badge'


const GAMES_CONFIG: Record<string, { title: string; description: string; maxPlayers: number; roundTime: number; keywords: string[] }> = {
  npat: {
    title: 'Name Place Animal Thing - Multiplayer Game',
    description: 'Play the classic Name, Place, Animal, Thing game online with friends! Real-time multiplayer with automated platform validation and scoring.',
    maxPlayers: 8,
    roundTime: 60,
    keywords: ['NPAT', 'multiplayer game', 'word game', 'name place animal thing', 'online game with friends'],
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const game = GAMES_CONFIG[slug]
  if (!game) return {}

  return {
    title: game.title,
    description: game.description,
    keywords: game.keywords,
    openGraph: {
      title: game.title,
      description: game.description,
      type: 'website',
      images: ['/og-game.png'], // You should create this asset
    },
    twitter: {
      card: 'summary_large_image',
      title: game.title,
      description: game.description,
    }
  }
}

export default async function GamePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const game = GAMES_CONFIG[slug]

  if (!game) {
    notFound()
  }

  // Structured Data for SEO - Topnotch detailed schema
  const jsonLds = [
    {
      '@context': 'https://schema.org',
      '@type': 'VideoGame',
      name: game.title,
      description: game.description,
      genre: 'Word Game',
      playMode: 'Multiplayer',
      applicationCategory: 'Game',
      operatingSystem: 'Any',
      publisher: 'StatsUpdate',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      }
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://statsupdate.com' },
        { '@type': 'ListItem', position: 2, name: 'Games', item: 'https://statsupdate.com/games' },
        { '@type': 'ListItem', position: 3, name: game.title, item: `https://statsupdate.com/games/${slug}` }
      ]
    },
    {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: `How to play ${game.title}`,
      description: 'Step by step guide to playing Name Place Animal Thing multiplayer.',
      step: [
        { '@type': 'HowToStep', text: 'Join a room or create a new game.' },
        { '@type': 'HowToStep', text: 'Wait for the random letter to be generated.' },
        { '@type': 'HowToStep', text: 'Quickly fill in a Name, Place, Animal, and Thing starting with that letter.' },
        { '@type': 'HowToStep', text: 'Submit your answers before the timer ends or someone else stops the bus.' }
      ]
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Is Name Place Animal Thing free to play?',
          acceptedAnswer: { '@type': 'Answer', text: 'Yes, it is completely free to play on StatsUpdate.' }
        },
        {
          '@type': 'Question',
          name: 'Does the game have automated validation?',
          acceptedAnswer: { '@type': 'Answer', text: 'Yes, the platform uses an active search engine to validate names, places, animals, and things in real-time.' }
        }
      ]
    }
  ]

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-24 relative overflow-hidden">
      {jsonLds.map((ld, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
        />
      ))}
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

        {/* Visual SEO Content: FAQ & How-To */}
        <div className="mt-24 grid md:grid-cols-2 gap-12 border-t border-slate-200 pt-16">
          <section className="space-y-8">
            <h2 className="text-3xl font-heading font-bold text-slate-900 tracking-tight flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-sm">?</span>
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              <div className="glass p-6 rounded-3xl border border-white/20 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-2">Is {game.title} free to play?</h3>
                <p className="text-slate-600 text-sm leading-relaxed">Yes, it is completely free to play on StatsUpdate. You can create or join rooms without any registration.</p>
              </div>
              <div className="glass p-6 rounded-3xl border border-white/20 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-2">Does the platform validate answers?</h3>
                <p className="text-slate-600 text-sm leading-relaxed">Our advanced validation engine actively searches Wikipedia and lexical databases to ensure every submission is a real person, place, animal, or thing.</p>
              </div>
              <div className="glass p-6 rounded-3xl border border-white/20 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-2">What is the "Stop the Bus" rule?</h3>
                <p className="text-slate-600 text-sm leading-relaxed">If a player submits four valid answers, the round instantly ends for everyone else. Speed is just as important as accuracy!</p>
              </div>
            </div>
          </section>

          <section className="space-y-8">
            <h2 className="text-3xl font-heading font-bold text-slate-900 tracking-tight flex items-center gap-3">
               <span className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-sm">!</span>
               How to Play
            </h2>
            <div className="relative space-y-8 before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {[
                { step: "Join or Create", desc: "Start by entering your name and joining an existing room or creating a private one." },
                { step: "Wait for Letter", desc: "A random letter will be generated at the start of each round." },
                { step: "Fill Categories", desc: "Quickly type a Name, Place, Animal, and Thing starting with that letter." },
                { step: "Submit or Stop", desc: "Submit all four valid answers to instantly end the round for others, or wait for the timer." }
              ].map((item, idx) => (
                <div key={idx} className="relative pl-12">
                  <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center text-xs font-bold text-slate-400 z-10">
                    {idx + 1}
                  </div>
                  <h3 className="font-bold text-slate-900 mb-1">{item.step}</h3>
                  <p className="text-slate-600 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}