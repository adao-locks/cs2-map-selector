/* eslint-disable @next/next/no-img-element */
import { PageShell } from "@/components/page-shell"
import { AWARDS_DATE, awards, type AwardTheme } from "@/data/awards"

// Classes completas (sem template string) para o Tailwind conseguir detectá-las no build
const THEMES: Record<AwardTheme, { glow: string; border: string; text: string; badge: string }> = {
  yellow: {
    glow: "shadow-[0_0_30px_rgba(255,215,0,0.3)]",
    border: "border-yellow-400",
    text: "text-yellow-400",
    badge: "bg-yellow-400 text-black",
  },
  green: {
    glow: "shadow-[0_0_30px_rgba(34,197,94,0.3)]",
    border: "border-green-400",
    text: "text-green-400",
    badge: "bg-green-400 text-white",
  },
  blue: {
    glow: "shadow-[0_0_30px_rgba(59,130,246,0.3)]",
    border: "border-blue-400",
    text: "text-blue-400",
    badge: "bg-blue-400 text-white",
  },
  red: {
    glow: "shadow-[0_0_30px_rgba(239,68,68,0.3)]",
    border: "border-red-400",
    text: "text-red-400",
    badge: "bg-red-400 text-white",
  },
  purple: {
    glow: "shadow-[0_0_30px_rgba(147,51,234,0.3)]",
    border: "border-purple-400",
    text: "text-purple-400",
    badge: "bg-purple-400 text-white",
  },
  gray: {
    glow: "shadow-[0_0_30px_rgba(107,114,128,0.3)]",
    border: "border-gray-400",
    text: "text-gray-400",
    badge: "bg-gray-400 text-white",
  },
}

const formatNumber = (value: number, maxDecimals = 0) =>
  value.toLocaleString("pt-BR", { maximumFractionDigits: maxDecimals })

export default function CS2PlayerAwards() {
  return (
    <PageShell>
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 bg-clip-text text-transparent">
          🏆 CS2 Player Awards
        </h1>
        <p className="text-xl text-gray-300">Estatísticas de {AWARDS_DATE}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {awards.map(({ id, award, icon, badge, theme, player }) => {
          const colors = THEMES[theme]
          const stats = [
            { label: "ADR", value: formatNumber(player.stats.adr, 1) },
            { label: "KAST", value: `${formatNumber(player.stats.kast, 1)}%` },
            { label: "Rating", value: formatNumber(player.stats.rating, 2) },
            { label: "Dano", value: formatNumber(player.stats.damage) },
          ]

          return (
            <div
              key={id}
              className={`rounded-2xl p-8 flex flex-col items-center transform hover:scale-105 transition-all duration-300 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-[10px] border border-white/10 ${colors.glow}`}
            >
              <div className="flex items-center mb-2">
                <span className="text-3xl mr-2">{icon}</span>
                <h3 className={`text-2xl font-bold ${colors.text}`}>{award}</h3>
              </div>

              <div className="relative mb-2">
                <img
                  src={player.image}
                  alt={player.name}
                  className={`w-24 h-24 rounded-full border-4 shadow-lg object-cover ${colors.border}`}
                />
                <div
                  className={`absolute -top-2 -right-2 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm ${colors.badge}`}
                >
                  {badge}
                </div>
              </div>

              <p className="text-xl font-bold text-white mb-4">{player.name}</p>

              <div className="grid grid-cols-2 gap-4 w-full text-sm">
                {stats.map((stat) => (
                  <div key={stat.label} className="bg-black/30 rounded-lg p-3 text-center">
                    <p className="text-gray-300">{stat.label}</p>
                    <p className={`text-xl font-bold ${colors.text}`}>{stat.value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4 bg-black/30 rounded-lg p-3 w-full text-center">
                <p className="text-gray-300 mb-1">KDA</p>
                <p className="text-lg font-bold text-white">
                  {player.kda.kills} / {player.kda.deaths} / {player.kda.assists}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div className="text-center mt-12">
        <p className="text-gray-400">🎮 Counter-Strike 2 Match Statistics</p>
      </div>
    </PageShell>
  )
}
