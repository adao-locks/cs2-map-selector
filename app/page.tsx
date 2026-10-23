/* eslint-disable @next/next/no-img-element */
import Link from "next/link"
import { ArrowRight, Map as MapIcon, Network, Trophy, Users } from "lucide-react"
import { PageShell, SectionLabel } from "@/components/page-shell"
import { buttonVariants } from "@/components/ui/button"
import { AWARDS_DATE, awards } from "@/data/awards"
import { formatNumber } from "@/lib/utils"

const tools = [
  {
    title: "Seletor de times",
    description: "Monte os dois times e o banco, e copie a escalação pro grupo.",
    href: "/team",
    Icon: Users,
  },
  {
    title: "Vetador de mapas",
    description: "Vetos e picks alternados, decider automático e escolha de lado.",
    href: "/map_picker",
    Icon: MapIcon,
  },
  {
    title: "Chaveamento",
    description: "Chave de 4, 8 ou 16 times, do primeiro jogo até o campeão.",
    href: "/tournaments",
    Icon: Network,
  },
  {
    title: "Ranking da semana",
    description: "MVP, mais dano, mais útil e os outros prêmios da rodada.",
    href: "/awards",
    Icon: Trophy,
  },
]

export default function HomePage() {
  const mvp = awards[0].player

  return (
    <PageShell className="gap-16 pt-[72px] pb-24">
      <section className="flex max-w-[720px] flex-col gap-5">
        <span className="font-mono text-[13px] tracking-[0.08em] text-fg-muted uppercase">CS2 entre amigos</span>
        <h1 className="text-5xl leading-[1.05] font-bold tracking-[-0.03em] md:text-[64px]">Bora cartear um CS?</h1>
        <p className="text-lg leading-relaxed text-fg-muted">
          Monte os times, vete os mapas, organize o chaveamento e veja quem carregou a semana. Tudo num lugar só.
        </p>
        <div className="mt-2 flex flex-wrap gap-3">
          <Link href="/team" className={buttonVariants({ className: "px-5 text-[15px]" })}>
            Montar os times
            <ArrowRight />
          </Link>
          <Link href="/map_picker" className={buttonVariants({ variant: "secondary", className: "px-5 text-[15px]" })}>
            Ir para o veto
          </Link>
        </div>
      </section>

      <section aria-labelledby="ferramentas" className="flex flex-col gap-5">
        <SectionLabel id="ferramentas">Ferramentas</SectionLabel>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4">
          {tools.map(({ title, description, href, Icon }) => (
            <Link
              key={href}
              href={href}
              className="group flex min-h-[200px] flex-col gap-4 rounded-[14px] border border-line bg-panel p-6 transition-colors hover:border-line-strong hover:bg-[#161a20]"
            >
              <span className="flex size-11 items-center justify-center rounded-[10px] bg-panel-2">
                <Icon className="size-[22px]" strokeWidth={1.8} aria-hidden="true" />
              </span>
              <span className="flex flex-col gap-1.5">
                <span className="text-lg font-semibold">{title}</span>
                <span className="text-sm leading-normal text-fg-muted">{description}</span>
              </span>
              <span className="mt-auto flex items-center gap-1.5 text-sm font-medium">
                Abrir
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section
        aria-labelledby="destaque"
        className="flex flex-wrap items-center gap-6 rounded-[14px] border border-line bg-panel p-6"
      >
        <img src={mvp.image} alt={mvp.name} className="size-[72px] rounded-full border-2 border-line-strong object-cover" />
        <div className="flex flex-[1_1_200px] flex-col gap-1">
          <span className="font-mono text-xs tracking-[0.08em] text-fg-muted uppercase">MVP da semana · {AWARDS_DATE}</span>
          <h2 id="destaque" className="text-2xl font-bold tracking-tight">
            {mvp.name}
          </h2>
        </div>
        <dl className="flex flex-wrap gap-8">
          {[
            { label: "Rating", value: formatNumber(mvp.stats.rating, 2) },
            { label: "ADR", value: formatNumber(mvp.stats.adr, 1) },
            { label: "K / D / A", value: `${mvp.kda.kills} / ${mvp.kda.deaths} / ${mvp.kda.assists}` },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col gap-0.5">
              <dt className="text-xs text-fg-muted">{stat.label}</dt>
              <dd className="font-mono text-xl">{stat.value}</dd>
            </div>
          ))}
        </dl>
        <Link href="/awards" className={buttonVariants({ variant: "secondary" })}>
          Ver ranking
        </Link>
      </section>
    </PageShell>
  )
}
