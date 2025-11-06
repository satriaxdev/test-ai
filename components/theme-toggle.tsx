"use client"

import { Moon, Sun } from "lucide-react"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("theme")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    const shouldBeDark = saved ? saved === "dark" : prefersDark
    setIsDark(shouldBeDark)
    applyTheme(shouldBeDark)
  }, [])

  const applyTheme = (dark: boolean) => {
    const html = document.documentElement
    if (dark) {
      html.classList.add("dark")
    } else {
      html.classList.remove("dark")
    }
  }

  const toggleTheme = () => {
    const newTheme = !isDark
    setIsDark(newTheme)
    applyTheme(newTheme)
    localStorage.setItem("theme", newTheme ? "dark" : "light")
  }

  return (
    <button onClick={toggleTheme} className="p-2 hover:bg-muted rounded-lg transition" title="Toggle theme">
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  )
}
