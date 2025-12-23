"use client"

import { Suspense } from "react"
import { DocumentEditorPage } from "@/components/editor/DocumentEditorPage"
import { ProtectedRoute } from "@/lib/components/protected-route"

export default function EditorPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading editor...</div>}>
        <DocumentEditorPage />
      </Suspense>
    </ProtectedRoute>
  )
}
