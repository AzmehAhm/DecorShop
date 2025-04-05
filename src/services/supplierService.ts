import { supabase } from "@/lib/supabase";

export interface Supplier {
  id: string;
  name: string;
  contact_person: string;
  email: string;
  phone: string;
  address: string;
  status: "active" | "inactive";
  notes: string;
  created_at?: string;
  updated_at?: string;
}

export interface PurchaseOrder {
  id: string;
  supplier_id: string;
  date: string;
  status: "pending" | "received" | "partial" | "cancelled";
  total: number;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

// Get all suppliers
export async function getSuppliers() {
  const { data, error } = await supabase
    .from("suppliers")
    .select("*")
    .order("name");

  return { data, error };
}

// Get a single supplier with purchase history
export async function getSupplier(id: string) {
  const { data: supplier, error } = await supabase
    .from("suppliers")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(`Error fetching supplier ${id}:`, error);
    return { data: null, error };
  }

  // Get purchase orders for this supplier
  const { data: purchaseOrders, error: purchaseOrdersError } = await supabase
    .from("purchase_orders")
    .select("*")
    .eq("supplier_id", id)
    .order("date", { ascending: false });

  if (purchaseOrdersError) {
    console.error(
      `Error fetching purchase orders for supplier ${id}:`,
      purchaseOrdersError,
    );
    return { data: supplier, error: purchaseOrdersError };
  }

  return {
    data: {
      ...supplier,
      purchaseOrders: purchaseOrders || [],
    },
    error: null,
  };
}

// Create a new supplier
export async function createSupplier(
  supplier: Omit<Supplier, "id" | "created_at" | "updated_at">,
) {
  const { data, error } = await supabase
    .from("suppliers")
    .insert(supplier)
    .select()
    .single();

  return { data, error };
}

// Update a supplier
export async function updateSupplier(id: string, supplier: Partial<Supplier>) {
  const { data, error } = await supabase
    .from("suppliers")
    .update(supplier)
    .eq("id", id)
    .select()
    .single();

  return { data, error };
}

// Delete a supplier
export async function deleteSupplier(id: string) {
  // Check if supplier has purchase orders
  const { data: purchaseOrders, error: purchaseOrdersError } = await supabase
    .from("purchase_orders")
    .select("id")
    .eq("supplier_id", id);

  if (purchaseOrdersError) {
    console.error(
      `Error checking purchase orders for supplier ${id}:`,
      purchaseOrdersError,
    );
    return { data: null, error: purchaseOrdersError };
  }

  if (purchaseOrders && purchaseOrders.length > 0) {
    return {
      data: null,
      error: {
        message: `Cannot delete supplier with ${purchaseOrders.length} purchase orders. Please delete purchase orders first.`,
        code: "SUPPLIER_HAS_PURCHASE_ORDERS",
      } as any,
    };
  }

  const { error } = await supabase.from("suppliers").delete().eq("id", id);

  if (error) {
    console.error(`Error deleting supplier ${id}:`, error);
    return { data: null, error };
  }

  return { data: { id }, error: null };
}
