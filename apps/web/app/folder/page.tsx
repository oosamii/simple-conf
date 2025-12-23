"use client"

import { useState, useEffect, useCallback, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Plus, Loader2, AlertCircle, RefreshCw, Folder } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { FolderBreadcrumbs } from "@/components/folder/Breadcrumbs"
import { DocumentList } from "@/components/folder/DocumentList"
import { DocumentPreview } from "@/components/folder/DocumentPreview"
import { ProtectedRoute } from "@/lib/components/protected-route"
import { folderService } from "@/lib/api/services/folders"
import type { GetFolderDetailResponse, DocumentSummary, FolderWithMeta } from "@simpleconf/shared"

function FolderContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const folderId = searchParams.get("id")

  const [folderData, setFolderData] = useState<GetFolderDetailResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null)

  const fetchFolderData = useCallback(async () => {
    if (!folderId) {
      setFolderData(null)
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)
    try {
      const response = await folderService.getFolderDetails(folderId)
      setFolderData(response)
    } catch (err) {
      setError("Failed to load folder")
      console.error("Failed to fetch folder details:", err)
    } finally {
      setIsLoading(false)
    }
  }, [folderId])

  useEffect(() => {
    fetchFolderData()
    setSelectedDocId(null)
  }, [fetchFolderData])

  const handleNewDocument = () => {
    if (folderId) {
      router.push(`/editor?folderId=${folderId}`)
    }
  }

  const handleDocumentOpen = (docId: string) => {
    router.push(`/document?id=${docId}`)
  }

  const handleSubfolderClick = (subfolderId: string) => {
    router.push(`/folder?id=${subfolderId}`)
  }

  const selectedDoc = folderData?.documents.find((doc) => doc.id === selectedDocId)

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <p className="text-lg text-slate-600">{error}</p>
        <Button
          variant="outline"
          onClick={fetchFolderData}
          className="gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Retry
        </Button>
      </div>
    )
  }

  // No folder selected - show root view
  if (!folderId || !folderData) {
    return (
      <div className="space-y-6">
        <FolderBreadcrumbs breadcrumbs={[]} />
        <h1 className="text-2xl font-semibold">All Folders</h1>
        <p className="text-slate-500">Select a folder from the sidebar to browse documents.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <FolderBreadcrumbs breadcrumbs={folderData.breadcrumbs} />

      {/* Folder Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold">{folderData.folder.name}</h1>
          <span className="text-sm text-slate-500">
            ({folderData.documents.length} documents)
          </span>
        </div>
        <Button
          onClick={handleNewDocument}
          className="bg-[#2563EB] hover:bg-[#1d4ed8] focus-visible:ring-2 focus-visible:ring-[#2563EB]"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Document
        </Button>
      </div>

      {/* Subfolders */}
      {folderData.subfolders.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-medium text-slate-700">Subfolders</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {folderData.subfolders.map((subfolder: FolderWithMeta) => (
              <Card
                key={subfolder.id}
                className={`p-4 cursor-pointer hover:bg-slate-50 transition-colors ${
                  !subfolder.isAccessible ? "opacity-60" : ""
                }`}
                onClick={() => subfolder.isAccessible && handleSubfolderClick(subfolder.id)}
              >
                <div className="flex items-center gap-3">
                  <Folder className="h-5 w-5 text-slate-400" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900 truncate">{subfolder.name}</p>
                    <p className="text-xs text-slate-500">{subfolder.documentCount} documents</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Documents */}
      <div className="space-y-3">
        <h2 className="text-sm font-medium text-slate-700">Documents</h2>
        <div className="flex gap-6">
          {/* Document List */}
          <div className={`${selectedDoc ? "w-[60%]" : "w-full"} transition-all duration-300`}>
            <DocumentList
              documents={folderData.documents}
              selectedId={selectedDocId}
              onSelect={setSelectedDocId}
              onOpen={handleDocumentOpen}
            />
          </div>

          {/* Preview Panel */}
          {selectedDoc && (
            <div className="w-[40%]">
              <DocumentPreview
                document={selectedDoc}
                onClose={() => setSelectedDocId(null)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function FolderBrowsePage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
        </div>
      }>
        <FolderContent />
      </Suspense>
    </ProtectedRoute>
  )
}
