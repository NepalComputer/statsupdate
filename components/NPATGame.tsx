'use client'

import { useState, useEffect, useRef } from 'react'
import { ref, onValue, set, update, off, remove } from 'firebase/database'
import { database } from '@/lib/firebase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Timer, Users, Trophy, Send, CheckCircle2, AlertCircle, Sparkles, LogOut, ArrowRight, BrainCircuit } from 'lucide-react'
import { GAME_DATA } from '@/lib/gameData'

interface GameState {
  id: string
  status: 'waiting' | 'playing' | 'voting' | 'finished'
  players: Record<string, Player>
  currentLetter: string
  roundTime: number
  timeLeft: number
  currentRound: number
  totalRounds: number
  answers: Record<string, RoundAnswers>
  scores: Record<string, number>
  validation?: Record<string, Record<string, boolean>> // results of platform verification
  createdAt: number
}

interface Player {
  id: string
  name: string
  joinedAt: number
  isReady: boolean
  lastActive?: number
}

interface RoundAnswers {
  name: string
  place: string
  animal: string
  thing: string
  submittedAt?: number
}

interface NPATGameProps {
  gameId?: string
  maxPlayers?: number
  roundTime?: number
}

export default function NPATGame({
  gameId: initialGameId,
  maxPlayers = 8,
  roundTime = 60
}: NPATGameProps) {
  const [gameId, setGameId] = useState(initialGameId || '')
  const [playerId, setPlayerId] = useState('')
  const [playerName, setPlayerName] = useState('')
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [answers, setAnswers] = useState<RoundAnswers>({
    name: '',
    place: '',
    animal: '',
    thing: ''
  })
  const [isJoined, setIsJoined] = useState(false)
  const [isHost, setIsHost] = useState(false)
  const [hasVotedInRound, setHasVotedInRound] = useState(false)
  
  // Timer and Heartbeat refs
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const timerRef = useRef<any>(null)
  
  useEffect(() => {
    const savedId = localStorage.getItem('npat_player_id')
    const id = savedId || Math.random().toString(36).substring(2, 11)
    if (!savedId) {
      localStorage.setItem('npat_player_id', id)
    }
    setPlayerId(id)

    const savedName = localStorage.getItem('npat_player_name')
    if (savedName) setPlayerName(savedName)
  }, [])

  // Heartbeat and Live Sync of answers
  useEffect(() => {
    if (!isJoined || !gameId || !playerId || gameState?.status !== 'playing') return

    const syncTimeout = setTimeout(async () => {
      const currentAnswersRef = ref(database, `games/${gameId}/players/${playerId}/currentAnswers`)
      await set(currentAnswersRef, answers)
    }, 500) // Debounce sync

    return () => clearTimeout(syncTimeout)
  }, [answers, isJoined, gameId, playerId, gameState?.status])

  // Listen to game state changes
  useEffect(() => {
    if (!gameId) return

    const gameRef = ref(database, `games/${gameId}`)
    const unsubscribe = onValue(gameRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        // Reset local answer inputs when a new round starts
        if (gameState?.status !== 'playing' && data.status === 'playing') {
          setAnswers({ name: '', place: '', animal: '', thing: '' })
          setHasVotedInRound(false)
        }

        setGameState(data)
        // Set host to the player who joined earliest
        const sortedPlayersArr = Object.values(data.players || {}) as Player[]
        sortedPlayersArr.sort((a, b) => a.joinedAt - b.joinedAt)
        setIsHost(sortedPlayersArr[0]?.id === playerId)
        
        // Automated transition to validation if all active players have submitted
        // OR if someone "Stopped the Bus" (forced status change)
        if (data.status === 'playing' && data.players && isHost) {
          const activePlayers = Object.values(data.players) as Player[]
          const allSubmitted = activePlayers.every(p => data.answers?.[p.id])
          
          if (allSubmitted) {
            transitionToValidation(data)
          }
        }
      } else {
        setGameState(null)
      }
    })

    return () => off(gameRef)
  }, [gameId, playerId, isHost, gameState?.status])

  // Timer management
  useEffect(() => {
    if (!isHost || !gameId || !gameState) return

    if (gameState.status === 'playing' && gameState.timeLeft > 0) {
      timerRef.current = setInterval(() => {
        const gameRef = ref(database, `games/${gameId}`)
        update(gameRef, {
          timeLeft: Math.max(0, (gameState.timeLeft || 0) - 1)
        })
      }, 1000)
    } else if (gameState.timeLeft === 0 && gameState.status === 'playing') {
      transitionToValidation(gameState)
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [gameState?.timeLeft, gameState?.status, gameId, isHost])

  const transitionToValidation = async (currentState: GameState) => {
    if (!isHost || !gameId) return
    
    // Automated Scoring Logic with Real-World Validation
    const allAnswers = currentState.answers || {}
    const newScores = { ...(currentState.scores || {}) }
    const currentLetter = currentState.currentLetter.toUpperCase()
    
    // Use currentAnswers for anyone who didn't submit yet (Stop the Bus case)
    const players = currentState.players || {}
    const finalAnswersToValidate: Record<string, RoundAnswers> = { ...allAnswers }
    
    Object.keys(players).forEach(pId => {
      if (!finalAnswersToValidate[pId]) {
        finalAnswersToValidate[pId] = (players[pId] as any).currentAnswers || { name: '', place: '', animal: '', thing: '' }
      }
    })

    // Helper to check duplicates
    const getOccurrences = (category: 'name' | 'place' | 'animal' | 'thing', value: string) => {
      if (!value) return 0
      const val = value.trim().toUpperCase()
      return Object.values(finalAnswersToValidate).filter(ans => ans[category]?.trim().toUpperCase() === val).length
    }

    // Advanced Validation Logic using Active Server API + Local Fallback
    const validateRealWorld = async (category: string, word: string): Promise<boolean> => {
      const cleanWord = word.trim().toLowerCase()
      if (cleanWord.length < 2) return false
      if (!cleanWord.startsWith(currentLetter.toLowerCase())) return false

      // 1. Step 1: Check Local Knowledge Base
      const listKey = `${category}s` as keyof typeof GAME_DATA
      const localList = GAME_DATA[listKey] || []
      if (localList.some(item => item.toLowerCase() === cleanWord)) return true

      // 2. Step 2: Check Active Server API
      try {
        const res = await fetch('/api/validate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ category, word, letter: currentLetter })
        })
        if (res.ok) {
          const data = await res.json()
          if (data.isValid) return true
        }
      } catch (e) {
        console.warn(`Active validation failed for ${cleanWord}, using local fallback.`, e)
      }
      return false
    }

    // Process each player's answers
    const playerResults: Record<string, Record<string, boolean>> = {}
    
    for (const pId of Object.keys(players)) {
      const pAns = finalAnswersToValidate[pId]
      playerResults[pId] = {}
      let roundScore = 0

      for (const cat of (['name', 'place', 'animal', 'thing'] as const)) {
        const val = (pAns[cat] || '').trim()
        if (!val || !val.toUpperCase().startsWith(currentLetter)) {
          playerResults[pId][cat] = false
          continue
        }

        const isValid = await validateRealWorld(cat, val)
        playerResults[pId][cat] = isValid

        if (isValid) {
          const occurrences = getOccurrences(cat, val)
          if (occurrences === 1) roundScore += 10
        }
      }
      newScores[pId] = (newScores[pId] || 0) + roundScore
    }

    await update(ref(database, `games/${gameId}`), { 
      status: 'voting', 
      scores: newScores,
      validation: playerResults,
      answers: finalAnswersToValidate // Store which words were accepted by the platform
    })
  }

  const createGame = async () => {
    if (!playerName.trim() || !playerId) return
    localStorage.setItem('npat_player_name', playerName)

    try {
      const newGameId = Math.random().toString(36).substring(2, 7).toUpperCase()
      const gameRef = ref(database, `games/${newGameId}`)

      const initialState: GameState = {
        id: newGameId,
        status: 'waiting',
        players: {
          [playerId]: {
            id: playerId,
            name: playerName,
            joinedAt: Date.now(),
            isReady: false,
            lastActive: Date.now()
          }
        },
        currentLetter: '',
        roundTime,
        timeLeft: roundTime,
        currentRound: 1,
        totalRounds: 3,
        answers: {},
        scores: {},
        createdAt: Date.now()
      }

      await set(gameRef, initialState)
      setGameId(newGameId)
      setIsJoined(true)
    } catch (error: any) {
      console.error('Error creating game:', error)
      alert(`Error: ${error.message}`)
    }
  }

  const joinGame = async () => {
    if (!playerName.trim() || !gameId || !playerId) return
    localStorage.setItem('npat_player_name', playerName)

    try {
      const gameRef = ref(database, `games/${gameId}`)
      const playerRef = ref(database, `games/${gameId}/players/${playerId}`)
      
      const snapshot = await onValue(gameRef, (s) => s.val(), { onlyOnce: true })
      if (!snapshot) {
        alert("Game not found!")
        return
      }

      await set(playerRef, {
        id: playerId,
        name: playerName,
        joinedAt: Date.now(),
        isReady: false,
        lastActive: Date.now()
      })
      setIsJoined(true)
    } catch (error: any) {
      console.error('Error joining game:', error)
      alert(`Error: ${error.message}`)
    }
  }

  const toggleReady = async () => {
    if (!gameId || !playerId) return
    const readyRef = ref(database, `games/${gameId}/players/${playerId}/isReady`)
    await set(readyRef, !gameState?.players[playerId]?.isReady)
  }

  const startGame = async () => {
    if (!gameState || !isHost) return
    
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
    const randomLetter = letters[Math.floor(Math.random() * letters.length)]
    const gameRef = ref(database, `games/${gameId}`)

    await update(gameRef, {
      status: 'playing',
      currentLetter: randomLetter,
      timeLeft: roundTime,
      answers: {},
      currentRound: 1,
      scores: {} // Reset total scores when starting a completely new game
    })
  }

  const submitAnswers = async () => {
    if (!gameState || !gameId) return

    // 1. Perform 3-Step Validation (Active Search + Local) for the "Stop the Bus" trigger
    const currentLetter = gameState.currentLetter.toUpperCase()
    
    const validateWithEngine = async (category: string, word: string) => {
      const clean = word.trim()
      if (!clean || !clean.toUpperCase().startsWith(currentLetter)) return false
      
      try {
        const res = await fetch('/api/validate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ category, word: clean, letter: currentLetter })
        })
        if (res.ok) {
          const data = await res.json()
          return data.isValid
        }
      } catch (e) {
        // Fallback for trigger purpose only
        const list = GAME_DATA[`${category}s` as keyof typeof GAME_DATA] || []
        return list.some(item => item.toLowerCase() === clean.toLowerCase())
      }
      return false
    }

    const [vName, vPlace, vAnimal, vThing] = await Promise.all([
      validateWithEngine('name', answers.name),
      validateWithEngine('place', answers.place),
      validateWithEngine('animal', answers.animal),
      validateWithEngine('thing', answers.thing)
    ])

    const allValid = vName && vPlace && vAnimal && vThing

    // 2. Submit to Firebase
    const answersRef = ref(database, `games/${gameId}/answers/${playerId}`)
    await set(answersRef, {
      ...answers,
      submittedAt: Date.now()
    })

    // 3. If "Stop the Bus" condition met (all 4 are actively validated), force end round
    if (allValid) {
       await update(ref(database, `games/${gameId}`), {
          status: 'voting', 
          busStoppedBy: playerName
       })
    }
  }

  const voteForAnswers = async (votedPlayerId: string) => {
    // Voting is now automated, but we could keep it for "Bonus" or "Overriding"
    // For now, let's keep it disabled as requested "validated by our platform"
    return
  }

  const nextRound = async () => {
    if (!gameState || !isHost) return
    
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
    const randomLetter = letters[Math.floor(Math.random() * letters.length)]
    const nextRoundNum = gameState.currentRound + 1
    
    if (nextRoundNum > gameState.totalRounds) {
      await update(ref(database, `games/${gameId}`), { status: 'finished' })
    } else {
      await update(ref(database, `games/${gameId}`), {
        status: 'playing',
        currentLetter: randomLetter,
        timeLeft: roundTime,
        currentRound: nextRoundNum,
        answers: {}
      })
    }
  }

  const leaveGame = async () => {
    if (!gameId || !playerId) return
    const playerRef = ref(database, `games/${gameId}/players/${playerId}`)
    await remove(playerRef)
    setIsJoined(false)
    setGameState(null)
  }

  const isValidInput = (val: string) => {
    if (!gameState?.currentLetter || !val) return true
    return val.trim().toUpperCase().startsWith(gameState.currentLetter.toUpperCase())
  }

  // Helper for UI to show duplicate status
  const getDuplicateStatus = (pId: string, category: 'name' | 'place' | 'animal' | 'thing') => {
    if (!gameState?.answers) return false
    const val = (gameState.answers[pId]?.[category] as string | undefined)?.trim().toUpperCase()
    if (!val) return false
    
    const count = Object.values(gameState.answers).filter(ans => (ans[category] as string | undefined)?.trim().toUpperCase() === val).length
    return count > 1
  }

  // Waiting Room UI
  if (!isJoined) {
    return (
      <div className="max-w-md mx-auto space-y-8 animate-fadeIn pt-10">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-indigo-500/20 animate-bounce-subtle">
            <BrainCircuit className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-heading font-bold text-slate-900 leading-tight">NPAT Game</h1>
          <p className="text-slate-500 text-lg">Name, Place, Animal, Thing - Multiplayer</p>
        </div>

        <Card className="glass shadow-2xl border-white/50 animate-scaleIn rounded-3xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-b border-white/50">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-600" />
              Join the Arena
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wider ml-1">Your Alias</label>
              <Input
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter a cool name..."
                className="rounded-xl h-12 bg-white/50 border-slate-200 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {!initialGameId && (
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wider ml-1">Game ID <span className="text-slate-400 normal-case font-normal">(optional)</span></label>
                <div className="relative">
                  <Input
                    value={gameId}
                    onChange={(e) => setGameId(e.target.value.toUpperCase())}
                    placeholder="Enter ID to join..."
                    className="rounded-xl h-12 pr-12 bg-white/50 border-slate-200 uppercase"
                  />
                  {gameId && <Sparkles className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400 animate-pulse" />}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-3">
              <Button
                onClick={gameId ? joinGame : createGame}
                className={`h-14 rounded-2xl text-lg font-bold shadow-lg transition-all duration-300 ${
                   gameId 
                   ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-emerald-500/25'
                   : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-indigo-500/25'
                }`}
                disabled={!playerName.trim()}
              >
                {gameId ? 'Join Battle' : 'Host New Game'}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
           <p className="text-slate-400 text-sm">Real-time multiplayer powered by StatsUpdate</p>
        </div>
      </div>
    )
  }

  if (!gameState) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 animate-pulse font-medium">Entering the arena...</p>
      </div>
    )
  }

  const players = Object.values(gameState.players || {})
  const everyoneReady = players.length >= 2 && players.every(p => p.isReady)

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn">
      {/* Game Header */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="glass relative overflow-hidden rounded-3xl border-white/50">
           <div className="absolute top-0 right-0 p-3">
              <Badge variant="outline" className="bg-white/50 border-indigo-100 flex items-center gap-1">
                <Users className="w-3 h-3" />
                {players.length}
              </Badge>
           </div>
           <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Game ID</p>
                <p className="text-xl font-heading font-bold text-indigo-600 tracking-tighter">{gameId}</p>
              </div>
           </CardContent>
        </Card>

        <Card className="glass rounded-3xl border-white/50">
           <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Total Pts</p>
                <p className="text-xl font-heading font-bold text-slate-900">{gameState.scores?.[playerId] || 0} pts</p>
              </div>
           </CardContent>
        </Card>

        <Card className="glass rounded-3xl border-white/50">
           <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center text-red-600">
                <Timer className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Time Left</p>
                <p className={`text-xl font-heading font-bold ${gameState.timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-slate-900'}`}>
                  {gameState.timeLeft}s
                </p>
              </div>
           </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-[1fr_300px] gap-8">
        {/* Main Gameplay Area */}
        <div className="space-y-6">
          {gameState.status === 'waiting' && (
            <Card className="glass rounded-4xl p-10 text-center border-white/50 shadow-xl min-h-[400px] flex flex-col items-center justify-center">
              <div className="w-24 h-24 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full flex items-center justify-center mb-6 animate-pulse">
                <Users className="w-12 h-12 text-indigo-600" />
              </div>
              <h2 className="text-3xl font-heading font-bold text-slate-900 mb-2">Waiting Room</h2>
              <p className="text-slate-500 mb-8 max-w-sm">Share the Game ID with friends. Everyone needs to be ready before starting!</p>
              
              <div className="flex gap-4">
                <Button 
                  onClick={toggleReady}
                  variant={gameState.players[playerId]?.isReady ? "outline" : "default"}
                  className={`h-14 px-8 rounded-2xl text-lg font-bold transition-all duration-300 ${
                    gameState.players[playerId]?.isReady 
                    ? 'border-emerald-500 text-emerald-600 hover:bg-emerald-50' 
                    : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/25'
                  }`}
                >
                  {gameState.players[playerId]?.isReady ? 'Ready! 👍' : 'Ready Up'}
                </Button>
                {isHost && (
                  <Button 
                    onClick={startGame} 
                    disabled={!everyoneReady}
                    className="h-14 px-10 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold rounded-2xl shadow-xl shadow-emerald-500/20 disabled:opacity-50"
                  >
                    Start Game
                  </Button>
                )}
              </div>
              {!everyoneReady && players.length >= 2 && <p className="mt-4 text-sm text-slate-400">Waiting for all players to click Ready...</p>}
              {players.length < 2 && <p className="mt-4 text-sm text-amber-600 font-medium">Need at least 2 players to start!</p>}
            </Card>
          )}

          {gameState.status === 'playing' && (
            <div className="space-y-6 animate-slideUp">
               <div className="flex items-center justify-between bg-white/50 p-6 rounded-3xl border border-white/80">
                  <h3 className="text-2xl font-heading font-bold text-slate-900">
                    Active Round: <span className="text-indigo-600 tracking-tighter">{gameState.currentRound}/{gameState.totalRounds}</span>
                  </h3>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Letter</span>
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-2xl flex items-center justify-center text-4xl font-bold shadow-2xl shadow-indigo-500/40 animate-scaleIn">
                      {gameState.currentLetter}
                    </div>
                  </div>
               </div>

               {gameState.answers?.[playerId] ? (
                 <Card className="glass rounded-4xl p-12 text-center border-white/50">
                    <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Answers Submitted!</h3>
                    <p className="text-slate-500">Waiting for other players to finish or the timer to run out.</p>
                 </Card>
               ) : (
                 <div className="grid md:grid-cols-2 gap-6 pb-20">
                    {['Name', 'Place', 'Animal', 'Thing'].map((field) => (
                      <div key={field} className="space-y-2">
                         <div className="flex justify-between items-center ml-1">
                           <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">{field}</label>
                           {answers[field.toLowerCase() as keyof RoundAnswers] && (
                             isValidInput(answers[field.toLowerCase() as keyof RoundAnswers] as string) 
                             ? <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                             : <AlertCircle className="w-4 h-4 text-red-500 animate-shake" />
                           )}
                         </div>
                         <Input
                           value={answers[field.toLowerCase() as keyof RoundAnswers] as string}
                           onChange={(e) => setAnswers(prev => ({ ...prev, [field.toLowerCase()]: e.target.value }))}
                           placeholder={`${field} with ${gameState.currentLetter}...`}
                           autoFocus={field === 'Name'}
                           className={`h-16 rounded-2xl text-xl bg-white/70 border-2 transition-all duration-300 focus:scale-[1.02] ${
                             answers[field.toLowerCase() as keyof RoundAnswers]
                             ? isValidInput(answers[field.toLowerCase() as keyof RoundAnswers] as string)
                               ? 'border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500'
                               : 'border-red-200 focus:border-red-500 focus:ring-red-500'
                             : 'border-slate-100 focus:border-indigo-500'
                           }`}
                         />
                      </div>
                    ))}
                    <Button 
                      onClick={submitAnswers}
                      className="md:col-span-2 h-16 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xl shadow-xl shadow-indigo-500/30 group transition-all"
                      disabled={!answers.name || !answers.place || !answers.animal || !answers.thing}
                    >
                      Lock In My Answers
                      <Send className="ml-2 w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </Button>
                 </div>
               )}
            </div>
          )}

          {gameState.status === 'voting' && (
            <div className="space-y-8 animate-fadeIn">
               <div className="text-center space-y-2">
                 <h2 className="text-3xl font-heading font-bold text-slate-900">Round Summary</h2>
                 <p className="text-slate-500">Platform-validated scoring. Duplicate answers get 0 points.</p>
               </div>

               <div className="grid gap-6">
                 {players.map((p) => {
                   const pAns = gameState.answers?.[p.id]
                   return (
                     <Card key={p.id} className={`glass rounded-3xl border-white/50 overflow-hidden ${p.id === playerId ? 'ring-2 ring-indigo-500 shadow-indigo-500/10' : ''}`}>
                        <CardHeader className="flex flex-row items-center justify-between border-b border-white/50 p-6 bg-white/30">
                           <div className="flex items-center gap-3">
                             <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center font-bold text-white">
                               {p.name[0].toUpperCase()}
                             </div>
                             <span className="font-bold text-lg text-slate-900">{p.name} {p.id === playerId && "(You)"}</span>
                           </div>
                           <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none px-4 py-1 font-bold">
                             Round Active
                           </Badge>
                        </CardHeader>
                        <CardContent className="p-6">
                           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                             {['Name', 'Place', 'Animal', 'Thing'].map(f => {
                               const cat = f.toLowerCase() as 'name' | 'place' | 'animal' | 'thing'
                               const val = pAns?.[cat] || '-'
                               const isDuplicate = getDuplicateStatus(p.id, cat)
                               const isPlatformValid = gameState.validation?.[p.id]?.[cat] ?? true
                               const isCorrectLetter = (val as string).trim().toUpperCase().startsWith(gameState.currentLetter.toUpperCase())
                               const isValidResult = isCorrectLetter && isPlatformValid && val !== '-'
                               
                               return (
                                 <div key={f} className={`p-4 rounded-2xl border transition-all ${
                                   isValidResult 
                                     ? isDuplicate ? 'bg-amber-50 border-amber-200' : 'bg-emerald-50 border-emerald-200'
                                     : 'bg-red-50 border-red-200 opacity-60'
                                 }`}>
                                    <div className="flex justify-between items-center mb-1">
                                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{f}</span>
                                      {isValidResult && !isDuplicate && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                                      {isValidResult && isDuplicate && <Users className="w-3 h-3 text-amber-600" />}
                                      {!isValidResult && val !== '-' && <AlertCircle className="w-3 h-3 text-red-600" />}
                                    </div>
                                    <span className={`font-bold truncate block ${
                                      isValidResult 
                                        ? isDuplicate ? 'text-amber-700' : 'text-emerald-700'
                                        : 'text-red-700'
                                    }`}>{val}</span>
                                    {isValidResult && isDuplicate && <span className="text-[9px] font-bold text-amber-500 uppercase leading-none">Duplicate (0)</span>}
                                    {isValidResult && !isDuplicate && <span className="text-[9px] font-bold text-emerald-500 uppercase leading-none">+10 Pts</span>}
                                    {!isValidResult && val !== '-' && (
                                       <span className="text-[9px] font-bold text-red-500 uppercase leading-none">
                                         {!isCorrectLetter ? 'Wrong Letter' : 'Fake Word'}
                                       </span>
                                    )}
                                    {val === '-' && <span className="text-[9px] font-bold text-slate-400 uppercase leading-none">Missing</span>}
                                 </div>
                               )
                             })}
                           </div>
                        </CardContent>
                     </Card>
                   )
                 })}
               </div>

               {isHost && (
                 <Button onClick={nextRound} className="w-full h-16 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-xl shadow-xl shadow-indigo-500/20 group">
                    {gameState.currentRound >= gameState.totalRounds ? 'See Final Leaderboard' : 'Start Next Round'}
                    <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1" />
                 </Button>
               )}
            </div>
          )}

          {gameState.status === 'finished' && (
            <Card className="glass rounded-4xl p-12 text-center border-white/50 shadow-2xl relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 -z-10" />
               <Sparkles className="w-16 h-16 text-amber-500 mx-auto mb-6 animate-float" />
               <h2 className="text-4xl font-heading font-bold text-slate-900 mb-2">Grand Finale!</h2>
               
               <div className="mt-10 mb-10 space-y-4">
                  {Object.entries(gameState.scores || {})
                    .sort(([, a], [, b]) => b - a)
                    .map(([pId, score], idx) => (
                      <div key={pId} className={`flex items-center justify-between p-6 rounded-2xl border-2 transition-all ${idx === 0 ? 'bg-amber-50 border-amber-200 scale-105' : 'bg-white/50 border-white/80'}`}>
                         <div className="flex items-center gap-4">
                            <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white ${idx === 0 ? 'bg-amber-500' : 'bg-slate-300'}`}>
                              {idx + 1}
                            </span>
                            <span className="font-bold text-xl text-slate-900">{gameState.players?.[pId]?.name}</span>
                         </div>
                         <span className="text-2xl font-heading font-bold text-indigo-600">{score} <span className="text-sm font-bold text-slate-400">PTS</span></span>
                      </div>
                    ))}
               </div>

               {isHost && (
                 <Button onClick={startGame} className="h-16 px-12 rounded-2xl bg-indigo-600 hover:bg-indigo-700 font-bold text-white shadow-xl shadow-indigo-500/25">
                    Start New Game
                 </Button>
               )}
            </Card>
          )}
        </div>

        {/* Sidebar: Players List */}
        <div className="space-y-6">
          <Card className="glass rounded-3xl border-white/50 sticky top-24 overflow-hidden">
             <CardHeader className="bg-white/40 border-b border-white/50 p-6">
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-500 flex items-center justify-between">
                   Warriors
                   <Users className="w-4 h-4" />
                </CardTitle>
             </CardHeader>
             <CardContent className="p-4 space-y-2">
                {players.map((p) => (
                  <div key={p.id} className="flex items-center justify-between p-3 rounded-xl bg-white/40 border border-white/60">
                     <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${p.isReady ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                        <span className={`font-medium ${p.id === playerId ? 'text-indigo-600 font-bold' : 'text-slate-700'}`}>
                          {p.name}
                          {p.id === playerId && " (You)"}
                        </span>
                     </div>
                     {p.id === Object.values(gameState.players).sort((a,b)=>a.joinedAt-b.joinedAt)[0]?.id && <Badge variant="secondary" className="text-[9px] h-4">Host</Badge>}
                  </div>
                ))}
             </CardContent>
             <div className="p-4 bg-white/20 border-t border-white/50">
                <Button 
                  onClick={leaveGame}
                  variant="ghost" 
                  className="w-full justify-start text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Leave Arena
                </Button>
             </div>
          </Card>
          
          <div className="p-6 bg-indigo-600 rounded-3xl text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-8 transform translate-x-1/2 -translate-y-1/2 bg-white/10 rounded-full w-40 h-40 group-hover:scale-110 transition-transform" />
             <h4 className="font-bold mb-2 relative">Scoring Rules</h4>
             <ul className="text-indigo-100 text-sm relative space-y-1">
                <li>• Correct & Unique: 10 pts</li>
                <li>• Correct & Duplicate: 0 pts</li>
                <li>• Wrong Letter: 0 pts</li>
             </ul>
          </div>
        </div>
      </div>
    </div>
  )
}