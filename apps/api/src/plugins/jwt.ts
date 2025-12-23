import type { FastifyInstance, FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import fastifyJwt from '@fastify/jwt';
import type { Department } from '@simpleconf/shared';

export interface JwtPayload {
  id: string;
  email: string;
  department: Department;
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: JwtPayload;
    user: JwtPayload;
  }
}

const jwtPlugin: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  await fastify.register(fastifyJwt, {
    secret: fastify.config.JWT_SECRET,
    sign: {
      expiresIn: '24h',
    },
  });

  fastify.log.info('JWT plugin registered');
};

export default fp(jwtPlugin, {
  name: 'jwt',
  dependencies: [],
});
