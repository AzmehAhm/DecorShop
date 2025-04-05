-- Fix for tables already in realtime publication
-- This migration checks if tables are already in the publication before adding them

DO $$
DECLARE
  table_exists BOOLEAN;
BEGIN
  -- Check if suppliers is already in the publication
  SELECT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'suppliers'
  ) INTO table_exists;
  
  IF NOT table_exists THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE suppliers';
  END IF;
  
  -- Check if purchase_orders is already in the publication
  SELECT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'purchase_orders'
  ) INTO table_exists;
  
  IF NOT table_exists THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE purchase_orders';
  END IF;
  
  -- Check if purchase_order_items is already in the publication
  SELECT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'purchase_order_items'
  ) INTO table_exists;
  
  IF NOT table_exists THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE purchase_order_items';
  END IF;
  
  -- Check if invoice_items is already in the publication
  SELECT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'invoice_items'
  ) INTO table_exists;
  
  IF NOT table_exists THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE invoice_items';
  END IF;
END
$$;