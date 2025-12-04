# ⚡ EVCharge India - Quick Start (3 Minutes)

Get running in 3 minutes. Full setup guide: `SETUP_GUIDE.md`

---

## 🏃 Fastest Path to Running App

### 1. Install Dependencies
```bash
npm install
```

### 2. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) → Sign up/Login
2. Click "New Project"
3. Fill in:
   - **Name**: evcharge-india
   - **Password**: (choose and save it!)
   - **Region**: Singapore (closest to India)
4. Click "Create project" → Wait 2 mins

### 3. Set Up Database

1. In Supabase, go to **SQL Editor** (left sidebar)
2. Copy entire contents of `database/schema.sql` from this project
3. Paste in SQL Editor → Click **Run**
4. Then copy `database/seed.sql` → Paste → **Run**
5. ✅ You should see success message with 20 vehicles + 10 stations

### 4. Get API Keys

1. In Supabase: **Settings** → **API**
2. Copy:
   - **Project URL**
   - **anon public key**
   - **service_role key** (secret!)

### 5. Create .env File

Create `.env` in project root:

```env
SUPABASE_URL=https://YOUR-PROJECT.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...paste-your-anon-key
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...paste-service-role-key

API_PORT=3001
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...paste-your-anon-key
NEXT_PUBLIC_MAPLIBRE_STYLE_URL=https://tiles.openfreemap.org/styles/liberty
NODE_ENV=development
```

### 6. Run the App

```bash
npm run dev
```

Wait 10-20 seconds for both servers to start.

### 7. Open in Browser

- **Web App**: http://localhost:3000
- **API Health**: http://localhost:3001/health

---

## ✅ What You Should See

### At http://localhost:3000:

✅ Map of Bangalore with station markers  
✅ List of 5-10 stations on left side (desktop)  
✅ "Select Vehicle" dropdown (top right)  
✅ Filters panel  
✅ Mobile: Map/List toggle buttons  

### Click Around:

1. **Click a station marker** → Should highlight
2. **Click a station card** → Opens detail page
3. **Select a vehicle** → Stations show compatibility badges
4. **Change filters** → Results update

---

## 🐛 Something Not Working?

### Backend won't start?
```bash
# Check .env file exists and has correct values
cat .env | grep SUPABASE_URL
```

### Frontend shows "Failed to fetch"?
- Make sure backend is running (check :3001/health)
- Check NEXT_PUBLIC_API_URL in .env

### No stations on map?
- Verify seed data: Supabase Dashboard → Table Editor → stations
- Should have 10 rows

### Map doesn't load?
- Refresh the page
- Check browser console for errors

---

## 📊 What's Next?

### Immediate (Today)

1. ✅ **Test the app** - click around, try features
2. ✅ **Read `data/STATION_TEMPLATE.md`** - how to add stations
3. ✅ **Start collecting station data** - aim for 20 stations first

### This Week

- [ ] Add 20-50 stations (Bangalore or Delhi)
- [ ] Test with real data
- [ ] Build "Add Station" form (see TODOs)
- [ ] Add authentication (optional for MVP)

### Next 2 Weeks

- [ ] Reach 100 stations per city
- [ ] Build mobile app (React Native)
- [ ] Deploy to production
- [ ] Soft launch to beta testers

---

## 💡 Pro Tips

1. **Use Supabase Table Editor** to add stations quickly:
   - Dashboard → Table Editor → stations → Insert row

2. **Test API directly** before building UI:
   - http://localhost:3001/api/vehicles
   - http://localhost:3001/api/stations/nearby?lat=12.9716&lng=77.5946

3. **Check backend logs** in the terminal to debug issues

4. **Use browser DevTools** (F12) to see network requests and errors

---

## 📚 Key Files

- `apps/backend/src/routes/` - API endpoints
- `apps/web/src/app/page.tsx` - Main page
- `apps/web/src/components/` - UI components
- `database/schema.sql` - Database structure
- `database/seed.sql` - Sample data
- `packages/shared/src/index.ts` - Shared types

---

## 🆘 Need Help?

1. Read full setup guide: `SETUP_GUIDE.md`
2. Check station template: `data/STATION_TEMPLATE.md`
3. Check TODO list: You have tasks planned out
4. Review code comments in components

---

**You're live! Market's waiting. Start adding stations and iterate fast.** 🚀

