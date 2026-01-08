// "use client";

// import { useState } from "react";
// import { Trash2 } from "lucide-react";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";

// interface Comment {
//   id: string | number; // ❌ this is the problem
//   author: { name: string; avatar: string };
//   content: string;
//   timestamp: string;
//   isAuthor: boolean;
// }

// interface CommentItemProps {
//   comment: Comment;
// }

// export function CommentItem({ comment }: CommentItemProps) {
//   const [isHovered, setIsHovered] = useState(false);

//   return (
//     <div
//       className="pt-6 first:pt-0"
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//     >
//       <div className="flex gap-3">
//         <Avatar className="h-10 w-10 shrink-0">
//           <AvatarFallback className="bg-slate-200 text-slate-700">
//             {comment.author.avatar}
//           </AvatarFallback>
//         </Avatar>
//         <div className="flex-1 space-y-1">
//           <div className="flex items-center gap-2">
//             <span className="font-medium text-slate-900">
//               {comment.author.name}
//             </span>
//             <span className="text-sm text-slate-500">{comment.timestamp}</span>
//           </div>
//           <p className="text-slate-700 leading-relaxed">{comment.content}</p>
//         </div>
//         {comment.isAuthor && (
//           <Button
//             variant="ghost"
//             size="sm"
//             className={`shrink-0 text-slate-400 hover:text-red-600 transition-opacity ${
//               isHovered ? "opacity-100" : "opacity-0"
//             }`}
//           >
//             <Trash2 className="h-4 w-4" />
//           </Button>
//         )}
//       </div>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { commentsService } from "@/lib/api/services";

// ✅ fix id to string (matches deleteComment signature)
interface Comment {
  id: string;
  author: { name: string; avatar: string };
  content: string;
  timestamp: string;
  isAuthor: boolean;
}

interface CommentItemProps {
  comment: Comment;
  onDeleted?: (commentId: string) => void;
}

export function CommentItem({ comment, onDeleted }: CommentItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);

      const p = commentsService.deleteComment(String(comment.id));

      toast.promise(p, {
        loading: "Deleting comment...",
        success: "Comment deleted",
        error: "Failed to delete comment",
      });

      const res = await p;

      if (res.success) {
        setOpen(false);
        onDeleted?.(String(comment.id));
      }
    } catch (e) {
      console.error(e);
      toast.error("Something went wrong while deleting.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      className="pt-2 first:pt-0 "
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* make it flex on mobile too */}
      <div className="flex gap-3">
        <Avatar className="h-10 w-10 shrink-0">
          <AvatarFallback className="bg-slate-200 text-slate-700">
            {comment.author.avatar}
          </AvatarFallback>
        </Avatar>

        {/* right side */}
        <div className="min-w-0 flex-1">
          {/* header row: name + delete */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="font-medium text-slate-900 truncate">
                {comment.author.name}
              </span>
              <div className="text-xs text-slate-500 ">{comment.timestamp}</div>
            </div>

            {comment.isAuthor && (
              <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="shrink-0 text-slate-400 hover:text-red-600"
                    aria-label="Delete comment"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete this comment?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  <AlertDialogFooter>
                    <AlertDialogCancel disabled={isDeleting}>
                      Cancel
                    </AlertDialogCancel>

                    <AlertDialogAction asChild>
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={isDeleting}
                      >
                        {isDeleting ? "Deleting..." : "Delete"}
                      </Button>
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
      </div>
      <p className="text-slate-700 text-xs leading-relaxed mt-2 wrap-break-words p-1">
        {comment.content}
      </p>
    </div>
  );
}
