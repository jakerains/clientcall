'use client'

import { useState } from 'react'
import { StatsSection } from "@/components/stats-section"
import { AppointmentsTable } from "@/components/appointments-table"
import { UploadSection } from "@/components/upload-section"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ClientDetailsSheet } from "@/components/client-details-sheet"
import { Toaster } from "@/components/ui/toaster"
import { SettingsPanel } from "@/components/settings-panel"
import { BlandSettings } from "@/lib/blandApi"

export default function Page() {
  const [blandSettings, setBlandSettings] = useState<BlandSettings>({
    prompt: "Hello, this is a confirmation call for your appointment on {date}. Please press 1 to confirm or 2 to reschedule.",
    voice: "female",
    language: "en-US"
  })

  return (
    <div className="min-h-screen bg-background">
      <Header>
        <SettingsPanel settings={blandSettings} onSettingsChange={setBlandSettings} />
      </Header>
      <main className="container mx-auto p-4 pb-24 space-y-6">
        <StatsSection />
        <UploadSection />
        <AppointmentsTable blandSettings={blandSettings} />
      </main>
      <Footer />
      <ClientDetailsSheet />
      <Toaster />
    </div>
  )
}

