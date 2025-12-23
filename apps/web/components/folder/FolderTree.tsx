"use client"

import { useState } from "react"
import { Folder, Lock, LockOpen, ChevronRight, ChevronDown } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { FolderTreeNode } from "@simpleconf/shared"

interface FolderTreeProps {
  folders: FolderTreeNode[]
  currentFolderId?: string
  onFolderSelect?: (folderId: string) => void
}

function FolderTreeItem({
  folder,
  currentFolderId,
  onFolderSelect,
  level = 0,
}: {
  folder: FolderTreeNode
  currentFolderId?: string
  onFolderSelect?: (folderId: string) => void
  level?: number
}) {
  const [isExpanded, setIsExpanded] = useState(true)
  const hasChildren = folder.children && folder.children.length > 0
  const isCurrent = folder.id === currentFolderId

  const handleFolderClick = () => {
    if (folder.isAccessible && onFolderSelect) {
      onFolderSelect(folder.id)
    }
  }

  const handleChevronClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsExpanded(!isExpanded)
  }

  return (
    <div>
      <div
        className={`flex items-center gap-2 py-1.5 px-2 text-sm rounded cursor-pointer transition-colors ${
          isCurrent ? "bg-slate-100 font-medium" : "hover:bg-slate-100"
        } ${!folder.isAccessible ? "opacity-60 italic cursor-not-allowed" : ""}`}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={handleFolderClick}
      >
        {hasChildren ? (
          <button
            onClick={handleChevronClick}
            className="shrink-0 hover:bg-slate-200 rounded p-0.5"
          >
            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
        ) : (
          <div className="w-5" />
        )}
        <Folder className="h-4 w-4 text-slate-400 shrink-0" />
        <span className="flex-1 truncate">{folder.name}</span>
        <Badge variant="secondary" className="h-5 text-xs shrink-0">
          {folder.documentCount}
        </Badge>
        {folder.isAccessible ? (
          <LockOpen className="h-3.5 w-3.5 text-slate-400 shrink-0" />
        ) : (
          <Lock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
        )}
      </div>
      {hasChildren && isExpanded && (
        <div>
          {folder.children!.map((child) => (
            <FolderTreeItem
              key={child.id}
              folder={child}
              currentFolderId={currentFolderId}
              onFolderSelect={onFolderSelect}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function FolderTree({ folders, currentFolderId, onFolderSelect }: FolderTreeProps) {
  return (
    <div className="space-y-1">
      {folders.map((folder) => (
        <FolderTreeItem
          key={folder.id}
          folder={folder}
          currentFolderId={currentFolderId}
          onFolderSelect={onFolderSelect}
        />
      ))}
    </div>
  )
}
