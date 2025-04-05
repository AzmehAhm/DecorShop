import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { PostgrestError } from "@supabase/supabase-js";

type QueryOptions<T> = {
  initialData?: T;
  onSuccess?: (data: T) => void;
  onError?: (error: PostgrestError) => void;
  enabled?: boolean;
};

export function useSupabaseQuery<T>(
  queryFn: () => Promise<{ data: T | null; error: PostgrestError | null }>,
  options: QueryOptions<T> = {},
) {
  const { initialData, onSuccess, onError, enabled = true } = options;

  const [data, setData] = useState<T | null>(initialData || null);
  const [error, setError] = useState<PostgrestError | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(enabled);

  async function fetchData() {
    if (!enabled) return;

    setIsLoading(true);
    try {
      const { data: responseData, error: responseError } = await queryFn();

      if (responseError) {
        console.error("Supabase query error:", responseError);
        setError(responseError);
        onError?.(responseError);
      } else {
        setData(responseData as T);
        onSuccess?.(responseData as T);
      }
    } catch (err) {
      console.error("Error in useSupabaseQuery:", err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [enabled]);

  const refetch = () => fetchData();

  return { data, error, isLoading, refetch };
}
