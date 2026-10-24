import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

export function PageShell({ children, className }: { children: ReactNode; className?: string }) {
  return <main className={cn("mx-auto flex max-w-[1200px] flex-col gap-7 px-6 pt-10 pb-20", className)}>{children}</main>
}

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string
  description?: ReactNode
  actions?: ReactNode
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-[32px] font-bold tracking-tight">{title}</h1>
        {description && <p className="text-[15px] text-fg-muted">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  )
}

export function SectionLabel({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <h2 id={id} className="text-sm font-semibold tracking-[0.06em] text-fg-muted uppercase">
      {children}
    </h2>
  )
}
