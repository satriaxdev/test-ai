"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Send, Paperclip, Settings } from "lucide-react"
import { MessageBubble } from "./message-bubble"
import { PersonalitySelector, PERSONALITIES } from "./personality-selector"
import { ThemeToggle } from "./theme-toggle"
import { ImageEditor } from "./image-editor"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  model?: string
  language?: string
}

interface ConversationProp {
  id: string
  messages: Message[]
}

export function ChatInterface({
  conversation,
  onUpdateConversation,
}: {
  conversation: ConversationProp
  onUpdateConversation: (messages: Message[]) => void
}) {
  const [messages, setMessages] = useState<Message[]>(conversation.messages)
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [model, setModel] = useState("gemini")
  const [file, setFile] = useState<File | null>(null)
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const [selectedPersonalities, setSelectedPersonalities] = useState<string[]>([])
  const [showPersonalitySelector, setShowPersonalitySelector] = useState(false)
  const [showImageEditor, setShowImageEditor] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMessages(conversation.messages)
  }, [conversation.id])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const isImageFile = (file: File) => {
    return file.type.startsWith("image/")
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    setFile(selectedFile)

    if (isImageFile(selectedFile)) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setFilePreview(event.target?.result as string)
      }
      reader.readAsDataURL(selectedFile)
    } else {
      setFilePreview(null)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() && !file) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input || (file ? `[File: ${file.name}]` : ""),
      model,
    }

    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInput("")
    setFile(null)
    setFilePreview(null)
    setLoading(true)

    try {
      const formData = new FormData()
      formData.append("messages", JSON.stringify(updatedMessages))
      formData.append("model", model)
      formData.append("personalities", JSON.stringify(selectedPersonalities))
      if (file) {
        formData.append("file", file)
      }

      const response = await fetch("/api/chat", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (data.error) {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: `Error: ${data.error}`,
          model,
        }
        setMessages([...updatedMessages, errorMessage])
      } else {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.content,
          model,
        }
        setMessages([...updatedMessages, assistantMessage])
      }
    } catch (error) {
      console.error("Chat error:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Failed to get response. Please try again.",
        model,
      }
      setMessages([...updatedMessages, errorMessage])
    } finally {
      setLoading(false)
    }

    onUpdateConversation([
      ...updatedMessages,
      {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "",
        model,
      },
    ])
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="border-b-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 flex justify-between items-center shadow-md">
        <h2 className="text-2xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Halilintar AI
        </h2>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowPersonalitySelector(true)}
            className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition font-bold text-slate-700 dark:text-slate-300"
            title="Set personality traits"
          >
            <Settings size={20} />
          </button>
          <ThemeToggle />
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="px-3 py-2 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100 border-2 border-blue-400 dark:border-blue-600 font-bold hover:bg-blue-200 dark:hover:bg-blue-800 transition"
          >
            <option value="gemini">Gemini AI</option>
            <option value="deepseek">DeepSeek R1</option>
          </select>
        </div>
      </div>

      {selectedPersonalities.length > 0 && (
        <div className="bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/50 dark:to-blue-900/50 border-b-2 border-purple-300 dark:border-purple-700 px-4 py-3 flex flex-wrap gap-2">
          {selectedPersonalities.map((p) => (
            <span
              key={p}
              className="text-xs px-3 py-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full font-bold shadow-md"
            >
              {PERSONALITIES.find((pers) => pers.id === p)?.label}
            </span>
          ))}
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-w-5xl mx-auto w-full">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg p-3 font-bold">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-current rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {file && (
        <div className="px-4 py-3 bg-slate-200 dark:bg-slate-800 border-t-2 border-slate-300 dark:border-slate-700 flex items-center justify-between font-bold">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-700 dark:text-slate-300">{file.name}</span>
            {filePreview && (
              <button
                onClick={() => setShowImageEditor(true)}
                className="text-xs px-3 py-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded hover:opacity-90 transition font-bold"
              >
                Edit Image
              </button>
            )}
          </div>
          <button
            onClick={() => setFile(null)}
            className="text-xs text-red-600 dark:text-red-400 hover:underline font-bold"
          >
            Remove
          </button>
        </div>
      )}

      <form
        onSubmit={handleSendMessage}
        className="border-t-2 border-slate-300 dark:border-slate-700 p-4 bg-white dark:bg-slate-900 shadow-lg"
      >
        <div className="flex gap-2 max-w-5xl mx-auto">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition font-bold text-slate-700 dark:text-slate-300"
            title="Attach file"
          >
            <Paperclip size={20} />
          </button>
          <input ref={fileInputRef} type="file" hidden onChange={handleFileSelect} />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg border-2 border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 font-bold"
            disabled={loading}
          />
          <Button
            type="submit"
            disabled={loading || (!input.trim() && !file)}
            className="gap-2 font-bold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Send size={20} />
          </Button>
        </div>
      </form>

      <PersonalitySelector
        selected={selectedPersonalities}
        onSelect={setSelectedPersonalities}
        isOpen={showPersonalitySelector}
        onClose={() => setShowPersonalitySelector(false)}
      />

      {showImageEditor && filePreview && (
        <ImageEditor imageUrl={filePreview} onClose={() => setShowImageEditor(false)} />
      )}
    </div>
  )
}
