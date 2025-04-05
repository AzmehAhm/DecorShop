-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  cost DECIMAL(10, 2),
  is_active BOOLEAN DEFAULT TRUE,
  image_url TEXT,
  has_size_modifier BOOLEAN DEFAULT TRUE,
  has_color_modifier BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create product modifiers table (for sizes and colors)
CREATE TABLE IF NOT EXISTS product_modifiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('size', 'color')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create product variants table
CREATE TABLE IF NOT EXISTS product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  sku TEXT NOT NULL,
  size_id UUID REFERENCES product_modifiers(id),
  color_id UUID REFERENCES product_modifiers(id),
  stock_level INTEGER DEFAULT 0,
  reorder_point INTEGER DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(sku)
);

-- Create price lists table
CREATE TABLE IF NOT EXISTS price_lists (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create price list items table
CREATE TABLE IF NOT EXISTS price_list_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  price_list_id TEXT NOT NULL REFERENCES price_lists(id) ON DELETE CASCADE,
  product_variant_id UUID NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(price_list_id, product_variant_id)
);

-- Insert default price list
INSERT INTO price_lists (id, name, is_default) 
VALUES ('default', 'Standard Pricing', TRUE)
ON CONFLICT (id) DO NOTHING;

-- Insert default modifiers
INSERT INTO product_modifiers (name, type) VALUES
('Small', 'size'),
('Medium', 'size'),
('Large', 'size'),
('X-Large', 'size'),
('Red', 'color'),
('Blue', 'color'),
('Green', 'color'),
('Black', 'color'),
('White', 'color')
ON CONFLICT DO NOTHING;

-- Enable row level security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_modifiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_list_items ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (for demo purposes)
DROP POLICY IF EXISTS "Public products access" ON products;
CREATE POLICY "Public products access" ON products FOR ALL USING (true);

DROP POLICY IF EXISTS "Public modifiers access" ON product_modifiers;
CREATE POLICY "Public modifiers access" ON product_modifiers FOR ALL USING (true);

DROP POLICY IF EXISTS "Public variants access" ON product_variants;
CREATE POLICY "Public variants access" ON product_variants FOR ALL USING (true);

DROP POLICY IF EXISTS "Public price lists access" ON price_lists;
CREATE POLICY "Public price lists access" ON price_lists FOR ALL USING (true);

DROP POLICY IF EXISTS "Public price items access" ON price_list_items;
CREATE POLICY "Public price items access" ON price_list_items FOR ALL USING (true);

-- Enable realtime for all tables
alter publication supabase_realtime add table products;
alter publication supabase_realtime add table product_modifiers;
alter publication supabase_realtime add table product_variants;
alter publication supabase_realtime add table price_lists;
alter publication supabase_realtime add table price_list_items;
