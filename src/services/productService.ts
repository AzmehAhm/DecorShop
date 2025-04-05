import { supabase } from "@/lib/supabase";
import {
  Product,
  ProductModifier,
  ProductVariant,
  PriceListItem,
} from "@/types/product";

// Get all products with their variants
export async function getProducts() {
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .order("name");

  if (error) {
    console.error("Error fetching products:", error);
    return { data: null, error };
  }

  // Get variants for all products
  const { data: variants, error: variantsError } = await supabase
    .from("product_variants")
    .select("*");

  if (variantsError) {
    console.error("Error fetching variants:", variantsError);
    return { data: products, error: variantsError };
  }

  // Get default price list
  const { data: defaultPriceList, error: priceListError } = await supabase
    .from("price_lists")
    .select("id")
    .eq("is_default", true)
    .single();

  if (priceListError && priceListError.code !== "PGRST116") {
    // PGRST116 is "no rows returned"
    console.error("Error fetching default price list:", priceListError);
  }

  // Get prices for variants if we have a default price list
  let priceItems: PriceListItem[] = [];
  if (defaultPriceList) {
    const { data: prices, error: pricesError } = await supabase
      .from("price_list_items")
      .select("*")
      .eq("price_list_id", defaultPriceList.id);

    if (pricesError) {
      console.error("Error fetching prices:", pricesError);
    } else if (prices) {
      priceItems = prices;
    }
  }

  // Group variants by product_id
  const variantsByProduct: Record<string, ProductVariant[]> = {};
  variants?.forEach((variant) => {
    if (!variantsByProduct[variant.product_id]) {
      variantsByProduct[variant.product_id] = [];
    }
    variantsByProduct[variant.product_id].push(variant);
  });

  // Attach variants to products
  const productsWithVariants = products?.map((product) => {
    const productVariants = variantsByProduct[product.id] || [];

    // Calculate product status based on variants stock levels
    let status = "In Stock";
    if (productVariants.length > 0) {
      const totalStock = productVariants.reduce(
        (sum, v) => sum + (v.stock_level || 0),
        0,
      );
      const anyBelowReorder = productVariants.some(
        (v) =>
          (v.stock_level || 0) <= (v.reorder_point || 0) &&
          (v.stock_level || 0) > 0,
      );
      const anyOutOfStock = productVariants.some(
        (v) => (v.stock_level || 0) === 0,
      );

      if (totalStock === 0) {
        status = "Out of Stock";
      } else if (anyBelowReorder || anyOutOfStock) {
        status = "Low Stock";
      }
    }

    // Find the lowest price among variants for this product
    let lowestPrice: number | undefined;
    productVariants.forEach((variant) => {
      const priceItem = priceItems.find(
        (p) => p.product_variant_id === variant.id,
      );
      if (
        priceItem &&
        (lowestPrice === undefined || priceItem.price < lowestPrice)
      ) {
        lowestPrice = priceItem.price;
      }
    });

    return {
      ...product,
      variants: productVariants,
      price: lowestPrice,
      status,
    };
  });

  return { data: productsWithVariants, error: null };
}

// Get a single product with its variants
export async function getProduct(id: string) {
  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(`Error fetching product ${id}:`, error);
    return { data: null, error };
  }

  // Get variants for this product
  const { data: variants, error: variantsError } = await supabase
    .from("product_variants")
    .select("*")
    .eq("product_id", id);

  if (variantsError) {
    console.error(`Error fetching variants for product ${id}:`, variantsError);
    return { data: product, error: variantsError };
  }

  // Get default price list
  const { data: defaultPriceList, error: priceListError } = await supabase
    .from("price_lists")
    .select("id")
    .eq("is_default", true)
    .single();

  if (priceListError && priceListError.code !== "PGRST116") {
    console.error("Error fetching default price list:", priceListError);
  }

  // Get prices for variants if we have a default price list
  if (defaultPriceList && variants) {
    const variantIds = variants.map((v) => v.id);
    const { data: prices, error: pricesError } = await supabase
      .from("price_list_items")
      .select("*")
      .eq("price_list_id", defaultPriceList.id)
      .in("product_variant_id", variantIds);

    if (pricesError) {
      console.error(`Error fetching prices for product ${id}:`, pricesError);
    } else if (prices) {
      // Attach prices to variants
      variants.forEach((variant) => {
        const priceItem = prices.find(
          (p) => p.product_variant_id === variant.id,
        );
        if (priceItem) {
          (variant as any).price = priceItem.price;
        }
      });
    }
  }

  return {
    data: {
      ...product,
      variants: variants || [],
    },
    error: null,
  };
}

// Create a new product with variants
export async function createProduct(
  product: Omit<Product, "id" | "created_at" | "updated_at">,
  variants: Omit<
    ProductVariant,
    "id" | "product_id" | "created_at" | "updated_at"
  >[],
  prices?: { variantIndex: number; price: number }[],
) {
  // Validate variants have valid size_id values
  const invalidVariants = variants.filter((v) => !v.size_id);
  if (invalidVariants.length > 0) {
    console.error("Invalid variants with missing size_id:", invalidVariants);
    return {
      data: null,
      error: {
        message: "All variants must have a valid size_id",
        code: "VALIDATION_ERROR",
      } as any,
    };
  }

  // Start a transaction
  const { data: newProduct, error: productError } = await supabase
    .from("products")
    .insert(product)
    .select()
    .single();

  if (productError) {
    console.error("Error creating product:", productError);
    return { data: null, error: productError };
  }

  // Add product_id to variants
  const variantsWithProductId = variants.map((variant) => ({
    ...variant,
    product_id: newProduct.id,
  }));

  // Insert variants
  const { data: newVariants, error: variantsError } = await supabase
    .from("product_variants")
    .insert(variantsWithProductId)
    .select();

  if (variantsError) {
    console.error("Error creating variants:", variantsError);
    // Clean up the created product since variants failed
    await supabase.from("products").delete().eq("id", newProduct.id);
    return { data: null, error: variantsError };
  }

  // If we have prices, insert them
  if (prices && prices.length > 0 && newVariants) {
    // Get default price list
    const { data: defaultPriceList, error: priceListError } = await supabase
      .from("price_lists")
      .select("id")
      .eq("is_default", true)
      .single();

    if (priceListError && priceListError.code !== "PGRST116") {
      console.error("Error fetching default price list:", priceListError);
    }

    // Create default price list if it doesn't exist
    let priceListId = defaultPriceList?.id;
    if (!priceListId) {
      const { data: newPriceList, error: newPriceListError } = await supabase
        .from("price_lists")
        .insert({
          name: "Default",
          is_default: true,
        })
        .select()
        .single();

      if (newPriceListError) {
        console.error("Error creating default price list:", newPriceListError);
      } else {
        priceListId = newPriceList.id;
      }
    }

    if (priceListId) {
      const priceItems = prices.map((p) => ({
        price_list_id: priceListId!,
        product_variant_id: newVariants[p.variantIndex].id,
        price: p.price,
      }));

      const { error: pricesError } = await supabase
        .from("price_list_items")
        .insert(priceItems);

      if (pricesError) {
        console.error("Error creating price items:", pricesError);
      }
    }
  }

  return { data: { ...newProduct, variants: newVariants || [] }, error: null };
}

// Update a product and its variants
export async function updateProduct(
  id: string,
  product: Partial<Product>,
  variants?: (Partial<ProductVariant> & { id: string })[],
  prices?: { variant_id: string; price: number }[],
) {
  // Update product
  const { data: updatedProduct, error: productError } = await supabase
    .from("products")
    .update(product)
    .eq("id", id)
    .select()
    .single();

  if (productError) {
    console.error(`Error updating product ${id}:`, productError);
    return { data: null, error: productError };
  }

  // Update variants if provided
  if (variants && variants.length > 0) {
    for (const variant of variants) {
      const { id: variantId, ...variantData } = variant;
      const { error: variantError } = await supabase
        .from("product_variants")
        .update(variantData)
        .eq("id", variantId);

      if (variantError) {
        console.error(`Error updating variant ${variantId}:`, variantError);
      }
    }
  }

  // Update prices if provided
  if (prices && prices.length > 0) {
    // Get default price list
    const { data: defaultPriceList, error: priceListError } = await supabase
      .from("price_lists")
      .select("id")
      .eq("is_default", true)
      .single();

    if (priceListError && priceListError.code !== "PGRST116") {
      console.error("Error fetching default price list:", priceListError);
    }

    if (defaultPriceList) {
      for (const price of prices) {
        // Check if price already exists
        const { data: existingPrice, error: existingPriceError } =
          await supabase
            .from("price_list_items")
            .select("id")
            .eq("price_list_id", defaultPriceList.id)
            .eq("product_variant_id", price.variant_id)
            .single();

        if (existingPriceError && existingPriceError.code !== "PGRST116") {
          console.error("Error checking existing price:", existingPriceError);
        }

        if (existingPrice) {
          // Update existing price
          const { error: updatePriceError } = await supabase
            .from("price_list_items")
            .update({ price: price.price })
            .eq("id", existingPrice.id);

          if (updatePriceError) {
            console.error(
              `Error updating price for variant ${price.variant_id}:`,
              updatePriceError,
            );
          }
        } else {
          // Insert new price
          const { error: insertPriceError } = await supabase
            .from("price_list_items")
            .insert({
              price_list_id: defaultPriceList.id,
              product_variant_id: price.variant_id,
              price: price.price,
            });

          if (insertPriceError) {
            console.error(
              `Error inserting price for variant ${price.variant_id}:`,
              insertPriceError,
            );
          }
        }
      }
    }
  }

  // Get updated product with variants
  return getProduct(id);
}

// Delete a product and its variants
export async function deleteProduct(id: string) {
  // Get variants for this product
  const { data: variants, error: variantsError } = await supabase
    .from("product_variants")
    .select("id")
    .eq("product_id", id);

  if (variantsError) {
    console.error(`Error fetching variants for product ${id}:`, variantsError);
  }

  // Delete price list items for these variants
  if (variants && variants.length > 0) {
    const variantIds = variants.map((v) => v.id);
    const { error: pricesError } = await supabase
      .from("price_list_items")
      .delete()
      .in("product_variant_id", variantIds);

    if (pricesError) {
      console.error(`Error deleting prices for product ${id}:`, pricesError);
    }
  }

  // Delete variants
  const { error: deleteVariantsError } = await supabase
    .from("product_variants")
    .delete()
    .eq("product_id", id);

  if (deleteVariantsError) {
    console.error(
      `Error deleting variants for product ${id}:`,
      deleteVariantsError,
    );
  }

  // Delete product
  const { error: deleteProductError } = await supabase
    .from("products")
    .delete()
    .eq("id", id);

  if (deleteProductError) {
    console.error(`Error deleting product ${id}:`, deleteProductError);
    return { data: null, error: deleteProductError };
  }

  return { data: { id }, error: null };
}

// Get all product modifiers
export async function getProductModifiers() {
  const { data, error } = await supabase
    .from("product_modifiers")
    .select("*")
    .order("name");

  return { data, error };
}

// Create a new product modifier
export async function createProductModifier(
  modifier: Omit<ProductModifier, "id" | "created_at" | "updated_at">,
) {
  const { data, error } = await supabase
    .from("product_modifiers")
    .insert(modifier)
    .select()
    .single();

  return { data, error };
}

// Update a product modifier
export async function updateProductModifier(
  id: string,
  modifier: Partial<ProductModifier>,
) {
  const { data, error } = await supabase
    .from("product_modifiers")
    .update(modifier)
    .eq("id", id)
    .select()
    .single();

  return { data, error };
}

// Delete a product modifier
export async function deleteProductModifier(id: string) {
  const { error } = await supabase
    .from("product_modifiers")
    .delete()
    .eq("id", id);

  return { data: { id }, error };
}
