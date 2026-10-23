import Link from "next/link"
import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

export function BackToMenu() {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all duration-300"
    >
      ← Voltar para Menu
    </Link>
  )
}

export function PageShell({
  children,
  showBack = true,
  className,
}: {
  children: ReactNode
  showBack?: boolean
  className?: string
}) {
  return (
    <div className="min-h-screen bg-slate-900 p-4 md:p-6">
      {/* Background Effects */}
      <div className="pointer-events-none fixed inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0deg,rgba(120,119,198,0.1)_60deg,transparent_120deg)]"></div>
      </div>

      <div className={cn("relative z-10 max-w-7xl mx-auto", className)}>
        {showBack && (
          <div className="text-center mb-8">
            <BackToMenu />
          </div>
        )}
        {children}
      </div>
    </div>
  )
}
