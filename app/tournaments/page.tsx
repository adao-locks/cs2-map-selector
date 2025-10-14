"use client"

import { useState } from "react"
import Link from "next/link"
import { Trophy, Plus, X, Edit2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Match {
  id: string
  team1: string
  team2: string
  winner: "team1" | "team2" | null
  score1?: number
  score2?: number
}

interface BracketRound {
  name: string
  matches: Match[]
}

export default function CS2TournamentBracket() {
  const [numTeams, setNumTeams] = useState<number>(8)
  const [bracketStarted, setBracketStarted] = useState(false)
  const [editingMatch, setEditingMatch] = useState<string | null>(null)
  const [rounds, setRounds] = useState<BracketRound[]>([])

  const initializeBracket = () => {
    const initialMatches: Match[] = []
    const numMatches = numTeams / 2

    for (let i = 0; i < numMatches; i++) {
      initialMatches.push({
        id: `round1-match${i}`,
        team1: `Time ${i * 2 + 1}`,
        team2: `Time ${i * 2 + 2}`,
        winner: null,
      })
    }

    const initialRounds: BracketRound[] = [
      {
        name: numTeams === 8 ? "Quartas de Final" : numTeams === 4 ? "Semifinal" : "Oitavas de Final",
        matches: initialMatches,
      },
    ]

    // Calculate number of rounds needed
    let teamsRemaining = numTeams / 2
    let roundNum = 2
    while (teamsRemaining > 1) {
      const roundMatches: Match[] = []
      for (let i = 0; i < teamsRemaining / 2; i++) {
        roundMatches.push({
          id: `round${roundNum}-match${i}`,
          team1: "TBD",
          team2: "TBD",
          winner: null,
        })
      }
      initialRounds.push({
        name: teamsRemaining === 2 ? "Final" : teamsRemaining === 4 ? "Semifinal" : `Rodada ${roundNum}`,
        matches: roundMatches,
      })
      teamsRemaining /= 2
      roundNum++
    }

    setRounds(initialRounds)
    setBracketStarted(true)
  }

  const updateMatchWinner = (roundIndex: number, matchIndex: number, winner: "team1" | "team2") => {
    const newRounds = [...rounds]
    const match = newRounds[roundIndex].matches[matchIndex]
    match.winner = winner

    // Advance winner to next round
    if (roundIndex < rounds.length - 1) {
      const nextRoundMatchIndex = Math.floor(matchIndex / 2)
      const nextMatch = newRounds[roundIndex + 1].matches[nextRoundMatchIndex]

      if (matchIndex % 2 === 0) {
        nextMatch.team1 = winner === "team1" ? match.team1 : match.team2
      } else {
        nextMatch.team2 = winner === "team1" ? match.team1 : match.team2
      }
    }

    setRounds(newRounds)
  }

  const updateTeamName = (roundIndex: number, matchIndex: number, team: "team1" | "team2", newName: string) => {
    const newRounds = [...rounds]
    newRounds[roundIndex].matches[matchIndex][team] = newName
    setRounds(newRounds)
  }

  const resetBracket = () => {
    setBracketStarted(false)
    setRounds([])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 md:p-6">
      {/* Background Effects */}
      <div className="fixed inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0deg,rgba(120,119,198,0.1)_60deg,transparent_120deg)]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/">
            <Button
              variant="ghost"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all duration-300"
            >
              ← Voltar para Menu
            </Button>
          </Link>
        </div>

        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <Trophy className="w-10 h-10 text-yellow-400" />
            <h1 className="text-4xl md:text-5xl font-bold text-white">Chaveamento de Torneio</h1>
            <Trophy className="w-10 h-10 text-yellow-400" />
          </div>
          <p className="text-purple-200 text-lg">Configure e gerencie seu torneio de CS2</p>
        </div>

        {!bracketStarted ? (
          // Setup Screen
          <div className="max-w-md mx-auto">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">Configurar Torneio</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-white mb-2 font-medium">Número de Times</label>
                  <select
                    value={numTeams}
                    onChange={(e) => setNumTeams(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value={4} className="bg-slate-800">
                      4 Times
                    </option>
                    <option value={8} className="bg-slate-800">
                      8 Times
                    </option>
                    <option value={16} className="bg-slate-800">
                      16 Times
                    </option>
                  </select>
                </div>

                <Button
                  onClick={initializeBracket}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-6 text-lg"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Iniciar Chaveamento
                </Button>
              </div>
            </div>
          </div>
        ) : (
          // Bracket Display
          <div className="space-y-6">
            <div className="flex justify-center gap-4 mb-8">
              <Button onClick={resetBracket} variant="destructive" className="bg-red-600 hover:bg-red-700">
                <X className="w-4 h-4 mr-2" />
                Resetar Chaveamento
              </Button>
            </div>

            <div className="overflow-x-auto pb-8">
              <div className="flex gap-8 min-w-max justify-center">
                {rounds.map((round, roundIndex) => (
                  <div key={roundIndex} className="flex flex-col gap-4" style={{ minWidth: "280px" }}>
                    <h3 className="text-xl font-bold text-center text-white mb-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg py-3">
                      {round.name}
                    </h3>

                    <div
                      className="flex flex-col gap-6"
                      style={{
                        marginTop: roundIndex > 0 ? `${Math.pow(2, roundIndex) * 40}px` : "0",
                      }}
                    >
                      {round.matches.map((match, matchIndex) => (
                        <div
                          key={match.id}
                          className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg overflow-hidden"
                          style={{
                            marginBottom: roundIndex > 0 ? `${Math.pow(2, roundIndex) * 40}px` : "0",
                          }}
                        >
                          {/* Team 1 */}
                          <div
                            className={`p-4 border-b border-white/10 cursor-pointer transition-all ${
                              match.winner === "team1"
                                ? "bg-green-600/30 border-l-4 border-l-green-500"
                                : match.winner === "team2"
                                  ? "bg-red-600/20"
                                  : "hover:bg-white/5"
                            }`}
                            onClick={() => match.team1 !== "TBD" && updateMatchWinner(roundIndex, matchIndex, "team1")}
                          >
                            {editingMatch === `${roundIndex}-${matchIndex}-team1` ? (
                              <div className="flex gap-2">
                                <Input
                                  defaultValue={match.team1}
                                  onBlur={(e: { target: { value: string } }) => {
                                    updateTeamName(roundIndex, matchIndex, "team1", e.target.value)
                                    setEditingMatch(null)
                                  }}
                                  onKeyDown={(e: { key: string; currentTarget: { value: string } }) => {
                                    if (e.key === "Enter") {
                                      updateTeamName(roundIndex, matchIndex, "team1", e.currentTarget.value)
                                      setEditingMatch(null)
                                    }
                                  }}
                                  autoFocus
                                  className="bg-white/10 border-white/20 text-white"
                                />
                              </div>
                            ) : (
                              <div className="flex items-center justify-between">
                                <span className="text-white font-medium">{match.team1}</span>
                                {roundIndex === 0 && (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setEditingMatch(`${roundIndex}-${matchIndex}-team1`)
                                    }}
                                    className="h-6 w-6 p-0 text-white/60 hover:text-white"
                                  >
                                    <Edit2 className="w-3 h-3" />
                                  </Button>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Team 2 */}
                          <div
                            className={`p-4 cursor-pointer transition-all ${
                              match.winner === "team2"
                                ? "bg-green-600/30 border-l-4 border-l-green-500"
                                : match.winner === "team1"
                                  ? "bg-red-600/20"
                                  : "hover:bg-white/5"
                            }`}
                            onClick={() => match.team2 !== "TBD" && updateMatchWinner(roundIndex, matchIndex, "team2")}
                          >
                            {editingMatch === `${roundIndex}-${matchIndex}-team2` ? (
                              <div className="flex gap-2">
                                <Input
                                  defaultValue={match.team2}
                                  onBlur={(e: { target: { value: string } }) => {
                                    updateTeamName(roundIndex, matchIndex, "team2", e.target.value)
                                    setEditingMatch(null)
                                  }}
                                  onKeyDown={(e: { key: string; currentTarget: { value: string } }) => {
                                    if (e.key === "Enter") {
                                      updateTeamName(roundIndex, matchIndex, "team2", e.currentTarget.value)
                                      setEditingMatch(null)
                                    }
                                  }}
                                  autoFocus
                                  className="bg-white/10 border-white/20 text-white"
                                />
                              </div>
                            ) : (
                              <div className="flex items-center justify-between">
                                <span className="text-white font-medium">{match.team2}</span>
                                {roundIndex === 0 && (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setEditingMatch(`${roundIndex}-${matchIndex}-team2`)
                                    }}
                                    className="h-6 w-6 p-0 text-white/60 hover:text-white"
                                  >
                                    <Edit2 className="w-3 h-3" />
                                  </Button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Winner Display */}
            {rounds.length > 0 && rounds[rounds.length - 1].matches[0].winner && (
              <div className="text-center mt-12">
                <div className="inline-block bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-xl p-8 border-4 border-yellow-300 shadow-2xl">
                  <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-900" />
                  <h2 className="text-3xl font-bold text-yellow-900 mb-2">🏆 CAMPEÃO 🏆</h2>
                  <p className="text-2xl font-bold text-yellow-950">
                    {rounds[rounds.length - 1].matches[0].winner === "team1"
                      ? rounds[rounds.length - 1].matches[0].team1
                      : rounds[rounds.length - 1].matches[0].team2}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
