/* eslint-disable @next/next/no-img-element */
import { PageHeader, PageShell, SectionLabel } from "@/components/page-shell"
import { AWARDS_DATE, awards, players, type AwardStat, type PlayerStats } from "@/data/awards"
import { formatNumber } from "@/lib/utils"

const formatStat = (player: PlayerStats, stat: AwardStat) => {
  if (stat === "rating") return `Rating ${formatNumber(player.stats.rating, 2)}`
  if (stat === "kast") return `KAST ${formatNumber(player.stats.kast, 1)}%`
  if (stat === "damage") return `${formatNumber(player.stats.damage)} de dano`
  if (stat === "kills") return `${player.kda.kills} kills`
  return `${player.kda.deaths} mortes`
}

const formatKda = (player: PlayerStats) => `${player.kda.kills}/${player.kda.deaths}/${player.kda.assists}`

export default function CS2PlayerAwards() {
  const [mvpAward, ...otherAwards] = awards
  const mvp = mvpAward.player
  const mvpExtras = otherAwards.filter((award) => award.player === mvp).map((award) => award.award)
  const ranking = Object.values(players).sort((a, b) => b.stats.rating - a.stats.rating)

  return (
    <PageShell className="gap-8">
      <PageHeader
        title="Ranking da semana"
        description="Somando as duas partidas do dia."
        actions={
          <span className="rounded-full border border-line px-3 py-2 font-mono text-[13px] text-fg-muted">
            {AWARDS_DATE}
          </span>
        }
      />

      <section
        aria-labelledby="mvp"
        className="flex flex-wrap items-center gap-7 rounded-2xl border border-line bg-panel p-7"
      >
        <img src={mvp.image} alt={mvp.name} className="size-[120px] rounded-full border-[3px] border-team2 object-cover" />
        <div className="flex flex-[1_1_220px] flex-col gap-1.5">
          <span className="font-mono text-xs tracking-[0.1em] text-team2">MVP DA SEMANA</span>
          <h2 id="mvp" className="text-[40px] leading-tight font-bold tracking-tight">
            {mvp.name}
          </h2>
          {mvpExtras.length > 0 && (
            <span className="text-sm text-fg-muted">Também levou {mvpExtras.join(" e ")}</span>
          )}
        </div>
        <dl className="grid grid-cols-2 gap-x-10 gap-y-4">
          {[
            { label: "Rating", value: formatNumber(mvp.stats.rating, 2) },
            { label: "ADR", value: formatNumber(mvp.stats.adr, 1) },
            { label: "KAST", value: `${formatNumber(mvp.stats.kast, 1)}%` },
            { label: "K / D / A", value: formatKda(mvp) },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col gap-0.5">
              <dt className="text-xs text-fg-muted">{stat.label}</dt>
              <dd className="font-mono text-2xl">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="premios" className="flex flex-col gap-4">
        <SectionLabel id="premios">Prêmios</SectionLabel>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-3">
          {otherAwards.map(({ id, award, stat, player }) => (
            <article key={id} className="flex flex-col gap-3.5 rounded-[14px] border border-line bg-panel p-[18px]">
              <span className="text-[13px] font-semibold text-fg-muted">{award}</span>
              <div className="flex items-center gap-3">
                <img src={player.image} alt="" className="size-11 rounded-full object-cover" />
                <span className="text-[17px] font-bold">{player.name}</span>
              </div>
              <span className="font-mono text-sm">{formatStat(player, stat)}</span>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="estatisticas" className="flex flex-col gap-4">
        <SectionLabel id="estatisticas">Estatísticas</SectionLabel>
        <div className="overflow-x-auto rounded-[14px] border border-line bg-panel">
          <table className="w-full border-collapse text-sm whitespace-nowrap [&_td]:px-4 [&_td]:py-3 [&_th]:px-4 [&_th]:py-3 [&_th]:text-left">
            <thead>
              <tr className="border-b border-line text-xs text-fg-muted">
                {["Jogador", "Rating", "ADR", "KAST", "Dano", "K / D / A"].map((label) => (
                  <th key={label} scope="col" className="font-semibold">
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="font-mono">
              {ranking.map((player) => (
                <tr key={player.name} className="border-b border-line-soft last:border-b-0">
                  <th scope="row" className="font-sans font-semibold">
                    {player.name}
                  </th>
                  <td>{formatNumber(player.stats.rating, 2)}</td>
                  <td>{formatNumber(player.stats.adr, 1)}</td>
                  <td>{formatNumber(player.stats.kast, 1)}%</td>
                  <td>{formatNumber(player.stats.damage)}</td>
                  <td>{formatKda(player)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </PageShell>
  )
}
