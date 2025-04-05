import { supabase } from "@/lib/supabase";
import { Tables } from "@/types/supabase";

export type Customer = Tables<"customers">;

export interface CustomerWithBalance extends Customer {
  balance: number;
  status: "active" | "inactive" | "overdue";
  lastTransaction?: string;
}

// Get all customers with their balances
export async function getCustomers() {
  const { data: customers, error } = await supabase
    .from("customers")
    .select("*")
    .order("name");

  if (error) {
    console.error("Error fetching customers:", error);
    return { data: null, error };
  }

  // Get invoices to calculate balances
  const { data: invoices, error: invoicesError } = await supabase
    .from("invoices")
    .select("*");

  if (invoicesError) {
    console.error("Error fetching invoices:", invoicesError);
    return { data: customers, error: invoicesError };
  }

  // Calculate balances and determine status
  const customersWithBalances = customers.map((customer) => {
    const customerInvoices = invoices.filter(
      (inv) => inv.customer_id === customer.id,
    );
    const balance = customerInvoices.reduce(
      (sum, inv) => sum + (inv.total || 0),
      0,
    );

    // Determine status based on balance and invoice dates
    let status: "active" | "inactive" | "overdue" = "active";
    let lastTransaction: string | undefined;

    if (customerInvoices.length === 0) {
      status = "inactive";
    } else {
      // Sort invoices by date descending
      const sortedInvoices = [...customerInvoices].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      );

      lastTransaction = sortedInvoices[0]?.date;

      // Check for overdue invoices (due_date is in the past)
      const hasOverdue = sortedInvoices.some((inv) => {
        if (!inv.due_date) return false;
        return new Date(inv.due_date) < new Date() && inv.status !== "paid";
      });

      if (hasOverdue) {
        status = "overdue";
      } else if (
        new Date(lastTransaction) <
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      ) {
        // Inactive if no transactions in the last 30 days
        status = "inactive";
      }
    }

    return {
      ...customer,
      balance,
      status,
      lastTransaction,
    };
  });

  return { data: customersWithBalances, error: null };
}

// Get a single customer with their balance
export async function getCustomer(id: string) {
  const { data: customer, error } = await supabase
    .from("customers")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(`Error fetching customer ${id}:`, error);
    return { data: null, error };
  }

  // Get invoices for this customer
  const { data: invoices, error: invoicesError } = await supabase
    .from("invoices")
    .select("*")
    .eq("customer_id", id);

  if (invoicesError) {
    console.error(`Error fetching invoices for customer ${id}:`, invoicesError);
    return { data: customer, error: invoicesError };
  }

  // Calculate balance
  const balance =
    invoices?.reduce((sum, inv) => sum + (inv.total || 0), 0) || 0;

  // Determine status
  let status: "active" | "inactive" | "overdue" = "active";
  let lastTransaction: string | undefined;

  if (!invoices || invoices.length === 0) {
    status = "inactive";
  } else {
    // Sort invoices by date descending
    const sortedInvoices = [...invoices].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

    lastTransaction = sortedInvoices[0]?.date;

    // Check for overdue invoices
    const hasOverdue = sortedInvoices.some((inv) => {
      if (!inv.due_date) return false;
      return new Date(inv.due_date) < new Date() && inv.status !== "paid";
    });

    if (hasOverdue) {
      status = "overdue";
    } else if (
      lastTransaction &&
      new Date(lastTransaction) <
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    ) {
      status = "inactive";
    }
  }

  return {
    data: {
      ...customer,
      balance,
      status,
      lastTransaction,
      invoices: invoices || [],
    },
    error: null,
  };
}

// Create a new customer
export async function createCustomer(
  customer: Omit<Customer, "id" | "created_at" | "updated_at">,
) {
  const { data, error } = await supabase
    .from("customers")
    .insert(customer)
    .select()
    .single();

  return { data, error };
}

// Update a customer
export async function updateCustomer(id: string, customer: Partial<Customer>) {
  const { data, error } = await supabase
    .from("customers")
    .update(customer)
    .eq("id", id)
    .select()
    .single();

  return { data, error };
}

// Delete a customer
export async function deleteCustomer(id: string) {
  // Check if customer has invoices
  const { data: invoices, error: invoicesError } = await supabase
    .from("invoices")
    .select("id")
    .eq("customer_id", id);

  if (invoicesError) {
    console.error(`Error checking invoices for customer ${id}:`, invoicesError);
    return { data: null, error: invoicesError };
  }

  if (invoices && invoices.length > 0) {
    return {
      data: null,
      error: {
        message: `Cannot delete customer with ${invoices.length} invoices. Please delete invoices first.`,
        code: "CUSTOMER_HAS_INVOICES",
      } as any,
    };
  }

  const { error } = await supabase.from("customers").delete().eq("id", id);

  if (error) {
    console.error(`Error deleting customer ${id}:`, error);
    return { data: null, error };
  }

  return { data: { id }, error: null };
}
