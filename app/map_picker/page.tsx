/* eslint-disable @typescript-eslint/no-require-imports */
"use client"

import { useState } from "react"
import { Card, CardContent } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { useEffect } from "react"
import Link from "next/link"

export default function CS2MapSelector() {
  const [team1, setTeam1] = useState("Time 1")
  const [team2, setTeam2] = useState("Time 2")
  const [team3, setBanco] = useState("Banco")
  const [currentTeam, setCurrentTeam] = useState(1)
  const [actionHistory, setActionHistory] = useState<Array<{ team: number; action: string; map: string }>>([])

  const [team1Players, setTeam1Players] = useState<string[]>([])
  const [team2Players, setTeam2Players] = useState<string[]>([])
  const [team3Players, setTeam3Players] = useState<string[]>([])
  const [newPlayerTeam1, setNewPlayerTeam1] = useState("")
  const [newPlayerTeam2, setNewPlayerTeam2] = useState("")
  const [newPlayerTeam3, setNewPlayerTeam3] = useState("")
  const [copySuccess, setCopySuccess] = useState(false)

  type MapType = {
    name: string
    isBanned: boolean
    isSelected: boolean
    isSideChosen: boolean
    teamSide: string
    side: string
  }

  const [maps, setMaps] = useState<MapType[]>([
    { name: "Ancient",        isBanned: false, isSelected: false, isSideChosen: false, teamSide: "", side: "" },
    { name: "Ancient Night",  isBanned: false, isSelected: false, isSideChosen: false, teamSide: "", side: "" },
    { name: "Dust II",        isBanned: false, isSelected: false, isSideChosen: false, teamSide: "", side: "" },
    { name: "Inferno",        isBanned: false, isSelected: false, isSideChosen: false, teamSide: "", side: "" },
    { name: "Mirage",         isBanned: false, isSelected: false, isSideChosen: false, teamSide: "", side: "" },
    { name: "Nuke",           isBanned: false, isSelected: false, isSideChosen: false, teamSide: "", side: "" },
    { name: "Overpass",       isBanned: false, isSelected: false, isSideChosen: false, teamSide: "", side: "" },
    { name: "Train",          isBanned: false, isSelected: false, isSideChosen: false, teamSide: "", side: "" },
    { name: "Anubis",         isBanned: false, isSelected: false, isSideChosen: false, teamSide: "", side: "" },
    { name: "Italy",          isBanned: false, isSelected: false, isSideChosen: false, teamSide: "", side: "" },
    { name: "Office",         isBanned: false, isSelected: false, isSideChosen: false, teamSide: "", side: "" },
    { name: "Vertigo",        isBanned: false, isSelected: false, isSideChosen: false, teamSide: "", side: "" },
  ])

  const handleBanMap = (mapName: string) => {
    const teamName = currentTeam === 1 ? team1 : team2
    setMaps(maps.map((map) => (map.name === mapName ? { ...map, isBanned: !map.isBanned, isSelected: false } : map)))
    setActionHistory([...actionHistory, { team: currentTeam, action: "vetou", map: mapName }])
    setCurrentTeam(currentTeam === 1 ? 2 : 1)
  }

  const handleSelectMap = (mapName: string) => {
    const teamName = currentTeam === 1 ? team1 : team2
    setMaps(maps.map((map) => (map.name === mapName ? { ...map, isSelected: !map.isSelected, isBanned: false } : map)))
    setActionHistory([...actionHistory, { team: currentTeam, action: "escolheu", map: mapName }])
    setCurrentTeam(currentTeam === 1 ? 2 : 1)
  }

  const resetAll = () => {
    setMaps(maps.map((map) => ({ ...map, isBanned: false, isSelected: false })))
    setActionHistory([])
    setCurrentTeam(1)
    setTeam1("Time 1")
    setTeam2("Time 2")
    setBanco("Banco")
    setTeam1Players([])
    setTeam2Players([])
    setTeam3Players([])
    setNewPlayerTeam1("")
    setNewPlayerTeam2("")
    setNewPlayerTeam3("")
  }

  const bannedMaps = maps.filter((map) => map.isBanned)
  const selectedMaps = maps.filter((map) => map.isSelected)
  const availableMaps = maps.filter((map) => !map.isBanned && !map.isSelected)

  const getImagePath = (mapName: string) => {
    return `/assets/maps/${mapName.toLowerCase().replace(/\s+/g, "-")}.jpg`
  }

  useEffect(() => {
    if (availableMaps.length === 2) {
      const shuffled = [...availableMaps].sort(() => Math.random() - 0.5)

      const mapToBan = shuffled[0]
      const mapToSelect = shuffled[1]

      setMaps((prev) => prev.map((m) => (m.name === mapToBan.name ? { ...m, isBanned: true, isSelected: false } : m)))
      setActionHistory((prev) => [...prev, { team: 3, action: "vetou", map: mapToBan.name }])

      setMaps((prev) =>
        prev.map((m) => (m.name === mapToSelect.name ? { ...m, isSelected: true, isBanned: false } : m)),
      )
      setActionHistory((prev) => [...prev, { team: 3, action: "escolheu", map: mapToSelect.name }])
    }
  }, [availableMaps])

  const getNextAction = () => {
    const totalBans = actionHistory.filter((a) => a.action === "vetou").length
    const totalSelects = actionHistory.filter((a) => a.action === "escolheu").length

    if (totalBans < 4) return "ban"
    if (totalSelects < 2) return "select"
    return "ban"
  }

  const sideCT = (mapName: string) => {
    if (maps.find((map) => map.name === mapName)?.isSideChosen !== true) {
      setMaps(maps.map((map) => (map.name === mapName ? { ...map, side: "CT" } : map)))
      setMaps(maps.map((map) => (map.name === mapName ? { ...map, teamSide: currentTeam.toString() } : map)))
      setActionHistory([...actionHistory, { team: currentTeam, action: "escolheu lado CT", map: mapName }])
      setMaps(maps.map((map) => (map.name === mapName ? { ...map, isSideChosen: true } : map)))
    }
  }

  const sideTR = (mapName: string) => {
    if (maps.find((map) => map.name === mapName)?.isSideChosen !== true) {
      setMaps(maps.map((map) => (map.name === mapName ? { ...map, side: "TR" } : map)))
      setMaps(maps.map((map) => (map.name === mapName ? { ...map, teamSide: currentTeam.toString() } : map)))
      setActionHistory([...actionHistory, { team: currentTeam, action: "escolheu lado TR", map: mapName }])
      setMaps(maps.map((map) => (map.name === mapName ? { ...map, isSideChosen: true } : map)))
    }
  }

  const handleAction = (mapName: string) => {
    const nextAction = getNextAction()

    if (nextAction === "ban") {
      setMaps(maps.map((map) => (map.name === mapName ? { ...map, isBanned: true, isSelected: false } : map)))
      setActionHistory([...actionHistory, { team: currentTeam, action: "vetou", map: mapName }])
    } else if (nextAction === "select") {
      setMaps(maps.map((map) => (map.name === mapName ? { ...map, isSelected: true, isBanned: false } : map)))
      setActionHistory([...actionHistory, { team: currentTeam, action: "escolheu", map: mapName }])
    }

    setCurrentTeam(currentTeam === 1 ? 2 : 1)
  }

  const addPlayerTeam1 = () => {
    if (newPlayerTeam1.trim() && team1Players.length < 5) {
      setTeam1Players([...team1Players, newPlayerTeam1.trim()])
      setNewPlayerTeam1("")
    }
  }

  const addPlayerTeam2 = () => {
    if (newPlayerTeam2.trim() && team2Players.length < 5) {
      setTeam2Players([...team2Players, newPlayerTeam2.trim()])
      setNewPlayerTeam2("")
    }
  }

  const addPlayerTeam3 = () => {
    if (newPlayerTeam3.trim() && team3Players.length < 5) {
      setTeam3Players([...team3Players, newPlayerTeam3.trim()])
      setNewPlayerTeam3("")
    }
  }

  const removePlayerTeam1 = (index: number) => {
    setTeam1Players(team1Players.filter((_, i) => i !== index))
  }

  const removePlayerTeam2 = (index: number) => {
    setTeam2Players(team2Players.filter((_, i) => i !== index))
  }

  const removePlayerTeam3 = (index: number) => {
    setTeam3Players(team3Players.filter((_, i) => i !== index))
  }

  const copyTeamsFormatted = async () => {
    const formatted = `Times escolhidos\n🎮 ${team1}\n${team1Players.map((p, i) => `${i + 1}. ${p}`).join("\n")}\n\n🎮 ${team2}\n${team2Players.map((p, i) => `${i + 1}. ${p}`).join("\n")}`

    try {
      await navigator.clipboard.writeText(formatted)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const copyHist = async () => {
    const formatted = `Histórico de Vetos:\n${actionHistory
      .map((action, index) => {
        const teamName = action.team === 1 ? team1 : action.team === 2 ? team2 : "Sistema"
        return `${index + 1}. ${teamName} ${action.action} ${action.map}`
      })
      .join("\n")}`

    try {
      await navigator.clipboard.writeText(formatted)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const copyGamesFormatted = async () => {
    const formatted = `Mapas:\n${selectedMaps.map((m) => `✅ ${m.name+" - "+m.teamSide+" - "+m.side}`).join("\n")}` + 
                      `\n\nTimes escolhidos\n🎮 ${team1}\n${team1Players.map((p, i) => `${i + 1}. ${p}`).join("\n")}\n\n
                      🎮 ${team2}\n${team2Players.map((p, i) => `${i + 1}. ${p}`).join("\n")}\n\n
                      🎮 ${team3}\n${team3Players.map((p, i) => `${i + 1}. ${p}`).join("\n")}`
    try {
      await navigator.clipboard.writeText(formatted)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 md:p-6">
      <div className="fixed inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0deg,rgba(120,119,198,0.1)_60deg,transparent_120deg)]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-8 mt-8">
          <div className="relative">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 bg-clip-text text-transparent mb-2">
              SispBalas
            </h1>
            <p className="text-xl md:text-2xl font-semibold text-cyan-400 tracking-wider">VETADOR DE MAPAS</p>
          </div>
        </div>
        
        <div className="text-center mb-8">
          <Link href="/">
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all duration-300">
              ← Voltar para Menu
            </button>
          </Link>
        </div>

        <div className="text-center mb-12">
          <Badge className="px-6 py-3 text-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 shadow-lg">
            🎯 Vez do: {currentTeam === 1 ? team1 : team2}
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {maps.map((map) => (
            <Card
              key={map.name}
              className={`transition-all duration-300 transform hover:scale-105 ${
                map.isBanned
                  ? "bg-red-500/20 backdrop-blur-md border border-red-500/50 shadow-lg shadow-red-500/25"
                  : map.isSelected
                    ? "bg-green-500/20 backdrop-blur-md border border-green-500/50 shadow-lg shadow-green-500/25"
                    : "bg-white/10 backdrop-blur-md border border-white/20 shadow-lg hover:shadow-cyan-500/20 hover:border-cyan-400/50"
              }`}
            >
              <CardContent className="p-4">
                <div className="h-32 mb-4 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg overflow-hidden border border-white/10">
                  <img
                    src={getImagePath(map.name) || "/placeholder.svg"}
                    alt={`Counter-Strike 2 ${map.name} map`}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                </div>

                <h3 className="font-bold text-lg mb-4 text-white text-center">{map.name}</h3>

                <div className="flex flex-col space-y-3">
                  <Button
                    onClick={() => handleAction(map.name)}
                    size="sm"
                    className={`w-full font-semibold transition-all duration-300 ${
                      getNextAction() === "ban"
                        ? "bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white shadow-lg hover:shadow-red-500/25"
                        : "bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white shadow-lg hover:shadow-green-500/25"
                    }`}
                    disabled={map.isBanned || map.isSelected}
                  >
                    {getNextAction() === "ban" ? "🚫 Vetar Mapa" : "✅ Selecionar Mapa"}
                  </Button>
                </div>

                {map.isBanned && (
                  <Badge className="mt-3 w-full justify-center bg-gradient-to-r from-red-500 to-red-700 text-white border-0 shadow-lg">
                    🚫 VETADO
                  </Badge>
                )}

                {map.isSelected && (
                  <Badge className="mt-3 w-full justify-center bg-gradient-to-r from-green-500 to-green-700 text-white border-0 shadow-lg">
                    ✅ SELECIONADO
                  </Badge>
                )}

                {map.isSelected && selectedMaps.length <= 2 && (
                <><div className="grid grid-cols-1 md:grid-cols-2 gap-1 mt-2">
                    <Button
                      onClick={() => sideCT(map.name)}
                      size="sm"
                      className={`w-full font-semibold transition-all duration-300 ${getNextAction() === "ban"
                          ? "bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white shadow-lg hover:shadow-blue-500/25"
                          : "bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white shadow-lg hover:shadow-blue-500/25"}`}
                      disabled={map.isBanned || map.isSideChosen}
                    >
                      {"🛡️ CT"}
                    </Button>
                    <Button
                      onClick={() => sideTR(map.name)}
                      size="sm"
                      className={`w-full font-semibold transition-all duration-300 ${getNextAction() === "ban"
                          ? "bg-gradient-to-r from-orange-500 to-orange-700 hover:from-orange-600 hover:to-orange-800 text-white shadow-lg hover:shadow-orange-500/25"
                          : "bg-gradient-to-r from-orange-500 to-orange-700 hover:from-orange-600 hover:to-orange-800 text-white shadow-lg hover:shadow-orange-500/25"}`}
                      disabled={map.isBanned || map.isSideChosen}
                    >
                      {"🎯 TR"}
                    </Button>
                  </div></>)}
              </CardContent>
            </Card>
          ))}
        </div>

        {actionHistory.length > 0 && (
          <><div className="mt-12 p-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl">
            <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
              <span className="text-2xl">📜</span>
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Histórico de Vetos
              </span>
            </h2>

            <div className="space-y-4">
              {actionHistory.map((action, index) => {
                const isBan = action.action.includes("vetou")
                const isSelect = action.action.includes("escolheu")

                return (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-6 rounded-xl shadow-lg border transition-all duration-300 hover:scale-[1.02]
                      ${isBan ? "bg-red-500/20 backdrop-blur-md border-red-500/50" : ""}
                      ${isSelect ? "bg-green-500/20 backdrop-blur-md border-green-500/50" : ""}
                      ${!isBan && !isSelect ? "bg-white/10 backdrop-blur-md border-white/20" : ""}
                    `}
                  >
                    <Badge
                      className={`px-4 py-2 text-sm font-semibold border-0 shadow-lg ${action.team === 1
                          ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white"
                          : action.team === 2
                            ? "bg-gradient-to-r from-orange-500 to-red-600 text-white"
                            : "bg-gradient-to-r from-purple-500 to-pink-600 text-white"}`}
                    >
                      {action.team === 1 ? team1 : action.team === 2 ? team2 : "Sistema"}
                    </Badge>

                    <div className="flex-1 text-center">
                      <span
                        className={`font-bold text-lg ${isBan ? "text-red-400" : isSelect ? "text-green-400" : "text-white"}`}
                      >
                        {action.action}
                      </span>
                    </div>

                    <Badge
                      className={`px-4 py-2 font-bold border-0 shadow-lg ${isBan ? "bg-gradient-to-r from-red-500 to-red-700 text-white" : ""} ${isSelect ? "bg-gradient-to-r from-green-500 to-green-700 text-white" : ""} ${!isBan && !isSelect ? "bg-white/20 text-white" : ""}`}
                    >
                      {action.map}
                    </Badge>
                  </div>
                )
              })}
            </div>
        
            <div className="mt-8 flex justify-center">
              <Button
                onClick={copyHist}
                className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white border-0 px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
              >
                {copySuccess ? "✅ Copiado!" : "📋 Copiar Histórico"}
              </Button>
            </div>
          </div></>
        )}

        <div className="mt-8 flex justify-center">
          <Button
            onClick={copyGamesFormatted}
            className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white border-0 px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
          >
            {copySuccess ? "✅ Copiado!" : "📋 Copiar Game Formatado"}
          </Button>
        </div>
      </div>
    </div>
  )
}
