"use client"

import { useState } from "react"
import { Check, Pencil, RotateCcw, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageHeader, PageShell } from "@/components/page-shell"
import { cn } from "@/lib/utils"

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

const BRACKET_SIZES = [4, 8, 16]

const getRoundName = (teamsInRound: number) => {
  if (teamsInRound === 2) return "Final"
  if (teamsInRound === 4) return "Semifinal"
  if (teamsInRound === 8) return "Quartas de Final"
  if (teamsInRound === 16) return "Oitavas de Final"
  return `Rodada de ${teamsInRound}`
}

const buildRounds = (numTeams: number) => {
  const rounds: BracketRound[] = []
  let roundNum = 1

  for (let teamsInRound = numTeams; teamsInRound > 1; teamsInRound /= 2) {
    rounds.push({
      name: getRoundName(teamsInRound),
      matches: Array.from({ length: teamsInRound / 2 }, (_, i) => ({
        id: `round${roundNum}-match${i}`,
        winner: null,
      })),
    })
    roundNum++
  }

  return rounds
}

const buildTeamNames = (numTeams: number) => Array.from({ length: numTeams }, (_, i) => `Time ${i + 1}`)

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
  selectable,
  editable,
  editing,
  onSelect,
  onStartEdit,
  onRename,
}: {
  name: string | null
  status: "winner" | "loser" | "pending"
  selectable: boolean
  editable: boolean
  editing: boolean
  onSelect: () => void
  onStartEdit: () => void
  onRename: (name: string) => void
}) {
  if (editing) {
    return (
      <div className="p-1.5">
        <input
          defaultValue={name ?? ""}
          onBlur={(e) => onRename(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") e.currentTarget.blur()
          }}
          autoFocus
          aria-label="Nome do time"
          className="h-9 w-full rounded-lg border border-team1 bg-ink px-2.5 text-[15px] text-fg"
        />
      </div>
    )
  }

  return (
    <div className={cn("flex items-center", status === "winner" && "bg-panel-2")}>
      <button
        type="button"
        onClick={onSelect}
        disabled={!selectable}
        className={cn(
          "flex min-h-12 flex-1 items-center justify-between gap-2 px-3.5 text-left text-[15px] transition-colors enabled:cursor-pointer enabled:hover:bg-panel-2",
          status === "winner" ? "font-bold text-fg" : "font-medium",
          (!name || status === "loser") && "text-fg-subtle",
        )}
      >
        <span className="truncate">{name ?? "A definir"}</span>
        {status === "winner" && <Check className="size-4 flex-none" strokeWidth={2.2} aria-label="Vencedor" />}
      </button>
      {editable && (
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onStartEdit}
          aria-label={`Editar nome de ${name}`}
          className="mr-1.5"
        >
          <Pencil className="size-3.5" />
        </Button>
      )}
    </div>
  )
}

export default function CS2TournamentBracket() {
  const [numTeams, setNumTeams] = useState(8)
  const [editingSlot, setEditingSlot] = useState<string | null>(null)
  const [teamNames, setTeamNames] = useState<string[]>(() => buildTeamNames(8))
  const [rounds, setRounds] = useState<BracketRound[]>(() => buildRounds(8))

  const bracket = resolveBracket(teamNames, rounds)
  const finalMatch = bracket.at(-1)?.[0]
  const champion = finalMatch ? getMatchWinner(finalMatch) : null
  const hasResults = rounds.some((round) => round.matches.some((match) => match.winner))

  const changeSize = (size: number) => {
    if (size === numTeams) return
    setNumTeams(size)
    setTeamNames(buildTeamNames(size))
    setRounds(buildRounds(size))
    setEditingSlot(null)
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

  return (
    <PageShell>
      <PageHeader
        title="Chaveamento"
        description="Clique no time que venceu. Trocar um resultado limpa as fases seguintes."
        actions={
          <>
            <div role="group" aria-label="Número de times" className="flex gap-0.5 rounded-xl border border-line bg-panel p-1">
              {BRACKET_SIZES.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => changeSize(size)}
                  aria-pressed={size === numTeams}
                  className={cn(
                    "h-9 cursor-pointer rounded-lg px-3.5 text-sm font-semibold transition-colors",
                    size === numTeams ? "bg-line text-fg" : "text-fg-muted hover:text-fg",
                  )}
                >
                  {size} times
                </button>
              ))}
            </div>
            <Button variant="secondary" onClick={() => setRounds(buildRounds(numTeams))} disabled={!hasResults}>
              <RotateCcw />
              Limpar resultados
            </Button>
          </>
        }
      />

      <div className="overflow-x-auto pb-2">
        <div className="flex min-w-max items-stretch gap-5">
          {bracket.map((matches, roundIndex) => (
            <section key={rounds[roundIndex].name} className="flex w-60 flex-col gap-3.5">
              <h2 className="text-[13px] font-semibold tracking-[0.06em] text-fg-muted uppercase">
                {rounds[roundIndex].name}
              </h2>
              <div className="flex flex-1 flex-col justify-around gap-4">
                {matches.map((match, matchIndex) => (
                  <div
                    key={match.id}
                    className="flex flex-col divide-y divide-line overflow-hidden rounded-xl border border-line bg-panel"
                  >
                    {(["team1", "team2"] as const).map((slot, slotIndex) => {
                      const slotKey = `${match.id}-${slot}`
                      const teamIndex = matchIndex * 2 + slotIndex
                      return (
                        <TeamRow
                          key={slot}
                          name={match[slot]}
                          status={!match.winner ? "pending" : match.winner === slot ? "winner" : "loser"}
                          selectable={Boolean(match.team1 && match.team2)}
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
            </section>
          ))}

          <section className="flex w-[220px] flex-col gap-3.5">
            <h2 className="text-[13px] font-semibold tracking-[0.06em] text-fg-muted uppercase">Campeão</h2>
            <div className="flex flex-1 flex-col justify-center">
              <div
                className={cn(
                  "flex flex-col items-center gap-2.5 rounded-[14px] border bg-panel px-4 py-6 text-center",
                  champion ? "border-team2" : "border-line",
                )}
              >
                <Trophy
                  className={cn("size-8", champion ? "text-team2" : "text-line-strong")}
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
                <span className={cn("text-xl font-bold", champion ? "text-fg" : "text-fg-subtle")}>
                  {champion ?? "A definir"}
                </span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </PageShell>
  )
}
