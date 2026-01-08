// "use client";

// import { X, Eye, MessageCircle } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { Card } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import type { DocumentSummary } from "@simpleconf/shared";

// function formatRelativeTime(date: Date | string): string {
//   const now = new Date();
//   const then = new Date(date);
//   const diffMs = now.getTime() - then.getTime();
//   const diffMins = Math.floor(diffMs / (1000 * 60));
//   const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
//   const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

//   if (diffMins < 1) return "Just now";
//   if (diffMins < 60) return `${diffMins} minutes ago`;
//   if (diffHours < 24) return `${diffHours} hours ago`;
//   if (diffDays === 1) return "Yesterday";
//   if (diffDays < 7) return `${diffDays} days ago`;
//   if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
//   return then.toLocaleDateString();
// }

// interface DocumentPreviewProps {
//   document: DocumentSummary;
//   onClose: () => void;
// }

// export function DocumentPreview({ document, onClose }: DocumentPreviewProps) {
//   const router = useRouter();

//   const handleOpenDocument = () => {
//     router.push(`/document?id=${document.id}`);
//   };

//   return (
//     <Card className="sticky top-6 shadow-lg border-l bg-white animate-in slide-in-from-right duration-300">
//       {/* Header */}
//       <div className="p-4 border-b border-slate-200 flex items-start justify-between">
//         <h2 className="text-lg font-semibold pr-8">{document.title}</h2>
//         <Button
//           variant="ghost"
//           size="icon"
//           onClick={onClose}
//           className="h-8 w-8 shrink-0 focus-visible:ring-2 focus-visible:ring-[#2563EB]"
//         >
//           <X className="h-4 w-4" />
//         </Button>
//       </div>

//       {/* Content Preview */}
//       <div className="p-4 space-y-4">
//         <div>
//           <h3 className="text-sm font-medium text-slate-700 mb-2">Location</h3>
//           <p className="text-sm text-slate-600 leading-relaxed">
//             {document.folderPath}
//           </p>
//         </div>

//         {/* Metadata */}
//         <div className="space-y-2 pt-4 border-t border-slate-100">
//           <div className="flex items-center justify-between text-sm">
//             <span className="text-slate-500">Owner</span>
//             <span className="font-medium text-slate-900">
//               {document.createdByUser.displayName}
//             </span>
//           </div>
//           <div className="flex items-center justify-between text-sm">
//             <span className="text-slate-500">Last updated</span>
//             <span className="text-slate-900">
//               {formatRelativeTime(document.updatedAt)}
//             </span>
//           </div>
//           <div className="flex items-center justify-between text-sm">
//             <span className="text-slate-500">Views</span>
//             <div className="flex items-center gap-1 text-slate-900">
//               <Eye className="h-3.5 w-3.5" />
//               <span>{document.viewCount}</span>
//             </div>
//           </div>
//           <div className="flex items-center justify-between text-sm">
//             <span className="text-slate-500">Comments</span>
//             <div className="flex items-center gap-1 text-slate-900">
//               <MessageCircle className="h-3.5 w-3.5" />
//               <span>{document.commentCount}</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Footer */}
//       <div className="p-4 border-t border-slate-200">
//         <Button
//           onClick={handleOpenDocument}
//           className="w-full bg-[#2563EB] hover:bg-[#1d4ed8] focus-visible:ring-2 focus-visible:ring-[#2563EB]"
//         >
//           Open Document
//         </Button>
//       </div>
//     </Card>
//   );
// }

"use client";

import {
  X,
  Eye,
  MessageCircle,
  Clock,
  User,
  MapPin,
  ExternalLink,
  TrendingUp,
} from "lucide-react";
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
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
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

  const isPopular = document.viewCount > 10;
  const isActive = document.commentCount > 5;

  return (
    <div className="sticky animate-in slide-in-from-right duration-500 fade-in">
      <div className="overflow-hidden border-0 ">
        {/* Header with gradient */}
        <div className="relative bg-linear-to-br from-blue-600 via-indigo-600 to-purple-600 p-6">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                backgroundSize: "24px 24px",
              }}
            />
          </div>

          <div className="relative flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-white leading-tight mb-2 pr-2">
                {document.title}
              </h2>
              <div className="flex items-center gap-2">
                {isPopular && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold bg-amber-400 text-amber-900 rounded-full">
                    <TrendingUp className="h-3 w-3" />
                    Popular
                  </span>
                )}
                {isActive && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold bg-green-400 text-green-900 rounded-full">
                    <MessageCircle className="h-3 w-3" />
                    Active
                  </span>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-9 w-9 shrink-0 text-white hover:bg-white/20 transition-colors"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Location Section */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <div className="p-1.5 bg-blue-100 rounded-lg">
                <MapPin className="h-3.5 w-3.5 text-blue-600" />
              </div>
              Location
            </div>
            <div className="pl-8">
              <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                {document.folderPath}
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="group relative overflow-hidden bg-linear-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100 hover:shadow-md transition-all duration-300">
              <div className="absolute top-0 right-0 w-20 h-20 bg-blue-200 rounded-full blur-2xl opacity-30 group-hover:opacity-50 transition-opacity" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-1">
                  <Eye className="h-4 w-4 text-blue-600" />
                  <span className="text-xs font-medium text-blue-700">
                    Views
                  </span>
                </div>
                <p className="text-2xl font-bold text-blue-900">
                  {document.viewCount}
                </p>
              </div>
            </div>

            <div className="group relative overflow-hidden bg-linear-to-br from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-100 hover:shadow-md transition-all duration-300">
              <div className="absolute top-0 right-0 w-20 h-20 bg-purple-200 rounded-full blur-2xl opacity-30 group-hover:opacity-50 transition-opacity" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-1">
                  <MessageCircle className="h-4 w-4 text-purple-600" />
                  <span className="text-xs font-medium text-purple-700">
                    Comments
                  </span>
                </div>
                <p className="text-2xl font-bold text-purple-900">
                  {document.commentCount}
                </p>
              </div>
            </div>
          </div>

          {/* Metadata List */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors group">
              <div className="p-2 bg-linear-to-br from-slate-100 to-slate-200 rounded-lg group-hover:from-blue-100 group-hover:to-indigo-100 transition-all">
                <User className="h-4 w-4 text-slate-600 group-hover:text-blue-600 transition-colors" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-500 font-medium mb-0.5">
                  Owner
                </p>
                <p className="text-sm font-semibold text-slate-900 truncate">
                  {document.createdByUser.displayName}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors group">
              <div className="p-2 bg-linear-to-br from-slate-100 to-slate-200 rounded-lg group-hover:from-amber-100 group-hover:to-orange-100 transition-all">
                <Clock className="h-4 w-4 text-slate-600 group-hover:text-amber-600 transition-colors" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-500 font-medium mb-0.5">
                  Last updated
                </p>
                <p className="text-sm font-semibold text-slate-900">
                  {formatRelativeTime(document.updatedAt)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer with gradient button */}
        <div className="p-6 pt-0">
          <Button
            onClick={handleOpenDocument}
            className="w-full bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 h-12 text-base font-semibold group relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              Open Document
              <ExternalLink className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-linear-to-r from-blue-400 to-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Button>
        </div>
      </div>
    </div>
  );
}
