import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import {
  createDocumentSchema,
  updateDocumentSchema,
  type CreateDocumentInput,
  type UpdateDocumentInput,
  type DocumentResponse,
  type CreateDocumentResponse,
  type UpdateDocumentResponse,
  type ApiErrorResponse,
} from "@simpleconf/shared";
import { DocumentService } from "../../services/document.service.js";
import { authenticate } from "../../middleware/authenticate.js";

export async function documentsRoutes(fastify: FastifyInstance): Promise<void> {
  const documentService = new DocumentService(fastify);

  // GET /documents/:id - Get document with metadata
  fastify.get<{
    Params: { id: string };
    Reply: DocumentResponse | ApiErrorResponse;
  }>(
    "/documents/:id",
    { preHandler: [authenticate] },
    async (
      request: FastifyRequest<{ Params: { id: string } }>,
      reply: FastifyReply
    ) => {
      try {
        const document = await documentService.getDocument(
          request.params.id,
          request.user.department
        );

        return reply.send({ document });
      } catch (err) {
        const error = err as Error & { code?: string };
        if (error.code === "NOT_FOUND") {
          return reply.status(404).send({
            error: {
              code: "NOT_FOUND",
              message: error.message,
            },
          });
        }
        if (error.code === "FORBIDDEN") {
          return reply.status(403).send({
            error: {
              code: "FORBIDDEN",
              message: error.message,
            },
          });
        }
        throw err;
      }
    }
  );

  // POST /documents - Create document
  fastify.post<{
    Body: CreateDocumentInput;
    Reply: CreateDocumentResponse | ApiErrorResponse;
  }>(
    "/documents",
    { preHandler: [authenticate] },
    async (
      request: FastifyRequest<{ Body: CreateDocumentInput }>,
      reply: FastifyReply
    ) => {
      const validation = createDocumentSchema.safeParse(request.body);

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
        const document = await documentService.createDocument(
          validation.data,
          request.user.id,
          request.user.department
        );

        return reply.status(201).send({ document });
      } catch (err) {
        const error = err as Error & { code?: string };
        if (error.code === "NOT_FOUND") {
          return reply.status(404).send({
            error: {
              code: "NOT_FOUND",
              message: error.message,
            },
          });
        }
        if (error.code === "FORBIDDEN") {
          return reply.status(403).send({
            error: {
              code: "FORBIDDEN",
              message: error.message,
            },
          });
        }
        throw err;
      }
    }
  );

  // PUT /documents/:id - Update document
  fastify.put<{
    Params: { id: string };
    Body: UpdateDocumentInput;
    Reply: UpdateDocumentResponse | ApiErrorResponse;
  }>(
    "/documents/:id",
    { preHandler: [authenticate] },
    async (
      request: FastifyRequest<{ Params: { id: string }; Body: UpdateDocumentInput }>,
      reply: FastifyReply
    ) => {
      const validation = updateDocumentSchema.safeParse(request.body);

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
        const document = await documentService.updateDocument(
          request.params.id,
          validation.data,
          request.user.id
        );

        return reply.send({ document });
      } catch (err) {
        const error = err as Error & { code?: string };
        if (error.code === "NOT_FOUND") {
          return reply.status(404).send({
            error: {
              code: "NOT_FOUND",
              message: error.message,
            },
          });
        }
        if (error.code === "FORBIDDEN") {
          return reply.status(403).send({
            error: {
              code: "FORBIDDEN",
              message: error.message,
            },
          });
        }
        throw err;
      }
    }
  );

  // DELETE /documents/:id - Delete document
  fastify.delete<{
    Params: { id: string };
    Reply: { success: boolean } | ApiErrorResponse;
  }>(
    "/documents/:id",
    { preHandler: [authenticate] },
    async (
      request: FastifyRequest<{ Params: { id: string } }>,
      reply: FastifyReply
    ) => {
      try {
        await documentService.deleteDocument(request.params.id, request.user.id);
        return reply.send({ success: true });
      } catch (err) {
        const error = err as Error & { code?: string };
        if (error.code === "NOT_FOUND") {
          return reply.status(404).send({
            error: {
              code: "NOT_FOUND",
              message: error.message,
            },
          });
        }
        if (error.code === "FORBIDDEN") {
          return reply.status(403).send({
            error: {
              code: "FORBIDDEN",
              message: error.message,
            },
          });
        }
        throw err;
      }
    }
  );
}
