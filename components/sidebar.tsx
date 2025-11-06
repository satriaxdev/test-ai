"use client"

import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Sidebar({
  conversations,
  currentConversation,
  onSelectConversation,
  onNewChat,
  onDeleteConversation,
}: {
  conversations: any[]
  currentConversation: string | null
  onSelectConversation: (id: string) => void
  onNewChat: () => void
  onDeleteConversation: (id: string) => void
}) {
  return (
    <div className="h-full w-full md:w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="p-4 border-b border-sidebar-border">
        <h1 className="text-lg font-bold text-sidebar-primary mb-3">Halilintar AI</h1>
        <p className="text-xs text-sidebar-foreground/60 mb-3">by Halilintar</p>
        <Button
          onClick={onNewChat}
          className="w-full gap-2 bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-accent"
        >
          <Plus size={20} />
          New Chat
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto px-2 space-y-2 py-2">
        {conversations.map((conv) => (
          <div
            key={conv.id}
            onClick={() => onSelectConversation(conv.id)}
            className={`p-3 rounded-lg cursor-pointer transition truncate ${
              currentConversation === conv.id
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "hover:bg-sidebar-accent/50 text-sidebar-foreground"
            }`}
          >
            <p className="text-sm truncate">{conv.title || "New Chat"}</p>
            <p className="text-xs text-sidebar-foreground/60">{new Date(conv.createdAt).toLocaleDateString()}</p>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-sidebar-border space-y-2">
        {conversations.map(
          (conv) =>
            currentConversation === conv.id && (
              <button
                key={`delete-${conv.id}`}
                onClick={() => onDeleteConversation(conv.id)}
                className="w-full flex items-center gap-2 px-3 py-2 text-destructive hover:bg-destructive/10 rounded-lg transition text-sm"
              >
                <Trash2 size={16} />
                Delete Chat
              </button>
            ),
        )}
      </div>
    </div>
  )
}
