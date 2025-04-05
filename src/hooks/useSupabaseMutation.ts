import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { PostgrestError } from "@supabase/supabase-js";

type MutationOptions<T, R> = {
  onSuccess?: (data: R) => void;
  onError?: (error: PostgrestError) => void;
};

export function useSupabaseMutation<T, R = any>(
  mutationFn: (
    variables: T,
  ) => Promise<{ data: R | null; error: PostgrestError | null }>,
  options: MutationOptions<T, R> = {},
) {
  const { onSuccess, onError } = options;

  const [data, setData] = useState<R | null>(null);
  const [error, setError] = useState<PostgrestError | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function mutate(variables: T) {
    setIsLoading(true);
    try {
      const { data: responseData, error: responseError } =
        await mutationFn(variables);

      if (responseError) {
        console.error("Supabase mutation error:", responseError);
        setError(responseError);
        onError?.(responseError);
        return { data: null, error: responseError };
      } else {
        setData(responseData);
        onSuccess?.(responseData as R);
        return { data: responseData, error: null };
      }
    } catch (err) {
      console.error("Error in useSupabaseMutation:", err);
      return { data: null, error: err as PostgrestError };
    } finally {
      setIsLoading(false);
    }
  }

  return { mutate, data, error, isLoading };
}
