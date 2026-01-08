// "use client";

// import { FileText, Eye, ChevronRight } from "lucide-react";
// import { Card } from "@/components/ui/card";
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

// interface DocumentListProps {
//   documents: DocumentSummary[];
//   selectedId: string | null;
//   onSelect: (id: string) => void;
//   onOpen: (id: string) => void;
// }

// export function DocumentList({
//   documents,
//   selectedId,
//   onSelect,
//   onOpen,
// }: DocumentListProps) {
//   if (documents.length === 0) {
//     return (
//       <Card className="p-12 flex flex-col items-center justify-center text-center">
//         <FileText className="h-16 w-16 text-slate-300 mb-4" />
//         <p className="text-lg text-slate-500 mb-2">
//           No documents in this folder
//         </p>
//         <p className="text-sm text-slate-400">
//           Create the first document to get started
//         </p>
//       </Card>
//     );
//   }
//   return (
//     <Card className="divide-y divide-slate-100">
//       {documents.map((doc) => {
//         const isSelected = doc.id === selectedId;

//         return (
//           <div
//             key={doc.id}
//             className={`py-3 px-4 cursor-pointer transition-colors group relative ${
//               isSelected
//                 ? "bg-blue-50 border-l-2 border-[#2563EB]"
//                 : "hover:bg-slate-50 border-l-2 border-transparent"
//             }`}
//             onClick={() => onSelect(doc.id)}
//             onDoubleClick={() => onOpen(doc.id)}
//           >
//             <div className="flex items-start gap-3">
//               <FileText className="h-5 w-5 text-slate-400 mt-0.5 shrink-0" />
//               <div className="flex-1 min-w-0">
//                 <h3 className="font-medium text-slate-900 mb-1">{doc.title}</h3>
//                 <div className="flex items-center gap-4 text-sm text-slate-500">
//                   <span>Updated {formatRelativeTime(doc.updatedAt)}</span>
//                   <span>•</span>
//                   <span>{doc.createdByUser.displayName}</span>
//                   <span>•</span>
//                   <div className="flex items-center gap-1">
//                     <Eye className="h-3.5 w-3.5" />
//                     <span>{doc.viewCount}</span>
//                   </div>
//                 </div>
//               </div>
//               <ChevronRight
//                 className={`h-5 w-5 text-slate-400 shrink-0 transition-opacity ${
//                   isSelected
//                     ? "opacity-100"
//                     : "opacity-0 group-hover:opacity-100"
//                 }`}
//               />
//             </div>
//           </div>
//         );
//       })}
//     </Card>
//   );
// }

"use client";

import {
  FileText,
  Eye,
  ChevronRight,
  Clock,
  User,
  Sparkles,
} from "lucide-react";
import { Card } from "@/components/ui/card";
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

interface DocumentListProps {
  documents: DocumentSummary[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onOpen: (id: string) => void;
}

export function DocumentList({
  documents,
  selectedId,
  onSelect,
  onOpen,
}: DocumentListProps) {
  if (documents.length === 0) {
    return (
      <div className="p-16 flex flex-col items-center justify-center text-center">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-linear-to-br from-blue-400 to-indigo-400 rounded-full blur-2xl opacity-20 animate-pulse" />
          <div className="relative p-6 bg-linear-to-br from-slate-100 to-slate-200 rounded-3xl">
            <FileText className="h-16 w-16 text-slate-400" />
          </div>
        </div>
        <h3 className="text-xl font-semibold text-slate-900 mb-2">
          No documents yet
        </h3>
        <p className="text-slate-500 max-w-sm">
          Create your first document to start collaborating and organizing your
          work
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-100/50">
      {documents.map((doc, index) => {
        const isSelected = doc.id === selectedId;
        const isRecent =
          new Date().getTime() - new Date(doc.updatedAt).getTime() < 3600000; // Less than 1 hour

        return (
          <div
            key={doc.id}
            className={`group relative overflow-hidden transition-all duration-300 animate-fadeIn ${
              isSelected
                ? "bg-linear-to-r from-blue-50 via-indigo-50 to-blue-50"
                : "hover:bg-slate-50/80"
            }`}
            style={{ animationDelay: `${index * 0.03}s` }}
            onClick={() => onSelect(doc.id)}
            onDoubleClick={() => onOpen(doc.id)}
          >
            {/* Selection indicator */}
            <div
              className={`absolute left-0 top-0 bottom-0 w-1 transition-all duration-300 ${
                isSelected
                  ? "bg-linear-to-b from-blue-600 to-indigo-600"
                  : "bg-transparent group-hover:bg-slate-300"
              }`}
            />

            {/* Hover gradient effect */}
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-blue-50/0 to-transparent group-hover:via-blue-50/50 transition-all duration-500 opacity-0 group-hover:opacity-100" />

            <div className="relative py-4 px-5 cursor-pointer">
              <div className="flex items-start gap-4">
                {/* Document icon with gradient */}
                <div
                  className={`relative shrink-0 transition-all duration-300 ${
                    isSelected ? "scale-110" : "group-hover:scale-105"
                  }`}
                >
                  <div
                    className={`p-2.5 rounded-xl transition-all duration-300 ${
                      isSelected
                        ? "bg-linear-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30"
                        : "bg-linear-to-br from-slate-200 to-slate-300 group-hover:from-blue-400 group-hover:to-indigo-500 group-hover:shadow-md"
                    }`}
                  >
                    <FileText
                      className={`h-5 w-5 transition-colors duration-300 ${
                        isSelected
                          ? "text-white"
                          : "text-slate-600 group-hover:text-white"
                      }`}
                    />
                  </div>
                  {isRecent && (
                    <div className="absolute -top-1 -right-1">
                      <Sparkles className="h-3.5 w-3.5 text-amber-500 animate-pulse" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3
                      className={`font-semibold text-base leading-snug transition-colors duration-300 ${
                        isSelected
                          ? "text-slate-900"
                          : "text-slate-800 group-hover:text-blue-700"
                      }`}
                    >
                      {doc.title}
                    </h3>
                    {isRecent && (
                      <span className="shrink-0 px-2 py-0.5 text-xs font-medium bg-linear-to-r from-amber-400 to-orange-500 text-white rounded-full shadow-sm">
                        New
                      </span>
                    )}
                  </div>

                  {/* Metadata */}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      <span className="font-medium">
                        {formatRelativeTime(doc.updatedAt)}
                      </span>
                    </div>

                    <div className="h-1 w-1 rounded-full bg-slate-300" />

                    <div className="flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5 text-slate-400" />
                      <span>{doc.createdByUser.displayName}</span>
                    </div>

                    <div className="h-1 w-1 rounded-full bg-slate-300" />

                    <div className="flex items-center gap-1.5">
                      <Eye className="h-3.5 w-3.5 text-slate-400" />
                      <span>{doc.viewCount} views</span>
                    </div>
                  </div>
                </div>

                {/* Chevron indicator */}
                <ChevronRight
                  className={`h-5 w-5 shrink-0 transition-all duration-300 ${
                    isSelected
                      ? "opacity-100 text-blue-600 translate-x-0"
                      : "opacity-0 text-slate-400 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
                  }`}
                />
              </div>
            </div>

            {/* Bottom shine effect */}
            {isSelected && (
              <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-blue-400 to-transparent" />
            )}
          </div>
        );
      })}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}
