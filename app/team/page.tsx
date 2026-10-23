"use client"

import { useState } from "react"
import { Copy, Plus, Shuffle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageHeader, PageShell } from "@/components/page-shell"
import { cn } from "@/lib/utils"

type TeamKey = "team1" | "team2" | "bench"

const TEAM_SIZE = 5
const BENCH_SIZE = 50
const LIMITS: Record<TeamKey, number> = { team1: TEAM_SIZE, team2: TEAM_SIZE, bench: BENCH_SIZE }

function TeamColumn({
  title,
  dotClass,
  players,
  maxPlayers,
  isTeam,
  onRename,
  onAdd,
  onRemove,
  moveTargets,
}: {
  title: string
  dotClass: string
  players: string[]
  maxPlayers: number
  isTeam: boolean
  onRename?: (name: string) => void
  onAdd: (player: string) => void
  onRemove: (index: number) => void
  moveTargets?: { label: string; name: string; textClass: string; onMove: (index: number) => void }[]
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
    <section className="flex flex-col gap-3.5 rounded-[14px] border border-line bg-panel p-[18px]">
      <div className="flex items-center gap-2.5">
        <span className={cn("size-2.5 flex-none rounded-full", dotClass)} />
        {onRename ? (
          <input
            type="text"
            value={title}
            onChange={(e) => onRename(e.target.value)}
            aria-label={`Nome do ${title}`}
            className="-ml-2.5 h-10 min-w-0 flex-1 rounded-lg border border-transparent bg-transparent px-2.5 text-lg font-bold text-fg hover:border-line focus:border-team1"
          />
        ) : (
          <h2 className="flex-1 text-lg font-bold">{title}</h2>
        )}
        <span className="font-mono text-[13px] text-fg-muted">
          {players.length}
          {isTeam && `/${maxPlayers}`}
        </span>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={newPlayer}
          onChange={(e) => setNewPlayer(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addPlayer()}
          aria-label={`Nome do jogador para ${title}`}
          placeholder="Nome do jogador"
          maxLength={20}
          disabled={isFull}
          className="h-11 min-w-0 flex-1 rounded-[10px] border border-line bg-ink px-3 text-sm text-fg placeholder:text-fg-subtle focus:border-team1 disabled:opacity-50"
        />
        <Button
          variant="secondary"
          size="icon"
          onClick={addPlayer}
          disabled={!newPlayer.trim() || isFull}
          aria-label={`Adicionar jogador em ${title}`}
          className="bg-panel-2"
        >
          <Plus className="size-[18px]" />
        </Button>
      </div>

      {players.length === 0 ? (
        <p className="py-5 text-center text-sm text-fg-muted">Nenhum jogador ainda</p>
      ) : (
        <ol className="flex flex-col gap-1.5">
          {players.map((player, index) => (
            <li key={index} className="flex items-center gap-2.5 rounded-[10px] bg-panel-2 py-1 pr-1 pl-3">
              <span className="w-4 font-mono text-xs text-fg-muted">{index + 1}</span>
              <span className="min-w-0 flex-1 truncate text-[15px] font-medium">{player}</span>
              {moveTargets?.map((target) => (
                <Button
                  key={target.label}
                  variant="ghost"
                  size="sm"
                  onClick={() => target.onMove(index)}
                  aria-label={`Mover ${player} para ${target.name}`}
                  className={cn("px-2 text-xs", target.textClass)}
                >
                  {target.label}
                </Button>
              ))}
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => onRemove(index)}
                aria-label={`Remover ${player}`}
              >
                <X />
              </Button>
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}

export default function CS2TeamSelector() {
  const [team1, setTeam1] = useState("Time 1")
  const [team2, setTeam2] = useState("Time 2")
  const [players, setPlayers] = useState<Record<TeamKey, string[]>>({ team1: [], team2: [], bench: [] })
  const [copySuccess, setCopySuccess] = useState(false)

  const addPlayer = (team: TeamKey, player: string) => {
    setPlayers((prev) => ({ ...prev, [team]: [...prev[team], player] }))
  }

  const removePlayer = (team: TeamKey, index: number) => {
    setPlayers((prev) => ({ ...prev, [team]: prev[team].filter((_, i) => i !== index) }))
  }

  const moveFromBench = (index: number, to: "team1" | "team2") => {
    setPlayers((prev) => {
      if (prev[to].length >= LIMITS[to]) return prev
      return {
        ...prev,
        [to]: [...prev[to], prev.bench[index]],
        bench: prev.bench.filter((_, i) => i !== index),
      }
    })
  }

  // Embaralha todo mundo e divide em dois times iguais (até 5); quem sobra vai pro banco
  const shuffleTeams = () => {
    setPlayers((prev) => {
      const all = [...prev.team1, ...prev.team2, ...prev.bench]
      for (let i = all.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[all[i], all[j]] = [all[j], all[i]]
      }
      const perTeam = Math.min(TEAM_SIZE, Math.floor(all.length / 2))
      return { team1: all.slice(0, perTeam), team2: all.slice(perTeam, perTeam * 2), bench: all.slice(perTeam * 2) }
    })
  }

  const totalPlayers = players.team1.length + players.team2.length + players.bench.length

  const copyTeamsFormatted = async () => {
    const formatList = (list: string[]) => list.map((p, i) => `${i + 1}. ${p}`).join("\n")
    const sections = [`🎮 ${team1}\n${formatList(players.team1)}`, `🎮 ${team2}\n${formatList(players.team2)}`]
    if (players.bench.length > 0) sections.push(`🪑 Banco\n${formatList(players.bench)}`)

    try {
      await navigator.clipboard.writeText(`Times escolhidos\n${sections.join("\n\n")}`)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  return (
    <PageShell>
      <PageHeader
        title="Seletor de times"
        description="Até 5 por time. Quem sobrar fica no banco."
        actions={
          <>
            <Button variant="secondary" onClick={shuffleTeams} disabled={totalPlayers < 2}>
              <Shuffle />
              Sortear times
            </Button>
            <Button onClick={copyTeamsFormatted} disabled={totalPlayers === 0}>
              <Copy />
              {copySuccess ? "Copiado" : "Copiar times"}
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] items-start gap-4">
        <TeamColumn
          title={team1}
          dotClass="bg-team1"
          players={players.team1}
          maxPlayers={TEAM_SIZE}
          isTeam
          onRename={setTeam1}
          onAdd={(player) => addPlayer("team1", player)}
          onRemove={(index) => removePlayer("team1", index)}
        />
        <TeamColumn
          title={team2}
          dotClass="bg-team2"
          players={players.team2}
          maxPlayers={TEAM_SIZE}
          isTeam
          onRename={setTeam2}
          onAdd={(player) => addPlayer("team2", player)}
          onRemove={(index) => removePlayer("team2", index)}
        />
        <TeamColumn
          title="Banco"
          dotClass="bg-fg-muted"
          players={players.bench}
          maxPlayers={BENCH_SIZE}
          isTeam={false}
          onAdd={(player) => addPlayer("bench", player)}
          onRemove={(index) => removePlayer("bench", index)}
          moveTargets={[
            { label: "T1", name: team1, textClass: "text-team1", onMove: (index) => moveFromBench(index, "team1") },
            { label: "T2", name: team2, textClass: "text-team2", onMove: (index) => moveFromBench(index, "team2") },
          ]}
        />
      </div>
    </PageShell>
  )
}
