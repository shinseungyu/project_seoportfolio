"use client"

import { useState } from "react"
import { Check } from "lucide-react"

interface Criterion {
  id: string
  label: string
  description: string
}

export function EligibilityChecklist({
  criteria,
}: {
  criteria: Criterion[]
}) {
  const [checked, setChecked] = useState<Record<string, boolean>>({})

  const toggleCheck = (id: string) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const allChecked =
    criteria.length > 0 && criteria.every((c) => checked[c.id])

  return (
    <div className="mt-6">
      <ul className="flex flex-col gap-3" role="list">
        {criteria.map((criterion) => (
          <li key={criterion.id}>
            <button
              type="button"
              onClick={() => toggleCheck(criterion.id)}
              className={`flex w-full items-start gap-4 rounded-xl border p-4 text-left transition-colors ${
                checked[criterion.id]
                  ? "border-primary/30 bg-primary/5"
                  : "border-border bg-card hover:bg-muted/50"
              }`}
              aria-pressed={!!checked[criterion.id]}
            >
              <span
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors ${
                  checked[criterion.id]
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card"
                }`}
              >
                {checked[criterion.id] && <Check className="h-3 w-3" />}
              </span>
              <span className="flex flex-col gap-0.5">
                <span className="text-sm font-medium text-foreground">
                  {criterion.label}
                </span>
                <span className="text-xs text-muted-foreground">
                  {criterion.description}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      {allChecked && (
        <div className="mt-6 rounded-xl border border-accent bg-accent/10 p-4 text-center">
          <p className="text-sm font-semibold text-foreground">
            모든 자격 요건을 충족합니다!
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            지금 바로 가까운 은행 또는 모바일 앱에서 가입하실 수 있습니다.
          </p>
        </div>
      )}
    </div>
  )
}
