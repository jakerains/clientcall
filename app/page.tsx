'use client'

import { StatsSection } from "@/components/stats-section"
import { AppointmentsTable } from "@/components/appointments-table"
import { UploadSection } from "@/components/upload-section"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ClientDetailsSheet } from "@/components/client-details-sheet"
import { Toaster } from "@/components/ui/toaster"
import { useConfig } from "@/hooks/useConfig"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

export default function Page() {
  const { config, loading, error } = useConfig()

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-4">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load application configuration: {error}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!config) {
    return (
      <div className="min-h-screen bg-background p-4">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            No configuration available. Please check your environment setup.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto p-4 pb-24 space-y-6">
        <StatsSection />
        <UploadSection />
        <AppointmentsTable />
      </main>
      <Footer />
      <ClientDetailsSheet />
      <Toaster />
    </div>
  )
}

