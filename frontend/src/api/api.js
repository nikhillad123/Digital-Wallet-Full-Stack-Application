const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export async function api(endpoint, options = {}) {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {})
        },
        ...options
    });

    return response;
}