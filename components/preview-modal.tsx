"use client"
import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { NameplateGrid } from "./nameplate-grid"

interface PreviewModalProps {
  open: boolean
  onClose: () => void
  names: string[]
  logoUrl: string
  customIcon?: string
  customization: {
    primaryColor: string
    secondaryColor: string
    fontFamily: string
    fontSize: number
  }
}

export function PreviewModal({ open, onClose, names, logoUrl, customIcon, customization }: PreviewModalProps) {
  if (names.length === 0) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>Print Preview</DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="mt-4">
          <p className="text-sm text-muted-foreground mb-4">
            Preview of {names.length} nameplates arranged for optimal printing (2 per row). Each page will contain up to
            4 nameplates.
          </p>

          <NameplateGrid names={names} logoUrl={logoUrl} customIcon={customIcon} customization={customization} />
        </div>
      </DialogContent>
    </Dialog>
  )
}

