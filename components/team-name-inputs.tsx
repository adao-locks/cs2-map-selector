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
    {
      label: "Time 1",
      value: team1,
      onChange: onTeam1Change,
      labelClass: "text-cyan-400",
      inputClass: "focus:border-cyan-400 focus:ring-cyan-400/20",
    },
    {
      label: "Time 2",
      value: team2,
      onChange: onTeam2Change,
      labelClass: "text-orange-400",
      inputClass: "focus:border-orange-400 focus:ring-orange-400/20",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {fields.map((field, index) => (
        <div key={field.label} className="space-y-3">
          <label
            htmlFor={`${id}-${index}`}
            className={`block text-sm font-medium uppercase tracking-wider ${field.labelClass}`}
          >
            {field.label}
          </label>
          <input
            id={`${id}-${index}`}
            type="text"
            value={field.value}
            onChange={(e) => field.onChange(e.target.value)}
            className={`w-full p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 transition-all ${field.inputClass}`}
            placeholder={`Nome do ${field.label}`}
          />
        </div>
      ))}
    </div>
  )
}
