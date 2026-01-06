"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Pencil, ChevronRight, Home } from "lucide-react"
import type { DocumentWithMeta } from "@simpleconf/shared"
import { Button } from "@/components/ui/button"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { MetadataBar } from "./MetadataBar"
import { MarkdownRenderer } from "./MarkdownRenderer"
import { CommentsSection } from "./CommentsSection"
import { useAuth } from "@/lib/contexts/auth-context"

interface DocumentViewPageProps {
  document: DocumentWithMeta
}

const initialComments = [
  {
    id: 1,
    author: { name: "Alex Chen", avatar: "AC" },
    content: "Great documentation! This helped me set up the checkout flow.",
    timestamp: "2 days ago",
    isAuthor: false,
  },
  {
    id: 2,
    author: { name: "Sarah Wilson", avatar: "SW" },
    content: "Can you add a section about handling webhooks?",
    timestamp: "1 day ago",
    isAuthor: false,
  },
  {
    id: 3,
    author: { name: "John Doe", avatar: "JD" },
    content: "Good suggestion Sarah, I'll add that this week.",
    timestamp: "5 hours ago",
    isAuthor: true,
  },
]

export function DocumentViewPage({ document }: DocumentViewPageProps) {
  const router = useRouter()
  const { user } = useAuth()
  const [comments, setComments] = useState(initialComments)

  const isOwner = user?.id === document.createdBy
  const folderPathParts = document.folderPath
    ? document.folderPath.split(" / ")
    : []

  const handleEdit = () => {
    router.push(`/editor?id=${document.id}`)
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb navigation */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              href="/folder"
              className="hover:text-[#2563EB] focus-visible:ring-2 focus-visible:ring-[#2563EB] rounded flex items-center gap-1"
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </BreadcrumbLink>
          </BreadcrumbItem>
          {folderPathParts.map((part, index) => (
            <div key={index} className="flex items-center">
              <BreadcrumbSeparator>
                <ChevronRight className="h-4 w-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage>{part}</BreadcrumbPage>
              </BreadcrumbItem>
            </div>
          ))}
          <div className="flex items-center">
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage className="font-semibold">{document.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </div>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Document header */}
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-3xl font-bold text-slate-900">{document.title}</h1>
        {isOwner && (
          <Button variant="outline" size="sm" onClick={handleEdit}>
            <Pencil className="h-4 w-4 mr-2" />
            Edit
          </Button>
        )}
      </div>

      {/* Metadata bar */}
      <MetadataBar
        createdBy={document.createdByUser}
        modifiedBy={document.modifiedByUser}
        updatedAt={document.updatedAt}
        views={document.viewCount}
        commentCount={document.commentCount}
      />

      {/* Markdown content */}
      <div className="mt-8">
        <MarkdownRenderer content={document.content} />
      </div>

      {/* Comments section */}
      <div className="mt-12 pt-8 border-t border-slate-200">
        <CommentsSection comments={comments} />
      </div>
    </div>
  )
}
