import { z } from "zod";

export const createCommentSchema = z.object({
  content: z
    .string()
    .min(1, "Content is required")
    .refine((v) => v.trim().length > 0, "Content cannot be empty"),
  parentCommentId: z.string().uuid().nullable().optional(),
});

export const updateCommentSchema = z.object({
  content: z
    .string()
    .min(1, "Content is required")
    .refine((v) => v.trim().length > 0, "Content cannot be empty"),
});
