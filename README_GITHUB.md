<div align="center">

# ⚡ EVCharge India

**Find the best EV charging stations in India**

Compare prices • Check compatibility • Discover nearby chargers

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-green?style=flat&logo=supabase)](https://supabase.com/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

[Demo](#) • [Features](#-features-mvp) • [Setup](#-quick-start) • [Contributing](#-contributing)

</div>

---

## 🎯 The Problem

Current EV charging apps in India:
- ❌ Network-specific (only show one company's chargers)
- ❌ Don't check vehicle compatibility
- ❌ No price comparison
- ❌ Outdated or incomplete data
- ❌ Clunky user experience

## 💡 Our Solution

A **vehicle-aware, comparison-first** platform that:
- ✅ Shows ALL charging networks (Tata Power, Statiq, ChargeZone, etc.)
- ✅ Checks compatibility with YOUR specific EV
- ✅ Estimates cost & charging time for your vehicle
- ✅ Compares stations by price, distance, rating
- ✅ Crowdsourced data + community reviews
- ✅ Clean, modern UI inspired by Skyscanner

---

## 🚀 Features (MVP)

### For EV Owners
- 🗺️ **Interactive Map** - Find nearby stations with color-coded compatibility
- 🚗 **Vehicle Selection** - Choose your EV model for smart recommendations
- 💰 **Cost Estimates** - See estimated charging cost for your vehicle
- ⏱️ **Time Estimates** - Know how long charging will take
- 🔍 **Smart Filters** - Filter by connector type, price, network, DC fast charging
- ⭐ **Reviews & Ratings** - Community feedback on each station
- 📱 **Mobile-First** - Works perfectly on all devices

### For the Community
- ➕ **Add Stations** - Contribute new charging locations
- 🐛 **Report Issues** - Mark stations offline or update prices
- 📸 **Upload Photos** - Help others know what to expect
- 💬 **Leave Reviews** - Share your charging experience

---

## 🛠️ Tech Stack

**Frontend:**
- [Next.js 14](https://nextjs.org/) - React framework with App Router
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [MapLibre GL](https://maplibre.org/) - Interactive maps
- [TanStack Query](https://tanstack.com/query) - Data fetching
- [Zustand](https://zustand-demo.pmnd.rs/) - State management

**Backend:**
- [Fastify](https://fastify.dev/) - High-performance Node.js framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Supabase](https://supabase.com/) - PostgreSQL database + Auth
- [PostGIS](https://postgis.net/) - Geospatial queries
- [Zod](https://zod.dev/) - Schema validation

**Infrastructure:**
- [Vercel](https://vercel.com/) - Frontend hosting (free tier)
- [Railway](https://railway.app/) - Backend hosting (free tier)
- [OpenStreetMap](https://www.openstreetmap.org/) - Map tiles (free)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm 9+
- Supabase account (free tier)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/YOUR-USERNAME/evcharge-india.git
cd evcharge-india
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up Supabase**
- Create a project at [supabase.com](https://supabase.com)
- Run `database/schema.sql` in Supabase SQL Editor
- Run `database/seed.sql` to populate initial data

4. **Configure environment**
```bash
cp .env.example .env
# Edit .env with your Supabase credentials
```

5. **Start development servers**
```bash
npm run dev
```

6. **Open in browser**
- Web app: http://localhost:3000
- API: http://localhost:3001

📚 **Detailed setup guide:** See [`QUICK_START.md`](QUICK_START.md)

---

## 📊 Current Coverage

| City | Stations | Vehicles Supported |
|------|----------|-------------------|
| Bangalore | 5+ (growing) | All major EVs |
| Delhi NCR | 5+ (growing) | All major EVs |
| **Total** | **10+ seed stations** | **20 vehicle models** |

**Supported EVs:**
- 2W: Ather 450X, Ola S1, TVS iQube, Bajaj Chetak, Simple One, Revolt RV400
- 4W: Tata Nexon EV, MG ZS EV, Mahindra XUV400, Hyundai Kona/Ioniq 5, BYD Atto 3, BMW i4

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Add Charging Stations
Know a charging station we're missing? 
1. Use the "Add Station" form in the app (when logged in)
2. Or submit via GitHub issue with station details

### Report Issues
- Found a bug? [Open an issue](https://github.com/YOUR-USERNAME/evcharge-india/issues)
- Station data incorrect? Use the "Report Issue" button in the app

### Development
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

See [`CONTRIBUTING.md`](CONTRIBUTING.md) for detailed guidelines.

---

## 📁 Project Structure

```
evcharge-india/
├── apps/
│   ├── backend/          # Fastify API server
│   └── web/              # Next.js web application
├── packages/
│   └── shared/           # Shared TypeScript types
├── database/
│   ├── schema.sql        # Database schema
│   └── seed.sql          # Seed data
├── data/
│   └── templates/        # Station data templates
└── docs/                 # Additional documentation
```

---

## 🗺️ Roadmap

### Phase 1: MVP (Current)
- [x] Core platform (web app + backend)
- [x] Vehicle-aware compatibility
- [x] Basic filtering & sorting
- [x] Station detail pages
- [ ] User authentication
- [ ] Add/report station features

### Phase 2: Scale (Next 2 months)
- [ ] 100+ stations per city
- [ ] Reviews & ratings system
- [ ] React Native mobile app
- [ ] Route planning
- [ ] Real-time availability (via CPO partnerships)

### Phase 3: Monetize (3-6 months)
- [ ] Freemium tier (₹49/month)
- [ ] B2B fleet dashboard
- [ ] Affiliate partnerships with charging networks
- [ ] In-app booking & payment

---

## 📈 Goals

**6-Month Targets:**
- 🎯 2,000+ active users
- 🎯 300+ charging stations
- 🎯 ₹10-30K/month revenue
- 🎯 Partnerships with 2-3 CPOs

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Supabase](https://supabase.com/) for the amazing database platform
- [OpenStreetMap](https://www.openstreetmap.org/) contributors for map data
- Indian EV community for inspiration and feedback

---

## 📞 Contact

- **Website**: [Coming soon]
- **Twitter**: [@evcharge_india]
- **Email**: contact@evcharge.in
- **Discord**: [Join our community]

---

<div align="center">

**Built with ⚡ for the future of mobility in India**

[⭐ Star this repo](https://github.com/YOUR-USERNAME/evcharge-india) • [🐛 Report Bug](https://github.com/YOUR-USERNAME/evcharge-india/issues) • [💡 Request Feature](https://github.com/YOUR-USERNAME/evcharge-india/issues)

</div>

