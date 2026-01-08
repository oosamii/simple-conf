// "use client";

// import { useState } from "react";
// import { MessageSquare } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import { CommentItem } from "./CommentItem";

// interface Comment {
//   id: number;
//   author: { name: string; avatar: string };
//   content: string;
//   timestamp: string;
//   isAuthor: boolean;
// }

// interface CommentsSectionProps {
//   comments: Comment[];
// }

// export function CommentsSection({ comments }: CommentsSectionProps) {
//   const [newComment, setNewComment] = useState("");

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
//             <Button disabled={!newComment.trim()}>Add Comment</Button>
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
import { MessageSquare } from "lucide-react";
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
  documentId: string; // ✅ needed for API
  comments: Comment[];
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>; // ✅ update list after add
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

  const handleAddComment = async () => {
    const content = newComment.trim();
    if (!content || !documentId || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const res = await commentsService.createComment(documentId, { content });

      // ✅ backend should return comment with createdByUser
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
    } catch (err) {
      console.error("Failed to add comment", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 ">
      {/* Section header */}
      <div className="flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-slate-700" />
        <h2 className="text-xl font-semibold text-slate-900">
          Comments ({comments.length})
        </h2>
      </div>

      {/* Add comment input */}
      <div className="flex gap-3">
        <Avatar className="h-10 w-10 flex-shrink-0">
          <AvatarFallback className="bg-blue-600 text-white">U</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-3">
          <Textarea
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[80px] resize-none focus:min-h-[120px] transition-all"
          />
          <div className="flex justify-end">
            <Button
              onClick={handleAddComment}
              disabled={!newComment.trim() || isSubmitting}
            >
              {isSubmitting ? "Adding..." : "Add Comment"}
            </Button>
          </div>
        </div>
      </div>

      {/* Comments list */}
      {comments.length > 0 ? (
        <div className="space-y-6 divide-y divide-slate-100">
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-slate-500">
          <MessageSquare className="h-12 w-12 mx-auto mb-3 text-slate-300" />
          <p>No comments yet. Be the first to share your thoughts!</p>
        </div>
      )}
    </div>
  );
}
