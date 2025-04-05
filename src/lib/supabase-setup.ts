import { supabase } from "./supabase";

// This function will set up the database schema programmatically
// instead of using SQL migrations directly
export async function setupDatabase() {
  try {
    console.log("Setting up database schema...");

    // Create products table
    await supabase.rpc("create_products_table_if_not_exists", {});

    // Create product modifiers table
    await supabase.rpc("create_product_modifiers_table_if_not_exists", {});

    // Create product variants table
    await supabase.rpc("create_product_variants_table_if_not_exists", {});

    // Create price lists table
    await supabase.rpc("create_price_lists_table_if_not_exists", {});

    // Create price list items table
    await supabase.rpc("create_price_list_items_table_if_not_exists", {});

    // Insert default data
    await insertDefaultData();

    console.log("Database setup complete");
    return { success: true, error: null };
  } catch (error) {
    console.error("Error setting up database:", error);
    return { success: false, error };
  }
}

async function insertDefaultData() {
  // Insert default price list if it doesn't exist
  const { error: priceListError } = await supabase
    .from("price_lists")
    .upsert([{ id: "default", name: "Standard Pricing", is_default: true }], {
      onConflict: "id",
    });

  if (priceListError) {
    console.error("Error inserting default price list:", priceListError);
  }

  // Insert default modifiers if they don't exist
  const sizeModifiers = [
    { name: "Small", type: "size" },
    { name: "Medium", type: "size" },
    { name: "Large", type: "size" },
    { name: "X-Large", type: "size" },
  ];

  const colorModifiers = [
    { name: "Red", type: "color" },
    { name: "Blue", type: "color" },
    { name: "Green", type: "color" },
    { name: "Black", type: "color" },
    { name: "White", type: "color" },
  ];

  const { error: modifiersError } = await supabase
    .from("product_modifiers")
    .upsert([...sizeModifiers, ...colorModifiers], { onConflict: "name,type" });

  if (modifiersError) {
    console.error("Error inserting default modifiers:", modifiersError);
  }
}
