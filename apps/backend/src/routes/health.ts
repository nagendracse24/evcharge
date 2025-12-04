import { FastifyPluginAsync } from 'fastify';
import { supabase } from '../db/supabase';

export const healthRoutes: FastifyPluginAsync = async (server) => {
  // Health check endpoint
  server.get('/', async (request, reply) => {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  });

  // Database health check
  server.get('/db', async (request, reply) => {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select('id')
        .limit(1);

      if (error) throw error;

      return {
        status: 'ok',
        database: 'connected',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      reply.status(500);
      return {
        status: 'error',
        database: 'disconnected',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  });
};

