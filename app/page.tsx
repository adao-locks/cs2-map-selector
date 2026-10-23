import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { PageShell } from "@/components/page-shell"

// Classes completas (sem template string) para o Tailwind conseguir detectá-las no build
const menuItems = [
  {
    title: "Seletor de Times",
    description: "Organize e selecione jogadores para os times",
    icon: "👥",
    href: "/team",
    gradient: "from-orange-500 to-red-600",
    buttonHover: "hover:from-orange-600 hover:to-red-700 hover:shadow-orange-500/25",
    cardShadow: "hover:shadow-orange-500/25",
  },
  {
    title: "Vetador de Mapas",
    description: "Sistema de veto e seleção de mapas para partidas",
    icon: "🗺️",
    href: "/map_picker",
    gradient: "from-cyan-500 to-blue-600",
    buttonHover: "hover:from-cyan-600 hover:to-blue-700 hover:shadow-cyan-500/25",
    cardShadow: "hover:shadow-cyan-500/25",
  },
  {
    title: "Chaveamento de Torneio",
    description: "Crie e gerencie brackets de torneios",
    icon: "🏆",
    href: "/tournaments",
    gradient: "from-purple-500 to-pink-600",
    buttonHover: "hover:from-purple-600 hover:to-pink-700 hover:shadow-purple-500/25",
    cardShadow: "hover:shadow-purple-500/25",
  },
  {
    title: "Ranking da Semana",
    description: "Veja os melhores jogadores e times da semana",
    icon: "⭐",
    href: "/awards",
    gradient: "from-green-500 to-emerald-600",
    buttonHover: "hover:from-green-600 hover:to-emerald-700 hover:shadow-green-500/25",
    cardShadow: "hover:shadow-green-500/25",
  },
]

export default function HomePage() {
  return (
    <PageShell showBack={false}>
      {/* Header */}
      <div className="text-center mb-12 mt-8">
        <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 bg-clip-text text-transparent mb-4">
          SispBalas
        </h1>
        <p className="text-xl md:text-2xl font-semibold text-cyan-400 tracking-wider mb-2">Bora Cartear um CS?</p>
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-5xl mx-auto mt-16">
        {menuItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <Card
              className={`group transition-all duration-300 transform hover:scale-105 bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl hover:border-white/40 cursor-pointer h-full ${item.cardShadow}`}
            >
              <CardContent className="p-8">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="text-6xl mb-2 transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                    {item.icon}
                  </div>

                  <h2
                    className={`text-2xl md:text-3xl font-bold bg-gradient-to-r ${item.gradient} bg-clip-text text-transparent`}
                  >
                    {item.title}
                  </h2>

                  <p className="text-gray-300 text-sm md:text-base leading-relaxed">{item.description}</p>

                  <div className="pt-4 w-full">
                    <div
                      className={`w-full py-3 px-6 rounded-lg bg-gradient-to-r ${item.gradient} ${item.buttonHover} text-white font-semibold shadow-lg transition-all duration-300 text-center`}
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
    </PageShell>
  )
}
