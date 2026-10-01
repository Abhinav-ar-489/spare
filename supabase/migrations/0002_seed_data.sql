-- Supabase Migration: 0002_seed_data.sql
-- Seed genuine automotive brands, categories, vehicles, and products

-- 1. Brands
INSERT INTO public.brands (id, name, slug, logo_url, description) VALUES
('brand-bosch', 'Bosch', 'bosch', 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=200&auto=format&fit=crop&q=80', 'World-leading Tier-1 OEM supplier for braking systems, sensors, electrical components, and precision fuel injection.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.brands (id, name, slug, logo_url, description) VALUES
('brand-brembo', 'Brembo', 'brembo', 'https://images.unsplash.com/photo-1600705722908-bab1e61c0b4d?w=200&auto=format&fit=crop&q=80', 'Global benchmark in high-performance braking rotors, ceramic pads, and monobloc calipers.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.brands (id, name, slug, logo_url, description) VALUES
('brand-denso', 'Denso', 'denso', 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=200&auto=format&fit=crop&q=80', 'Premier Japanese OEM supplier specializing in iridium spark plugs, AC compressors, alternators, and engine sensors.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.brands (id, name, slug, logo_url, description) VALUES
('brand-valeo', 'Valeo', 'valeo', 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=200&auto=format&fit=crop&q=80', 'French automotive technology specialist in powertrain clutches, dual-mass flywheels, headlamps, and thermal systems.')
ON CONFLICT (id) DO NOTHING;

-- 2. Categories
INSERT INTO public.categories (id, name, slug, description, icon, image_url, display_order) VALUES
('cat-brakes', 'Brake System', 'brake-system', 'High-friction ceramic & semi-metallic brake pads, ventilated rotors, ABS wheel sensors, and master cylinders.', 'Disc', 'https://images.unsplash.com/photo-1600705722908-bab1e61c0b4d?w=600&auto=format&fit=crop&q=80', 1),
('cat-engine', 'Engine Parts', 'engine-parts', 'OEM cylinder heads, piston assemblies, timing belts, camshaft adjusters, valves, and overhaul gasket sets.', 'Cpu', 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=600&auto=format&fit=crop&q=80', 2),
('cat-suspension', 'Suspension & Steering', 'suspension-steering', 'Gas-charged shock absorbers, control arms, tie rod ends, stabilizer links, and precision wheel bearing hub assemblies.', 'Activity', 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?w=600&auto=format&fit=crop&q=80', 3),
('cat-electrical', 'Electrical & Ignition', 'electrical-ignition', 'Alternators, starter motors, ignition coils, laser iridium spark plugs, crankshaft sensors, and ECU relays.', 'Zap', 'https://images.unsplash.com/photo-1558441719-70222a7f502c?w=600&auto=format&fit=crop&q=80', 4),
('cat-filters', 'Filters & Fluids', 'filters-fluids', 'Synthetic oil filters, micro-fiber engine air filters, activated carbon cabin filters, and inline fuel filters.', 'Filter', 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=600&auto=format&fit=crop&q=80', 5)
ON CONFLICT (id) DO NOTHING;

-- 3. Vehicle Makes
INSERT INTO public.vehicle_makes (id, name, slug) VALUES
('make-toyota', 'Toyota', 'toyota'),
('make-hyundai', 'Hyundai', 'hyundai'),
('make-honda', 'Honda', 'honda'),
('make-maruti', 'Maruti Suzuki', 'maruti-suzuki')
ON CONFLICT (id) DO NOTHING;

-- 4. Vehicle Models
INSERT INTO public.vehicle_models (id, make_id, name, slug, year_start, year_end) VALUES
('model-innova', 'make-toyota', 'Innova Crysta', 'innova-crysta', 2016, 2024),
('model-fortuner', 'make-toyota', 'Fortuner', 'fortuner', 2016, 2024),
('model-creta', 'make-hyundai', 'Creta', 'creta', 2020, 2024),
('model-city', 'make-honda', 'City (5th Gen)', 'city-5th-gen', 2020, NULL)
ON CONFLICT (id) DO NOTHING;

-- 5. Vehicle Variants
INSERT INTO public.vehicle_variants (id, model_id, name, fuel_type, engine_capacity, transmission) VALUES
('var-innova-28d', 'model-innova', '2.8 Diesel AT', 'Diesel', '2755 cc', 'Automatic'),
('var-innova-24d', 'model-innova', '2.4 Diesel MT', 'Diesel', '2393 cc', 'Manual'),
('var-creta-15d', 'model-creta', '1.5 CRDi Diesel AT', 'Diesel', '1493 cc', 'Automatic'),
('var-city-15p', 'model-city', '1.5 i-VTEC Petrol CVT', 'Petrol', '1498 cc', 'CVT')
ON CONFLICT (id) DO NOTHING;

-- 6. Products
INSERT INTO public.products (
  id, name, slug, part_number, oem_number, brand_id, category_id,
  description, specifications, price, discount_price, currency,
  stock, is_available, is_featured, is_archived, payment_enabled, tags
) VALUES
(
  'prod-bosch-bp-innova',
  'Bosch Premium Front Ceramic Brake Pad Set',
  'bosch-premium-front-ceramic-brake-pad-set-toyota-innova',
  'BP-4821',
  '04465-0K280',
  'brand-bosch',
  'cat-brakes',
  'Engineered with aerospace-grade ceramic friction formulation for whisper-quiet braking, minimal brake dust, and exceptional thermal fade resistance up to 650°C. Features multi-layer vulcanized rubber shims for sound absorption and pre-chamfered edges for immediate bedding-in.',
  '{"Fitting Position": "Front Axle", "Friction Material": "Advanced Ceramic Composite", "Pad Thickness": "17.2 mm", "ECE Regulation": "ECE-R90 Certified"}'::jsonb,
  3450,
  2890,
  'INR',
  24,
  true,
  true,
  false,
  false,
  ARRAY['Brakes', 'Ceramic', 'OEM Replacement', 'Front Axle']
),
(
  'prod-brembo-rotor-innova',
  'Brembo UV-Coated High-Carbon Ventilated Front Brake Disc',
  'brembo-uv-coated-front-brake-disc-toyota-innova-fortuner',
  '09.C498.11',
  '43512-0K090',
  'brand-brembo',
  'cat-brakes',
  'Constructed with high-carbon metallurgy to mitigate vibration, brake shudder, and thermal distortion during heavy deceleration. Brembo proprietary UV coating protects the internal cooling vanes and hub bell against rust and corrosion throughout its service life.',
  '{"Diameter": "319 mm", "Brake Disc Thickness": "28 mm", "Minimum Thickness": "26 mm", "Centering Diameter": "108 mm"}'::jsonb,
  6850,
  5990,
  'INR',
  14,
  true,
  true,
  false,
  false,
  ARRAY['Rotors', 'High Carbon', 'UV Coated', 'Brembo']
)
ON CONFLICT (id) DO NOTHING;
