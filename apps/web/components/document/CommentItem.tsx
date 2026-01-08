"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface Comment {
  id: string | number; // ❌ this is the problem
  author: { name: string; avatar: string };
  content: string;
  timestamp: string;
  isAuthor: boolean;
}

interface CommentItemProps {
  comment: Comment;
}

export function CommentItem({ comment }: CommentItemProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="pt-6 first:pt-0"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex gap-3">
        <Avatar className="h-10 w-10 flex-shrink-0">
          <AvatarFallback className="bg-slate-200 text-slate-700">
            {comment.author.avatar}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-slate-900">
              {comment.author.name}
            </span>
            <span className="text-sm text-slate-500">{comment.timestamp}</span>
          </div>
          <p className="text-slate-700 leading-relaxed">{comment.content}</p>
        </div>
        {comment.isAuthor && (
          <Button
            variant="ghost"
            size="sm"
            className={`flex-shrink-0 text-slate-400 hover:text-red-600 transition-opacity ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
