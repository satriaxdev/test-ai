"use client"

import { useState, useRef } from "react"
import { Download, RotateCcw } from "lucide-react"

interface ImageEditorProps {
  imageUrl: string
  onClose: () => void
}

export function ImageEditor({ imageUrl, onClose }: ImageEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [brightness, setBrightness] = useState(100)
  const [contrast, setContrast] = useState(100)
  const [saturation, setSaturation] = useState(100)
  const [rotation, setRotation] = useState(0)

  const applyFilters = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const img = new Image()
    img.crossOrigin = "anonymous"
    img.src = imageUrl

    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height

      ctx.save()
      ctx.translate(canvas.width / 2, canvas.height / 2)
      ctx.rotate((rotation * Math.PI) / 180)
      ctx.translate(-canvas.width / 2, -canvas.height / 2)

      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`
      ctx.drawImage(img, 0, 0)
      ctx.restore()
    }
  }

  const downloadImage = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement("a")
    link.href = canvas.toDataURL("image/png")
    link.download = "edited-image.png"
    link.click()
  }

  const reset = () => {
    setBrightness(100)
    setContrast(100)
    setSaturation(100)
    setRotation(0)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
        <div className="p-4 border-b border-border flex justify-between items-center">
          <h3 className="font-semibold">Edit Foto</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            ✕
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div className="flex justify-center">
            <canvas
              ref={canvasRef}
              className="max-w-md max-h-48 rounded-lg border border-border"
              onLoad={applyFilters}
            />
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium">Brightness: {brightness}%</label>
              <input
                type="range"
                min="0"
                max="200"
                value={brightness}
                onChange={(e) => {
                  setBrightness(Number(e.target.value))
                  applyFilters()
                }}
                className="w-full"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Contrast: {contrast}%</label>
              <input
                type="range"
                min="0"
                max="200"
                value={contrast}
                onChange={(e) => {
                  setContrast(Number(e.target.value))
                  applyFilters()
                }}
                className="w-full"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Saturation: {saturation}%</label>
              <input
                type="range"
                min="0"
                max="200"
                value={saturation}
                onChange={(e) => {
                  setSaturation(Number(e.target.value))
                  applyFilters()
                }}
                className="w-full"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Rotation: {rotation}°</label>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const newRotation = (rotation - 90 + 360) % 360
                    setRotation(newRotation)
                    applyFilters()
                  }}
                  className="px-3 py-1 bg-muted hover:bg-muted/80 rounded"
                >
                  <RotateCcw size={16} />
                </button>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={rotation}
                  onChange={(e) => {
                    setRotation(Number(e.target.value))
                    applyFilters()
                  }}
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <button onClick={reset} className="px-4 py-2 bg-muted hover:bg-muted/80 rounded flex items-center gap-2">
              <RotateCcw size={16} />
              Reset
            </button>
            <button
              onClick={downloadImage}
              className="px-4 py-2 bg-primary text-primary-foreground rounded hover:opacity-90 flex items-center gap-2"
            >
              <Download size={16} />
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
