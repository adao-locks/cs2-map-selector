"use client"

import Link from "next/link"
import { Card, CardContent } from "../components/ui/card"

export default function HomePage() {
  const menuItems = [
    {
      title: "Vetador de Mapas",
      description: "Sistema de veto e seleção de mapas para partidas",
      icon: "🗺️",
      href: "/map_picker",
      gradient: "from-cyan-500 to-blue-600",
      hoverGradient: "from-cyan-600 to-blue-700",
      shadowColor: "cyan-500/25",
    },
    {
      title: "Seletor de Times",
      description: "Organize e selecione jogadores para os times",
      icon: "👥",
      href: "/team",
      gradient: "from-orange-500 to-red-600",
      hoverGradient: "from-orange-600 to-red-700",
      shadowColor: "orange-500/25",
    },
    {
      title: "Chaveamento de Torneio",
      description: "Crie e gerencie brackets de torneios",
      icon: "🏆",
      href: "/tournaments",
      gradient: "from-purple-500 to-pink-600",
      hoverGradient: "from-purple-600 to-pink-700",
      shadowColor: "purple-500/25",
    },
    {
      title: "Ranking da Semana",
      description: "Veja os melhores jogadores e times da semana",
      icon: "⭐",
      href: "/awards",
      gradient: "from-green-500 to-emerald-600",
      hoverGradient: "from-green-600 to-emerald-700",
      shadowColor: "green-500/25",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 md:p-6">
      {/* Background Effects */}
      <div className="fixed inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0deg,rgba(120,119,198,0.1)_60deg,transparent_120deg)]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 mt-8">
          <div className="relative">
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 bg-clip-text text-transparent mb-4">
              SispBalas
            </h1>
            <p className="text-xl md:text-2xl font-semibold text-cyan-400 tracking-wider mb-2">
              SISTEMA DE GERENCIAMENTO CS2
            </p>
            <p className="text-sm md:text-base text-gray-400 max-w-2xl mx-auto">
              Plataforma completa para organização de partidas, times e torneios de Counter-Strike 2
            </p>
          </div>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto mt-16">
          {menuItems.map((item, index) => (
            <Link key={index} href={item.href}>
              <Card
                className={`group transition-all duration-300 transform hover:scale-105 bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl hover:shadow-${item.shadowColor} hover:border-white/40 cursor-pointer h-full`}
              >
                <CardContent className="p-8">
                  <div className="flex flex-col items-center text-center space-y-4">
                    {/* Icon */}
                    <div
                      className={`text-6xl mb-2 transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6`}
                    >
                      {item.icon}
                    </div>

                    {/* Title */}
                    <h2
                      className={`text-2xl md:text-3xl font-bold bg-gradient-to-r ${item.gradient} bg-clip-text text-transparent`}
                    >
                      {item.title}
                    </h2>

                    {/* Description */}
                    <p className="text-gray-300 text-sm md:text-base leading-relaxed">{item.description}</p>

                    {/* Button */}
                    <div className="pt-4 w-full">
                      <div
                        className={`w-full py-3 px-6 rounded-lg bg-gradient-to-r ${item.gradient} hover:${item.hoverGradient} text-white font-semibold shadow-lg hover:shadow-${item.shadowColor} transition-all duration-300 text-center`}
                      >
                        Acessar →
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Footer Info */}
        <div className="mt-16 text-center">
          <div className="inline-block p-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl">
            <p className="text-gray-300 text-sm md:text-base">
              💡 <span className="font-semibold text-cyan-400">Dica:</span> Selecione uma das opções acima para começar
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
