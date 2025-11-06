"use client"

import { useState } from "react"
import { Copy, Check } from "lucide-react"

export function CodeBlock({ content }: { content: string }) {
  const [copied, setCopied] = useState(false)

  // Extract code blocks from content
  const parts: any[] = []
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g
  let lastIndex = 0
  let match

  while ((match = codeBlockRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push({
        type: "text",
        content: content.substring(lastIndex, match.index),
      })
    }
    parts.push({
      type: "code",
      language: match[1] || "plaintext",
      content: match[2].trim(),
    })
    lastIndex = codeBlockRegex.lastIndex
  }

  if (lastIndex < content.length) {
    parts.push({
      type: "text",
      content: content.substring(lastIndex),
    })
  }

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-3">
      {parts.map((part, idx) => (
        <div key={idx}>
          {part.type === "text" ? (
            <p className="whitespace-pre-wrap break-words font-bold text-sm leading-relaxed text-slate-200">
              {part.content}
            </p>
          ) : (
            <div className="bg-slate-900 rounded-lg overflow-hidden border border-slate-700">
              <div className="flex items-center justify-between bg-gradient-to-r from-slate-800 to-slate-700 px-4 py-2 border-b border-slate-700">
                <span className="text-xs font-mono text-amber-400 font-bold uppercase tracking-wider">
                  {part.language}
                </span>
                <button
                  onClick={() => copyToClipboard(part.content)}
                  className="flex items-center gap-1 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition uppercase"
                >
                  {copied ? (
                    <>
                      <Check size={14} /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy size={14} /> Copy
                    </>
                  )}
                </button>
              </div>
              <div className="overflow-x-auto max-h-96 overflow-y-auto">
                <pre className="p-4 font-mono text-sm leading-relaxed">
                  <code className="text-slate-100 font-bold whitespace-pre">{part.content}</code>
                </pre>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
