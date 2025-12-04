-- EVCharge India - Database Schema
-- Run this in Supabase SQL Editor

-- Enable PostGIS extension for geospatial queries
CREATE EXTENSION IF NOT EXISTS postgis;

-- ============= VEHICLES =============

CREATE TABLE vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  variant VARCHAR(100),
  vehicle_type VARCHAR(10) NOT NULL CHECK (vehicle_type IN ('2W', '4W')),
  battery_capacity_kwh DECIMAL(6,2) NOT NULL,
  ac_connector_type VARCHAR(50),
  ac_max_power_kw DECIMAL(5,2),
  dc_connector_type VARCHAR(50),
  dc_max_power_kw DECIMAL(6,2),
  efficiency_wh_per_km DECIMAL(6,2) NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(brand, model, variant)
);

CREATE INDEX idx_vehicles_type ON vehicles(vehicle_type);
CREATE INDEX idx_vehicles_brand ON vehicles(brand);

-- ============= USER VEHICLES =============

CREATE TABLE user_vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  nickname VARCHAR(100),
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, vehicle_id)
);

CREATE INDEX idx_user_vehicles_user ON user_vehicles(user_id);
CREATE INDEX idx_user_vehicles_default ON user_vehicles(user_id, is_default);

-- ============= STATIONS =============

CREATE TABLE stations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  network VARCHAR(100),
  latitude DECIMAL(10,8) NOT NULL,
  longitude DECIMAL(11,8) NOT NULL,
  location GEOGRAPHY(POINT, 4326) GENERATED ALWAYS AS (
    ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)
  ) STORED,
  address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  pincode VARCHAR(10),
  is_24x7 BOOLEAN DEFAULT false,
  parking_type VARCHAR(100),
  source VARCHAR(50) NOT NULL DEFAULT 'crowdsourced' 
    CHECK (source IN ('seed', 'crowdsourced', 'cpo_api', 'government')),
  trust_level INT DEFAULT 50 CHECK (trust_level BETWEEN 0 AND 100),
  last_verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_stations_location ON stations USING GIST(location);
CREATE INDEX idx_stations_city ON stations(city);
CREATE INDEX idx_stations_network ON stations(network);
CREATE INDEX idx_stations_trust ON stations(trust_level DESC);

-- ============= STATION CONNECTORS =============

CREATE TABLE station_connectors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  station_id UUID NOT NULL REFERENCES stations(id) ON DELETE CASCADE,
  connector_type VARCHAR(50) NOT NULL,
  power_kw DECIMAL(6,2) NOT NULL,
  is_dc_fast BOOLEAN DEFAULT false,
  count INT DEFAULT 1 CHECK (count > 0),
  vehicle_type_supported VARCHAR(10) NOT NULL CHECK (vehicle_type_supported IN ('2W', '4W', 'BOTH')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_connectors_station ON station_connectors(station_id);
CREATE INDEX idx_connectors_type ON station_connectors(connector_type);

-- ============= STATION PRICING =============

CREATE TABLE station_pricing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  station_id UUID NOT NULL REFERENCES stations(id) ON DELETE CASCADE,
  connector_type VARCHAR(50),
  pricing_model VARCHAR(50) NOT NULL 
    CHECK (pricing_model IN ('per_kwh', 'per_minute', 'flat_session')),
  price_value DECIMAL(10,2) NOT NULL,
  parking_charges DECIMAL(8,2),
  remarks TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_pricing_station ON station_pricing(station_id);

-- ============= STATION AMENITIES =============

CREATE TABLE station_amenities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  station_id UUID NOT NULL REFERENCES stations(id) ON DELETE CASCADE,
  has_washroom BOOLEAN DEFAULT false,
  has_food BOOLEAN DEFAULT false,
  has_coffee_tea BOOLEAN DEFAULT false,
  has_wifi BOOLEAN DEFAULT false,
  has_sitting_area BOOLEAN DEFAULT false,
  has_shade BOOLEAN DEFAULT false,
  nearby_atm BOOLEAN DEFAULT false,
  safety_rating INT CHECK (safety_rating BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(station_id)
);

CREATE INDEX idx_amenities_station ON station_amenities(station_id);

-- ============= STATION STATUS =============

CREATE TABLE station_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  station_id UUID NOT NULL REFERENCES stations(id) ON DELETE CASCADE,
  connector_id UUID REFERENCES station_connectors(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL 
    CHECK (status IN ('available', 'occupied', 'offline', 'unknown')),
  last_updated_at TIMESTAMPTZ DEFAULT NOW(),
  source VARCHAR(50) NOT NULL DEFAULT 'user_report'
    CHECK (source IN ('cpo_api', 'user_report', 'inferred')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_status_station ON station_status(station_id);
CREATE INDEX idx_status_updated ON station_status(last_updated_at DESC);

-- ============= STATION REVIEWS =============

CREATE TABLE station_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  station_id UUID NOT NULL REFERENCES stations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(station_id, user_id)
);

CREATE INDEX idx_reviews_station ON station_reviews(station_id);
CREATE INDEX idx_reviews_user ON station_reviews(user_id);
CREATE INDEX idx_reviews_rating ON station_reviews(rating DESC);

-- ============= STATION REPORTS =============

CREATE TABLE station_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  station_id UUID NOT NULL REFERENCES stations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  report_type VARCHAR(50) NOT NULL 
    CHECK (report_type IN ('offline', 'price_change', 'busy', 'incorrect_info', 'other')),
  value TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  status VARCHAR(20) DEFAULT 'pending' 
    CHECK (status IN ('pending', 'accepted', 'rejected'))
);

CREATE INDEX idx_reports_station ON station_reports(station_id);
CREATE INDEX idx_reports_status ON station_reports(status, created_at DESC);

-- ============= STATION PHOTOS =============

CREATE TABLE station_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  station_id UUID NOT NULL REFERENCES stations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  caption TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_photos_station ON station_photos(station_id);

-- ============= USER PROFILES (Extended) =============

CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name VARCHAR(200),
  avatar_url TEXT,
  contribution_score INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============= FUNCTIONS =============

-- Function to get nearby stations
CREATE OR REPLACE FUNCTION get_nearby_stations(
  user_lat DECIMAL,
  user_lng DECIMAL,
  radius_km DECIMAL DEFAULT 10,
  result_limit INT DEFAULT 50
)
RETURNS TABLE (
  id UUID,
  name VARCHAR,
  network VARCHAR,
  latitude DECIMAL,
  longitude DECIMAL,
  address TEXT,
  city VARCHAR,
  state VARCHAR,
  is_24x7 BOOLEAN,
  trust_level INT,
  distance_km DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    s.name,
    s.network,
    s.latitude,
    s.longitude,
    s.address,
    s.city,
    s.state,
    s.is_24x7,
    s.trust_level,
    ROUND(
      ST_Distance(
        s.location,
        ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography
      )::DECIMAL / 1000,
      2
    ) AS distance_km
  FROM stations s
  WHERE ST_DWithin(
    s.location,
    ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography,
    radius_km * 1000
  )
  ORDER BY distance_km
  LIMIT result_limit;
END;
$$ LANGUAGE plpgsql;

-- Function to update station trust level
CREATE OR REPLACE FUNCTION update_station_trust()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE stations
  SET 
    trust_level = LEAST(100, GREATEST(0, trust_level + 
      CASE 
        WHEN NEW.status = 'accepted' THEN 5
        WHEN NEW.status = 'rejected' THEN -5
        ELSE 0
      END
    )),
    last_verified_at = CASE 
      WHEN NEW.status = 'accepted' THEN NOW()
      ELSE last_verified_at
    END
  WHERE id = NEW.station_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_trust
AFTER UPDATE ON station_reports
FOR EACH ROW
WHEN (OLD.status IS DISTINCT FROM NEW.status)
EXECUTE FUNCTION update_station_trust();

-- ============= ROW LEVEL SECURITY =============

-- Enable RLS on user-specific tables
ALTER TABLE user_vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE station_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE station_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE station_photos ENABLE ROW LEVEL SECURITY;

-- Policies for user_vehicles
CREATE POLICY "Users can view own vehicles"
  ON user_vehicles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own vehicles"
  ON user_vehicles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own vehicles"
  ON user_vehicles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own vehicles"
  ON user_vehicles FOR DELETE
  USING (auth.uid() = user_id);

-- Policies for user_profiles
CREATE POLICY "Profiles are viewable by everyone"
  ON user_profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id);

-- Policies for reviews (users can CRUD own, view all)
CREATE POLICY "Reviews are viewable by everyone"
  ON station_reviews FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own reviews"
  ON station_reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews"
  ON station_reviews FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reviews"
  ON station_reviews FOR DELETE
  USING (auth.uid() = user_id);

-- Public read access for core data
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Vehicles are viewable by everyone"
  ON vehicles FOR SELECT
  USING (true);

ALTER TABLE stations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Stations are viewable by everyone"
  ON stations FOR SELECT
  USING (true);

ALTER TABLE station_connectors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Connectors are viewable by everyone"
  ON station_connectors FOR SELECT
  USING (true);

ALTER TABLE station_pricing ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Pricing is viewable by everyone"
  ON station_pricing FOR SELECT
  USING (true);

ALTER TABLE station_amenities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Amenities are viewable by everyone"
  ON station_amenities FOR SELECT
  USING (true);

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Schema created successfully! Next: Run seed.sql to populate initial data.';
END $$;

