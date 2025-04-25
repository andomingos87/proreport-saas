"use client"

import React, { createContext, useContext, useState } from "react"
import { cn } from "@/lib/utils"

// Context para controlar os estados do accordion
type AccordionContextType = {
  expanded: string | null
  toggleExpanded: (itemId: string) => void
}

const AccordionContext = createContext<AccordionContextType | undefined>(undefined)

export function Accordion({
  className,
  defaultExpanded,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  defaultExpanded?: string
}) {
  const [expanded, setExpanded] = useState<string | null>(defaultExpanded || null)

  const toggleExpanded = (itemId: string) => {
    setExpanded(prev => prev === itemId ? null : itemId)
  }

  return (
    <AccordionContext.Provider value={{ expanded, toggleExpanded }}>
      <div className={cn("space-y-2", className)} {...props}>
        {children}
      </div>
    </AccordionContext.Provider>
  )
}

export function AccordionItem({
  className,
  id,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { id: string }) {
  const context = useContext(AccordionContext)
  
  if (!context) {
    throw new Error("AccordionItem deve ser usado dentro de Accordion")
  }

  return (
    <div
      className={cn("border rounded-md overflow-hidden", className)}
      {...props}
    >
      {children}
    </div>
  )
}

export function AccordionTrigger({
  className,
  children,
  id,
  ...props
}: React.HTMLAttributes<HTMLButtonElement> & { id: string }) {
  const context = useContext(AccordionContext)
  
  if (!context) {
    throw new Error("AccordionTrigger deve ser usado dentro de AccordionItem")
  }

  const { expanded, toggleExpanded } = context
  const isExpanded = expanded === id

  return (
    <button
      className={cn(
        "flex w-full items-center justify-between px-4 py-3 font-medium text-left bg-slate-50 hover:bg-slate-100 transition-all",
        className
      )}
      onClick={() => toggleExpanded(id)}
      aria-expanded={isExpanded}
      {...props}
    >
      {children}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn(
          "h-4 w-4 shrink-0 transition-transform duration-200",
          isExpanded ? "rotate-180 transform" : ""
        )}
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </button>
  )
}

export function AccordionContent({
  className,
  children,
  id,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { id: string }) {
  const context = useContext(AccordionContext)
  
  if (!context) {
    throw new Error("AccordionContent deve ser usado dentro de AccordionItem")
  }

  const { expanded } = context
  const isExpanded = expanded === id

  return (
    <div
      className={cn(
        "overflow-hidden transition-all",
        isExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0",
        className
      )}
      {...props}
    >
      {isExpanded && <div className="p-4">{children}</div>}
    </div>
  )
} 