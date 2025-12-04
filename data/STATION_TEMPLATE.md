# 📍 Station Data Collection Template

Use this template to collect 200 stations (100 Bangalore + 100 Delhi NCR).

## 🎯 Goal: 100 Stations per City

### Data Sources You Can Use:
1. **Tata Power Website**: https://evcharging.tatapowerddl.com/
2. **Statiq Website**: https://www.statiq.in/
3. **Google Maps**: Search "EV charging station [city]"
4. **PlugShare**: https://www.plugshare.com/ (note manually)
5. **ChargeZone**: Check their app/website
6. **Ather Grid**: https://www.atherenergy.com/charging

---

## 📋 Quick Data Entry Format

Copy this for each station:

```
STATION NAME: [e.g., Lulu Mall - Tata Power]
NETWORK: [Tata Power/Statiq/ChargeZone/Ather/JioBP/Other]
ADDRESS: [Full address]
CITY: [Bangalore/Delhi/Gurgaon/Noida/etc.]
STATE: [Karnataka/Delhi/Haryana/UP]
PINCODE: [6 digits]
LATITUDE: [Use Google Maps - right-click location]
LONGITUDE: [Use Google Maps - right-click location]
24x7: [Yes/No]
PARKING TYPE: [mall/hotel/highway/office/metro/public/fuel_station]

CONNECTORS:
- Type: [CCS2/Type 2 AC/CHAdeMO/Bharat AC001]
  Power: [kW - e.g., 60/7.2/3.3]
  Count: [Number of guns]
  For: [2W/4W/Both]

PRICING:
- Model: [per_kwh/per_minute/flat_session]
- Price: [₹ amount]
- Parking: [₹ amount, if any]

AMENITIES:
- Washroom: [Y/N]
- Food: [Y/N]
- WiFi: [Y/N]
- Sitting Area: [Y/N]
- Safety (1-5): [Rating]
```

---

## 📝 Example Entry

```
STATION NAME: UB City Mall - Tata Power
NETWORK: Tata Power
ADDRESS: 24, Vittal Mallya Road, Bangalore
CITY: Bangalore
STATE: Karnataka
PINCODE: 560001
LATITUDE: 12.9716
LONGITUDE: 77.5946
24x7: No
PARKING TYPE: mall

CONNECTORS:
- Type: CCS2
  Power: 60
  Count: 2
  For: 4W
- Type: Type 2 AC
  Power: 7.2
  Count: 2
  For: Both

PRICING:
- Model: per_kwh
- Price: ₹16
- Parking: ₹50

AMENITIES:
- Washroom: Y
- Food: Y
- WiFi: Y
- Sitting Area: Y
- Safety (1-5): 5
```

---

## 🗺️ How to Get Latitude/Longitude from Google Maps

1. Open Google Maps
2. Search for the location
3. Right-click on the exact spot
4. Click "What's here?"
5. Copy the coordinates (e.g., 12.9716, 77.5946)
   - First number = Latitude
   - Second number = Longitude

---

## 📊 Priority Stations to Collect

### **Bangalore (Target: 100)**

**High Priority Areas (50 stations):**
- [ ] Koramangala (10)
- [ ] Indiranagar (8)
- [ ] Whitefield (10)
- [ ] Electronic City (10)
- [ ] Hebbal/Manyata (8)
- [ ] Banashankari/Jayanagar (4)

**Medium Priority (30):**
- [ ] Marathahalli
- [ ] Sarjapur Road
- [ ] Outer Ring Road
- [ ] Yelahanka
- [ ] JP Nagar

**Highways (20):**
- [ ] Bangalore-Mysore Highway
- [ ] Bangalore-Chennai Highway
- [ ] Tumkur Road

---

### **Delhi NCR (Target: 100)**

**High Priority Areas (50 stations):**
- [ ] Connaught Place (8)
- [ ] Cyber City, Gurgaon (12)
- [ ] Noida Sector 18 (10)
- [ ] Dwarka (8)
- [ ] Saket/Nehru Place (12)

**Medium Priority (30):**
- [ ] Greater Noida
- [ ] Faridabad
- [ ] Vasant Kunj
- [ ] Rohini
- [ ] Aerocity

**Highways (20):**
- [ ] Delhi-Jaipur Highway
- [ ] Delhi-Agra Yamuna Expressway
- [ ] Delhi-Chandigarh Highway

---

## ⚡ Quick Start Plan

### Week 1: Get 20 Verified Stations
- Manually visit/verify 10 in each city
- Focus on popular malls, metros (high trust)

### Week 2-3: Collect 80 from Online Sources
- Scrape/note from Tata Power, Statiq websites
- Mark as "needs verification"

### Week 4: Fill Gaps with Crowdsourcing
- Launch app with 100 stations
- Let users add remaining

---

## 📤 How to Submit Data

Once you collect stations, you can:

1. **Fill the SQL template** (I'll provide one)
2. **Use CSV import** (I'll create a script)
3. **Use the web form** (we'll build "Add Station" feature in Week 2)

---

## 💡 Tips

- **Don't aim for perfection**: Get 100 stations with basic info first
- **Mark confidence level**: 
  - ✅ Verified (visited/confirmed)
  - ⚠️ Online source (not verified)
  - ❓ User-added (needs check)
- **Photos help**: If you visit, take photos (huge trust signal)
- **Update regularly**: Stations change, prices change

---

**Let me know once you have first 20-30 stations and I'll help import them!** 🚀

