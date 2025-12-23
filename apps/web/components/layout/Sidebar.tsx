"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ChevronLeft, ChevronRight, Loader2, AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FolderTree } from "@/components/folder/FolderTree"
import { folderService } from "@/lib/api/services/folders"
import type { FolderTreeNode } from "@simpleconf/shared"

interface SidebarProps {
  isCollapsed: boolean
  onToggle: () => void
}

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentFolderId = searchParams.get("id") || undefined

  const [folders, setFolders] = useState<FolderTreeNode[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchFolders = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await folderService.getFolderTree()
      setFolders(response.folders)
    } catch (err) {
      setError("Failed to load folders")
      console.error("Failed to fetch folder tree:", err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchFolders()
  }, [fetchFolders])

  const handleFolderSelect = (folderId: string) => {
    router.push(`/folder?id=${folderId}`)
  }

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
        </div>
      )
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center py-8 gap-3 text-center">
          <AlertCircle className="h-6 w-6 text-red-500" />
          <p className="text-sm text-slate-500">{error}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchFolders}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </Button>
        </div>
      )
    }

    if (folders.length === 0) {
      return (
        <div className="text-center py-8 text-sm text-slate-500">
          No folders found
        </div>
      )
    }

    return (
      <FolderTree
        folders={folders}
        currentFolderId={currentFolderId}
        onFolderSelect={handleFolderSelect}
      />
    )
  }

  return (
    <aside
      className={`border-r bg-slate-50 transition-all duration-200 shrink-0 ${isCollapsed ? "w-16" : "w-[280px]"}`}
    >
      <div className="flex flex-col h-full">
        {/* Toggle Button */}
        <div className="h-12 flex items-center justify-end px-2 border-b border-slate-200">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="h-8 w-8 focus-visible:ring-2 focus-visible:ring-[#2563EB]"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        <div className="flex-1 p-4 overflow-y-auto">
          {!isCollapsed && renderContent()}
        </div>
      </div>
    </aside>
  )
}
