/* eslint-disable @next/next/no-img-element */
"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PageShell } from "@/components/page-shell"
import { TeamNameInputs } from "@/components/team-name-inputs"

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
  if (entry.type === "side") return `escolheu lado ${entry.side}`
  return entry.type === "ban" ? "vetou" : "escolheu"
}

const STATUS_CARD_CLASS: Record<MapState["status"], string> = {
  available:
    "bg-white/10 backdrop-blur-md border border-white/20 shadow-lg hover:shadow-cyan-500/20 hover:border-cyan-400/50",
  banned: "bg-red-500/20 backdrop-blur-md border border-red-500/50 shadow-lg shadow-red-500/25",
  picked: "bg-green-500/20 backdrop-blur-md border border-green-500/50 shadow-lg shadow-green-500/25",
}

const HISTORY_ROW_CLASS: Record<HistoryEntry["type"], string> = {
  ban: "bg-red-500/20 backdrop-blur-md border-red-500/50",
  pick: "bg-green-500/20 backdrop-blur-md border-green-500/50",
  side: "bg-white/10 backdrop-blur-md border-white/20",
}

const HISTORY_TEXT_CLASS: Record<HistoryEntry["type"], string> = {
  ban: "text-red-400",
  pick: "text-green-400",
  side: "text-white",
}

const HISTORY_MAP_BADGE_CLASS: Record<HistoryEntry["type"], string> = {
  ban: "bg-gradient-to-r from-red-500 to-red-700 text-white",
  pick: "bg-gradient-to-r from-green-500 to-green-700 text-white",
  side: "bg-white/20 text-white",
}

const ACTOR_BADGE_CLASS: Record<Actor, string> = {
  1: "bg-gradient-to-r from-cyan-500 to-blue-600 text-white",
  2: "bg-gradient-to-r from-orange-500 to-red-600 text-white",
  3: "bg-gradient-to-r from-purple-500 to-pink-600 text-white",
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

  const teamName = (actor: Actor) => (actor === 1 ? team1 : actor === 2 ? team2 : "Sistema")

  // Quem não escolheu o mapa escolhe o lado. O decider não tem escolha: o lado sai no round faca.
  const getSideChooser = (map: MapState): TeamId | null =>
    map.pickedBy === 1 || map.pickedBy === 2 ? otherTeam(map.pickedBy) : null

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

  const renderSideChoice = (map: MapState) => {
    const chooser = getSideChooser(map)

    if (!chooser) {
      return <p className="mt-2 text-center text-sm text-gray-300">🔪 Lado decidido no round faca</p>
    }

    if (map.side) {
      return (
        <p className="mt-2 text-center text-sm text-white">
          {teamName(chooser)} começa de{" "}
          <span className={map.side === "CT" ? "font-bold text-blue-400" : "font-bold text-orange-400"}>
            {map.side}
          </span>
        </p>
      )
    }

    return (
      <>
        <p className="mt-2 text-center text-xs text-gray-300">{teamName(chooser)} escolhe o lado</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1 mt-1">
          <Button
            onClick={() => chooseSide(map.name, "CT")}
            size="sm"
            className="w-full font-semibold transition-all duration-300 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white shadow-lg hover:shadow-blue-500/25"
          >
            🛡️ CT
          </Button>
          <Button
            onClick={() => chooseSide(map.name, "TR")}
            size="sm"
            className="w-full font-semibold transition-all duration-300 bg-gradient-to-r from-orange-500 to-orange-700 hover:from-orange-600 hover:to-orange-800 text-white shadow-lg hover:shadow-orange-500/25"
          >
            🎯 TR
          </Button>
        </div>
      </>
    )
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
    <PageShell className="mt-4">
      <TeamNameInputs team1={team1} team2={team2} onTeam1Change={setTeam1} onTeam2Change={setTeam2} />

      <div className="text-center mb-8">
        <Badge className="px-6 py-3 text-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 shadow-lg">
          {vetoFinished ? "🏁 Veto concluído" : `🎯 Vez do: ${teamName(currentTeam)}`}
        </Badge>
      </div>

      {/* CARD */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {maps.map((map) => (
          <Card
            key={map.name}
            className={`transition-all duration-300 transform hover:scale-105 ${STATUS_CARD_CLASS[map.status]}`}
          >
            <CardContent className="p-4">
              <div className="h-32 mb-4 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg overflow-hidden border border-white/10">
                <img
                  src={getImagePath(map.name)}
                  alt={`Counter-Strike 2 ${map.name} map`}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
              </div>

              <h3 className="font-bold text-lg mb-4 text-white text-center">{map.name}</h3>

              {map.status === "available" && (
                <Button
                  onClick={() => handleAction(map.name)}
                  size="sm"
                  className={`w-full font-semibold transition-all duration-300 text-white shadow-lg ${
                    nextAction === "ban"
                      ? "bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 hover:shadow-red-500/25"
                      : "bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 hover:shadow-green-500/25"
                  }`}
                >
                  {nextAction === "ban" ? "🚫 Vetar Mapa" : "✅ Selecionar Mapa"}
                </Button>
              )}

              {map.status === "banned" && (
                <Badge className="mt-3 w-full justify-center bg-gradient-to-r from-red-500 to-red-700 text-white border-0 shadow-lg">
                  🚫 VETADO
                </Badge>
              )}

              {map.status === "picked" && (
                <>
                  <Badge className="mt-3 w-full justify-center bg-gradient-to-r from-green-500 to-green-700 text-white border-0 shadow-lg">
                    ✅ {map.pickedBy === 3 ? "DECIDER" : "SELECIONADO"}
                  </Badge>

                  {renderSideChoice(map)}
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {history.length > 0 && (
        <div className="mt-12 p-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl">
          <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
            <span className="text-2xl">📜</span>
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Histórico de Vetos
            </span>
          </h2>

          <div className="space-y-4">
            {history.map((entry, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-6 rounded-xl shadow-lg border transition-all duration-300 hover:scale-[1.02] ${HISTORY_ROW_CLASS[entry.type]}`}
              >
                <Badge className={`px-4 py-2 text-sm font-semibold border-0 shadow-lg ${ACTOR_BADGE_CLASS[entry.team]}`}>
                  {teamName(entry.team)}
                </Badge>

                <div className="flex-1 text-center">
                  <span className={`font-bold text-lg ${HISTORY_TEXT_CLASS[entry.type]}`}>{describeAction(entry)}</span>
                </div>

                <Badge className={`px-4 py-2 font-bold border-0 shadow-lg ${HISTORY_MAP_BADGE_CLASS[entry.type]}`}>
                  {entry.map}
                </Badge>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <Button
              onClick={copyHist}
              className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white border-0 px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
            >
              {copySuccess ? "✅ Copiado!" : "📋 Copiar Histórico"}
            </Button>
          </div>
        </div>
      )}
    </PageShell>
  )
}
