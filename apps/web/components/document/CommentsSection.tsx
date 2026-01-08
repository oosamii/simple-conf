// // "use client";

// // import { useState } from "react";
// // import { MessageSquare } from "lucide-react";
// // import { Button } from "@/components/ui/button";
// // import { Textarea } from "@/components/ui/textarea";
// // import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// // import { CommentItem } from "./CommentItem";

// // interface Comment {
// //   id: number;
// //   author: { name: string; avatar: string };
// //   content: string;
// //   timestamp: string;
// //   isAuthor: boolean;
// // }

// // interface CommentsSectionProps {
// //   comments: Comment[];
// // }

// // export function CommentsSection({ comments }: CommentsSectionProps) {
// //   const [newComment, setNewComment] = useState("");

// //   return (
// //     <div className="space-y-6 ">
// //       {/* Section header */}
// //       <div className="flex items-center gap-2">
// //         <MessageSquare className="h-5 w-5 text-slate-700" />
// //         <h2 className="text-xl font-semibold text-slate-900">
// //           Comments ({comments.length})
// //         </h2>
// //       </div>

// //       {/* Add comment input */}
// //       <div className="flex gap-3">
// //         <Avatar className="h-10 w-10 flex-shrink-0">
// //           <AvatarFallback className="bg-blue-600 text-white">U</AvatarFallback>
// //         </Avatar>
// //         <div className="flex-1 space-y-3">
// //           <Textarea
// //             placeholder="Add a comment..."
// //             value={newComment}
// //             onChange={(e) => setNewComment(e.target.value)}
// //             className="min-h-[80px] resize-none focus:min-h-[120px] transition-all"
// //           />
// //           <div className="flex justify-end">
// //             <Button disabled={!newComment.trim()}>Add Comment</Button>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Comments list */}
// //       {comments.length > 0 ? (
// //         <div className="space-y-6 divide-y divide-slate-100">
// //           {comments.map((comment) => (
// //             <CommentItem key={comment.id} comment={comment} />
// //           ))}
// //         </div>
// //       ) : (
// //         <div className="text-center py-12 text-slate-500">
// //           <MessageSquare className="h-12 w-12 mx-auto mb-3 text-slate-300" />
// //           <p>No comments yet. Be the first to share your thoughts!</p>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// "use client";

// import { useState } from "react";
// import { MessageSquare } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import { CommentItem } from "./CommentItem";
// import { commentsService } from "@/lib/api/services";

// interface Comment {
//   id: string;
//   author: { name: string; avatar: string };
//   content: string;
//   timestamp: string;
//   isAuthor: boolean;
// }

// interface CommentsSectionProps {
//   documentId: string; // ✅ needed for API
//   comments: Comment[];
//   setComments: React.Dispatch<React.SetStateAction<Comment[]>>; // ✅ update list after add
// }

// function getInitials(name: string) {
//   return name
//     .split(" ")
//     .filter(Boolean)
//     .map((n) => n[0])
//     .join("")
//     .slice(0, 2)
//     .toUpperCase();
// }

// export function CommentsSection({
//   documentId,
//   comments,
//   setComments,
// }: CommentsSectionProps) {
//   const [newComment, setNewComment] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleAddComment = async () => {
//     const content = newComment.trim();
//     if (!content || !documentId || isSubmitting) return;

//     setIsSubmitting(true);

//     try {
//       const res = await commentsService.createComment(documentId, { content });

//       // ✅ backend should return comment with createdByUser
//       const c: any = res.comment;

//       const uiComment: Comment = {
//         id: c.id,
//         author: {
//           name: c.createdByUser?.displayName ?? "You",
//           avatar: getInitials(c.createdByUser?.displayName ?? "You"),
//         },
//         content: c.content,
//         timestamp: new Date(c.createdAt).toLocaleString(),
//         isAuthor: true,
//       };

//       setComments((prev) => [uiComment, ...prev]);
//       setNewComment("");
//     } catch (err) {
//       console.error("Failed to add comment", err);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="space-y-6 ">
//       {/* Section header */}
//       <div className="flex items-center gap-2">
//         <MessageSquare className="h-5 w-5 text-slate-700" />
//         <h2 className="text-xl font-semibold text-slate-900">
//           Comments ({comments.length})
//         </h2>
//       </div>

//       {/* Add comment input */}
//       <div className="flex gap-3">
//         <Avatar className="h-10 w-10 flex-shrink-0">
//           <AvatarFallback className="bg-blue-600 text-white">U</AvatarFallback>
//         </Avatar>
//         <div className="flex-1 space-y-3">
//           <Textarea
//             placeholder="Add a comment..."
//             value={newComment}
//             onChange={(e) => setNewComment(e.target.value)}
//             className="min-h-[80px] resize-none focus:min-h-[120px] transition-all"
//           />
//           <div className="flex justify-end">
//             <Button
//               onClick={handleAddComment}
//               disabled={!newComment.trim() || isSubmitting}
//             >
//               {isSubmitting ? "Adding..." : "Add Comment"}
//             </Button>
//           </div>
//         </div>
//       </div>

//       {/* Comments list */}
//       {comments.length > 0 ? (
//         <div className="space-y-6 divide-y divide-slate-100">
//           {comments.map((comment) => (
//             <CommentItem key={comment.id} comment={comment} />
//           ))}
//         </div>
//       ) : (
//         <div className="text-center py-12 text-slate-500">
//           <MessageSquare className="h-12 w-12 mx-auto mb-3 text-slate-300" />
//           <p>No comments yet. Be the first to share your thoughts!</p>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { MessageSquare, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CommentItem } from "./CommentItem";
import { commentsService } from "@/lib/api/services";

interface Comment {
  id: string;
  author: { name: string; avatar: string };
  content: string;
  timestamp: string;
  isAuthor: boolean;
}

interface CommentsSectionProps {
  documentId: string;
  comments: Comment[];
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function CommentsSection({
  documentId,
  comments,
  setComments,
}: CommentsSectionProps) {
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleAddComment = async () => {
    const content = newComment.trim();
    if (!content || !documentId || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const res = await commentsService.createComment(documentId, { content });

      const c: any = res.comment;

      const uiComment: Comment = {
        id: c.id,
        author: {
          name: c.createdByUser?.displayName ?? "You",
          avatar: getInitials(c.createdByUser?.displayName ?? "You"),
        },
        content: c.content,
        timestamp: new Date(c.createdAt).toLocaleString(),
        isAuthor: true,
      };

      setComments((prev) => [uiComment, ...prev]);
      setNewComment("");
      setIsFocused(false);
    } catch (err) {
      console.error("Failed to add comment", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && newComment.trim()) {
      e.preventDefault();
      handleAddComment();
    }
  };

  return (
    <div className="space-y-8">
      {/* Add comment card */}
      <div
        className={`relative overflow-hidden rounded-2xl border-2 transition-all duration-300 ${
          isFocused
            ? "border-blue-300 shadow-lg shadow-blue-100 bg-white"
            : "border-slate-200 hover:border-slate-300 bg-slate-50/50"
        }`}
      >
        {/* Decorative gradient on focus */}
        {isFocused && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-blue-500 via-indigo-600 to-purple-600" />
        )}

        <div className="p-5">
          <div className="flex gap-4">
            <Avatar className="h-11 w-11 shrink-0 ring-2 ring-slate-100 transition-all hover:ring-blue-200">
              <AvatarFallback className="bg-linear-to-br from-blue-600 to-indigo-600 text-white font-semibold">
                U
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-3">
              <Textarea
                placeholder="Share your thoughts..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => !newComment && setIsFocused(false)}
                onKeyDown={handleKeyDown}
                className={`min-h-22.5 resize-none border-0 bg-transparent focus-visible:ring-0 text-slate-900 placeholder:text-slate-400 transition-all ${
                  isFocused ? "min-h-30" : ""
                }`}
              />

              {(isFocused || newComment) && (
                <div className="flex items-center justify-between animate-fadeIn">
                  <p className="text-xs text-slate-500">
                    <kbd className="px-1.5 py-0.5 text-xs font-semibold bg-slate-100 border border-slate-300 rounded">
                      Cmd/Ctrl + Enter
                    </kbd>{" "}
                    to post
                  </p>
                  <Button
                    onClick={handleAddComment}
                    disabled={!newComment.trim() || isSubmitting}
                    className="bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="h-4 w-4 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Posting...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2 group-hover:translate-x-0.5 transition-transform" />
                        Post Comment
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Comments list */}
      {comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((comment, index) => (
            <div
              key={comment.id}
              className="animate-fadeIn"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <CommentItem
                comment={comment}
                onDeleted={(deletedId) => {
                  setComments((prev) => prev.filter((c) => c.id !== deletedId));
                }}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-linear-to-br from-blue-400 to-indigo-400 rounded-full blur-2xl opacity-20 animate-pulse" />
            <div className="relative p-6 bg-linear-to-br from-slate-100 to-slate-200 rounded-3xl">
              <MessageSquare className="h-16 w-16 text-slate-400" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            No comments yet
          </h3>
          <p className="text-slate-500 max-w-sm mx-auto">
            Start the conversation! Share your thoughts and feedback about this
            document.
          </p>
        </div>
      )}

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
