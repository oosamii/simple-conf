import { Calendar, Eye, MessageSquare } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import type { PublicUser } from "@simpleconf/shared"

function getInitials(displayName: string): string {
  return displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

function formatRelativeTime(date: Date | string): string {
  const now = new Date()
  const then = new Date(date)
  const diffMs = now.getTime() - then.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMins < 1) return "Just now"
  if (diffMins < 60) return `${diffMins} minutes ago`
  if (diffHours < 24) return `${diffHours} hours ago`
  if (diffDays === 1) return "Yesterday"
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  return then.toLocaleDateString()
}

interface MetadataBarProps {
  createdBy: PublicUser
  modifiedBy: PublicUser | null
  updatedAt: Date | string
  views: number
  commentCount: number
}

export function MetadataBar({ createdBy, modifiedBy, updatedAt, views, commentCount }: MetadataBarProps) {
  const showModifiedBy = modifiedBy && modifiedBy.id !== createdBy.id
  const formattedTime = formatRelativeTime(updatedAt)

  return (
    <div className="flex items-center gap-4 text-sm text-slate-500 flex-wrap">
      {/* Created by */}
      <div className="flex items-center gap-2">
        <Avatar className="h-6 w-6">
          <AvatarFallback className="text-xs">{getInitials(createdBy.displayName)}</AvatarFallback>
        </Avatar>
        <span>
          Created by <span className="font-medium text-slate-700">{createdBy.displayName}</span>
        </span>
      </div>

      <span className="text-slate-300">|</span>

      {/* Modified by (if different) */}
      {showModifiedBy && (
        <>
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-xs">{getInitials(modifiedBy.displayName)}</AvatarFallback>
            </Avatar>
            <span>
              Modified by <span className="font-medium text-slate-700">{modifiedBy.displayName}</span>
            </span>
          </div>
          <span className="text-slate-300">|</span>
        </>
      )}

      {/* Last updated */}
      <div className="flex items-center gap-1.5">
        <Calendar className="h-4 w-4" />
        <span>Updated {formattedTime}</span>
      </div>

      <span className="text-slate-300">|</span>

      {/* View count */}
      <div className="flex items-center gap-1.5">
        <Eye className="h-4 w-4" />
        <span>{views} views</span>
      </div>

      <span className="text-slate-300">|</span>

      {/* Comment count */}
      <div className="flex items-center gap-1.5">
        <MessageSquare className="h-4 w-4" />
        <span>
          {commentCount} {commentCount === 1 ? "comment" : "comments"}
        </span>
      </div>
    </div>
  )
}
