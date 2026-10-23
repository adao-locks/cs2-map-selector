"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PageShell } from "@/components/page-shell"
import { TeamNameInputs } from "@/components/team-name-inputs"

type TeamKey = "team1" | "team2" | "bench"

const TEAM_SIZE = 5
const BENCH_SIZE = 50

const THEMES = {
  cyan: {
    dot: "from-cyan-400 to-blue-500",
    title: "text-cyan-400",
    count: "bg-cyan-500/20 text-cyan-400 border-cyan-500/50",
    input: "focus:border-cyan-400 focus:ring-cyan-400/20",
    add: "from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 hover:shadow-cyan-500/25",
    row: "bg-cyan-500/10 border-cyan-500/30 hover:bg-cyan-500/20",
    index: "from-cyan-500 to-blue-600",
  },
  orange: {
    dot: "from-orange-400 to-red-500",
    title: "text-orange-400",
    count: "bg-orange-500/20 text-orange-400 border-orange-500/50",
    input: "focus:border-orange-400 focus:ring-orange-400/20",
    add: "from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 hover:shadow-orange-500/25",
    row: "bg-orange-500/10 border-orange-500/30 hover:bg-orange-500/20",
    index: "from-orange-500 to-red-600",
  },
  green: {
    dot: "from-green-400 to-green-500",
    title: "text-green-400",
    count: "bg-green-500/20 text-green-400 border-green-500/50",
    input: "focus:border-green-400 focus:ring-green-400/20",
    add: "from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 hover:shadow-green-500/25",
    row: "bg-green-500/10 border-green-500/30 hover:bg-green-500/20",
    index: "from-green-500 to-green-600",
  },
}

function TeamColumn({
  title,
  players,
  maxPlayers,
  showMax,
  theme,
  onAdd,
  onRemove,
}: {
  title: string
  players: string[]
  maxPlayers: number
  showMax: boolean
  theme: (typeof THEMES)[keyof typeof THEMES]
  onAdd: (player: string) => void
  onRemove: (index: number) => void
}) {
  const [newPlayer, setNewPlayer] = useState("")
  const isFull = players.length >= maxPlayers

  const addPlayer = () => {
    if (newPlayer.trim() && !isFull) {
      onAdd(newPlayer.trim())
      setNewPlayer("")
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${theme.dot}`}></div>
        <h3 className={`text-xl font-bold ${theme.title}`}>{title}</h3>
        <Badge className={`border ${theme.count}`}>
          {players.length}
          {showMax && `/${maxPlayers}`}
        </Badge>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={newPlayer}
          onChange={(e) => setNewPlayer(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addPlayer()}
          aria-label={`Nome do jogador para ${title}`}
          className={`flex-1 p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 transition-all ${theme.input}`}
          placeholder="Nome do jogador"
          maxLength={20}
          disabled={isFull}
        />
        <Button
          onClick={addPlayer}
          disabled={!newPlayer.trim() || isFull}
          aria-label={`Adicionar jogador em ${title}`}
          className={`bg-gradient-to-r text-white border-0 px-6 font-semibold shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${theme.add}`}
        >
          ➕
        </Button>
      </div>

      <div className="space-y-2">
        {players.map((player, index) => (
          <div
            key={index}
            className={`flex items-center justify-between p-3 backdrop-blur-md border rounded-lg group transition-all duration-300 ${theme.row}`}
          >
            <div className="flex items-center gap-3">
              <Badge
                className={`bg-gradient-to-r text-white border-0 w-8 h-8 flex items-center justify-center ${theme.index}`}
              >
                {index + 1}
              </Badge>
              <span className="text-white font-medium">{player}</span>
            </div>
            <Button
              onClick={() => onRemove(index)}
              size="sm"
              aria-label={`Remover ${player}`}
              className="bg-red-500/20 hover:bg-red-500/40 text-red-400 border border-red-500/50 md:opacity-0 md:group-hover:opacity-100 focus-visible:opacity-100 transition-all duration-300"
            >
              ✕
            </Button>
          </div>
        ))}
        {players.length === 0 && <div className="text-center py-8 text-gray-400 italic">Nenhum jogador adicionado</div>}
      </div>
    </div>
  )
}

export default function CS2TeamSelector() {
  const [team1, setTeam1] = useState("Time 1")
  const [team2, setTeam2] = useState("Time 2")
  const [players, setPlayers] = useState<Record<TeamKey, string[]>>({ team1: [], team2: [], bench: [] })
  const [copySuccess, setCopySuccess] = useState(false)

  const columns = [
    { key: "team1", title: team1, maxPlayers: TEAM_SIZE, showMax: true, theme: THEMES.cyan },
    { key: "team2", title: team2, maxPlayers: TEAM_SIZE, showMax: true, theme: THEMES.orange },
    { key: "bench", title: "Banco", maxPlayers: BENCH_SIZE, showMax: false, theme: THEMES.green },
  ] as const

  const addPlayer = (team: TeamKey, player: string) => {
    setPlayers((prev) => ({ ...prev, [team]: [...prev[team], player] }))
  }

  const removePlayer = (team: TeamKey, index: number) => {
    setPlayers((prev) => ({ ...prev, [team]: prev[team].filter((_, i) => i !== index) }))
  }

  const hasPlayers = Object.values(players).some((list) => list.length > 0)

  const copyTeamsFormatted = async () => {
    const formatList = (list: string[]) => list.map((p, i) => `${i + 1}. ${p}`).join("\n")
    const sections = [`🎮 ${team1}\n${formatList(players.team1)}`, `🎮 ${team2}\n${formatList(players.team2)}`]
    if (players.bench.length > 0) sections.push(`🪑 Banco\n${formatList(players.bench)}`)

    const formatted = `Times escolhidos\n${sections.join("\n\n")}`

    try {
      await navigator.clipboard.writeText(formatted)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  return (
    <PageShell className="mt-4">
      <TeamNameInputs team1={team1} team2={team2} onTeam1Change={setTeam1} onTeam2Change={setTeam2} />

      <div className="mt-12 mb-12 p-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl">
        <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
          <span className="text-2xl">👥</span>
          <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            Escolha dos Times
          </span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {columns.map((column) => (
            <TeamColumn
              key={column.key}
              title={column.title}
              players={players[column.key]}
              maxPlayers={column.maxPlayers}
              showMax={column.showMax}
              theme={column.theme}
              onAdd={(player) => addPlayer(column.key, player)}
              onRemove={(index) => removePlayer(column.key, index)}
            />
          ))}
        </div>

        {/* Copy Button */}
        {hasPlayers && (
          <div className="mt-8 flex justify-center">
            <Button
              onClick={copyTeamsFormatted}
              className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white border-0 px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
            >
              {copySuccess ? "✅ Copiado!" : "📋 Copiar Times Formatados"}
            </Button>
          </div>
        )}
      </div>
    </PageShell>
  )
}
