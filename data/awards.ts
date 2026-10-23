export type PlayerStats = {
  name: string
  image: string
  stats: { adr: number; kast: number; rating: number; damage: number }
  kda: { kills: number; deaths: number; assists: number }
}

// Estatística que aparece em destaque no card do prêmio
export type AwardStat = "rating" | "kast" | "damage" | "kills" | "deaths"

export type Award = {
  id: string
  award: string
  stat: AwardStat
  player: PlayerStats
}

// Os valores somados/médios são das duas partidas do dia
const avg = (...values: number[]) => values.reduce((sum, v) => sum + v, 0) / values.length

export const AWARDS_DATE = "26/09/2025"

export const players = {
  davi: {
    name: "Davizera",
    image: "/players/davi.png",
    stats: { adr: avg(140, 135), kast: 71, rating: avg(1.68, 1.59), damage: 2243 + 3928 },
    kda: { kills: 17 + 33, deaths: 14 + 23, assists: 10 + 7 },
  },
  ghs: {
    name: "gHs",
    image: "/players/ghs.png",
    stats: { adr: 104, kast: 84, rating: 2.95, damage: 4643 },
    kda: { kills: 16 + 24, deaths: 9 + 18, assists: 7 + 10 },
  },
  silva: {
    name: "CavaFalta",
    image: "/players/silva.png",
    stats: { adr: avg(69, 67), kast: avg(56, 67), rating: avg(0.76, 1), damage: 1111 + 1950 },
    kda: { kills: 11 + 22, deaths: 15 + 20, assists: 2 + 4 },
  },
  kad: {
    name: "Kad",
    image: "/players/kad.png",
    stats: { adr: avg(27, 45), kast: avg(18, 58), rating: avg(0.01, 0.6), damage: 432 + 1316 },
    kda: { kills: 1 + 9, deaths: 15 + 20, assists: 2 + 3 },
  },
} satisfies Record<string, PlayerStats>

// O primeiro prêmio é o MVP, que ganha o destaque da página
export const awards: Award[] = [
  { id: "mvp", award: "MVP", stat: "rating", player: players.davi },
  { id: "useful", award: "Mais útil", stat: "kast", player: players.ghs },
  { id: "damage", award: "Mais dano", stat: "damage", player: players.davi },
  { id: "trade", award: "Trade killer", stat: "kills", player: players.silva },
  { id: "deaths", award: "Mais morreu", stat: "deaths", player: players.davi },
  { id: "sixth", award: "6º player", stat: "rating", player: players.kad },
]
