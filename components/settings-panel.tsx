'use client'

import { useState } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Settings } from 'lucide-react'
import { BlandSettings } from '@/lib/blandApi'

interface SettingsPanelProps {
  settings: BlandSettings;
  onSettingsChange: (settings: BlandSettings) => void;
}

export function SettingsPanel({ settings, onSettingsChange }: SettingsPanelProps) {
  const [localSettings, setLocalSettings] = useState<BlandSettings>(settings)

  const handleSave = () => {
    onSettingsChange(localSettings)
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Bland API Settings</SheetTitle>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="prompt">Call Prompt</Label>
            <Input
              id="prompt"
              value={localSettings.prompt}
              onChange={(e) => setLocalSettings(prev => ({ ...prev, prompt: e.target.value }))}
              placeholder="Enter call prompt. Use {date} for appointment date."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="voice">Voice</Label>
            <Select
              value={localSettings.voice}
              onValueChange={(value) => setLocalSettings(prev => ({ ...prev, voice: value }))}
            >
              <SelectTrigger id="voice">
                <SelectValue placeholder="Select a voice" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <Select
              value={localSettings.language}
              onValueChange={(value) => setLocalSettings(prev => ({ ...prev, language: value }))}
            >
              <SelectTrigger id="language">
                <SelectValue placeholder="Select a language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en-US">English (US)</SelectItem>
                <SelectItem value="es-ES">Spanish (Spain)</SelectItem>
                <SelectItem value="fr-FR">French (France)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleSave}>Save Settings</Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

