"use client"

import { ExternalLink, Copy, Download } from "lucide-react"
import { useState } from "react"

interface CodePreviewProps {
  code: string
  language: string
}

export function CodePreview({ code, language }: CodePreviewProps) {
  const [showPreview, setShowPreview] = useState(false)
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadCode = () => {
    const extension = getExtension(language)
    const element = document.createElement("a")
    element.setAttribute("href", `data:text/plain;charset=utf-8,${encodeURIComponent(code)}`)
    element.setAttribute("download", `code.${extension}`)
    element.style.display = "none"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const getExtension = (lang: string) => {
    const extensions: Record<string, string> = {
      javascript: "js",
      typescript: "ts",
      python: "py",
      java: "java",
      cpp: "cpp",
      csharp: "cs",
      php: "php",
      ruby: "rb",
      go: "go",
      rust: "rs",
      html: "html",
      css: "css",
      sql: "sql",
      bash: "sh",
    }
    return extensions[lang] || "txt"
  }

  const renderPreview = () => {
    if (language === "html") {
      return (
        <iframe
          srcDoc={code}
          className="w-full h-96 border border-border rounded-lg bg-white"
          sandbox="allow-scripts allow-same-origin"
          title="HTML Preview"
        />
      )
    }
    return (
      <div className="bg-muted p-4 rounded-lg text-sm text-muted-foreground">
        Preview tidak tersedia untuk bahasa {language}
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2 justify-end">
        {language === "html" && (
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-2 px-3 py-1 text-sm bg-primary text-primary-foreground rounded hover:opacity-90"
            title="Preview HTML"
          >
            <ExternalLink size={16} />
            Preview
          </button>
        )}
        <button
          onClick={copyToClipboard}
          className="flex items-center gap-2 px-3 py-1 text-sm bg-muted hover:bg-muted/80 rounded"
          title="Copy code"
        >
          <Copy size={16} />
          {copied ? "Copied" : "Copy"}
        </button>
        <button
          onClick={downloadCode}
          className="flex items-center gap-2 px-3 py-1 text-sm bg-muted hover:bg-muted/80 rounded"
          title="Download code"
        >
          <Download size={16} />
          Download
        </button>
      </div>
      {showPreview && renderPreview()}
    </div>
  )
}
