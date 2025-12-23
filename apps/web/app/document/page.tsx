"use client"

import { DocumentViewPage } from "@/components/document/DocumentViewPage"
import { ProtectedRoute } from "@/lib/components/protected-route"

export default function DocumentPage() {
  return (
    <ProtectedRoute>
      <DocumentViewPage />
    </ProtectedRoute>
  )
}
