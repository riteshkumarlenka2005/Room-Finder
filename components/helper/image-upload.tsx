"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Upload, X, Image as ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface ImageUploadProps {
  value: File[]
  onChange: (files: File[]) => void
  placeholder?: string
  maxFiles?: number
  single?: boolean
}

export function ImageUpload({
  value,
  onChange,
  placeholder = "Upload images",
  maxFiles = 6,
  single = false,
}: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const [previews, setPreviews] = useState<string[]>([])

  // 🔥 Sync previews whenever value changes (important!)
  useEffect(() => {
    if (value.length > 0) {
      const urls = value.map((file) => URL.createObjectURL(file))
      setPreviews(urls)

      return () => {
        urls.forEach((url) => URL.revokeObjectURL(url))
      }
    } else {
      setPreviews([])
    }
  }, [value])

  const handleFiles = (files: FileList | null) => {
    if (!files) return

    const newFiles = Array.from(files).filter((file) => file.type.startsWith("image/"))

    if (single) {
      const file = newFiles[0]
      if (file) {
        onChange([file])
      }
    } else {
      const remaining = maxFiles - value.length
      const filesToAdd = newFiles.slice(0, remaining)
      onChange([...value, ...filesToAdd])
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    handleFiles(e.dataTransfer.files)
  }

  const removeImage = (index: number) => {
    const newFiles = value.filter((_, i) => i !== index)
    onChange(newFiles)
  }

  const canAddMore = single ? value.length === 0 : value.length < maxFiles

  return (
    <div className="space-y-3">
      {canAddMore && (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "relative border-2 border-dashed rounded-lg p-6 transition-all cursor-pointer",
            "hover:border-[#2563EB]/50 hover:bg-[#2563EB]/5",
            dragActive ? "border-[#2563EB] bg-[#2563EB]/10" : "border-border bg-card",
          )}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple={!single}
            onChange={(e) => handleFiles(e.target.files)}
            className="hidden"
          />
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#2563EB]/10">
              <Upload className="h-6 w-6 text-[#2563EB]" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{placeholder}</p>
              <p className="text-xs text-muted-foreground mt-1">Drag and drop or click to browse</p>
              {!single && (
                <p className="text-xs text-muted-foreground">
                  Up to {maxFiles} images ({value.length}/{maxFiles})
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {previews.length > 0 && (
        <div className={cn("grid gap-3", single ? "grid-cols-1" : "grid-cols-2 sm:grid-cols-3")}>
          {previews.map((preview, index) => (
            <div
              key={index}
              className="relative group rounded-lg overflow-hidden border border-border bg-muted aspect-square"
            >
              <Image src={preview || "/placeholder.svg"} alt={`Upload ${index + 1}`} fill className="object-cover" />

              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-card/90 text-foreground shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-destructive-foreground"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/50 to-transparent p-2">
                <div className="flex items-center gap-1 text-primary-foreground text-xs">
                  <ImageIcon className="h-3 w-3" />
                  <span className="truncate">{value[index]?.name}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
