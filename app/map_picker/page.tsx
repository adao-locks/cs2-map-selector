/* eslint-disable @next/next/no-img-element */
"use client"

import { useState } from "react"
import { Copy, RotateCcw, Swords } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageHeader, PageShell } from "@/components/page-shell"
import { TeamNameInputs } from "@/components/team-name-inputs"
import { cn } from "@/lib/utils"

type TeamId = 1 | 2
// 3 = Sistema, que faz o último veto e escolhe o decider
type Actor = TeamId | 3
type Side = "CT" | "TR"
type VetoAction = "ban" | "pick"

type MapState = {
  name: string
  status: "available" | "banned" | "picked"
  pickedBy: Actor | null
  side: Side | null
}

type HistoryEntry =
  | { team: Actor; type: VetoAction; map: string }
  | { team: TeamId; type: "side"; map: string; side: Side }

const MAP_POOL = [
  "Ancient",
  "Aztec",
  "Dust II",
  "Inferno",
  "Mirage",
  "Nuke",
  "Overpass",
  "Train",
  "Anubis",
  "Cbble",
  "Cache",
  "Vertigo",
]

// Sequência dos times: 6 vetos, 2 picks e 2 vetos; o Sistema fecha com o decider
const TOTAL_TEAM_ACTIONS = 10

const initialMaps = (): MapState[] =>
  MAP_POOL.map((name): MapState => ({ name, status: "available", pickedBy: null, side: null }))

const getImagePath = (mapName: string) => `/assets/maps/${mapName.toLowerCase().replace(/\s+/g, "-")}.jpg`

const otherTeam = (team: TeamId): TeamId => (team === 1 ? 2 : 1)

const getNextAction = (history: HistoryEntry[]): VetoAction => {
  const totalBans = history.filter((a) => a.type === "ban").length
  const totalPicks = history.filter((a) => a.type === "pick").length

  if (totalBans < 6) return "ban"
  if (totalPicks < 2) return "pick"
  return "ban"
}

const describeAction = (entry: HistoryEntry) => {
  if (entry.type === "side") return `começa de ${entry.side} em`
  return entry.type === "ban" ? "vetou" : "escolheu"
}

// Quem não escolheu o mapa escolhe o lado. O decider não tem escolha: o lado sai no round faca.
const getSideChooser = (map: MapState): TeamId | null =>
  map.pickedBy === 1 || map.pickedBy === 2 ? otherTeam(map.pickedBy) : null

const TEAM_TEXT_CLASS: Record<Actor, string> = {
  1: "text-team1",
  2: "text-team2",
  3: "text-system",
}

const TEAM_DOT_CLASS: Record<Actor, string> = {
  1: "bg-team1",
  2: "bg-team2",
  3: "bg-system",
}

const PICK_BORDER_CLASS: Record<Actor, string> = {
  1: "border-team1",
  2: "border-team2",
  3: "border-system",
}

const HISTORY_TAG: Record<HistoryEntry["type"], { label: string; className: string }> = {
  ban: { label: "VETO", className: "bg-ban-bg text-ban" },
  pick: { label: "PICK", className: "bg-pick-bg text-fg" },
  side: { label: "LADO", className: "bg-panel-2 text-fg-muted" },
}

export default function CS2MapSelector() {
  const [team1, setTeam1] = useState("Time 1")
  const [team2, setTeam2] = useState("Time 2")
  const [currentTeam, setCurrentTeam] = useState<TeamId>(1)
  const [maps, setMaps] = useState<MapState[]>(initialMaps)
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [copySuccess, setCopySuccess] = useState(false)

  const nextAction = getNextAction(history)
  const vetoFinished = maps.every((map) => map.status !== "available")
  const teamActions = history.filter((entry) => entry.team !== 3 && entry.type !== "side").length

  const teamName = (actor: Actor) => (actor === 1 ? team1 : actor === 2 ? team2 : "Sistema")

  const steps = Array.from({ length: TOTAL_TEAM_ACTIONS + 1 }, (_, i) => {
    const isDecider = i === TOTAL_TEAM_ACTIONS
    return {
      label: isDecider ? "Decider" : i >= 6 && i < 8 ? "Pick" : "Veto",
      actor: (isDecider ? 3 : i % 2 === 0 ? 1 : 2) as Actor,
      state: i < teamActions || (isDecider && vetoFinished) ? "done" : i === teamActions && !vetoFinished ? "current" : "next",
    }
  })

  const pickedMaps = maps.filter((map) => map.status === "picked")
  const summary = [
    ...pickedMaps.filter((map) => map.pickedBy !== 3).map((map) => map.name),
    ...pickedMaps.filter((map) => map.pickedBy === 3).map((map) => `${map.name} (decider)`),
  ].join(" · ")

  const handleAction = (mapName: string) => {
    let nextMaps = maps.map(
      (map): MapState =>
        map.name === mapName
          ? {
              ...map,
              status: nextAction === "ban" ? "banned" : "picked",
              pickedBy: nextAction === "pick" ? currentTeam : null,
            }
          : map,
    )
    const nextHistory: HistoryEntry[] = [...history, { team: currentTeam, type: nextAction, map: mapName }]

    // Com 2 mapas sobrando, o Sistema veta um aleatoriamente e o outro vira o decider
    const remaining = nextMaps.filter((map) => map.status === "available")
    if (remaining.length === 2) {
      const [mapToBan, mapToPick] = Math.random() < 0.5 ? remaining : [remaining[1], remaining[0]]

      nextMaps = nextMaps.map(
        (map): MapState =>
          map.name === mapToBan.name
            ? { ...map, status: "banned" }
            : map.name === mapToPick.name
              ? { ...map, status: "picked", pickedBy: 3 }
              : map,
      )
      nextHistory.push({ team: 3, type: "ban", map: mapToBan.name }, { team: 3, type: "pick", map: mapToPick.name })
    }

    setMaps(nextMaps)
    setHistory(nextHistory)
    setCurrentTeam(otherTeam(currentTeam))
  }

  const chooseSide = (mapName: string, side: Side) => {
    const target = maps.find((map) => map.name === mapName)
    const chooser = target && getSideChooser(target)
    if (!target || !chooser || target.status !== "picked" || target.side) return

    setMaps(maps.map((map) => (map.name === mapName ? { ...map, side } : map)))
    setHistory([...history, { team: chooser, type: "side", map: mapName, side }])
  }

  const resetVeto = () => {
    setMaps(initialMaps())
    setHistory([])
    setCurrentTeam(1)
  }

  const copyHist = async () => {
    const formatted = `Histórico de Vetos:\n${history
      .map((entry, index) => `${index + 1}. ${teamName(entry.team)} ${describeAction(entry)} ${entry.map}`)
      .join("\n")}`

    try {
      await navigator.clipboard.writeText(formatted)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  return (
    <PageShell>
      <PageHeader
        title="Vetador de mapas"
        description="6 vetos, 2 picks, mais 2 vetos. O mapa que sobra vira o decider."
        actions={
          <>
            <Button variant="secondary" onClick={copyHist} disabled={history.length === 0}>
              <Copy />
              {copySuccess ? "Copiado" : "Copiar histórico"}
            </Button>
            <Button variant="secondary" onClick={resetVeto} disabled={history.length === 0}>
              <RotateCcw />
              Reiniciar
            </Button>
          </>
        }
      />

      <TeamNameInputs team1={team1} team2={team2} onTeam1Change={setTeam1} onTeam2Change={setTeam2} />

      <section
        aria-label="Andamento do veto"
        className="flex flex-col gap-3.5 rounded-[14px] border border-line bg-panel px-5 py-[18px]"
      >
        {vetoFinished ? (
          <div className="flex flex-wrap items-baseline gap-2.5">
            <span className="text-lg font-bold">Veto concluído</span>
            <span className="text-[15px] text-fg-muted">{summary}</span>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-2.5">
            <span className={cn("size-2.5 rounded-full", TEAM_DOT_CLASS[currentTeam])} />
            <span className="text-lg font-bold">Vez de {teamName(currentTeam)}</span>
            <span className="text-[15px] text-fg-muted">
              {nextAction === "ban" ? "Escolha um mapa para vetar" : "Escolha um mapa para jogar"}
            </span>
          </div>
        )}
        <ol className="flex flex-wrap gap-1.5">
          {steps.map((step, index) => (
            <li
              key={index}
              aria-current={step.state === "current" ? "step" : undefined}
              className={cn(
                "flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-xs",
                step.state === "done" && "border-line bg-panel-2 text-fg-muted",
                step.state === "current" && "border-fg font-semibold text-fg",
                step.state === "next" && "border-line text-fg-subtle",
              )}
            >
              <span className={cn("size-1.5 rounded-full", TEAM_DOT_CLASS[step.actor])} />
              {step.label}
            </li>
          ))}
        </ol>
      </section>

      <div className="flex flex-wrap items-start gap-6">
        <div className="grid min-w-0 flex-[999_1_600px] grid-cols-[repeat(auto-fill,minmax(176px,1fr))] gap-3.5">
          {maps.map((map) => {
            const sideChooser = getSideChooser(map)
            return (
              <article
                key={map.name}
                className={cn(
                  "flex flex-col overflow-hidden rounded-[14px] border bg-panel",
                  map.status === "picked" && map.pickedBy ? PICK_BORDER_CLASS[map.pickedBy] : "border-line",
                )}
              >
                <div className="relative h-[104px] bg-panel-2">
                  <img
                    src={getImagePath(map.name)}
                    alt=""
                    className={cn("size-full object-cover", map.status === "banned" && "brightness-40 grayscale")}
                  />
                  {map.status === "banned" && (
                    <span className="absolute top-2.5 left-2.5 rounded-md bg-ink px-2 py-1 font-mono text-[11px] tracking-[0.06em] text-ban">
                      VETADO
                    </span>
                  )}
                  {map.status === "picked" && map.pickedBy && (
                    <span
                      className={cn(
                        "absolute top-2.5 left-2.5 rounded-md bg-ink px-2 py-1 font-mono text-[11px] tracking-[0.06em]",
                        TEAM_TEXT_CLASS[map.pickedBy],
                      )}
                    >
                      {map.pickedBy === 3 ? "DECIDER" : "PICK"}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-2.5 px-3.5 pt-3 pb-3.5">
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className={cn("text-base font-semibold", map.status === "banned" && "text-fg-subtle")}>
                      {map.name}
                    </h3>
                    <span className="text-xs text-fg-muted">
                      {map.status === "banned" ? "Vetado" : map.pickedBy ? teamName(map.pickedBy) : ""}
                    </span>
                  </div>

                  {map.status === "available" && (
                    <Button
                      onClick={() => handleAction(map.name)}
                      variant={nextAction === "ban" ? "secondary" : "default"}
                      className={cn(nextAction === "ban" && "border-ban-line text-ban hover:bg-ban-bg")}
                    >
                      {nextAction === "ban" ? "Vetar" : "Escolher"}
                    </Button>
                  )}

                  {map.status === "picked" && !sideChooser && (
                    <span className="flex items-center gap-1.5 text-[13px] text-fg-muted">
                      <Swords className="size-3.5" aria-hidden="true" />
                      Lado no round faca
                    </span>
                  )}

                  {map.status === "picked" && sideChooser && map.side && (
                    <span className="text-[13px] text-fg-muted">
                      {teamName(sideChooser)} começa de <strong className="text-fg">{map.side}</strong>
                    </span>
                  )}

                  {map.status === "picked" && sideChooser && !map.side && (
                    <div className="flex flex-col gap-2">
                      <span className="text-xs text-fg-muted">{teamName(sideChooser)} escolhe o lado</span>
                      <div className="grid grid-cols-2 gap-1.5">
                        {(["CT", "TR"] as const).map((side) => (
                          <Button
                            key={side}
                            variant="secondary"
                            onClick={() => chooseSide(map.name, side)}
                            className="bg-panel-2 hover:bg-line"
                          >
                            {side}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </article>
            )
          })}
        </div>

        <aside
          aria-labelledby="historico"
          className="flex min-w-0 flex-[1_1_300px] flex-col gap-3 rounded-[14px] border border-line bg-panel px-5 py-[18px]"
        >
          <h2 id="historico" className="text-[15px] font-semibold">
            Histórico
          </h2>
          {history.length === 0 ? (
            <p className="text-sm leading-normal text-fg-muted">Nenhuma ação ainda. Comece vetando um mapa.</p>
          ) : (
            <ol className="flex flex-col">
              {history.map((entry, index) => (
                <li
                  key={index}
                  className="grid grid-cols-[24px_1fr_auto] items-center gap-2.5 border-b border-line-soft py-2 text-sm last:border-b-0"
                >
                  <span className="font-mono text-xs text-fg-muted">{index + 1}</span>
                  <span>
                    <span className={cn("font-semibold", TEAM_TEXT_CLASS[entry.team])}>{teamName(entry.team)}</span>{" "}
                    <span className="text-fg-muted">{describeAction(entry)}</span>{" "}
                    <span className="font-semibold">{entry.map}</span>
                  </span>
                  <span
                    className={cn(
                      "rounded px-1.5 py-0.5 font-mono text-[10px] tracking-[0.06em]",
                      HISTORY_TAG[entry.type].className,
                    )}
                  >
                    {HISTORY_TAG[entry.type].label}
                  </span>
                </li>
              ))}
            </ol>
          )}
        </aside>
      </div>
    </PageShell>
  )
}
