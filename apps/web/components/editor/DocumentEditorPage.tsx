"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import type { DocumentWithMeta } from "@simpleconf/shared"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { EditorToolbar } from "./EditorToolbar"
import { MarkdownEditor } from "./MarkdownEditor"
import { EditorPreview } from "./EditorPreview"
import { UnsavedChangesDialog } from "./UnsavedChangesDialog"
import { documentService } from "@/lib/api/services"

interface DocumentEditorPageProps {
  mode: "edit" | "create"
  document?: DocumentWithMeta
  folderId?: string
}

export function DocumentEditorPage({ mode, document: initialDocument, folderId }: DocumentEditorPageProps) {
  const router = useRouter()
  const [title, setTitle] = useState(initialDocument?.title ?? "")
  const [content, setContent] = useState(initialDocument?.content ?? "")
  const [originalTitle] = useState(initialDocument?.title ?? "")
  const [originalContent] = useState(initialDocument?.content ?? "")
  const [leftWidth, setLeftWidth] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const hasUnsavedChanges = title !== originalTitle || content !== originalContent
  const canSave = mode === "create"
    ? title.trim().length > 0
    : title.trim().length > 0 && hasUnsavedChanges

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault()
        if (canSave) handleSave()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [canSave, title, content])

  // Warn on navigation with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault()
        e.returnValue = ""
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [hasUnsavedChanges])

  const handleSave = async () => {
    if (!canSave || isSaving) return

    setIsSaving(true)
    setSaveError(null)

    try {
      if (mode === "edit" && initialDocument) {
        await documentService.updateDocument(initialDocument.id, { title, content })
        router.push(`/document?id=${initialDocument.id}`)
      } else if (mode === "create" && folderId) {
        const response = await documentService.createDocument({
          title,
          content,
          folderId,
        })
        router.push(`/document?id=${response.document.id}`)
      }
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Failed to save document")
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      setShowUnsavedDialog(true)
    } else {
      navigateBack()
    }
  }

  const navigateBack = () => {
    if (mode === "edit" && initialDocument) {
      router.push(`/document?id=${initialDocument.id}`)
    } else if (folderId) {
      router.push(`/folder?id=${folderId}`)
    } else {
      router.push("/folder")
    }
  }

  const handleDiscard = () => {
    setShowUnsavedDialog(false)
    navigateBack()
  }

  const handleMouseDown = () => {
    setIsDragging(true)
  }

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return

      const containerWidth = window.innerWidth
      const newLeftWidth = (e.clientX / containerWidth) * 100

      // Constrain between 20% and 80%
      if (newLeftWidth >= 20 && newLeftWidth <= 80) {
        setLeftWidth(newLeftWidth)
      }
    },
    [isDragging],
  )

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleDoubleClick = () => {
    setLeftWidth(50)
  }

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [isDragging, handleMouseMove])

  const insertMarkdown = (before: string, after = "") => {
    const textarea = document.querySelector("textarea")
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = content.substring(start, end)
    const newText = content.substring(0, start) + before + selectedText + after + content.substring(end)

    setContent(newText)

    // Restore cursor position
    setTimeout(() => {
      textarea.focus()
      const newCursorPos = start + before.length + selectedText.length
      textarea.setSelectionRange(newCursorPos, newCursorPos)
    }, 0)
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="border-b bg-white px-4 py-3 flex items-center justify-between">
        <Button variant="ghost" onClick={handleCancel} disabled={isSaving}>
          Cancel
        </Button>

        <div className="flex items-center gap-2">
          {hasUnsavedChanges && <div className="w-2 h-2 bg-yellow-500 rounded-full" title="Unsaved changes" />}
          <span className="text-sm font-medium text-slate-700">
            {mode === "edit" ? `Edit: ${originalTitle}` : "New Document"}
          </span>
        </div>

        <Button onClick={handleSave} disabled={!canSave || isSaving}>
          {isSaving ? "Saving..." : "Save"}
        </Button>
      </div>

      {/* Error message */}
      {saveError && (
        <div className="bg-red-50 border-b border-red-200 px-4 py-2 text-sm text-red-700">
          {saveError}
        </div>
      )}

      {/* Title Input */}
      <div className="border-b bg-white px-6 py-4">
        <Input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Document title..."
          className="text-xl font-semibold border-0 border-b border-transparent focus-visible:border-blue-600 focus-visible:ring-0 rounded-none px-0"
        />
      </div>

      {/* Split Pane */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor Pane */}
        <div className="flex flex-col bg-white" style={{ width: `${leftWidth}%` }}>
          <EditorToolbar onInsertMarkdown={insertMarkdown} />
          <MarkdownEditor content={content} onChange={setContent} />
        </div>

        {/* Divider */}
        <div
          className="w-1 bg-slate-200 hover:bg-slate-300 cursor-col-resize transition-colors select-none"
          onMouseDown={handleMouseDown}
          onDoubleClick={handleDoubleClick}
        />

        {/* Preview Pane */}
        <div className="flex-1 flex flex-col bg-slate-50">
          <div className="border-b bg-white px-6 py-3">
            <span className="text-sm font-medium text-slate-700">Preview</span>
          </div>
          <EditorPreview content={content} />
        </div>
      </div>

      <UnsavedChangesDialog
        open={showUnsavedDialog}
        onCancel={() => setShowUnsavedDialog(false)}
        onDiscard={handleDiscard}
      />
    </div>
  )
}
