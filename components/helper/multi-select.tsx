"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Check, ChevronDown, X, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { createPortal } from "react-dom"

interface Option {
  value: string
  label: string
}

interface MultiSelectProps {
  options: Option[]
  selected: string[]
  onChange: (values: string[]) => void
  placeholder?: string
}

export function MultiSelect({ options, selected, onChange, placeholder = "Select options" }: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState("")
  const containerRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  })

  // ⭐ FIX #1 → Calculate position BEFORE opening (removes jump)
  const openDropdown = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()

      setDropdownPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width: rect.width,
      })
    }
    setIsOpen(true)
  }

  const closeDropdown = () => {
    setIsOpen(false)
    setSearch("")
  }

  // Listen for scroll/resize AFTER open
  useEffect(() => {
    if (!isOpen) return

    const updatePosition = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setDropdownPosition({
          top: rect.bottom + window.scrollY + 4,
          left: rect.left + window.scrollX,
          width: rect.width,
        })
      }
    }

    window.addEventListener("scroll", updatePosition, true)
    window.addEventListener("resize", updatePosition)

    return () => {
      window.removeEventListener("scroll", updatePosition, true)
      window.removeEventListener("resize", updatePosition)
    }
  }, [isOpen])

  // Click outside → close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        closeDropdown()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Escape key → close dropdown
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeDropdown()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      return () => document.removeEventListener("keydown", handleEscape)
    }
  }, [isOpen])

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(search.toLowerCase()),
  )

  const toggleOption = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value))
    } else {
      onChange([...selected, value])
    }
  }

  const removeOption = (value: string, e: React.MouseEvent) => {
    e.stopPropagation()
    onChange(selected.filter((v) => v !== value))
  }

  const selectedLabels = selected.map((value) => {
    const option = options.find((o) => o.value === value)
    return option ? option.label : value
  })

  const dropdownContent =
    isOpen && typeof document !== "undefined"
      ? createPortal(
          <div
            ref={dropdownRef}
            style={{
              position: "absolute",
              top: dropdownPosition.top,
              left: dropdownPosition.left,
              width: dropdownPosition.width,
              zIndex: 9999,
            }}
            className="animate-in fade-in-0 zoom-in-95 duration-150"
          >
            <div className="rounded-lg border border-gray-200 bg-white shadow-lg overflow-hidden">
              {/* Search bar */}
              <div className="p-2 border-b border-gray-100 bg-gray-50/50">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search options..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-md border border-gray-200 bg-white 
                    focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20
                    placeholder:text-gray-400 transition-all duration-150"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>

              {/* Options */}
              <div
                className="max-h-80 overflow-y-auto p-1.5 
                [&::-webkit-scrollbar]:w-2
                [&::-webkit-scrollbar-track]:bg-gray-100
                [&::-webkit-scrollbar-thumb]:bg-gray-300
                [&::-webkit-scrollbar-thumb]:rounded-full
                scroll-smooth"
              >
                {filteredOptions.length === 0 ? (
                  <div className="px-3 py-6 text-sm text-gray-400 text-center">
                    No options found
                  </div>
                ) : (
                  filteredOptions.map((option) => {
                    const isSelected = selected.includes(option.value)
                    return (
                      <div
                        key={option.value}
                        onClick={() => toggleOption(option.value)}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 text-sm rounded-md cursor-pointer transition-all duration-150",
                          isSelected
                            ? "bg-[#2563EB]/10 text-[#2563EB] font-medium"
                            : "text-gray-700 hover:bg-gray-100",
                        )}
                      >
                        <div
                          className={cn(
                            "h-4 w-4 rounded border-2 flex items-center justify-center transition-all duration-150",
                            isSelected
                              ? "bg-[#2563EB] border-[#2563EB]"
                              : "border-gray-300 hover:border-gray-400",
                          )}
                        >
                          {isSelected && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
                        </div>
                        <span className="truncate">{option.label}</span>
                      </div>
                    )
                  })
                )}
              </div>

              {/* Footer */}
              {selected.length > 0 && (
                <div className="px-3 py-2 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {selected.length} selected
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      onChange([])
                    }}
                    className="text-xs text-[#2563EB] hover:text-[#1d4ed8] font-medium transition-colors"
                  >
                    Clear all
                  </button>
                </div>
              )}
            </div>
          </div>,
          document.body,
        )
      : null

  return (
    <div ref={containerRef} className="relative">
      <div
        onClick={() => {
          isOpen ? closeDropdown() : openDropdown()
        }}
        className={cn(
          "min-h-11 w-full rounded-lg border bg-white px-3 py-2 cursor-pointer transition-all duration-200",
          "hover:border-[#2563EB]/50",
          isOpen
            ? "border-[#2563EB] ring-2 ring-[#2563EB]/20 shadow-sm"
            : "border-gray-200",
        )}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1.5 flex-1 min-h-[24px]">
            {selected.length === 0 ? (
              <span className="text-gray-400 text-sm py-0.5">
                {placeholder}
              </span>
            ) : (
              selectedLabels.slice(0, 3).map((label, index) => (
                <span
                  key={selected[index]}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#2563EB]/10 text-[#2563EB] text-xs font-medium hover:bg-[#2563EB]/15 transition-colors"
                >
                  <span className="max-w-[100px] truncate">{label}</span>
                  <button
                    type="button"
                    onClick={(e) => removeOption(selected[index], e)}
                    className="hover:bg-[#2563EB]/20 rounded-full p-0.5 transition-colors ml-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))
            )}

            {selected.length > 3 && (
              <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-gray-600 text-xs font-medium">
                +{selected.length - 3} more
              </span>
            )}
          </div>

          <ChevronDown
            className={cn(
              "h-4 w-4 text-gray-400 transition-transform duration-200",
              isOpen && "rotate-180 text-[#2563EB]",
            )}
          />
        </div>
      </div>

      {dropdownContent}
    </div>
  )
}
