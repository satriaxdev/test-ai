"use client"
import { X } from "lucide-react"

export const PERSONALITIES = [
  { id: "gaul", label: "Gaul", description: "Santai & casual" },
  { id: "serius", label: "Serius", description: "Formal & profesional" },
  { id: "tenang", label: "Tenang", description: "Sabar & berempati" },
  { id: "lucu", label: "Lucu", description: "Banyak humor" },
  { id: "ringkas", label: "Ringkas", description: "Jawaban singkat padat" },
  { id: "detail", label: "Detail", description: "Penjelasan mendalam" },
  { id: "helpful", label: "Helpful", description: "Selalu membantu" },
  { id: "creative", label: "Creative", description: "Berpikir kreatif" },
  { id: "analytical", label: "Analytical", description: "Logika & data" },
  { id: "friendly", label: "Friendly", description: "Ramah & hangat" },
]

interface PersonalitySelectorProps {
  selected: string[]
  onSelect: (personalities: string[]) => void
  isOpen: boolean
  onClose: () => void
}

export function PersonalitySelector({ selected, onSelect, isOpen, onClose }: PersonalitySelectorProps) {
  if (!isOpen) return null

  const togglePersonality = (id: string) => {
    const updated = selected.includes(id) ? selected.filter((p) => p !== id) : [...selected, id]
    onSelect(updated)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background border border-border rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Pilih Sifat AI</h3>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded">
            <X size={20} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
          {PERSONALITIES.map((personality) => (
            <button
              key={personality.id}
              onClick={() => togglePersonality(personality.id)}
              className={`p-3 rounded-lg border-2 text-left transition ${
                selected.includes(personality.id)
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <div className="font-medium text-sm">{personality.label}</div>
              <div className="text-xs text-muted-foreground">{personality.description}</div>
            </button>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
        >
          Done
        </button>
      </div>
    </div>
  )
}
