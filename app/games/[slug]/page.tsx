import NPATGame from '@/components/NPATGame'
import WordChainGame from '@/components/WordChainGame'
import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/badge'


const GAMES_CONFIG: Record<string, { title: string; description: string; maxPlayers: number; roundTime: number; keywords: string[] }> = {
  npat: {
    title: 'Play Name Place Animal Thing Online Multiplayer Game',
    description: 'Play the classic Name Place Animal Thing game online with friends! Free real-time multiplayer with automated validation on StatsUpdate.',
    maxPlayers: 8,
    roundTime: 60,
    keywords: ['name place animal thing', 'name place animal thing online', 'multiplayer name place animal thing', 'statsupdate name place animal thing', 'statsupdate', 'statsupdate.com', 'NPAT game', 'play word game online', 'friends game'],
  },
  'word-chain': {
    title: 'Word Chain Online Multiplayer - Link the Words',
    description: 'Challenge your friends in Word Chain! Link words starting with the last letter of the previous one. Fast-paced multiplayer word game on StatsUpdate.',
    maxPlayers: 8,
    roundTime: 15,
    keywords: ['word chain', 'word chain online', 'multiplayer word chain', 'word link game', 'shiritori online', 'word game with friends', 'statsupdate games'],
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const game = GAMES_CONFIG[slug]
  if (!game) return {}

  return {
    metadataBase: new URL('https://statsupdate.com'),
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
          acceptedAnswer: { '@type': 'Answer', text: 'Yes, the platform uses an active search engine leveraging Wikipedia and lexical databases to validate names, places, animals, and things in real-time.' }
        },
        {
          '@type': 'Question',
          name: 'Can I play NPAT on my mobile device?',
          acceptedAnswer: { '@type': 'Answer', text: 'Absolutely! NPAT is fully responsive and optimized for both Android and iOS devices, so you can play on the go.' }
        },
        {
          '@type': 'Question',
          name: 'How many players can join a single game room?',
          acceptedAnswer: { '@type': 'Answer', text: 'Currently, our rooms support up to 8 players for a balanced and exciting real-time experience.' }
        },
        {
          '@type': 'Question',
          name: 'What happens if two players submit the same answer?',
          acceptedAnswer: { '@type': 'Answer', text: 'To encourage creativity, if two or more players submit the same valid answer, they both receive 0 points for that category. Only unique answers are rewarded!' }
        },
        {
          '@type': 'Question',
          name: 'Do I need to create an account to play?',
          acceptedAnswer: { '@type': 'Answer', text: 'No registration is required. You can jump straight into the action by entering a nickname and joining or creating a room.' }
        },
        {
          '@type': 'Question',
          name: 'Can I create a private room to play only with my friends?',
          acceptedAnswer: { '@type': 'Answer', text: 'Yes! You can toggle the "Private Room" option when hosting a game. Simply share the unique Game ID with your friends to let them join.' }
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
          {slug === 'npat' ? (
            <NPATGame
              maxPlayers={game.maxPlayers}
              roundTime={game.roundTime}
            />
          ) : (
            <WordChainGame
              maxPlayers={game.maxPlayers}
              roundTime={game.roundTime}
            />
          )}
        </div>

        {/* Visual SEO Content: FAQ & How-To */}
        <div className="mt-24 grid md:grid-cols-2 gap-12 border-t border-slate-200 pt-16">
          <section className="space-y-8">
            <h2 className="text-3xl font-heading font-bold text-slate-900 tracking-tight flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-sm">?</span>
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {slug === 'npat' ? (
                <>
                  <div className="glass p-6 rounded-3xl border border-white/20 shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="font-bold text-slate-900 mb-2">Is {game.title} free to play?</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">Yes, it is completely free to play on StatsUpdate. You can create or join rooms without any registration or hidden fees.</p>
                  </div>
                  <div className="glass p-6 rounded-3xl border border-white/20 shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="font-bold text-slate-900 mb-2">Does the platform validate answers?</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">Our advanced validation engine actively searches Wikipedia and lexical databases to ensure every submission is a real person, place, animal, or thing.</p>
                  </div>
                  <div className="glass p-6 rounded-3xl border border-white/20 shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="font-bold text-slate-900 mb-2">What is the "Stop the Bus" rule?</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">If a player submits four valid answers, the round instantly ends for everyone else. Speed is just as important as accuracy!</p>
                  </div>
                  <div className="glass p-6 rounded-3xl border border-white/20 shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="font-bold text-slate-900 mb-2">Can I play on my mobile phone?</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">Yes! The game is built using responsive design principles and works perfectly on smartphones and tablets.</p>
                  </div>
                  <div className="glass p-6 rounded-3xl border border-white/20 shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="font-bold text-slate-900 mb-2">How many players can join a room?</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">Rooms support up to 8 players. If you have more friends, you can split into multiple rooms and compete for the highest total score!</p>
                  </div>
                  <div className="glass p-6 rounded-3xl border border-white/20 shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="font-bold text-slate-900 mb-2">Why did I get 0 points for a valid answer?</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">In NPAT, if two or more players provide the same answer, both receive 0 points. Try to think of unique words to maximize your score!</p>
                  </div>
                  <div className="glass p-6 rounded-3xl border border-white/20 shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="font-bold text-slate-900 mb-2">How do I invite friends?</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">Once you create or join a room, simply copy the 5-digit Game ID from the dashboard and send it to your friends. They can enter it on the home page to join you.</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="glass p-6 rounded-3xl border border-white/20 shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="font-bold text-slate-900 mb-2">How do I play Word Chain?</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">Start with any word. The next player must provide a word that begins with the last letter of your word. The chain continues until someone runs out of time!</p>
                  </div>
                  <div className="glass p-6 rounded-3xl border border-white/20 shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="font-bold text-slate-900 mb-2">Can I use the same word twice?</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">No, repeated words are not allowed in the same round. This keeps the game challenging and forces players to be creative.</p>
                  </div>
                  <div className="glass p-6 rounded-3xl border border-white/20 shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="font-bold text-slate-900 mb-2">What happens if I run out of time?</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">If the timer reaches zero on your turn, you are eliminated from the round. The last player standing wins!</p>
                  </div>
                  <div className="glass p-6 rounded-3xl border border-white/20 shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="font-bold text-slate-900 mb-2">Are all words allowed?</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">We validate words using a real-time dictionary engine. Slang and very obscure terms might not be recognized, so stick to standard English words.</p>
                  </div>
                  <div className="glass p-6 rounded-3xl border border-white/20 shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="font-bold text-slate-900 mb-2">Is Word Chain multiplayer?</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">Yes! You can play with up to 8 friends in real-time. The game automatically manages turns and elimination.</p>
                  </div>
                </>
              )}
            </div>
          </section>

          <section className="space-y-8">
            <h2 className="text-3xl font-heading font-bold text-slate-900 tracking-tight flex items-center gap-3">
               <span className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-sm">!</span>
               How to Play
            </h2>
            <div className="relative space-y-8 before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {slug === 'npat' ? (
                [
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
                ))
              ) : (
                [
                  { step: "Get Your Turn", desc: "Wait for the previous player to submit a word. The chain begins with a random starter." },
                  { step: "Link the Word", desc: "Type a word that starts with the LAST letter of the previous word." },
                  { step: "Beat the Clock", desc: "You only have 15 seconds! Don't let the timer run out or you're eliminated." },
                  { step: "Last One Standing", desc: "Survive the rounds as others get eliminated. The final player remaining wins the match." }
                ].map((item, idx) => (
                  <div key={idx} className="relative pl-12">
                    <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center text-xs font-bold text-slate-400 z-10">
                      {idx + 1}
                    </div>
                    <h3 className="font-bold text-slate-900 mb-1">{item.step}</h3>
                    <p className="text-slate-600 text-sm">{item.desc}</p>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}