import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import {
  createFolderSchema,
  type CreateFolderInput,
  type FolderTreeResponse,
  type GetFolderDetailResponse,
  type CreateFolderResponse,
  type ApiErrorResponse,
} from "@simpleconf/shared";
import { FolderService } from "../../services/folder.service.js";
import { authenticate } from "../../middleware/authenticate.js";

export async function foldersRoutes(fastify: FastifyInstance): Promise<void> {
  const folderService = new FolderService(fastify);

  // GET /folders - Get folder tree
  fastify.get<{
    Reply: FolderTreeResponse | ApiErrorResponse;
  }>(
    "/folders",
    { preHandler: [authenticate] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const folders = await folderService.getFolderTree(request.user.department);
      return reply.send({ folders });
    }
  );

  // GET /folders/:id - Get folder details
  fastify.get<{
    Params: { id: string };
    Reply: GetFolderDetailResponse | ApiErrorResponse;
  }>(
    "/folders/:id",
    { preHandler: [authenticate] },
    async (
      request: FastifyRequest<{ Params: { id: string } }>,
      reply: FastifyReply
    ) => {
      try {
        const result = await folderService.getFolderDetails(
          request.params.id,
          request.user.department
        );

        if (!result) {
          return reply.status(404).send({
            error: {
              code: "NOT_FOUND",
              message: "Folder not found",
            },
          });
        }

        return reply.send(result);
      } catch (err) {
        const error = err as Error & { code?: string };
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

  // POST /folders - Create folder
  fastify.post<{
    Body: CreateFolderInput;
    Reply: CreateFolderResponse | ApiErrorResponse;
  }>(
    "/folders",
    { preHandler: [authenticate] },
    async (
      request: FastifyRequest<{ Body: CreateFolderInput }>,
      reply: FastifyReply
    ) => {
      const validation = createFolderSchema.safeParse(request.body);

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
        const folder = await folderService.createFolder(
          validation.data,
          request.user.id,
          request.user.department
        );

        return reply.status(201).send({ folder });
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
