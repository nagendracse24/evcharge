# 🔋 EVCharge India

**Find the best EV charging stations in India** - Compare prices, check compatibility, and discover nearby chargers for your electric vehicle.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm 9+
- Supabase account (free tier works)

### Setup

1. **Clone and Install**
   ```bash
   npm install
   ```

2. **Set up Supabase**
   - Create account at [supabase.com](https://supabase.com)
   - Create new project
   - Copy Project URL and API keys to `.env`

3. **Environment Variables**
   ```bash
   cp .env.example .env
   # Edit .env with your Supabase credentials
   ```

4. **Run Database Migrations**
   ```bash
   cd database
   # Run schema.sql in Supabase SQL Editor
   # Then run seed.sql
   ```

5. **Start Development**
   ```bash
   npm run dev
   ```
   - Backend API: http://localhost:3001
   - Web App: http://localhost:3000

## 📁 Project Structure

```
evcharge-india/
├── apps/
│   ├── backend/          # Fastify API server
│   └── web/              # Next.js web app
├── packages/
│   └── shared/           # Shared types & utilities
├── database/             # SQL schemas & seeds
└── data/                 # Station data templates
```

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, MapLibre GL
- **Backend**: Fastify, TypeScript
- **Database**: Supabase (Postgres + PostGIS)
- **Cache**: Upstash Redis
- **Maps**: OpenStreetMap + MapLibre

## 🎯 Features (MVP)

- ✅ Search EV charging stations by location
- ✅ Filter by connector type, price, distance
- ✅ Vehicle-specific compatibility matching
- ✅ Estimated charging cost & time
- ✅ Crowdsourced station data
- ✅ User reviews & ratings
- ✅ Interactive map view

## 📊 Coverage

- **Cities**: Bangalore, Delhi NCR
- **Stations**: 200+ (growing)
- **Vehicles**: 20+ popular Indian EVs

## 🤝 Contributing

We rely on community contributions for accurate data:
- Add new stations
- Update pricing
- Report station status
- Upload photos
- Write reviews

## 📝 License

MIT License - Built for Indian EV community

---

**Built with ⚡ for the future of mobility in India**

