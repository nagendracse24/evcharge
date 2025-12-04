-- EVCharge India - Seed Data
-- Popular Indian EVs + Sample Stations

-- ============= VEHICLE CATALOG =============

INSERT INTO vehicles (brand, model, variant, vehicle_type, battery_capacity_kwh, ac_connector_type, ac_max_power_kw, dc_connector_type, dc_max_power_kw, efficiency_wh_per_km) VALUES

-- 2-Wheelers
('Ather', '450X', 'Gen 3', '2W', 3.7, 'Type 2 AC', 1.5, NULL, NULL, 25),
('Ather', '450S', NULL, '2W', 3.0, 'Type 2 AC', 1.5, NULL, NULL, 24),
('Ola Electric', 'S1 Pro', NULL, '2W', 4.0, 'Type 2 AC', 1.5, NULL, NULL, 27),
('Ola Electric', 'S1 Air', NULL, '2W', 3.0, 'Type 2 AC', 1.5, NULL, NULL, 26),
('TVS', 'iQube Electric', NULL, '2W', 3.04, 'Bharat AC001', 1.5, NULL, NULL, 28),
('Bajaj', 'Chetak', NULL, '2W', 3.0, 'Type 2 AC', 1.5, NULL, NULL, 30),
('Simple', 'One', NULL, '2W', 4.8, 'Type 2 AC', 1.5, NULL, NULL, 24),
('Revolt', 'RV400', NULL, '2W', 3.24, 'Type 2 AC', 1.5, NULL, NULL, 27),

-- 4-Wheelers
('Tata', 'Nexon EV', 'Max', '4W', 40.5, 'Type 2 AC', 7.2, 'CCS2', 60, 140),
('Tata', 'Nexon EV', 'Prime', '4W', 30.2, 'Type 2 AC', 7.2, 'CCS2', 50, 135),
('Tata', 'Tiago EV', 'XZ+', '4W', 24.0, 'Type 2 AC', 7.2, 'CCS2', 50, 125),
('Tata', 'Tigor EV', NULL, '4W', 26.0, 'Type 2 AC', 7.2, 'CCS2', 50, 130),
('MG', 'ZS EV', NULL, '4W', 50.3, 'Type 2 AC', 7.4, 'CCS2', 50, 165),
('MG', 'Comet EV', NULL, '4W', 17.3, 'Type 2 AC', 3.3, NULL, NULL, 110),
('Mahindra', 'XUV400', NULL, '4W', 39.4, 'Type 2 AC', 7.2, 'CCS2', 50, 150),
('Hyundai', 'Kona Electric', NULL, '4W', 39.2, 'Type 2 AC', 7.2, 'CCS2', 50, 145),
('Hyundai', 'Ioniq 5', NULL, '4W', 72.6, 'Type 2 AC', 11, 'CCS2', 220, 168),
('BYD', 'Atto 3', NULL, '4W', 60.48, 'Type 2 AC', 7, 'CCS2', 80, 155),
('Citroen', 'eC3', NULL, '4W', 29.2, 'Type 2 AC', 3.3, NULL, NULL, 130),
('BMW', 'i4', NULL, '4W', 83.9, 'Type 2 AC', 11, 'CCS2', 200, 170);

-- ============= SAMPLE STATIONS - BANGALORE =============

-- Station 1: Orion Mall
INSERT INTO stations (name, network, latitude, longitude, address, city, state, pincode, is_24x7, parking_type, source, trust_level, last_verified_at) 
VALUES ('Orion Mall - Tata Power', 'Tata Power', 13.0103, 77.5537, 'Dr. Rajkumar Road, Rajajinagar', 'Bangalore', 'Karnataka', '560010', false, 'mall', 'seed', 90, NOW());

INSERT INTO station_connectors (station_id, connector_type, power_kw, is_dc_fast, count, vehicle_type_supported)
SELECT id, 'CCS2', 60, true, 2, '4W' FROM stations WHERE name = 'Orion Mall - Tata Power';

INSERT INTO station_connectors (station_id, connector_type, power_kw, is_dc_fast, count, vehicle_type_supported)
SELECT id, 'Type 2 AC', 7.2, false, 2, 'BOTH' FROM stations WHERE name = 'Orion Mall - Tata Power';

INSERT INTO station_pricing (station_id, pricing_model, price_value, parking_charges)
SELECT id, 'per_kwh', 15.00, 30.00 FROM stations WHERE name = 'Orion Mall - Tata Power';

INSERT INTO station_amenities (station_id, has_washroom, has_food, has_coffee_tea, has_wifi, has_sitting_area, has_shade, safety_rating)
SELECT id, true, true, true, true, true, true, 5 FROM stations WHERE name = 'Orion Mall - Tata Power';

-- Station 2: Indiranagar Metro
INSERT INTO stations (name, network, latitude, longitude, address, city, state, pincode, is_24x7, parking_type, source, trust_level, last_verified_at) 
VALUES ('Indiranagar Metro - Statiq', 'Statiq', 12.9784, 77.6408, 'Indiranagar 100 Feet Road, Near Metro Station', 'Bangalore', 'Karnataka', '560038', true, 'metro', 'seed', 85, NOW());

INSERT INTO station_connectors (station_id, connector_type, power_kw, is_dc_fast, count, vehicle_type_supported)
SELECT id, 'CCS2', 50, true, 1, '4W' FROM stations WHERE name = 'Indiranagar Metro - Statiq';

INSERT INTO station_connectors (station_id, connector_type, power_kw, is_dc_fast, count, vehicle_type_supported)
SELECT id, 'Type 2 AC', 3.3, false, 3, 'BOTH' FROM stations WHERE name = 'Indiranagar Metro - Statiq';

INSERT INTO station_pricing (station_id, pricing_model, price_value)
SELECT id, 'per_kwh', 12.50 FROM stations WHERE name = 'Indiranagar Metro - Statiq';

INSERT INTO station_amenities (station_id, has_washroom, has_food, has_wifi, has_shade, safety_rating)
SELECT id, true, false, true, true, 4 FROM stations WHERE name = 'Indiranagar Metro - Statiq';

-- Station 3: Electronic City
INSERT INTO stations (name, network, latitude, longitude, address, city, state, pincode, is_24x7, parking_type, source, trust_level, last_verified_at) 
VALUES ('Electronic City - ChargeZone', 'ChargeZone', 12.8456, 77.6603, 'Hosur Road, Electronic City Phase 1', 'Bangalore', 'Karnataka', '560100', true, 'office', 'seed', 80, NOW());

INSERT INTO station_connectors (station_id, connector_type, power_kw, is_dc_fast, count, vehicle_type_supported)
SELECT id, 'CCS2', 60, true, 2, '4W' FROM stations WHERE name = 'Electronic City - ChargeZone';

INSERT INTO station_pricing (station_id, pricing_model, price_value, remarks)
SELECT id, 'per_kwh', 14.00, 'Free parking for first 2 hours' FROM stations WHERE name = 'Electronic City - ChargeZone';

INSERT INTO station_amenities (station_id, has_washroom, has_coffee_tea, has_sitting_area, has_shade, safety_rating)
SELECT id, true, true, true, true, 4 FROM stations WHERE name = 'Electronic City - ChargeZone';

-- Station 4: Whitefield
INSERT INTO stations (name, network, latitude, longitude, address, city, state, pincode, is_24x7, parking_type, source, trust_level) 
VALUES ('Phoenix Marketcity - Tata Power', 'Tata Power', 12.9976, 77.6966, 'Whitefield Main Road', 'Bangalore', 'Karnataka', '560066', false, 'mall', 'seed', 85);

INSERT INTO station_connectors (station_id, connector_type, power_kw, is_dc_fast, count, vehicle_type_supported)
SELECT id, 'CCS2', 60, true, 1, '4W' FROM stations WHERE name = 'Phoenix Marketcity - Tata Power';

INSERT INTO station_connectors (station_id, connector_type, power_kw, is_dc_fast, count, vehicle_type_supported)
SELECT id, 'Type 2 AC', 7.2, false, 3, 'BOTH' FROM stations WHERE name = 'Phoenix Marketcity - Tata Power';

INSERT INTO station_pricing (station_id, pricing_model, price_value, parking_charges)
SELECT id, 'per_kwh', 15.50, 40.00 FROM stations WHERE name = 'Phoenix Marketcity - Tata Power';

INSERT INTO station_amenities (station_id, has_washroom, has_food, has_wifi, has_sitting_area, has_shade, safety_rating)
SELECT id, true, true, true, true, true, 5 FROM stations WHERE name = 'Phoenix Marketcity - Tata Power';

-- Station 5: Koramangala
INSERT INTO stations (name, network, latitude, longitude, address, city, state, pincode, is_24x7, parking_type, source, trust_level) 
VALUES ('Forum Mall Koramangala - Statiq', 'Statiq', 12.9352, 77.6101, '21, Hosur Road, Koramangala', 'Bangalore', 'Karnataka', '560029', false, 'mall', 'seed', 80);

INSERT INTO station_connectors (station_id, connector_type, power_kw, is_dc_fast, count, vehicle_type_supported)
SELECT id, 'Type 2 AC', 3.3, false, 2, 'BOTH' FROM stations WHERE name = 'Forum Mall Koramangala - Statiq';

INSERT INTO station_pricing (station_id, pricing_model, price_value)
SELECT id, 'per_kwh', 13.00 FROM stations WHERE name = 'Forum Mall Koramangala - Statiq';

INSERT INTO station_amenities (station_id, has_washroom, has_food, has_wifi, has_sitting_area, safety_rating)
SELECT id, true, true, true, true, 4 FROM stations WHERE name = 'Forum Mall Koramangala - Statiq';

-- ============= SAMPLE STATIONS - DELHI NCR =============

-- Station 6: Connaught Place
INSERT INTO stations (name, network, latitude, longitude, address, city, state, pincode, is_24x7, parking_type, source, trust_level, last_verified_at) 
VALUES ('Connaught Place - Tata Power', 'Tata Power', 28.6315, 77.2167, 'Block A, Connaught Place', 'New Delhi', 'Delhi', '110001', true, 'public', 'seed', 90, NOW());

INSERT INTO station_connectors (station_id, connector_type, power_kw, is_dc_fast, count, vehicle_type_supported)
SELECT id, 'CCS2', 60, true, 2, '4W' FROM stations WHERE name = 'Connaught Place - Tata Power';

INSERT INTO station_connectors (station_id, connector_type, power_kw, is_dc_fast, count, vehicle_type_supported)
SELECT id, 'Type 2 AC', 7.2, false, 2, 'BOTH' FROM stations WHERE name = 'Connaught Place - Tata Power';

INSERT INTO station_pricing (station_id, pricing_model, price_value, parking_charges)
SELECT id, 'per_kwh', 14.00, 50.00 FROM stations WHERE name = 'Connaught Place - Tata Power';

INSERT INTO station_amenities (station_id, has_washroom, has_food, has_coffee_tea, has_wifi, safety_rating)
SELECT id, true, true, true, true, 5 FROM stations WHERE name = 'Connaught Place - Tata Power';

-- Station 7: Cyber City Gurgaon
INSERT INTO stations (name, network, latitude, longitude, address, city, state, pincode, is_24x7, parking_type, source, trust_level) 
VALUES ('DLF Cyber Hub - Statiq', 'Statiq', 28.4950, 77.0890, 'DLF Cyber City, Phase 2', 'Gurgaon', 'Haryana', '122002', true, 'office', 'seed', 85);

INSERT INTO station_connectors (station_id, connector_type, power_kw, is_dc_fast, count, vehicle_type_supported)
SELECT id, 'CCS2', 50, true, 3, '4W' FROM stations WHERE name = 'DLF Cyber Hub - Statiq';

INSERT INTO station_pricing (station_id, pricing_model, price_value)
SELECT id, 'per_kwh', 13.50 FROM stations WHERE name = 'DLF Cyber Hub - Statiq';

INSERT INTO station_amenities (station_id, has_washroom, has_food, has_coffee_tea, has_sitting_area, has_shade, safety_rating)
SELECT id, true, true, true, true, true, 5 FROM stations WHERE name = 'DLF Cyber Hub - Statiq';

-- Station 8: Noida Sector 18
INSERT INTO stations (name, network, latitude, longitude, address, city, state, pincode, is_24x7, parking_type, source, trust_level) 
VALUES ('DLF Mall of India - Tata Power', 'Tata Power', 28.5688, 77.3252, 'Sector 18, Noida', 'Noida', 'Uttar Pradesh', '201301', false, 'mall', 'seed', 80);

INSERT INTO station_connectors (station_id, connector_type, power_kw, is_dc_fast, count, vehicle_type_supported)
SELECT id, 'CCS2', 60, true, 2, '4W' FROM stations WHERE name = 'DLF Mall of India - Tata Power';

INSERT INTO station_connectors (station_id, connector_type, power_kw, is_dc_fast, count, vehicle_type_supported)
SELECT id, 'Type 2 AC', 7.2, false, 4, 'BOTH' FROM stations WHERE name = 'DLF Mall of India - Tata Power';

INSERT INTO station_pricing (station_id, pricing_model, price_value, parking_charges)
SELECT id, 'per_kwh', 14.50, 30.00 FROM stations WHERE name = 'DLF Mall of India - Tata Power';

INSERT INTO station_amenities (station_id, has_washroom, has_food, has_wifi, has_sitting_area, has_shade, safety_rating)
SELECT id, true, true, true, true, true, 4 FROM stations WHERE name = 'DLF Mall of India - Tata Power';

-- Station 9: Dwarka
INSERT INTO stations (name, network, latitude, longitude, address, city, state, pincode, is_24x7, parking_type, source, trust_level) 
VALUES ('Dwarka Sector 21 Metro - ChargeZone', 'ChargeZone', 28.5521, 77.0590, 'Dwarka Sector 21, Near Metro Station', 'New Delhi', 'Delhi', '110075', true, 'metro', 'seed', 75);

INSERT INTO station_connectors (station_id, connector_type, power_kw, is_dc_fast, count, vehicle_type_supported)
SELECT id, 'Type 2 AC', 3.3, false, 3, 'BOTH' FROM stations WHERE name = 'Dwarka Sector 21 Metro - ChargeZone';

INSERT INTO station_pricing (station_id, pricing_model, price_value)
SELECT id, 'per_kwh', 12.00 FROM stations WHERE name = 'Dwarka Sector 21 Metro - ChargeZone';

INSERT INTO station_amenities (station_id, has_washroom, has_wifi, has_shade, safety_rating)
SELECT id, true, true, true, 3 FROM stations WHERE name = 'Dwarka Sector 21 Metro - ChargeZone';

-- Station 10: Faridabad
INSERT INTO stations (name, network, latitude, longitude, address, city, state, pincode, is_24x7, parking_type, source, trust_level) 
VALUES ('Crown Plaza Faridabad - Statiq', 'Statiq', 28.4082, 77.3178, 'Mathura Road, Faridabad', 'Faridabad', 'Haryana', '121003', false, 'hotel', 'seed', 70);

INSERT INTO station_connectors (station_id, connector_type, power_kw, is_dc_fast, count, vehicle_type_supported)
SELECT id, 'CCS2', 50, true, 1, '4W' FROM stations WHERE name = 'Crown Plaza Faridabad - Statiq';

INSERT INTO station_pricing (station_id, pricing_model, price_value, parking_charges)
SELECT id, 'per_kwh', 15.00, 20.00 FROM stations WHERE name = 'Crown Plaza Faridabad - Statiq';

INSERT INTO station_amenities (station_id, has_washroom, has_food, has_coffee_tea, has_sitting_area, safety_rating)
SELECT id, true, true, true, true, 4 FROM stations WHERE name = 'Crown Plaza Faridabad - Statiq';

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Seed data inserted successfully!';
  RAISE NOTICE 'Vehicles: 20 | Stations: 10 (5 Bangalore + 5 Delhi NCR)';
  RAISE NOTICE 'Next: Add more stations using the data template';
END $$;

