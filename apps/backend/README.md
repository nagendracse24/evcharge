# EVCharge Backend API

Fastify-based REST API for the EVCharge India platform.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy `.env.example` to `.env` and fill in Supabase credentials:
```bash
cp .env.example .env
```

3. Run development server:
```bash
npm run dev
```

Server will start on http://localhost:3001

## API Endpoints

### Health
- `GET /health` - Health check
- `GET /health/db` - Database connectivity check

### Vehicles
- `GET /api/vehicles` - List all supported vehicles
- `GET /api/vehicles/:id` - Get specific vehicle
- `GET /api/vehicles/type/:type` - Filter by 2W or 4W

### Stations
- `GET /api/stations/nearby?lat=&lng=&radius_km=&vehicle_id=` - Get nearby stations
- `GET /api/stations/:id` - Get station details
- `GET /api/stations/city/:city` - Get stations in a city

### User (Protected - requires auth token)
- `GET /api/user/vehicles` - Get user's saved vehicles
- `POST /api/user/vehicles` - Add vehicle to garage
- `PATCH /api/user/vehicles/:id` - Update vehicle (set as default, etc.)
- `DELETE /api/user/vehicles/:id` - Remove vehicle from garage

## Authentication

Protected endpoints require `Authorization: Bearer <token>` header with Supabase auth token.

## Development

```bash
# Watch mode (auto-reload)
npm run dev

# Build
npm run build

# Production
npm start

# Lint
npm run lint
```

