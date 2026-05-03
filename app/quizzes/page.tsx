import Link from 'next/link'
import { BrainCircuit, Star, Trophy, ArrowRight, Zap, Play } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const ALL_QUIZZES = [
  {
    id: 'cricket-iq',
    title: 'Cricket IQ Challenge',
    href: '/cricket-iq-challenge',
    category: 'Sports',
    difficulty: 'Medium',
    questions: 5,
    icon: '🏏',
    color: 'from-emerald-500 to-teal-600'
  },
  {
    id: 'movie-buff',
    title: 'Hollywood Movie Buff',
    href: '/hollywood-movie-buff-quiz',
    category: 'Pop Culture',
    difficulty: 'Easy',
    questions: 5,
    icon: '🎬',
    color: 'from-rose-500 to-pink-600'
  },
  {
    id: 'tech-titan',
    title: 'The Tech Titan Quiz',
    href: '/tech-titan-quiz',
    category: 'Technology',
    difficulty: 'Hard',
    questions: 5,
    icon: '💻',
    color: 'from-indigo-500 to-purple-600'
  },
  {
    id: 'world-history',
    title: 'World History Trivia',
    href: '/world-history-trivia',
    category: 'Education',
    difficulty: 'Medium',
    questions: 5,
    icon: '🌍',
    color: 'from-amber-500 to-orange-600'
  }
]

export default function QuizzesPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="pt-20 pb-24 bg-slate-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-full text-xs font-bold uppercase tracking-widest mb-8">
              <BrainCircuit className="w-4 h-4" />
              Brain Power
            </div>
            <h1 className="text-6xl md:text-8xl font-heading font-black tracking-tighter text-slate-900 leading-[0.9] mb-8">
              QUIZ <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">CENTRAL.</span>
            </h1>
            <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-xl">
              Challenge yourself with our curated trivia. From quick facts to deep dives into your favorite subjects.
            </p>
          </div>
        </div>
      </section>

      {/* Quiz Grid */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {ALL_QUIZZES.map((quiz) => (
              <Card key={quiz.id} className="group overflow-hidden border-slate-100 hover:border-amber-200 hover:shadow-2xl hover:shadow-amber-500/10 transition-all rounded-[32px]">
                <div className={`h-40 bg-gradient-to-br ${quiz.color} flex items-center justify-center relative`}>
                  <span className="text-6xl group-hover:scale-110 transition-transform duration-500">{quiz.icon}</span>
                  <div className="absolute top-4 right-4 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-bold text-white uppercase tracking-widest">
                    {quiz.difficulty}
                  </div>
                </div>
                <div className="p-8 space-y-6">
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">{quiz.category}</span>
                    <h3 className="text-2xl font-bold text-slate-900 group-hover:text-amber-600 transition-colors leading-tight">
                      {quiz.title}
                    </h3>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-slate-500 font-medium pb-6 border-b border-slate-50">
                    <Play className="w-4 h-4" /> {quiz.questions} Questions
                  </div>

                  <Link href={quiz.href}>
                    <Button className="w-full py-6 rounded-2xl bg-slate-900 text-white font-bold group-hover:bg-amber-500 transition-all">
                      Start Playing
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
