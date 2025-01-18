"use client"

import { Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSheet } from "@/components/ui/sheet"

export function Header() {
  const { setIsOpen } = useSheet()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 shadow-lg">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-white">Client Caller</h1>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setIsOpen(true)}
          className="hover:bg-blue-400/20 text-white"
        >
          <Settings className="h-5 w-5 transition-transform hover:rotate-90" />
          <span className="sr-only">Settings</span>
        </Button>
      </div>
    </header>
  )
}

