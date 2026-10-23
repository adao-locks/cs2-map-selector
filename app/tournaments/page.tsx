"use client"

import { useState } from "react"
import { Trophy, Plus, X, Edit2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PageShell } from "@/components/page-shell"

type Slot = "team1" | "team2"

interface Match {
  id: string
  winner: Slot | null
}

interface BracketRound {
  name: string
  matches: Match[]
}

// Partida com os times resolvidos: na 1ª rodada vêm dos nomes digitados, nas demais dos vencedores anteriores
interface ResolvedMatch extends Match {
  team1: string | null
  team2: string | null
}

const getRoundName = (teamsInRound: number) => {
  if (teamsInRound === 2) return "Final"
  if (teamsInRound === 4) return "Semifinal"
  if (teamsInRound === 8) return "Quartas de Final"
  if (teamsInRound === 16) return "Oitavas de Final"
  return `Rodada de ${teamsInRound}`
}

const getMatchWinner = (match: ResolvedMatch) => (match.winner ? match[match.winner] : null)

const resolveBracket = (teamNames: string[], rounds: BracketRound[]) => {
  const resolved: ResolvedMatch[][] = []

  rounds.forEach((round, roundIndex) => {
    resolved.push(
      round.matches.map((match, matchIndex) =>
        roundIndex === 0
          ? { ...match, team1: teamNames[matchIndex * 2], team2: teamNames[matchIndex * 2 + 1] }
          : {
              ...match,
              team1: getMatchWinner(resolved[roundIndex - 1][matchIndex * 2]),
              team2: getMatchWinner(resolved[roundIndex - 1][matchIndex * 2 + 1]),
            },
      ),
    )
  })

  return resolved
}

function TeamRow({
  name,
  status,
  editable,
  editing,
  onSelect,
  onStartEdit,
  onRename,
}: {
  name: string | null
  status: "winner" | "loser" | "pending"
  editable: boolean
  editing: boolean
  onSelect: () => void
  onStartEdit: () => void
  onRename: (name: string) => void
}) {
  if (editing) {
    return (
      <div className="p-4">
        <Input
          defaultValue={name ?? ""}
          onBlur={(e) => onRename(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") e.currentTarget.blur()
          }}
          autoFocus
          aria-label="Nome do time"
          className="bg-white/10 border-white/20 text-white"
        />
      </div>
    )
  }

  return (
    <div
      className={`flex items-center justify-between transition-all ${
        status === "winner"
          ? "bg-green-600/30 border-l-4 border-l-green-500"
          : status === "loser"
            ? "bg-red-600/20"
            : "hover:bg-white/5"
      }`}
    >
      <button
        type="button"
        onClick={onSelect}
        disabled={!name}
        className="flex-1 p-4 text-left text-white font-medium cursor-pointer disabled:cursor-default disabled:text-white/40"
      >
        {name ?? "A definir"}
      </button>
      {editable && (
        <Button
          size="sm"
          variant="ghost"
          onClick={onStartEdit}
          aria-label={`Editar nome de ${name}`}
          className="mr-3 h-6 w-6 p-0 text-white/60 hover:text-white"
        >
          <Edit2 className="w-3 h-3" />
        </Button>
      )}
    </div>
  )
}

export default function CS2TournamentBracket() {
  const [numTeams, setNumTeams] = useState<number>(8)
  const [bracketStarted, setBracketStarted] = useState(false)
  const [editingSlot, setEditingSlot] = useState<string | null>(null)
  const [teamNames, setTeamNames] = useState<string[]>([])
  const [rounds, setRounds] = useState<BracketRound[]>([])

  const bracket = resolveBracket(teamNames, rounds)
  const finalMatch = bracket.at(-1)?.[0]
  const champion = finalMatch ? getMatchWinner(finalMatch) : null

  const initializeBracket = () => {
    const initialRounds: BracketRound[] = []
    let roundNum = 1

    for (let teamsInRound = numTeams; teamsInRound > 1; teamsInRound /= 2) {
      initialRounds.push({
        name: getRoundName(teamsInRound),
        matches: Array.from({ length: teamsInRound / 2 }, (_, i) => ({
          id: `round${roundNum}-match${i}`,
          winner: null,
        })),
      })
      roundNum++
    }

    setTeamNames(Array.from({ length: numTeams }, (_, i) => `Time ${i + 1}`))
    setRounds(initialRounds)
    setBracketStarted(true)
  }

  const updateMatchWinner = (roundIndex: number, matchIndex: number, winner: Slot) => {
    const match = bracket[roundIndex][matchIndex]
    if (!match.team1 || !match.team2 || match.winner === winner) return

    // Troca o vencedor e limpa os resultados das partidas seguintes que dependiam dele
    setRounds((prev) =>
      prev.map((round, ri) => {
        if (ri < roundIndex) return round
        const affectedMatch = Math.floor(matchIndex / 2 ** (ri - roundIndex))
        return {
          ...round,
          matches: round.matches.map((m, mi) =>
            mi === affectedMatch ? { ...m, winner: ri === roundIndex ? winner : null } : m,
          ),
        }
      }),
    )
  }

  const updateTeamName = (teamIndex: number, newName: string) => {
    const trimmed = newName.trim()
    if (trimmed) {
      setTeamNames((prev) => prev.map((name, i) => (i === teamIndex ? trimmed : name)))
    }
    setEditingSlot(null)
  }

  const resetBracket = () => {
    setBracketStarted(false)
    setRounds([])
    setTeamNames([])
  }

  return (
    <PageShell>
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
                <label htmlFor="num-teams" className="block text-white mb-2 font-medium">
                  Número de Times
                </label>
                <select
                  id="num-teams"
                  value={numTeams}
                  onChange={(e) => setNumTeams(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {[4, 8, 16].map((n) => (
                    <option key={n} value={n} className="bg-slate-800">
                      {n} Times
                    </option>
                  ))}
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
              {bracket.map((matches, roundIndex) => (
                <div key={rounds[roundIndex].name} className="flex flex-col gap-4" style={{ minWidth: "280px" }}>
                  <h3 className="text-xl font-bold text-center text-white mb-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg py-3">
                    {rounds[roundIndex].name}
                  </h3>

                  <div
                    className="flex flex-col gap-6"
                    style={{
                      marginTop: roundIndex > 0 ? `${Math.pow(2, roundIndex) * 40}px` : "0",
                    }}
                  >
                    {matches.map((match, matchIndex) => (
                      <div
                        key={match.id}
                        className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg overflow-hidden divide-y divide-white/10"
                        style={{
                          marginBottom: roundIndex > 0 ? `${Math.pow(2, roundIndex) * 40}px` : "0",
                        }}
                      >
                        {(["team1", "team2"] as const).map((slot, slotIndex) => {
                          const slotKey = `${match.id}-${slot}`
                          const teamIndex = matchIndex * 2 + slotIndex
                          return (
                            <TeamRow
                              key={slot}
                              name={match[slot]}
                              status={!match.winner ? "pending" : match.winner === slot ? "winner" : "loser"}
                              editable={roundIndex === 0}
                              editing={editingSlot === slotKey}
                              onSelect={() => updateMatchWinner(roundIndex, matchIndex, slot)}
                              onStartEdit={() => setEditingSlot(slotKey)}
                              onRename={(name) => updateTeamName(teamIndex, name)}
                            />
                          )
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Winner Display */}
          {champion && (
            <div className="text-center mt-12">
              <div className="inline-block bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-xl p-8 border-4 border-yellow-300 shadow-2xl">
                <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-900" />
                <h2 className="text-3xl font-bold text-yellow-900 mb-2">🏆 CAMPEÃO 🏆</h2>
                <p className="text-2xl font-bold text-yellow-950">{champion}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </PageShell>
  )
}
