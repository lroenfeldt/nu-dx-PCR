import { useState } from "react";
import { ApiResponse } from "apisauce";

interface ApiHookReturn<T> {
  data: T | null;
  error: boolean;
  loading: boolean;
  request: (...args: any[]) => Promise<ApiResponse<T>>;
}

export default function useApi<T>(
  apiFunc: (...args: any[]) => Promise<ApiResponse<T>>
): ApiHookReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const request = async (...args: any[]): Promise<ApiResponse<T>> => {
    setLoading(true);
    const response = await apiFunc(...args);
    setLoading(false);

    if (response.ok) {
      setData(response.data || null);
    } else {
      setError(true);
      setData(null);
    }

    return response;
  };

  return { data, error, loading, request };
}
