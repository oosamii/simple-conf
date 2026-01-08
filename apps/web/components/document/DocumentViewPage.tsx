// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { Pencil, ChevronRight, Home } from "lucide-react";
// import type { DocumentWithMeta } from "@simpleconf/shared";
// import { Button } from "@/components/ui/button";
// import {
//   Breadcrumb,
//   BreadcrumbItem,
//   BreadcrumbLink,
//   BreadcrumbList,
//   BreadcrumbPage,
//   BreadcrumbSeparator,
// } from "@/components/ui/breadcrumb";
// import { MetadataBar } from "./MetadataBar";
// import { MarkdownRenderer } from "./MarkdownRenderer";
// import { CommentsSection } from "./CommentsSection";
// import { useAuth } from "@/lib/contexts/auth-context";
// import { commentsService, documentService } from "@/lib/api/services";
// import { FolderBreadcrumbs } from "../folder/Breadcrumbs";

// interface DocumentViewPageProps {
//   document: DocumentWithMeta;
// }

// interface UIComment {
//   id: string;
//   author: { name: string; avatar: string };
//   content: string;
//   timestamp: string;
//   isAuthor: boolean;
// }

// function mapCommentToUI(comment: any, currentUserId?: string) {
//   console.log(comment);
//   return {
//     id: comment.id,
//     author: {
//       name: comment.createdByUser.displayName,
//       avatar: comment.createdByUser.displayName
//         .split(" ")
//         .map((n: string) => n[0])
//         .join("")
//         .slice(0, 2)
//         .toUpperCase(),
//     },
//     content: comment.content,
//     timestamp: new Date(comment.createdAt).toLocaleString(),
//     isAuthor: comment.createdBy === currentUserId,
//   };
// }

// const initialComments = [
//   {
//     id: 1,
//     author: { name: "Alex Chen", avatar: "AC" },
//     content: "Great documentation! This helped me set up the checkout flow.",
//     timestamp: "2 days ago",
//     isAuthor: false,
//   },
//   {
//     id: 2,
//     author: { name: "Sarah Wilson", avatar: "SW" },
//     content: "Can you add a section about handling webhooks?",
//     timestamp: "1 day ago",
//     isAuthor: false,
//   },
//   {
//     id: 3,
//     author: { name: "John Doe", avatar: "JD" },
//     content: "Good suggestion Sarah, I'll add that this week.",
//     timestamp: "5 hours ago",
//     isAuthor: true,
//   },
// ];

// export function DocumentViewPage({ document }: DocumentViewPageProps) {
//   const router = useRouter();
//   const { user } = useAuth();
//   const [comments, setComments] = useState<UIComment[]>([]);

//   useEffect(() => {
//     if (!document?.id) return;

//     const fetchComments = async () => {
//       try {
//         const res = await commentsService.listComments(document.id, 1, 50);
//         const uiComments = res.comments.map((c: any) =>
//           mapCommentToUI(c, user?.id)
//         );

//         setComments(uiComments);
//       } catch (err) {
//         console.error("Failed to load comments", err);
//       }
//     };

//     fetchComments();
//   }, [document?.id, user?.id]);

//   const isOwner = user?.id === document.createdBy;
//   const folderPathParts = document.folderPath
//     ? document.folderPath.split(" / ")
//     : [];
//   const folderpath = [
//     {
//       name: document.folderPath,
//       id: document.folderId,
//     },
//     { id: document.id, name: document.title },
//   ];

//   const handleEdit = () => {
//     router.push(`/editor?id=${document.id}`);
//   };

//   return (
//     <div className="space-y-6 p-2 sm:p-6">
//       <FolderBreadcrumbs breadcrumbs={folderpath} />

//       <div className="flex items-start justify-between gap-4">
//         <h1 className="text-3xl font-bold text-slate-900">{document.title}</h1>
//         {isOwner && (
//           <Button variant="outline" size="sm" onClick={handleEdit}>
//             <Pencil className="h-4 w-4 mr-2" />
//             Edit
//           </Button>
//         )}
//       </div>

//       {/* Metadata bar */}
//       <MetadataBar
//         createdBy={document.createdByUser}
//         modifiedBy={document.modifiedByUser}
//         updatedAt={document.updatedAt}
//         views={document.viewCount}
//         commentCount={document.commentCount}
//       />

//       {/* Markdown content */}
//       <div className="mt-8">
//         <MarkdownRenderer content={document.content} />
//       </div>

//       {/* Comments section */}
//       <div className="mt-12 pt-8 border-t border-slate-200">
//         {/* <CommentsSection comments={comments} /> */}
//         <CommentsSection
//           documentId={document.id}
//           comments={comments}
//           setComments={setComments}
//         />
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Pencil,
  ChevronRight,
  Home,
  Sparkles,
  Eye,
  MessageCircle,
} from "lucide-react";
import type { DocumentWithMeta } from "@simpleconf/shared";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { MetadataBar } from "./MetadataBar";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { CommentsSection } from "./CommentsSection";
import { useAuth } from "@/lib/contexts/auth-context";
import { commentsService, documentService } from "@/lib/api/services";
import { FolderBreadcrumbs } from "../folder/Breadcrumbs";

interface DocumentViewPageProps {
  document: DocumentWithMeta;
}

interface UIComment {
  id: string;
  author: { name: string; avatar: string };
  content: string;
  timestamp: string;
  isAuthor: boolean;
}

function mapCommentToUI(comment: any, currentUserId?: string) {
  return {
    id: comment.id,
    author: {
      name: comment.createdByUser.displayName,
      avatar: comment.createdByUser.displayName
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase(),
    },
    content: comment.content,
    timestamp: new Date(comment.createdAt).toLocaleString(),
    isAuthor: comment.createdBy === currentUserId,
  };
}

export function DocumentViewPage({ document }: DocumentViewPageProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [comments, setComments] = useState<UIComment[]>([]);

  useEffect(() => {
    if (!document?.id) return;

    const fetchComments = async () => {
      try {
        const res = await commentsService.listComments(document.id, 1, 50);
        const uiComments = res.comments.map((c: any) =>
          mapCommentToUI(c, user?.id)
        );

        setComments(uiComments);
      } catch (err) {
        console.error("Failed to load comments", err);
      }
    };

    fetchComments();
  }, [document?.id, user?.id]);

  const isOwner = user?.id === document.createdBy;
  const folderPathParts = document.folderPath
    ? document.folderPath.split(" / ")
    : [];
  const folderpath = [
    {
      name: document.folderPath,
      id: document.folderId,
    },
    { id: document.id, name: document.title },
  ];

  const handleEdit = () => {
    router.push(`/editor?id=${document.id}`);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-indigo-50/30">
      <div className="max-w-5xl mx-auto space-y-8 p-4 sm:p-8 py-8">
        {/* Breadcrumbs with animation */}
        <div className="animate-fadeIn">
          <FolderBreadcrumbs breadcrumbs={folderpath} />
        </div>

        {/* Document Header Card */}
        <Card
          className="border-0 shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden animate-fadeIn"
          style={{ animationDelay: "0.1s" }}
        >
          {/* Decorative gradient bar */}
          <div className="h-2 bg-linear-to-r from-blue-500 via-indigo-600 to-purple-600" />

          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-4 sm:gap-6">
              <div className="flex-1 min-w-0 space-y-4">
                {/* Title with gradient underline */}
                <div className="space-y-3">
                  <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
                    {document.title}
                  </h1>
                  <div className="h-1 w-20 bg-linear-to-r from-blue-600 to-indigo-600 rounded-full" />
                </div>

                {/* Enhanced Metadata Bar */}
                <div className="pt-2">
                  <MetadataBar
                    createdBy={document.createdByUser}
                    modifiedBy={document.modifiedByUser}
                    updatedAt={document.updatedAt}
                    views={document.viewCount}
                    commentCount={document.commentCount}
                  />
                </div>
              </div>

              {/* Edit Button */}
              {isOwner && (
                <Button
                  variant="outline"
                  onClick={handleEdit}
                  className="shrink-0 border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 shadow-sm hover:shadow-md group"
                >
                  <Pencil className="h-4 w-4 mr-2 group-hover:text-blue-600 transition-colors" />
                  <span className="font-semibold">Edit</span>
                </Button>
              )}
            </div>

            {/* Stats bar */}
            <div className="mt-6 pt-6 border-t border-slate-100 flex items-center gap-6">
              <div className="flex items-center gap-2 text-slate-600">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Eye className="h-4 w-4 text-blue-600" />
                </div>
                <span className="text-sm font-medium">
                  {document.viewCount} views
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <MessageCircle className="h-4 w-4 text-purple-600" />
                </div>
                <span className="text-sm font-medium">
                  {document.commentCount} comments
                </span>
              </div>
            </div>
          </div>
        </Card>
        {/* Content Card */}
        <Card
          className="border-0 shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden animate-fadeIn"
          style={{ animationDelay: "0.2s" }}
        >
          {/* Content header with gradient */}
          <div className="bg-linear-to-r from-slate-50 to-blue-50 px-6 sm:px-10 py-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-linear-to-br from-blue-500 to-indigo-600 rounded-xl shadow-md">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                Document Content
              </h2>
            </div>
          </div>

          <div className="p-6 sm:p-10">
            <MarkdownRenderer content={document.content} />
          </div>
        </Card>

        {/* Comments Section Card */}
        <Card
          className="border-0 shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden animate-fadeIn"
          style={{ animationDelay: "0.3s" }}
        >
          {/* Section header with gradient */}
          <div className="bg-linear-to-r from-slate-50 to-blue-50 px-6 sm:px-10 py-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-linear-to-br from-blue-500 to-indigo-600 rounded-xl shadow-md">
                <MessageCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Comments</h2>
                <p className="text-sm text-slate-600 mt-0.5">
                  {comments.length}{" "}
                  {comments.length === 1 ? "comment" : "comments"}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-10">
            <CommentsSection
              documentId={document.id}
              comments={comments}
              setComments={setComments}
            />
          </div>
        </Card>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}
