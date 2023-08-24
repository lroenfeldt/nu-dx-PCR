import { useState } from "react";

interface ApiResponse<T> {
    data: T[];
    ok: boolean;
}

interface ApiHookReturn<T> {
    data: T[];
    error: boolean;
    loading: boolean;
    request: (...args: any[]) => Promise<ApiResponse<T>>;
}

export default function useApi<T>(apiFunc: (...args: any[]) => Promise<ApiResponse<T>>): ApiHookReturn<T> {
    const [data, setData] = useState<T[]>([]);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    /**
     * invokes the api function and updates the state
     * @param {object} params
     * @returns {object}
     * @example request({ email: " ", password: " " });
     * */
    const request = async (...args: any[]): Promise<ApiResponse<T>> => {
        setLoading(true);
        const response = await apiFunc(...args);
        setLoading(false);
        if (response.ok) {
            setData(response.data);
        } else {
            setError(!response.ok);
            setData([]);
        }

        return response;
    };

    return { data, error, loading, request };
}

/**
 * type User = {
    id: number;
    name: string;
    email: string;
};

const { data, error, loading, request } = useApi<User[]>(usersApi.getUsers);

 */