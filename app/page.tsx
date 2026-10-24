import Link from "next/link"
import { ArrowRight, Map as MapIcon, Network, Users } from "lucide-react"
import { PageShell, SectionLabel } from "@/components/page-shell"
import { buttonVariants } from "@/components/ui/button"

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
]

export default function HomePage() {
  return (
    <PageShell className="gap-16 pt-[72px] pb-24">
      <section className="flex max-w-[720px] flex-col gap-5">
        <span className="font-mono text-[13px] tracking-[0.08em] text-fg-muted uppercase">CS2 entre amigos</span>
        <h1 className="text-5xl leading-[1.05] font-bold tracking-[-0.03em] md:text-[64px]">Bora cartear um CS?</h1>
        <p className="text-lg leading-relaxed text-fg-muted">
          Monte os times, vete os mapas e organize o chaveamento. Tudo num lugar só.
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
    </PageShell>
  )
}
