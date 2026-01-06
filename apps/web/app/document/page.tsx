"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import type { DocumentWithMeta } from "@simpleconf/shared"
import { DocumentViewPage } from "@/components/document/DocumentViewPage"
import { ProtectedRoute } from "@/lib/components/protected-route"
import { documentService } from "@/lib/api/services"
import DocumentLoading from "./loading"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function DocumentPage() {
  const searchParams = useSearchParams()
  const documentId = searchParams.get("id")

  const [document, setDocument] = useState<DocumentWithMeta | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchDocument() {
      if (!documentId) {
        setError("No document ID provided")
        setLoading(false)
        return
      }

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
      <ProtectedRoute>
        <DocumentLoading />
      </ProtectedRoute>
    )
  }

  if (error || !document) {
    return (
      <ProtectedRoute>
        <div className="flex flex-col items-center justify-center py-16 space-y-4">
          <AlertCircle className="h-12 w-12 text-red-500" />
          <h2 className="text-xl font-semibold text-slate-900">Document Not Found</h2>
          <p className="text-slate-600">{error || "The document you're looking for doesn't exist."}</p>
          <Button asChild>
            <Link href="/folder">Back to Folders</Link>
          </Button>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <DocumentViewPage document={document} />
    </ProtectedRoute>
  )
}
