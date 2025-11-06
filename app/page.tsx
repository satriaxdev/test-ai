"use client"

import { useState, useEffect } from "react"
import { ChatInterface } from "@/components/chat-interface"
import { Sidebar } from "@/components/sidebar"
import { Menu, X } from "lucide-react"

export default function Page() {
  const [conversations, setConversations] = useState<any[]>([])
  const [currentConversation, setCurrentConversation] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem("theme")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    const shouldBeDark = saved ? saved === "dark" : prefersDark
    const html = document.documentElement
    if (shouldBeDark) {
      html.classList.add("dark")
    } else {
      html.classList.remove("dark")
    }
  }, [])

  useEffect(() => {
    const saved = localStorage.getItem("conversations")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setConversations(parsed)
        if (parsed.length > 0) {
          setCurrentConversation(parsed[0].id)
        }
      } catch (e) {
        console.error("Failed to load conversations", e)
      }
    }
  }, [])

  const createNewConversation = () => {
    const newConversation = {
      id: Date.now().toString(),
      title: "New Chat",
      messages: [],
      createdAt: new Date().toISOString(),
    }
    const updated = [newConversation, ...conversations]
    setConversations(updated)
    localStorage.setItem("conversations", JSON.stringify(updated))
    setCurrentConversation(newConversation.id)
  }

  const updateConversation = (id: string, messages: any[]) => {
    const updated = conversations.map((c) =>
      c.id === id ? { ...c, messages, title: messages[0]?.content?.substring(0, 30) || "New Chat" } : c,
    )
    setConversations(updated)
    localStorage.setItem("conversations", JSON.stringify(updated))
  }

  const deleteConversation = (id: string) => {
    const updated = conversations.filter((c) => c.id !== id)
    setConversations(updated)
    localStorage.setItem("conversations", JSON.stringify(updated))
    if (currentConversation === id) {
      setCurrentConversation(updated.length > 0 ? updated[0].id : null)
    }
  }

  const current = conversations.find((c) => c.id === currentConversation)

  if (!mounted) return null

  return (
    <div className="flex h-screen bg-background">
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden absolute top-4 left-4 z-50 p-2 hover:bg-muted rounded-lg"
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {sidebarOpen && (
        <div className="md:relative absolute inset-0 md:w-64 md:border-r md:border-border z-40">
          <Sidebar
            conversations={conversations}
            currentConversation={currentConversation}
            onSelectConversation={(id) => {
              setCurrentConversation(id)
              setSidebarOpen(false)
            }}
            onNewChat={createNewConversation}
            onDeleteConversation={deleteConversation}
          />
        </div>
      )}

      <div className="flex-1 flex flex-col">
        {current ? (
          <ChatInterface
            conversation={current}
            onUpdateConversation={(messages) => updateConversation(current.id, messages)}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <button
              onClick={createNewConversation}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
            >
              Start New Chat
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
