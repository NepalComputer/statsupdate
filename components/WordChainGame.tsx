'use client'

import { useState, useEffect, useRef } from 'react'
import { ref, onValue, get, set, update, off, remove } from 'firebase/database'
import { database } from '@/lib/firebase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Timer, Users, Trophy, Send, CheckCircle2, AlertCircle, Sparkles, ArrowRight, BrainCircuit, Globe, Lock, Unlock, Zap, Heart } from 'lucide-react'
import { query, limitToLast } from 'firebase/database'

interface GameState {
  id: string
  status: 'waiting' | 'playing' | 'finished'
  players: Record<string, Player>
  currentWord: string
  lastLetter: string
  turnPlayerId: string
  turnTimeLimit: number
  maxLives: number
  timeLeft: number
  usedWords: string[]
  scores: Record<string, number>
  createdAt: number
  isPublic?: boolean
  roundCount: number
}

interface Player {
  id: string
  name: string
  joinedAt: number
  isReady: boolean
  lastActive?: number
  isEliminated?: boolean
  lives?: number
}

interface WordChainGameProps {
  gameId?: string
  maxPlayers?: number
  roundTime?: number
}

export default function WordChainGame({
  gameId: initialGameId,
  maxPlayers = 8,
  roundTime = 15
}: WordChainGameProps) {
  const [gameId, setGameId] = useState(initialGameId || '')
  const [playerId, setPlayerId] = useState('')
  const [playerName, setPlayerName] = useState('')
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [inputWord, setInputWord] = useState('')
  const [isJoined, setIsJoined] = useState(false)
  const [isHost, setIsHost] = useState(false)
  const [isPublicRoom, setIsPublicRoom] = useState(true)
  const [publicRooms, setPublicRooms] = useState<GameState[]>([])
  const [error, setError] = useState<string | null>(null)
  
  // Settings (for host)
  const [maxLives, setMaxLives] = useState(2)
  const [turnTime, setTurnTime] = useState(10)
  
  const timerRef = useRef<any>(null)
  
  useEffect(() => {
    const savedId = localStorage.getItem('wordchain_player_id')
    const id = savedId || Math.random().toString(36).substring(2, 11)
    if (!savedId) {
      localStorage.setItem('wordchain_player_id', id)
    }
    setPlayerId(id)

    const savedName = localStorage.getItem('wordchain_player_name')
    if (savedName) setPlayerName(savedName)
  }, [])

  // Listen for public rooms
  useEffect(() => {
    if (isJoined) return

    const gamesRef = ref(database, 'games_wordchain')
    const recentGamesQuery = query(gamesRef, limitToLast(20))
    
    const unsubscribe = onValue(recentGamesQuery, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const rooms = Object.values(data) as GameState[]
        const activePublicRooms = rooms.filter(room => 
          room.isPublic && 
          room.status === 'waiting' && 
          Object.keys(room.players || {}).length < maxPlayers
        ).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
        setPublicRooms(activePublicRooms)
      } else {
        setPublicRooms([])
      }
    })

    return () => off(gamesRef)
  }, [isJoined, maxPlayers])

  // Listen to game state changes
  useEffect(() => {
    if (!gameId) return

    const gameRef = ref(database, `games_wordchain/${gameId}`)
    const unsubscribe = onValue(gameRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        setGameState(data)
        const sortedPlayersArr = Object.values(data.players || {}) as Player[]
        sortedPlayersArr.sort((a, b) => a.joinedAt - b.joinedAt)
        setIsHost(sortedPlayersArr[0]?.id === playerId)
      } else {
        setGameState(null)
      }
    })

    return () => off(gameRef)
  }, [gameId, playerId])

  // Timer management (Host only)
  useEffect(() => {
    if (!isHost || !gameId || !gameState || gameState.status !== 'playing') return

    timerRef.current = setInterval(() => {
      if (gameState.timeLeft <= 0) {
        handleTurnFailure()
      } else {
        update(ref(database, `games_wordchain/${gameId}`), {
          timeLeft: gameState.timeLeft - 1
        })
      }
    }, 1000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [gameState?.timeLeft, gameState?.status, gameId, isHost])

  const handleTurnFailure = async () => {
    if (!gameState || !gameId || !isHost) return
    
    const currentTurnId = gameState.turnPlayerId
    const players = { ...gameState.players }
    const player = players[currentTurnId]
    
    if (!player) return

    // Lose a life
    const newLives = (player.lives || 1) - 1
    player.lives = newLives
    
    if (newLives <= 0) {
      player.isEliminated = true
    }
    
    // Find next player
    const activePlayerIds = Object.keys(players).filter(id => !players[id].isEliminated)
    
    if (activePlayerIds.length <= 1) {
      // Game over if 1 or 0 players left
      await update(ref(database, `games_wordchain/${gameId}`), {
        status: 'finished',
        players: players
      })
    } else {
      const currentIndex = activePlayerIds.indexOf(currentTurnId)
      // If current was eliminated, index might be -1 if we filter first, but we filtered active
      // Let's use the active list to find next
      const nextIndex = (currentIndex + 1) % activePlayerIds.length
      const nextPlayerId = activePlayerIds[nextIndex]
      
      await update(ref(database, `games_wordchain/${gameId}`), {
        players: players,
        turnPlayerId: nextPlayerId,
        timeLeft: gameState.turnTimeLimit || 10
      })
    }
  }

  const createGame = async () => {
    if (!playerName.trim() || !playerId) return
    localStorage.setItem('wordchain_player_name', playerName)

    try {
      const newGameId = Math.random().toString(36).substring(2, 7).toUpperCase()
      const gameRef = ref(database, `games_wordchain/${newGameId}`)

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
        currentWord: '',
        lastLetter: '',
        turnPlayerId: '',
        turnTimeLimit: 10,
        maxLives: 2,
        timeLeft: 10,
        usedWords: [],
        scores: {},
        createdAt: Date.now(),
        isPublic: isPublicRoom,
        roundCount: 0
      }

      await set(gameRef, initialState)
      setGameId(newGameId)
      setIsJoined(true)
    } catch (error: any) {
      console.error('Error creating game:', error)
    }
  }

  const joinGame = async (overrideId?: string) => {
    const idToJoin = overrideId || gameId
    if (!playerName.trim() || !idToJoin || !playerId) return
    localStorage.setItem('wordchain_player_name', playerName)

    try {
      const playerRef = ref(database, `games_wordchain/${idToJoin}/players/${playerId}`)
      await set(playerRef, {
        id: playerId,
        name: playerName,
        joinedAt: Date.now(),
        isReady: false,
        lastActive: Date.now()
      })
      setIsJoined(true)
      setGameId(idToJoin)
    } catch (error: any) {
      console.error('Error joining game:', error)
    }
  }

  const toggleReady = async () => {
    if (!gameId || !playerId) return
    const readyRef = ref(database, `games_wordchain/${gameId}/players/${playerId}/isReady`)
    await set(readyRef, !gameState?.players[playerId]?.isReady)
  }

  const startGame = async () => {
    if (!gameState || !isHost) return
    
    const players = { ...gameState.players }
    const playerIds = Object.keys(players)
    const firstPlayerId = playerIds[Math.floor(Math.random() * playerIds.length)]
    
    Object.keys(players).forEach(id => {
      players[id].lives = maxLives
      players[id].isEliminated = false
    })
    
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const randomLetter = letters[Math.floor(Math.random() * letters.length)]
    
    await update(ref(database, `games_wordchain/${gameId}`), {
      status: 'playing',
      turnPlayerId: firstPlayerId,
      timeLeft: turnTime,
      turnTimeLimit: turnTime,
      maxLives: maxLives,
      currentWord: '',
      lastLetter: randomLetter,
      usedWords: [],
      scores: {},
      players: players
    })
  }

  const submitWord = async () => {
    if (!gameState || gameState.turnPlayerId !== playerId || !inputWord.trim()) return
    
    const word = inputWord.trim().toLowerCase()
    const currentLetter = gameState.lastLetter.toLowerCase()
    
    // Validation
    if (word.length < 2) {
      setError("Word too short!")
      return
    }
    
    if (currentLetter && !word.startsWith(currentLetter)) {
      setError(`Must start with '${currentLetter.toUpperCase()}'`)
      return
    }
    
    if (gameState.usedWords?.includes(word)) {
      setError("Word already used!")
      return
    }

    // Server API Validation
    try {
      const res = await fetch('/api/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: 'thing', word: word })
      })
      const data = await res.json()
      if (!data.isValid) {
        setError("Not a valid English word!")
        return
      }
    } catch (e) {
      console.warn("Validation failed, falling back")
    }

    // Success - Move to next turn
    const activePlayers = Object.values(gameState.players).filter(p => !p.isEliminated)
    const playerIds = activePlayers.map(p => p.id)
    const currentIndex = playerIds.indexOf(playerId)
    const nextPlayerId = playerIds[(currentIndex + 1) % playerIds.length]
    
    const newUsedWords = [...(gameState.usedWords || []), word]
    const lastChar = word.charAt(word.length - 1)
    
    await update(ref(database, `games_wordchain/${gameId}`), {
      currentWord: word,
      lastLetter: lastChar,
      usedWords: newUsedWords,
      turnPlayerId: nextPlayerId,
      timeLeft: gameState.turnTimeLimit || 10,
      [`scores/${playerId}`]: (gameState.scores?.[playerId] || 0) + 10
    })
    
    setInputWord('')
    setError(null)
  }

  if (!isJoined) {
    return (
      <div className="max-w-md mx-auto space-y-8 animate-fadeIn pt-10">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-indigo-500/20">
            <Zap className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-heading font-bold text-slate-900 leading-tight">Word Chain</h1>
          <p className="text-slate-500 text-lg">Connect words, don&apos;t break the chain!</p>
        </div>

        <Card className="glass shadow-2xl border-white/50 animate-scaleIn rounded-3xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-b border-white/50">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-600" />
              Join the Chain
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wider ml-1">Your Alias</label>
              <Input
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter your name..."
                className="rounded-xl h-12 bg-white/50 border-slate-200"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wider ml-1">Game ID <span className="text-slate-400 normal-case font-normal">(optional)</span></label>
              <Input
                value={gameId}
                onChange={(e) => setGameId(e.target.value.toUpperCase())}
                placeholder="Enter ID to join..."
                className="rounded-xl h-12 bg-white/50 border-slate-200 uppercase"
              />
            </div>

            <div className="flex flex-col gap-3">
              <Button
                onClick={() => (gameId ? joinGame() : createGame())}
                className="h-14 rounded-2xl text-lg font-bold shadow-lg bg-indigo-600 hover:bg-indigo-700"
                disabled={!playerName.trim()}
              >
                {gameId ? 'Join Game' : 'Host Game'}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!gameState) return <div>Loading...</div>

  const playersArr = Object.values(gameState.players || {})
  const isMyTurn = gameState.turnPlayerId === playerId

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
      {/* Game Info Bar */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="glass p-4 rounded-2xl text-center border-white/50">
           <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Game ID</p>
           <p className="text-lg font-bold text-indigo-600">{gameId}</p>
        </Card>
        <Card className="glass p-4 rounded-2xl text-center border-white/50">
           <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Time Left</p>
           <p className={`text-lg font-bold ${gameState.timeLeft < 5 ? 'text-red-500 animate-pulse' : 'text-slate-900'}`}>{gameState.timeLeft}s</p>
        </Card>
        <Card className="glass p-4 rounded-2xl text-center border-white/50">
           <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Words</p>
           <p className="text-lg font-bold text-slate-900">{gameState.usedWords?.length || 0}</p>
        </Card>
      </div>

      {gameState.status === 'waiting' && (
        <Card className="glass p-10 text-center rounded-3xl border-white/50 min-h-[300px] flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold mb-4">Waiting for Players</h2>
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {playersArr.map(p => (
              <Badge key={p.id} variant={p.isReady ? "default" : "outline"} className="px-4 py-2 rounded-full">
                {p.name} {p.isReady ? '✅' : '⏳'}
              </Badge>
            ))}
          </div>

          {isHost && (
            <div className="w-full max-w-sm mx-auto space-y-6 mb-8 p-6 bg-slate-50 rounded-2xl border border-slate-100">
              <h3 className="font-bold text-slate-700 uppercase text-xs tracking-widest">Host Settings</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm font-bold">
                  <span>Lives per Player</span>
                  <span className="text-indigo-600">{maxLives} ❤️</span>
                </div>
                <input 
                  type="range" min="1" max="5" value={maxLives} 
                  onChange={(e) => setMaxLives(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm font-bold">
                  <span>Time per Turn</span>
                  <span className="text-indigo-600">{turnTime}s ⏱️</span>
                </div>
                <input 
                  type="range" min="5" max="15" value={turnTime} 
                  onChange={(e) => setTurnTime(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>
            </div>
          )}

          <div className="flex gap-4">
            <Button onClick={toggleReady} variant={gameState.players?.[playerId]?.isReady ? "outline" : "default"} className="h-12 px-6 rounded-xl">
              {gameState.players?.[playerId]?.isReady ? 'Ready! 👍' : 'Ready Up'}
            </Button>
            {isHost && (
              <Button 
                onClick={startGame} 
                disabled={playersArr.length < 2 || !playersArr.every(p => p.isReady)}
                className="h-12 px-8 rounded-xl bg-emerald-600 hover:bg-emerald-700"
              >
                Start Battle
              </Button>
            )}
          </div>
        </Card>
      )}

      {gameState.status === 'playing' && (
        <div className="space-y-6">
           {/* Chain Visualizer */}
           <div className="bg-white/50 p-8 rounded-3xl border border-white/80 text-center space-y-4">
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Current Word</p>
              <div className="flex items-center justify-center gap-4">
                 <div className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter">
                    {gameState.currentWord || 'START'}
                 </div>
                 {gameState.lastLetter && (
                    <div className="w-16 h-16 bg-indigo-600 text-white rounded-2xl flex items-center justify-center text-4xl font-bold animate-scaleIn">
                       {gameState.lastLetter.toUpperCase()}
                    </div>
                 )}
              </div>
              <p className="text-indigo-500 font-bold">
                {isMyTurn ? "Your turn! Type a word starting with the letter above." : `${gameState.players?.[gameState.turnPlayerId]?.name || 'Player'}'s turn...`}
              </p>
           </div>

           {/* Input Area */}
           <div className="max-w-md mx-auto space-y-4">
              <div className="relative">
                <Input
                  value={inputWord}
                  onChange={(e) => setInputWord(e.target.value)}
                  disabled={!isMyTurn}
                  placeholder={isMyTurn ? `Starts with ${gameState.lastLetter.toUpperCase()}...` : "Waiting for turn..."}
                  className="h-16 text-2xl rounded-2xl border-2 border-slate-100 focus:border-indigo-500 text-center"
                  onKeyDown={(e) => e.key === 'Enter' && submitWord()}
                />
                <Button 
                  onClick={submitWord}
                  disabled={!isMyTurn || !inputWord.trim()}
                  className="absolute right-2 top-2 h-12 w-12 rounded-xl bg-indigo-600 p-0"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
              {error && <p className="text-red-500 text-center font-bold animate-shake">{error}</p>}
           </div>

           {/* Players List */}
           <div className="flex flex-wrap justify-center gap-4">
              {playersArr.map(p => (
                <div key={p.id} className={`p-4 rounded-2xl border transition-all flex flex-col items-center min-w-[120px] ${
                  p.id === gameState.turnPlayerId ? 'bg-indigo-50 border-indigo-200 scale-110 shadow-lg z-10' : 'bg-white/40 border-white/50 opacity-60'
                } ${p.isEliminated ? 'grayscale line-through opacity-30 bg-slate-100' : ''}`}>
                  <p className="font-bold text-slate-900">{p.name}</p>
                  <div className="flex gap-0.5 my-1">
                    {[...Array(gameState.maxLives || 2)].map((_, i) => (
                      <Heart 
                        key={i} 
                        className={`w-3 h-3 ${i < (p.lives || 0) ? 'text-red-500 fill-red-500' : 'text-slate-300'}`} 
                      />
                    ))}
                  </div>
                  <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-tighter">{(gameState.scores?.[p.id]) || 0} pts</p>
                </div>
              ))}
           </div>
        </div>
      )}

      {gameState.status === 'finished' && (
        <Card className="glass p-10 text-center rounded-3xl border-white/50 animate-scaleIn">
          <div className="relative mb-8">
             <Trophy className="w-24 h-24 text-amber-500 mx-auto animate-bounce" />
             <Sparkles className="absolute top-0 right-1/4 w-8 h-8 text-indigo-400 animate-pulse" />
          </div>
          
          <h2 className="text-4xl font-heading font-black mb-2 text-slate-900 tracking-tighter">Match Over!</h2>
          <p className="text-slate-500 mb-8 font-medium">The last one standing is the champion.</p>

          <div className="space-y-4 mb-10 max-w-sm mx-auto">
            {playersArr
              .sort((a, b) => {
                if (a.isEliminated && !b.isEliminated) return 1;
                if (!a.isEliminated && b.isEliminated) return -1;
                return (gameState.scores?.[b.id] || 0) - (gameState.scores?.[a.id] || 0);
              })
              .map((p, idx) => {
                const isWinner = !p.isEliminated;
                return (
                  <div 
                    key={p.id} 
                    className={`flex items-center justify-between p-5 rounded-2xl border transition-all ${
                      isWinner 
                        ? 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 scale-105 shadow-xl shadow-amber-200/20' 
                        : 'bg-white/50 border-white/80 opacity-70'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        isWinner ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-500'
                      }`}>
                        {idx + 1}
                      </span>
                      <div className="text-left">
                        <p className={`font-bold ${isWinner ? 'text-amber-900 text-lg' : 'text-slate-700'}`}>
                          {p.name}
                          {isWinner && <span className="ml-2 text-xs uppercase tracking-widest text-amber-600 font-black">Winner</span>}
                        </p>
                        <p className="text-xs font-medium text-slate-400">{gameState.scores?.[p.id] || 0} total points</p>
                      </div>
                    </div>
                    {isWinner && <Trophy className="w-6 h-6 text-amber-500" />}
                  </div>
                );
              })
            }
          </div>
          <Button onClick={() => window.location.reload()} className="h-12 px-8 rounded-xl bg-indigo-600">
            Play Again
          </Button>
        </Card>
      )}
    </div>
  )
}
