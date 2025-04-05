import { supabase } from "@/lib/supabase";

export interface Invoice {
  id: string;
  customer_id: string;
  date: string;
  due_date?: string;
  status:
    | "draft"
    | "sent"
    | "paid"
    | "overdue"
    | "cancelled"
    | "partially_paid";
  total: number;
  price_list_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface InvoiceItem {
  id: string;
  invoice_id: string;
  product_variant_id: string;
  quantity: number;
  unit_price: number;
  discount?: number;
  tax_rate?: number;
  created_at?: string;
  updated_at?: string;
}

export interface InvoiceWithItems extends Invoice {
  items: InvoiceItem[];
  customer?: {
    id: string;
    name: string;
    email?: string;
  };
}

// Get all invoices
export async function getInvoices() {
  const { data: invoices, error } = await supabase
    .from("invoices")
    .select("*, customers(id, name, email)")
    .order("date", { ascending: false });

  if (error) {
    console.error("Error fetching invoices:", error);
    return { data: null, error };
  }

  // Format the response to match our interface
  const formattedInvoices = invoices.map((invoice) => ({
    ...invoice,
    customer: invoice.customers,
  }));

  return { data: formattedInvoices, error: null };
}

// Get a single invoice with items
export async function getInvoice(id: string) {
  const { data: invoice, error } = await supabase
    .from("invoices")
    .select("*, customers(id, name, email)")
    .eq("id", id)
    .single();

  if (error) {
    console.error(`Error fetching invoice ${id}:`, error);
    return { data: null, error };
  }

  // Get items for this invoice
  const { data: items, error: itemsError } = await supabase
    .from("invoice_items")
    .select("*, product_variants(id, sku, product_id, products(name))")
    .eq("invoice_id", id);

  if (itemsError) {
    console.error(`Error fetching items for invoice ${id}:`, itemsError);
    return { data: invoice, error: itemsError };
  }

  // Format the response
  const formattedInvoice = {
    ...invoice,
    customer: invoice.customers,
    items: items || [],
  };

  return { data: formattedInvoice, error: null };
}

// Create a new invoice with items
export async function createInvoice(
  invoice: Omit<Invoice, "id" | "created_at" | "updated_at">,
  items: Omit<InvoiceItem, "id" | "invoice_id" | "created_at" | "updated_at">[],
) {
  // Start a transaction
  const { data: newInvoice, error: invoiceError } = await supabase
    .from("invoices")
    .insert(invoice)
    .select()
    .single();

  if (invoiceError) {
    console.error("Error creating invoice:", invoiceError);
    return { data: null, error: invoiceError };
  }

  // Add invoice_id to items
  const itemsWithInvoiceId = items.map((item) => ({
    ...item,
    invoice_id: newInvoice.id,
  }));

  // Insert items
  const { data: newItems, error: itemsError } = await supabase
    .from("invoice_items")
    .insert(itemsWithInvoiceId)
    .select();

  if (itemsError) {
    console.error("Error creating invoice items:", itemsError);
    return { data: { ...newInvoice, items: [] }, error: itemsError };
  }

  // Update product variant stock levels
  for (const item of items) {
    const { data: variant, error: variantError } = await supabase
      .from("product_variants")
      .select("stock_level")
      .eq("id", item.product_variant_id)
      .single();

    if (variantError) {
      console.error(
        `Error fetching variant ${item.product_variant_id}:`,
        variantError,
      );
      continue;
    }

    const newStockLevel = Math.max(
      0,
      (variant.stock_level || 0) - item.quantity,
    );

    const { error: updateError } = await supabase
      .from("product_variants")
      .update({ stock_level: newStockLevel })
      .eq("id", item.product_variant_id);

    if (updateError) {
      console.error(
        `Error updating stock level for variant ${item.product_variant_id}:`,
        updateError,
      );
    }
  }

  return { data: { ...newInvoice, items: newItems || [] }, error: null };
}

// Update an invoice and its items
export async function updateInvoice(
  id: string,
  invoice: Partial<Invoice>,
  items?: (Partial<InvoiceItem> & { id: string })[],
  newItems?: Omit<
    InvoiceItem,
    "id" | "invoice_id" | "created_at" | "updated_at"
  >[],
  deletedItemIds?: string[],
) {
  // Update invoice
  const { data: updatedInvoice, error: invoiceError } = await supabase
    .from("invoices")
    .update(invoice)
    .eq("id", id)
    .select()
    .single();

  if (invoiceError) {
    console.error(`Error updating invoice ${id}:`, invoiceError);
    return { data: null, error: invoiceError };
  }

  // Update existing items if provided
  if (items && items.length > 0) {
    for (const item of items) {
      const { id: itemId, ...itemData } = item;
      const { error: itemError } = await supabase
        .from("invoice_items")
        .update(itemData)
        .eq("id", itemId);

      if (itemError) {
        console.error(`Error updating invoice item ${itemId}:`, itemError);
      }
    }
  }

  // Add new items if provided
  if (newItems && newItems.length > 0) {
    const itemsWithInvoiceId = newItems.map((item) => ({
      ...item,
      invoice_id: id,
    }));

    const { error: newItemsError } = await supabase
      .from("invoice_items")
      .insert(itemsWithInvoiceId);

    if (newItemsError) {
      console.error(`Error adding new items to invoice ${id}:`, newItemsError);
    }

    // Update product variant stock levels for new items
    for (const item of newItems) {
      const { data: variant, error: variantError } = await supabase
        .from("product_variants")
        .select("stock_level")
        .eq("id", item.product_variant_id)
        .single();

      if (variantError) {
        console.error(
          `Error fetching variant ${item.product_variant_id}:`,
          variantError,
        );
        continue;
      }

      const newStockLevel = Math.max(
        0,
        (variant.stock_level || 0) - item.quantity,
      );

      const { error: updateError } = await supabase
        .from("product_variants")
        .update({ stock_level: newStockLevel })
        .eq("id", item.product_variant_id);

      if (updateError) {
        console.error(
          `Error updating stock level for variant ${item.product_variant_id}:`,
          updateError,
        );
      }
    }
  }

  // Delete items if provided
  if (deletedItemIds && deletedItemIds.length > 0) {
    // First, get the items to restore stock
    const { data: itemsToDelete, error: fetchError } = await supabase
      .from("invoice_items")
      .select("*")
      .in("id", deletedItemIds);

    if (fetchError) {
      console.error(
        `Error fetching items to delete for invoice ${id}:`,
        fetchError,
      );
    } else if (itemsToDelete) {
      // Restore stock for deleted items
      for (const item of itemsToDelete) {
        const { data: variant, error: variantError } = await supabase
          .from("product_variants")
          .select("stock_level")
          .eq("id", item.product_variant_id)
          .single();

        if (variantError) {
          console.error(
            `Error fetching variant ${item.product_variant_id}:`,
            variantError,
          );
          continue;
        }

        const newStockLevel = (variant.stock_level || 0) + item.quantity;

        const { error: updateError } = await supabase
          .from("product_variants")
          .update({ stock_level: newStockLevel })
          .eq("id", item.product_variant_id);

        if (updateError) {
          console.error(
            `Error updating stock level for variant ${item.product_variant_id}:`,
            updateError,
          );
        }
      }
    }

    // Now delete the items
    const { error: deleteError } = await supabase
      .from("invoice_items")
      .delete()
      .in("id", deletedItemIds);

    if (deleteError) {
      console.error(`Error deleting items from invoice ${id}:`, deleteError);
    }
  }

  // Get updated invoice with items
  return getInvoice(id);
}

// Delete an invoice and its items
export async function deleteInvoice(id: string) {
  // Get items to restore stock
  const { data: items, error: itemsError } = await supabase
    .from("invoice_items")
    .select("*")
    .eq("invoice_id", id);

  if (itemsError) {
    console.error(`Error fetching items for invoice ${id}:`, itemsError);
  } else if (items) {
    // Restore stock for all items
    for (const item of items) {
      const { data: variant, error: variantError } = await supabase
        .from("product_variants")
        .select("stock_level")
        .eq("id", item.product_variant_id)
        .single();

      if (variantError) {
        console.error(
          `Error fetching variant ${item.product_variant_id}:`,
          variantError,
        );
        continue;
      }

      const newStockLevel = (variant.stock_level || 0) + item.quantity;

      const { error: updateError } = await supabase
        .from("product_variants")
        .update({ stock_level: newStockLevel })
        .eq("id", item.product_variant_id);

      if (updateError) {
        console.error(
          `Error updating stock level for variant ${item.product_variant_id}:`,
          updateError,
        );
      }
    }
  }

  // Delete items
  const { error: deleteItemsError } = await supabase
    .from("invoice_items")
    .delete()
    .eq("invoice_id", id);

  if (deleteItemsError) {
    console.error(`Error deleting items for invoice ${id}:`, deleteItemsError);
  }

  // Delete invoice
  const { error: deleteInvoiceError } = await supabase
    .from("invoices")
    .delete()
    .eq("id", id);

  if (deleteInvoiceError) {
    console.error(`Error deleting invoice ${id}:`, deleteInvoiceError);
    return { data: null, error: deleteInvoiceError };
  }

  return { data: { id }, error: null };
}
