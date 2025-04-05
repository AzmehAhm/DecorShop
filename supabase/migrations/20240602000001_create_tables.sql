-- Create suppliers table
CREATE TABLE IF NOT EXISTS suppliers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  contact_person TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  status TEXT DEFAULT 'active',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create purchase_orders table
CREATE TABLE IF NOT EXISTS purchase_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  supplier_id UUID REFERENCES suppliers(id),
  date DATE NOT NULL,
  status TEXT DEFAULT 'pending',
  total DECIMAL(10, 2) DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create purchase_order_items table
CREATE TABLE IF NOT EXISTS purchase_order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  purchase_order_id UUID REFERENCES purchase_orders(id),
  product_variant_id UUID REFERENCES product_variants(id),
  quantity INTEGER NOT NULL,
  unit_cost DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create invoice_items table
CREATE TABLE IF NOT EXISTS invoice_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_id UUID REFERENCES invoices(id),
  product_variant_id UUID REFERENCES product_variants(id),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  discount DECIMAL(10, 2) DEFAULT 0,
  tax_rate DECIMAL(5, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Public access to suppliers" ON suppliers;
CREATE POLICY "Public access to suppliers"
  ON suppliers FOR ALL
  USING (true);

DROP POLICY IF EXISTS "Public access to purchase_orders" ON purchase_orders;
CREATE POLICY "Public access to purchase_orders"
  ON purchase_orders FOR ALL
  USING (true);

DROP POLICY IF EXISTS "Public access to purchase_order_items" ON purchase_order_items;
CREATE POLICY "Public access to purchase_order_items"
  ON purchase_order_items FOR ALL
  USING (true);

DROP POLICY IF EXISTS "Public access to invoice_items" ON invoice_items;
CREATE POLICY "Public access to invoice_items"
  ON invoice_items FOR ALL
  USING (true);

-- Enable realtime
alter publication supabase_realtime add table suppliers;
alter publication supabase_realtime add table purchase_orders;
alter publication supabase_realtime add table purchase_order_items;
alter publication supabase_realtime add table invoice_items;
