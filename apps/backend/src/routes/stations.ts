import { FastifyPluginAsync } from 'fastify';
import { supabase } from '../db/supabase';
import {
  StationWithDetails,
  ApiResponse,
  calculateDistance,
  Vehicle,
  StationConnector,
} from '@evcharge/shared';
import { z } from 'zod';

// Query schema for nearby stations
const nearbyQuerySchema = z.object({
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  radius_km: z.coerce.number().min(1).max(100).optional().default(10),
  limit: z.coerce.number().min(1).max(100).optional().default(50),
  vehicle_id: z.string().uuid().optional(),
  connector_type: z.string().optional(),
  is_dc_fast: z.coerce.boolean().optional(),
  network: z.string().optional(),
  sort_by: z.enum(['distance', 'price', 'rating', 'best']).optional().default('distance'),
});

type NearbyQuery = z.infer<typeof nearbyQuerySchema>;

export const stationsRoutes: FastifyPluginAsync = async (server) => {
  // GET /api/stations/nearby - Get nearby stations
  server.get('/nearby', async (request, reply) => {
    try {
      const query = nearbyQuerySchema.parse(request.query);

      // Use the get_nearby_stations function
      const { data: stationsData, error: stationsError } = await supabase.rpc(
        'get_nearby_stations',
        {
          user_lat: query.lat,
          user_lng: query.lng,
          radius_km: query.radius_km,
          result_limit: query.limit,
        }
      );

      if (stationsError) throw stationsError;

      if (!stationsData || stationsData.length === 0) {
        return {
          data: [],
          meta: {
            total: 0,
            query_location: { lat: query.lat, lng: query.lng },
            radius_km: query.radius_km,
          },
        };
      }

      // Get station IDs
      const stationIds = stationsData.map((s: any) => s.id);

      // Fetch connectors, pricing, amenities, reviews for all stations
      const [connectorsRes, pricingRes, amenitiesRes, reviewsRes] = await Promise.all([
        supabase.from('station_connectors').select('*').in('station_id', stationIds),
        supabase.from('station_pricing').select('*').in('station_id', stationIds),
        supabase.from('station_amenities').select('*').in('station_id', stationIds),
        supabase
          .from('station_reviews')
          .select('station_id, rating')
          .in('station_id', stationIds),
      ]);

      // Get user's vehicle if vehicle_id provided
      let userVehicle: Vehicle | null = null;
      if (query.vehicle_id) {
        const { data: vehicleData } = await supabase
          .from('vehicles')
          .select('*')
          .eq('id', query.vehicle_id)
          .single();
        userVehicle = vehicleData;
      }

      // Build enriched station objects
      const enrichedStations: StationWithDetails[] = stationsData.map((station: any) => {
        const connectors = connectorsRes.data?.filter((c) => c.station_id === station.id) || [];
        const pricing = pricingRes.data?.filter((p) => p.station_id === station.id) || [];
        const amenities = amenitiesRes.data?.find((a) => a.station_id === station.id);
        const stationReviews = reviewsRes.data?.filter((r) => r.station_id === station.id) || [];

        // Calculate average rating
        const avg_rating =
          stationReviews.length > 0
            ? stationReviews.reduce((sum, r) => sum + r.rating, 0) / stationReviews.length
            : undefined;

        // Calculate compatibility if vehicle provided
        let compatibility_status: 'compatible' | 'partial' | 'incompatible' | undefined;
        let estimated_cost: number | undefined;
        let estimated_charge_time_minutes: number | undefined;

        if (userVehicle && connectors.length > 0) {
          const hasFullCompatibility = connectors.some(
            (c: StationConnector) =>
              c.connector_type === userVehicle.dc_connector_type ||
              c.connector_type === userVehicle.ac_connector_type
          );

          const hasPartialCompatibility = connectors.some(
            (c: StationConnector) => c.connector_type === userVehicle.ac_connector_type
          );

          compatibility_status = hasFullCompatibility
            ? 'compatible'
            : hasPartialCompatibility
            ? 'partial'
            : 'incompatible';

          // Estimate cost (20% to 80% charge as default)
          if (pricing.length > 0 && pricing[0].pricing_model === 'per_kwh') {
            const energyNeeded = userVehicle.battery_capacity_kwh * 0.6; // 60% charge
            estimated_cost = energyNeeded * pricing[0].price_value;
          }

          // Estimate time
          const bestConnector = connectors
            .filter(
              (c: StationConnector) =>
                c.connector_type === userVehicle.dc_connector_type ||
                c.connector_type === userVehicle.ac_connector_type
            )
            .sort((a: StationConnector, b: StationConnector) => b.power_kw - a.power_kw)[0];

          if (bestConnector) {
            const energyNeeded = userVehicle.battery_capacity_kwh * 0.6;
            estimated_charge_time_minutes = (energyNeeded / (bestConnector.power_kw * 0.9)) * 60;
          }
        }

        return {
          ...station,
          connectors,
          pricing,
          amenities,
          avg_rating,
          total_reviews: stationReviews.length,
          compatibility_status,
          estimated_cost,
          estimated_charge_time_minutes,
        };
      });

      // Apply filters
      let filteredStations = enrichedStations;

      if (query.connector_type) {
        filteredStations = filteredStations.filter((s) =>
          s.connectors.some((c) => c.connector_type === query.connector_type)
        );
      }

      if (query.is_dc_fast !== undefined) {
        filteredStations = filteredStations.filter((s) =>
          s.connectors.some((c) => c.is_dc_fast === query.is_dc_fast)
        );
      }

      if (query.network) {
        filteredStations = filteredStations.filter((s) => s.network === query.network);
      }

      // Apply sorting
      if (query.sort_by === 'price' && filteredStations.some((s) => s.pricing.length > 0)) {
        filteredStations.sort((a, b) => {
          const priceA = a.pricing[0]?.price_value || Infinity;
          const priceB = b.pricing[0]?.price_value || Infinity;
          return priceA - priceB;
        });
      } else if (query.sort_by === 'rating') {
        filteredStations.sort((a, b) => (b.avg_rating || 0) - (a.avg_rating || 0));
      } else if (query.sort_by === 'best') {
        // Combine distance, price, rating, trust
        filteredStations.sort((a, b) => {
          const scoreA =
            (a.trust_level || 50) / 100 +
            (a.avg_rating || 0) / 5 -
            (a.distance_km || 0) / query.radius_km;
          const scoreB =
            (b.trust_level || 50) / 100 +
            (b.avg_rating || 0) / 5 -
            (b.distance_km || 0) / query.radius_km;
          return scoreB - scoreA;
        });
      }
      // else defaults to distance (already sorted by DB function)

      return {
        data: filteredStations,
        meta: {
          total: filteredStations.length,
          query_location: { lat: query.lat, lng: query.lng },
          radius_km: query.radius_km,
          vehicle_id: query.vehicle_id,
          sort_by: query.sort_by,
        },
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        reply.status(400);
        return {
          data: [],
          error: {
            message: 'Invalid query parameters',
            code: 'INVALID_QUERY',
          },
        };
      }

      server.log.error(error);
      reply.status(500);
      return {
        data: [],
        error: {
          message: 'Failed to fetch stations',
          code: 'STATIONS_FETCH_ERROR',
        },
      };
    }
  });

  // GET /api/stations/:id - Get station details
  server.get<{ Params: { id: string } }>('/:id', async (request, reply) => {
    try {
      const { id } = request.params;

      const { data: station, error: stationError } = await supabase
        .from('stations')
        .select('*')
        .eq('id', id)
        .single();

      if (stationError) throw stationError;

      if (!station) {
        reply.status(404);
        return {
          data: null,
          error: {
            message: 'Station not found',
            code: 'STATION_NOT_FOUND',
          },
        };
      }

      // Fetch related data
      const [connectorsRes, pricingRes, amenitiesRes, reviewsRes, photosRes] =
        await Promise.all([
          supabase.from('station_connectors').select('*').eq('station_id', id),
          supabase.from('station_pricing').select('*').eq('station_id', id),
          supabase.from('station_amenities').select('*').eq('station_id', id).single(),
          supabase
            .from('station_reviews')
            .select('*, user_id')
            .eq('station_id', id)
            .order('created_at', { ascending: false }),
          supabase
            .from('station_photos')
            .select('*')
            .eq('station_id', id)
            .order('created_at', { ascending: false }),
        ]);

      const reviews = reviewsRes.data || [];
      const avg_rating =
        reviews.length > 0
          ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
          : undefined;

      const enrichedStation: StationWithDetails = {
        ...station,
        connectors: connectorsRes.data || [],
        pricing: pricingRes.data || [],
        amenities: amenitiesRes.data || undefined,
        reviews,
        avg_rating,
        total_reviews: reviews.length,
      };

      return {
        data: enrichedStation,
      };
    } catch (error) {
      server.log.error(error);
      reply.status(500);
      return {
        data: null,
        error: {
          message: 'Failed to fetch station details',
          code: 'STATION_DETAILS_ERROR',
        },
      };
    }
  });

  // GET /api/stations/city/:city - Get stations by city
  server.get<{ Params: { city: string } }>('/city/:city', async (request, reply) => {
    try {
      const { city } = request.params;

      const { data, error } = await supabase
        .from('stations')
        .select('*')
        .ilike('city', city)
        .order('trust_level', { ascending: false });

      if (error) throw error;

      return {
        data: data || [],
        meta: {
          total: data?.length || 0,
          city,
        },
      };
    } catch (error) {
      server.log.error(error);
      reply.status(500);
      return {
        data: [],
        error: {
          message: 'Failed to fetch stations',
          code: 'STATIONS_FETCH_ERROR',
        },
      };
    }
  });
};

