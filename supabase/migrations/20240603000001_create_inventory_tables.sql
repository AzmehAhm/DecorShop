-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

-- Create product modifiers table (sizes, colors)
CREATE TABLE IF NOT EXISTS product_modifiers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('size', 'color')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(name, type)
);

-- Create product variants table
CREATE TABLE IF NOT EXISTS product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  sku TEXT NOT NULL,
  size_id UUID REFERENCES product_modifiers(id),
  color_id UUID REFERENCES product_modifiers(id),
  stock_level INTEGER DEFAULT 0,
  reorder_point INTEGER DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(product_id, sku)
);

-- Create price lists table
CREATE TABLE IF NOT EXISTS price_lists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create price list items table
CREATE TABLE IF NOT EXISTS price_list_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  price_list_id UUID NOT NULL REFERENCES price_lists(id) ON DELETE CASCADE,
  product_variant_id UUID NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(price_list_id, product_variant_id)
);

-- Create functions for database setup
CREATE OR REPLACE FUNCTION create_products_table_if_not_exists()
RETURNS VOID AS $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'products') THEN
    CREATE TABLE products (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
  END IF;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION create_product_modifiers_table_if_not_exists()
RETURNS VOID AS $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'product_modifiers') THEN
    CREATE TABLE product_modifiers (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name TEXT NOT NULL,
      type TEXT NOT NULL CHECK (type IN ('size', 'color')),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      UNIQUE(name, type)
    );
  END IF;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION create_product_variants_table_if_not_exists()
RETURNS VOID AS $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'product_variants') THEN
    CREATE TABLE product_variants (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
      sku TEXT NOT NULL,
      size_id UUID REFERENCES product_modifiers(id),
      color_id UUID REFERENCES product_modifiers(id),
      stock_level INTEGER DEFAULT 0,
      reorder_point INTEGER DEFAULT 5,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      UNIQUE(product_id, sku)
    );
  END IF;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION create_price_lists_table_if_not_exists()
RETURNS VOID AS $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'price_lists') THEN
    CREATE TABLE price_lists (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name TEXT NOT NULL,
      description TEXT,
      is_default BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  END IF;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION create_price_list_items_table_if_not_exists()
RETURNS VOID AS $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'price_list_items') THEN
    CREATE TABLE price_list_items (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      price_list_id UUID NOT NULL REFERENCES price_lists(id) ON DELETE CASCADE,
      product_variant_id UUID NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
      price DECIMAL(10, 2) NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      UNIQUE(price_list_id, product_variant_id)
    );
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Enable realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE products;
ALTER PUBLICATION supabase_realtime ADD TABLE product_modifiers;
ALTER PUBLICATION supabase_realtime ADD TABLE product_variants;
ALTER PUBLICATION supabase_realtime ADD TABLE price_lists;
ALTER PUBLICATION supabase_realtime ADD TABLE price_list_items;
