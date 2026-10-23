"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const NAV_LINKS = [
  { href: "/", label: "Início" },
  { href: "/team", label: "Times" },
  { href: "/map_picker", label: "Vetos" },
  { href: "/tournaments", label: "Chaveamento" },
  { href: "/awards", label: "Ranking" },
]

export function SiteHeader() {
  const pathname = usePathname()

  return (
    <header className="border-b border-line">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-3 px-6 py-3">
        <Link href="/" className="flex min-h-11 items-center gap-2.5 text-lg font-bold tracking-tight text-fg">
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="8" />
            <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
            <circle cx="12" cy="12" r="1.5" className="fill-team2" stroke="none" />
          </svg>
          SispBalas
        </Link>

        <nav aria-label="Principal" className="flex flex-wrap gap-1">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-lg px-3.5 py-3 text-sm font-medium transition-colors hover:bg-panel-2 hover:text-fg",
                  active ? "bg-panel-2 text-fg" : "text-fg-muted",
                )}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
