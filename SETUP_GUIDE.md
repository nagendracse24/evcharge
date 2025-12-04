# 🚀 EVCharge India - Setup Guide

Complete step-by-step guide to get your project running.

---

## 📋 Prerequisites

Before starting, ensure you have:

- ✅ **Node.js 18+** installed ([Download](https://nodejs.org/))
- ✅ **npm 9+** (comes with Node.js)
- ✅ **Git** installed
- ✅ **Supabase Account** (free tier) - [Sign up](https://supabase.com)

---

## 🛠️ Step 1: Install Dependencies

From the project root:

```bash
npm install
```

This installs all dependencies for backend, web, and shared packages.

---

## 🗄️ Step 2: Set Up Supabase

### 2.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Create a new organization (if needed)
4. Create a new project:
   - **Name**: evcharge-india (or your choice)
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: Choose closest to India (e.g., Singapore)
   - Click "Create new project"
5. Wait 2-3 minutes for project to initialize

### 2.2 Get Your API Keys

1. In your Supabase project dashboard:
   - Go to **Settings** (gear icon) → **API**
2. Copy these values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public key** (long string starting with `eyJ...`)
   - **service_role key** (long string, keep this secret!)

### 2.3 Run Database Schema

1. In Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Open the file `database/schema.sql` from this project
3. Copy the entire contents
4. Paste into Supabase SQL Editor
5. Click **Run** (or press Ctrl/Cmd + Enter)
6. You should see: "Success. No rows returned"

### 2.4 Seed Initial Data

1. Still in SQL Editor
2. Open `database/seed.sql` from this project
3. Copy and paste entire contents
4. Click **Run**
5. You should see: "Success" with message about vehicles and stations inserted

---

## ⚙️ Step 3: Configure Environment Variables

### 3.1 Root .env

Create `.env` in project root:

```bash
cp .env.example .env
```

Edit `.env` and add your Supabase credentials:

```env
# Supabase
SUPABASE_URL=https://YOUR-PROJECT-ID.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...your-service-role-key-here

# Backend API
API_PORT=3001
API_URL=http://localhost:3001

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT-ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...your-anon-key-here

# Maps
NEXT_PUBLIC_MAPLIBRE_STYLE_URL=https://tiles.openfreemap.org/styles/liberty

# Environment
NODE_ENV=development
```

### 3.2 Backend .env

The backend reads from root `.env`, but you can create `apps/backend/.env` for backend-specific overrides if needed.

---

## ▶️ Step 4: Run the Project

### Option A: Run Everything (Recommended)

From project root:

```bash
npm run dev
```

This starts:
- ✅ Backend API on http://localhost:3001
- ✅ Web app on http://localhost:3000

### Option B: Run Separately

**Terminal 1 - Backend:**
```bash
npm run dev:backend
```

**Terminal 2 - Frontend:**
```bash
npm run dev:web
```

---

## ✅ Step 5: Verify Setup

### 5.1 Check Backend Health

Open browser: http://localhost:3001/health

You should see:
```json
{
  "status": "ok",
  "timestamp": "2024-...",
  "uptime": 123.45
}
```

### 5.2 Check Database Connection

Open: http://localhost:3001/health/db

You should see:
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "..."
}
```

### 5.3 Check API Endpoints

**Get Vehicles:**
http://localhost:3001/api/vehicles

Should return 20 vehicles (Tata, Ather, Ola, MG, etc.)

**Get Nearby Stations (Bangalore):**
http://localhost:3001/api/stations/nearby?lat=12.9716&lng=77.5946&radius_km=10

Should return 5 seed stations in Bangalore

### 5.4 Check Web App

Open: http://localhost:3000

You should see:
- ✅ Map centered on Bangalore
- ✅ 5-10 station markers on map
- ✅ Station list on left (desktop) or toggle button (mobile)
- ✅ Vehicle selector dropdown (top right)
- ✅ Filter panel

---

## 🐛 Troubleshooting

### Issue: "Module not found" errors

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
rm -rf apps/*/node_modules
rm -rf packages/*/node_modules
npm install
```

### Issue: Backend won't start - "SUPABASE_URL is required"

**Solution:**
- Make sure `.env` file exists in project root
- Check that `SUPABASE_URL` and `SUPABASE_ANON_KEY` are set
- Restart the dev server

### Issue: Frontend shows "Failed to fetch stations"

**Solution:**
1. Ensure backend is running (http://localhost:3001/health should work)
2. Check browser console for CORS errors
3. Verify `NEXT_PUBLIC_API_URL=http://localhost:3001` in `.env`

### Issue: Map doesn't load

**Solution:**
- Check browser console for errors
- Ensure `maplibre-gl` CSS is imported in `globals.css`
- Try refreshing the page

### Issue: No stations showing on map

**Solution:**
1. Verify seed data was inserted:
   - Go to Supabase Dashboard → Table Editor → stations
   - You should see 10 stations (5 Bangalore + 5 Delhi NCR)
2. Check API response:
   - Open http://localhost:3001/api/stations/nearby?lat=12.9716&lng=77.5946
   - Should return array with station data

---

## 📊 Next Steps

### 1. Add More Station Data

See `data/STATION_TEMPLATE.md` for how to add stations.

Quick test:
- Use the "Add Station" feature (when built)
- Or manually insert via Supabase Table Editor

### 2. Set Up Authentication (Optional for MVP)

Supabase Auth is already configured. To enable:

```typescript
// In your component
import { supabase } from '@/lib/supabase'

// Sign in with Google
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
})
```

Configure OAuth in Supabase:
- Dashboard → Authentication → Providers
- Enable Google, configure credentials

### 3. Deploy to Production

**Backend (Railway):**
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize
cd apps/backend
railway init

# Add environment variables in Railway dashboard
# Deploy
railway up
```

**Frontend (Vercel):**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd apps/web
vercel

# Follow prompts, add environment variables
```

Update `.env` with production URLs.

---

## 🎯 Development Workflow

### Daily Development

```bash
# Start dev servers
npm run dev

# In separate terminal, watch shared package
cd packages/shared
npm run dev
```

### Make Changes

1. **Add new API endpoint:**
   - Edit `apps/backend/src/routes/*.ts`
   - Backend auto-reloads

2. **Add new component:**
   - Create in `apps/web/src/components/`
   - Import and use

3. **Modify shared types:**
   - Edit `packages/shared/src/index.ts`
   - Run `npm run build` in shared package
   - Or use watch mode: `cd packages/shared && npm run dev`

### Build for Production

```bash
# Build all packages
npm run build

# Test production build locally
cd apps/backend
npm start

cd apps/web
npm run build && npm start
```

---

## 📚 Useful Commands

```bash
# Install new dependency in backend
npm install <package> --workspace=apps/backend

# Install new dependency in web
npm install <package> --workspace=apps/web

# Run linter
npm run lint

# Format code
npm run format

# Clean build artifacts
rm -rf apps/*/dist apps/*/.next
```

---

## 🆘 Getting Help

1. **Check logs:**
   - Backend: Terminal running `npm run dev:backend`
   - Frontend: Browser console (F12)
   - Network requests: Browser DevTools → Network tab

2. **Database issues:**
   - Supabase Dashboard → Logs
   - SQL Editor → Run `SELECT * FROM stations LIMIT 5;`

3. **API testing:**
   - Use browser for GET requests
   - Use Postman/Thunder Client for POST/PATCH/DELETE

---

## ✅ You're Ready!

If you can:
- ✅ See backend health at :3001/health
- ✅ See web app at :3000
- ✅ See stations on map
- ✅ Select a vehicle and see compatibility

**You're all set! Start building** 🚀

Next: Check `data/STATION_TEMPLATE.md` to add your 100+100 stations.

