"use client"

import { useId } from "react"

type TeamNameInputsProps = {
  team1: string
  team2: string
  onTeam1Change: (name: string) => void
  onTeam2Change: (name: string) => void
}

export function TeamNameInputs({ team1, team2, onTeam1Change, onTeam2Change }: TeamNameInputsProps) {
  const id = useId()

  const fields = [
    { label: "Time 1", value: team1, onChange: onTeam1Change, dotClass: "bg-team1" },
    { label: "Time 2", value: team2, onChange: onTeam2Change, dotClass: "bg-team2" },
  ]

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      {fields.map((field, index) => (
        <div key={field.label} className="flex flex-col gap-2">
          <label
            htmlFor={`${id}-${index}`}
            className="flex items-center gap-2 text-[13px] font-semibold text-fg-muted"
          >
            <span className={`size-2 rounded-full ${field.dotClass}`} />
            {field.label}
          </label>
          <input
            id={`${id}-${index}`}
            type="text"
            value={field.value}
            onChange={(e) => field.onChange(e.target.value)}
            placeholder={`Nome do ${field.label}`}
            className="h-11 rounded-[10px] border border-line bg-panel px-3.5 text-[15px] text-fg placeholder:text-fg-subtle focus:border-team1"
          />
        </div>
      ))}
    </div>
  )
}
