import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import {
  createCommentSchema,
  updateCommentSchema,
  type CreateCommentInput,
  type UpdateCommentInput,
  type ApiErrorResponse,
} from "@simpleconf/shared";
import { authenticate } from "../../middleware/authenticate.js";
import { CommentsService } from "../../services/comments.service.js";

export async function commentsRoutes(fastify: FastifyInstance): Promise<void> {
  const commentsService = new CommentsService(fastify);

  // GET /documents/:id/comments - List comments for a document
  fastify.get<{
    Params: { id: string };
    Querystring: { page?: string; limit?: string };
    Reply: { comments: unknown[] } | ApiErrorResponse;
  }>(
    "/documents/:id/comments",
    { preHandler: [authenticate] },
    async (
      request: FastifyRequest<{
        Params: { id: string };
        Querystring: { page?: string; limit?: string };
      }>,
      reply: FastifyReply
    ) => {
      try {
        const page = request.query.page ? Number(request.query.page) : 1;
        const limit = request.query.limit ? Number(request.query.limit) : 20;

        const comments = await commentsService.listDocumentComments(
          request.params.id,
          request.user.department,
          { page, limit }
        );

        return reply.send({ comments });
      } catch (err) {
        const error = err as Error & { code?: string };
        if (error.code === "NOT_FOUND") {
          return reply
            .status(404)
            .send({ error: { code: "NOT_FOUND", message: error.message } });
        }
        if (error.code === "FORBIDDEN") {
          return reply
            .status(403)
            .send({ error: { code: "FORBIDDEN", message: error.message } });
        }
        throw err;
      }
    }
  );

  // POST /documents/:id/comments - Create comment
  fastify.post<{
    Params: { id: string };
    Body: CreateCommentInput;
    Reply: { comment: unknown } | ApiErrorResponse;
  }>(
    "/documents/:id/comments",
    { preHandler: [authenticate] },
    async (
      request: FastifyRequest<{
        Params: { id: string };
        Body: CreateCommentInput;
      }>,
      reply: FastifyReply
    ) => {
      const validation = createCommentSchema.safeParse(request.body);

      if (!validation.success) {
        const details: Record<string, string> = {};
        for (const issue of validation.error.issues) {
          details[issue.path.join(".")] = issue.message;
        }
        return reply.status(400).send({
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid input",
            details,
          },
        });
      }

      try {
        const comment = await commentsService.createComment(
          request.params.id,
          validation.data,
          request.user.id,
          request.user.department
        );

        return reply.status(201).send({ comment });
      } catch (err) {
        const error = err as Error & { code?: string };
        if (error.code === "NOT_FOUND") {
          return reply
            .status(404)
            .send({ error: { code: "NOT_FOUND", message: error.message } });
        }
        if (error.code === "FORBIDDEN") {
          return reply
            .status(403)
            .send({ error: { code: "FORBIDDEN", message: error.message } });
        }
        throw err;
      }
    }
  );

  // PATCH /comments/:id - Update comment content
  fastify.patch<{
    Params: { id: string };
    Body: UpdateCommentInput;
    Reply: { comment: unknown } | ApiErrorResponse;
  }>(
    "/comments/:id",
    { preHandler: [authenticate] },
    async (
      request: FastifyRequest<{
        Params: { id: string };
        Body: UpdateCommentInput;
      }>,
      reply: FastifyReply
    ) => {
      const validation = updateCommentSchema.safeParse(request.body);

      if (!validation.success) {
        const details: Record<string, string> = {};
        for (const issue of validation.error.issues) {
          details[issue.path.join(".")] = issue.message;
        }
        return reply.status(400).send({
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid input",
            details,
          },
        });
      }

      try {
        const comment = await commentsService.updateComment(
          request.params.id,
          validation.data,
          request.user.id
        );

        return reply.send({ comment });
      } catch (err) {
        const error = err as Error & { code?: string };
        if (error.code === "NOT_FOUND") {
          return reply
            .status(404)
            .send({ error: { code: "NOT_FOUND", message: error.message } });
        }
        if (error.code === "FORBIDDEN") {
          return reply
            .status(403)
            .send({ error: { code: "FORBIDDEN", message: error.message } });
        }
        throw err;
      }
    }
  );

  // DELETE /comments/:id - Soft delete comment
  fastify.delete<{
    Params: { id: string };
    Reply: { success: boolean } | ApiErrorResponse;
  }>(
    "/comments/:id",
    { preHandler: [authenticate] },
    async (
      request: FastifyRequest<{ Params: { id: string } }>,
      reply: FastifyReply
    ) => {
      try {
        await commentsService.deleteComment(request.params.id, request.user.id);
        return reply.send({ success: true });
      } catch (err) {
        const error = err as Error & { code?: string };
        if (error.code === "NOT_FOUND") {
          return reply
            .status(404)
            .send({ error: { code: "NOT_FOUND", message: error.message } });
        }
        if (error.code === "FORBIDDEN") {
          return reply
            .status(403)
            .send({ error: { code: "FORBIDDEN", message: error.message } });
        }
        throw err;
      }
    }
  );
}
