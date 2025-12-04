import { FastifyPluginAsync } from 'fastify';
import { supabase } from '../db/supabase';
import { Vehicle, ApiResponse } from '@evcharge/shared';

export const vehiclesRoutes: FastifyPluginAsync = async (server) => {
  // GET /api/vehicles - List all supported vehicles
  server.get('/', async (request, reply) => {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .order('brand', { ascending: true })
        .order('model', { ascending: true });

      if (error) throw error;

      const response: ApiResponse<Vehicle[]> = {
        data: data || [],
        meta: {
          total: data?.length || 0,
        },
      };

      return response;
    } catch (error) {
      server.log.error(error);
      reply.status(500);
      return {
        data: [],
        error: {
          message: 'Failed to fetch vehicles',
          code: 'VEHICLES_FETCH_ERROR',
        },
      };
    }
  });

  // GET /api/vehicles/:id - Get specific vehicle
  server.get<{ Params: { id: string } }>('/:id', async (request, reply) => {
    try {
      const { id } = request.params;

      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      if (!data) {
        reply.status(404);
        return {
          data: null,
          error: {
            message: 'Vehicle not found',
            code: 'VEHICLE_NOT_FOUND',
          },
        };
      }

      return {
        data,
      };
    } catch (error) {
      server.log.error(error);
      reply.status(500);
      return {
        data: null,
        error: {
          message: 'Failed to fetch vehicle',
          code: 'VEHICLE_FETCH_ERROR',
        },
      };
    }
  });

  // GET /api/vehicles/type/:type - Filter by vehicle type
  server.get<{ Params: { type: '2W' | '4W' } }>(
    '/type/:type',
    async (request, reply) => {
      try {
        const { type } = request.params;

        if (!['2W', '4W'].includes(type)) {
          reply.status(400);
          return {
            data: [],
            error: {
              message: 'Invalid vehicle type. Must be 2W or 4W',
              code: 'INVALID_VEHICLE_TYPE',
            },
          };
        }

        const { data, error } = await supabase
          .from('vehicles')
          .select('*')
          .eq('vehicle_type', type)
          .order('brand', { ascending: true });

        if (error) throw error;

        return {
          data: data || [],
          meta: {
            total: data?.length || 0,
            type,
          },
        };
      } catch (error) {
        server.log.error(error);
        reply.status(500);
        return {
          data: [],
          error: {
            message: 'Failed to fetch vehicles',
            code: 'VEHICLES_FETCH_ERROR',
          },
        };
      }
    }
  );
};

