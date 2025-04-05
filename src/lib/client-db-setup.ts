import { supabase } from "./supabase";

// This function will check if the database tables exist and create them if needed
export async function setupClientDatabase() {
  try {
    console.log("Checking database setup...");

    // Check if products table exists
    const { count, error: checkError } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true });

    if (checkError) {
      console.log("Database tables don't exist, creating them...");
      await createTables();
      await insertDefaultData();
      console.log("Database setup complete");
    } else {
      console.log("Database tables already exist");
    }

    return { success: true };
  } catch (error) {
    console.error("Error setting up database:", error);
    return { success: false, error };
  }
}

async function createTables() {
  // Create products table
  await supabase.rpc("create_products_table_if_not_exists");

  // Create product modifiers table
  await supabase.rpc("create_product_modifiers_table_if_not_exists");

  // Create product variants table
  await supabase.rpc("create_product_variants_table_if_not_exists");

  // Create price lists table
  await supabase.rpc("create_price_lists_table_if_not_exists");

  // Create price list items table
  await supabase.rpc("create_price_list_items_table_if_not_exists");
}

async function insertDefaultData() {
  // Insert default price list
  await supabase
    .from("price_lists")
    .upsert([{ name: "Default", is_default: true }]);

  // Insert default size modifiers
  await supabase.from("product_modifiers").upsert([
    { name: "Small", type: "size" },
    { name: "Medium", type: "size" },
    { name: "Large", type: "size" },
    { name: "X-Large", type: "size" },
  ]);

  // Insert default color modifiers
  await supabase.from("product_modifiers").upsert([
    { name: "Red", type: "color" },
    { name: "Blue", type: "color" },
    { name: "Green", type: "color" },
    { name: "Black", type: "color" },
    { name: "White", type: "color" },
  ]);
}
