"use client"

import { useState } from "react"
import { CodeBlock } from "./code-block"
import { CodePreview } from "./code-preview"
import { Eye } from "lucide-react"

export function MessageBubble({ message }: { message: any }) {
  const isUser = message.role === "user"
  const [showPreview, setShowPreview] = useState(false)

  const hasCodeBlock = message.content.includes("```")
  const codeLanguageMatch = message.content.match(/```(\w+)/)
  const language = codeLanguageMatch ? codeLanguageMatch[1] : "javascript"

  const codeMatch = message.content.match(/```\w*\n([\s\S]*?)```/)
  const codeContent = codeMatch ? codeMatch[1].trim() : ""

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`w-full mx-2 px-4 py-3 rounded-lg ${
          isUser
            ? "bg-blue-600 text-white max-w-md"
            : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-600 max-w-2xl"
        }`}
      >
        {hasCodeBlock ? (
          <div className="space-y-3">
            {(language === "html" || language === "css" || language === "javascript") && (
              <div className="flex justify-end">
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="flex items-center gap-1 text-xs px-3 py-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-md hover:opacity-90 transition font-bold"
                >
                  <Eye size={14} />
                  {showPreview ? "Hide Preview" : "Preview"}
                </button>
              </div>
            )}
            {showPreview && codeContent && (
              <div className="mb-3 bg-white dark:bg-slate-900 rounded-lg border-2 border-purple-400 dark:border-purple-600 p-3">
                <CodePreview code={codeContent} language={language} />
              </div>
            )}
            <div className="bg-slate-900 text-slate-100 rounded-lg overflow-hidden border border-slate-700">
              <CodeBlock content={message.content} />
            </div>
          </div>
        ) : (
          <div className="whitespace-pre-wrap break-words font-bold text-base leading-relaxed">{message.content}</div>
        )}
        {message.model && (
          <p className="text-xs mt-3 opacity-75 font-bold italic">
            {message.role === "assistant" && `Model: ${message.model === "gemini" ? "Google Gemini" : "DeepSeek R1"}`}
          </p>
        )}
      </div>
    </div>
  )
}
