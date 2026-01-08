"use client";

import { X, Eye, MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { DocumentSummary } from "@simpleconf/shared";

function formatRelativeTime(date: Date | string): string {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} minutes ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return then.toLocaleDateString();
}

interface DocumentPreviewProps {
  document: DocumentSummary;
  onClose: () => void;
}

export function DocumentPreview({ document, onClose }: DocumentPreviewProps) {
  const router = useRouter();

  const handleOpenDocument = () => {
    router.push(`/document?id=${document.id}`);
  };

  return (
    <Card className="sticky top-6 shadow-lg border-l bg-white animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 flex items-start justify-between">
        <h2 className="text-lg font-semibold pr-8">{document.title}</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-8 w-8 shrink-0 focus-visible:ring-2 focus-visible:ring-[#2563EB]"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Content Preview */}
      <div className="p-4 space-y-4">
        <div>
          <h3 className="text-sm font-medium text-slate-700 mb-2">Location</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            {document.folderPath}
          </p>
        </div>

        {/* Metadata */}
        <div className="space-y-2 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">Owner</span>
            <span className="font-medium text-slate-900">
              {document.createdBy.displayName}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">Last updated</span>
            <span className="text-slate-900">
              {formatRelativeTime(document.updatedAt)}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">Views</span>
            <div className="flex items-center gap-1 text-slate-900">
              <Eye className="h-3.5 w-3.5" />
              <span>{document.viewCount}</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">Comments</span>
            <div className="flex items-center gap-1 text-slate-900">
              <MessageCircle className="h-3.5 w-3.5" />
              <span>{document.commentCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-200">
        <Button
          onClick={handleOpenDocument}
          className="w-full bg-[#2563EB] hover:bg-[#1d4ed8] focus-visible:ring-2 focus-visible:ring-[#2563EB]"
        >
          Open Document
        </Button>
      </div>
    </Card>
  );
}
