"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function CS2PlayerAwards() {
  const players = [
    {
      id: 1,
      name: "PlayerX",
      award: "MVP",
      icon: "👑",
      color: "yellow",
      stats: { adr: 92.5, kast: 74, rating: 1.25, damage: 1842 },
      kda: { kills: 24, deaths: 15, assists: 5 },
      badge: "1",
      glowClass: "mvp-glow",
      gradientClass: "from-yellow-500/20 to-orange-500/20",
      borderClass: "border-yellow-400",
      textClass: "text-yellow-400",
    },
    {
      id: 2,
      name: "PlayerY",
      award: "Mais Útil",
      icon: "🛡️",
      color: "green",
      stats: { adr: 80.3, kast: 79, rating: 1.12, damage: 1520 },
      kda: { kills: 18, deaths: 12, assists: 6 },
      badge: "⭐",
      glowClass: "useful-glow",
      gradientClass: "from-green-500/20 to-emerald-500/20",
      borderClass: "border-green-400",
      textClass: "text-green-400",
    },
    {
      id: 3,
      name: "PlayerZ",
      award: "Trade Killer",
      icon: "⚡",
      color: "blue",
      stats: { adr: 77.1, kast: 70, rating: 1.05, trades: 10 },
      kda: { kills: 16, deaths: 14, assists: 4 },
      badge: "10",
      glowClass: "trade-glow",
      gradientClass: "from-blue-500/20 to-cyan-500/20",
      borderClass: "border-blue-400",
      textClass: "text-blue-400",
    },
    {
      id: 4,
      name: "PlayerA",
      award: "Mais Dano",
      icon: "💥",
      color: "red",
      stats: { adr: 95.6, kast: 68, rating: 1.18, damage: 2050 },
      kda: { kills: 28, deaths: 20, assists: 3 },
      badge: "🔥",
      glowClass: "damage-glow",
      gradientClass: "from-red-500/20 to-pink-500/20",
      borderClass: "border-red-400",
      textClass: "text-red-400",
    },
    {
      id: 5,
      name: "PlayerB",
      award: "Mais Morreu",
      icon: "💀",
      color: "purple",
      stats: { adr: 60.4, kast: 62, rating: 0.85, deaths: 25 },
      kda: { kills: 12, deaths: 25, assists: 3 },
      badge: "25",
      glowClass: "death-glow",
      gradientClass: "from-purple-500/20 to-indigo-500/20",
      borderClass: "border-purple-400",
      textClass: "text-purple-400",
    },
    {
      id: 6,
      name: "PlayerC",
      award: "6º Player",
      icon: "🎯",
      color: "gray",
      stats: { adr: 55.0, kast: 58, rating: 0.76, damage: 980 },
      kda: { kills: 9, deaths: 20, assists: 2 },
      badge: "6",
      glowClass: "sixth-glow",
      gradientClass: "from-gray-500/20 to-slate-500/20",
      borderClass: "border-gray-400",
      textClass: "text-gray-400",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <style jsx>{`
        .award-card {
          background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.1);
        }
        .mvp-glow { box-shadow: 0 0 30px rgba(255, 215, 0, 0.3); }
        .useful-glow { box-shadow: 0 0 30px rgba(34, 197, 94, 0.3); }
        .trade-glow { box-shadow: 0 0 30px rgba(59, 130, 246, 0.3); }
        .damage-glow { box-shadow: 0 0 30px rgba(239, 68, 68, 0.3); }
        .death-glow { box-shadow: 0 0 30px rgba(147, 51, 234, 0.3); }
        .sixth-glow { box-shadow: 0 0 30px rgba(107, 114, 128, 0.3); }
      `}</style>

      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 bg-clip-text text-transparent">
          🏆 CS2 Player Awards
        </h1>
        <p className="text-xl text-gray-300">Estatísticas e Conquistas da Partida</p>
      </div>

      {/* Navigation */}
      <div className="text-center mb-8">
        <Link href="/">
          <button className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all duration-300">
            ← Voltar para Seletor de Mapas
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {players.map((player) => (
          <div
            key={player.id}
            className={`award-card ${player.glowClass} rounded-2xl p-8 flex flex-col items-center transform hover:scale-105 transition-all duration-300 bg-gradient-to-br ${player.gradientClass}`}
          >
            <div className="flex items-center mb-4">
              <span className="text-3xl mr-2">{player.icon}</span>
              <h3 className={`text-2xl font-bold ${player.textClass}`}>{player.award}</h3>
            </div>

            <div className="relative mb-6">
              <img
                src="/cs2-player-avatar.jpg"
                alt="Player"
                className={`w-24 h-24 rounded-full border-4 ${player.borderClass} shadow-lg`}
              />
              <div
                className={`absolute -top-2 -right-2 bg-${player.color}-400 ${player.color === "yellow" ? "text-black" : "text-white"} rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm`}
              >
                {player.badge}
              </div>
            </div>

            <p className="text-xl font-bold text-white mb-6">{player.name}</p>

            <div className="grid grid-cols-2 gap-4 w-full text-sm">
              <div className="bg-black/30 rounded-lg p-3 text-center">
                <p className="text-gray-300">ADR</p>
                <p className={`text-xl font-bold ${player.textClass}`}>{player.stats.adr}</p>
              </div>
              <div className="bg-black/30 rounded-lg p-3 text-center">
                <p className="text-gray-300">KAST</p>
                <p className={`text-xl font-bold ${player.textClass}`}>{player.stats.kast}%</p>
              </div>
              <div className="bg-black/30 rounded-lg p-3 text-center">
                <p className="text-gray-300">Rating</p>
                <p className={`text-xl font-bold ${player.textClass}`}>{player.stats.rating}</p>
              </div>
              <div className="bg-black/30 rounded-lg p-3 text-center">
                <p className="text-gray-300">
                  {player.stats.damage
                    ? "Dano"
                    : player.stats.trades
                      ? "Trades"
                      : player.stats.deaths
                        ? "Mortes"
                        : "Dano"}
                </p>
                <p className={`text-xl font-bold ${player.textClass}`}>
                  {player.stats.damage || player.stats.trades || player.stats.deaths}
                </p>
              </div>
            </div>

            <div className="mt-4 bg-black/30 rounded-lg p-3 w-full text-center">
              <p className="text-gray-300 mb-1">KDA</p>
              <p className="text-lg font-bold text-white">
                {player.kda.kills} / {player.kda.deaths} / {player.kda.assists}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="text-center mt-12">
        <p className="text-gray-400">🎮 Counter-Strike 2 Match Statistics</p>
      </div>
    </div>
  )
}
