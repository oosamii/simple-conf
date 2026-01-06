"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import type { DocumentWithMeta } from "@simpleconf/shared"
import { DocumentEditorPage } from "@/components/editor/DocumentEditorPage"
import { ProtectedRoute } from "@/lib/components/protected-route"
import { documentService } from "@/lib/api/services"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

function EditorContent() {
  const searchParams = useSearchParams()
  const documentId = searchParams.get("id")
  const folderId = searchParams.get("folderId")

  const [document, setDocument] = useState<DocumentWithMeta | null>(null)
  const [loading, setLoading] = useState(!!documentId)
  const [error, setError] = useState<string | null>(null)

  const mode = documentId ? "edit" : "create"

  useEffect(() => {
    async function fetchDocument() {
      if (!documentId) return

      try {
        setLoading(true)
        setError(null)
        const response = await documentService.getDocument(documentId)
        setDocument(response.document)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load document")
      } finally {
        setLoading(false)
      }
    }

    fetchDocument()
  }, [documentId])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading editor...
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <h2 className="text-xl font-semibold text-slate-900">Failed to Load Document</h2>
        <p className="text-slate-600">{error}</p>
        <Button asChild>
          <Link href="/folder">Back to Folders</Link>
        </Button>
      </div>
    )
  }

  if (mode === "edit" && !document) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <h2 className="text-xl font-semibold text-slate-900">Document Not Found</h2>
        <p className="text-slate-600">The document you're trying to edit doesn't exist.</p>
        <Button asChild>
          <Link href="/folder">Back to Folders</Link>
        </Button>
      </div>
    )
  }

  if (mode === "create" && !folderId) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <AlertCircle className="h-12 w-12 text-yellow-500" />
        <h2 className="text-xl font-semibold text-slate-900">Missing Folder</h2>
        <p className="text-slate-600">Please select a folder to create a new document.</p>
        <Button asChild>
          <Link href="/folder">Go to Folders</Link>
        </Button>
      </div>
    )
  }

  return (
    <DocumentEditorPage
      mode={mode}
      document={document ?? undefined}
      folderId={folderId ?? undefined}
    />
  )
}

export default function EditorPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading editor...</div>}>
        <EditorContent />
      </Suspense>
    </ProtectedRoute>
  )
}
