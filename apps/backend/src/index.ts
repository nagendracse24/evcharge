import Fastify from 'fastify';
import cors from '@fastify/cors';
import { config } from './config';
import { vehiclesRoutes } from './routes/vehicles';
import { stationsRoutes } from './routes/stations';
import { userRoutes } from './routes/users';
import { healthRoutes } from './routes/health';

const server = Fastify({
  logger: {
    level: config.NODE_ENV === 'production' ? 'info' : 'debug',
  },
});

async function start() {
  try {
    // Register CORS
    await server.register(cors, {
      origin: config.NODE_ENV === 'production' 
        ? ['https://your-domain.com'] // Update with your domain
        : true,
      credentials: true,
    });

    // Register routes
    await server.register(healthRoutes, { prefix: '/health' });
    await server.register(vehiclesRoutes, { prefix: '/api/vehicles' });
    await server.register(stationsRoutes, { prefix: '/api/stations' });
    await server.register(userRoutes, { prefix: '/api/user' });

    // Start server
    const port = config.API_PORT;
    await server.listen({ port, host: '0.0.0.0' });
    
    console.log(`🚀 Backend server running on http://localhost:${port}`);
    console.log(`📊 Environment: ${config.NODE_ENV}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

start();

