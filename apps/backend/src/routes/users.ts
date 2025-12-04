import { FastifyPluginAsync } from 'fastify';
import { supabase } from '../db/supabase';
import { UserVehicle, ApiResponse } from '@evcharge/shared';
import { z } from 'zod';

// Middleware to get user from Authorization header
async function getUserFromAuth(authHeader: string | undefined) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Missing or invalid authorization header');
  }

  const token = authHeader.substring(7);
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    throw new Error('Invalid or expired token');
  }

  return data.user;
}

const addVehicleSchema = z.object({
  vehicle_id: z.string().uuid(),
  nickname: z.string().optional(),
  is_default: z.boolean().optional().default(false),
});

export const userRoutes: FastifyPluginAsync = async (server) => {
  // GET /api/user/vehicles - Get user's vehicles
  server.get('/vehicles', async (request, reply) => {
    try {
      const user = await getUserFromAuth(request.headers.authorization);

      const { data, error } = await supabase
        .from('user_vehicles')
        .select(
          `
          *,
          vehicle:vehicles(*)
        `
        )
        .eq('user_id', user.id)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;

      const response: ApiResponse<UserVehicle[]> = {
        data: data || [],
        meta: {
          total: data?.length || 0,
        },
      };

      return response;
    } catch (error) {
      if (error instanceof Error && error.message.includes('authorization')) {
        reply.status(401);
        return {
          data: [],
          error: {
            message: 'Unauthorized',
            code: 'UNAUTHORIZED',
          },
        };
      }

      server.log.error(error);
      reply.status(500);
      return {
        data: [],
        error: {
          message: 'Failed to fetch user vehicles',
          code: 'USER_VEHICLES_FETCH_ERROR',
        },
      };
    }
  });

  // POST /api/user/vehicles - Add vehicle to user's garage
  server.post('/vehicles', async (request, reply) => {
    try {
      const user = await getUserFromAuth(request.headers.authorization);
      const body = addVehicleSchema.parse(request.body);

      // If this is set as default, unset other defaults
      if (body.is_default) {
        await supabase
          .from('user_vehicles')
          .update({ is_default: false })
          .eq('user_id', user.id);
      }

      const { data, error } = await supabase
        .from('user_vehicles')
        .insert({
          user_id: user.id,
          vehicle_id: body.vehicle_id,
          nickname: body.nickname,
          is_default: body.is_default,
        })
        .select(
          `
          *,
          vehicle:vehicles(*)
        `
        )
        .single();

      if (error) {
        if (error.code === '23505') {
          // Unique constraint violation
          reply.status(409);
          return {
            data: null,
            error: {
              message: 'Vehicle already added',
              code: 'VEHICLE_ALREADY_ADDED',
            },
          };
        }
        throw error;
      }

      reply.status(201);
      return {
        data,
      };
    } catch (error) {
      if (error instanceof Error && error.message.includes('authorization')) {
        reply.status(401);
        return {
          data: null,
          error: {
            message: 'Unauthorized',
            code: 'UNAUTHORIZED',
          },
        };
      }

      if (error instanceof z.ZodError) {
        reply.status(400);
        return {
          data: null,
          error: {
            message: 'Invalid request body',
            code: 'INVALID_REQUEST',
          },
        };
      }

      server.log.error(error);
      reply.status(500);
      return {
        data: null,
        error: {
          message: 'Failed to add vehicle',
          code: 'ADD_VEHICLE_ERROR',
        },
      };
    }
  });

  // DELETE /api/user/vehicles/:id - Remove vehicle from user's garage
  server.delete<{ Params: { id: string } }>('/vehicles/:id', async (request, reply) => {
    try {
      const user = await getUserFromAuth(request.headers.authorization);
      const { id } = request.params;

      const { error } = await supabase
        .from('user_vehicles')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      reply.status(204);
      return;
    } catch (error) {
      if (error instanceof Error && error.message.includes('authorization')) {
        reply.status(401);
        return {
          error: {
            message: 'Unauthorized',
            code: 'UNAUTHORIZED',
          },
        };
      }

      server.log.error(error);
      reply.status(500);
      return {
        error: {
          message: 'Failed to remove vehicle',
          code: 'REMOVE_VEHICLE_ERROR',
        },
      };
    }
  });

  // PATCH /api/user/vehicles/:id - Update user vehicle (e.g., set as default)
  server.patch<{ Params: { id: string } }>('/vehicles/:id', async (request, reply) => {
    try {
      const user = await getUserFromAuth(request.headers.authorization);
      const { id } = request.params;
      const body = z
        .object({
          nickname: z.string().optional(),
          is_default: z.boolean().optional(),
        })
        .parse(request.body);

      // If setting as default, unset others
      if (body.is_default) {
        await supabase
          .from('user_vehicles')
          .update({ is_default: false })
          .eq('user_id', user.id);
      }

      const { data, error } = await supabase
        .from('user_vehicles')
        .update(body)
        .eq('id', id)
        .eq('user_id', user.id)
        .select(
          `
          *,
          vehicle:vehicles(*)
        `
        )
        .single();

      if (error) throw error;

      return {
        data,
      };
    } catch (error) {
      if (error instanceof Error && error.message.includes('authorization')) {
        reply.status(401);
        return {
          data: null,
          error: {
            message: 'Unauthorized',
            code: 'UNAUTHORIZED',
          },
        };
      }

      if (error instanceof z.ZodError) {
        reply.status(400);
        return {
          data: null,
          error: {
            message: 'Invalid request body',
            code: 'INVALID_REQUEST',
          },
        };
      }

      server.log.error(error);
      reply.status(500);
      return {
        data: null,
        error: {
          message: 'Failed to update vehicle',
          code: 'UPDATE_VEHICLE_ERROR',
        },
      };
    }
  });
};

