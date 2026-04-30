import { useAuthStore } from "@/store/useAuthStore";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiRequest(endpoint, options = {}) {
    const { accessToken, logout, restoreSession, user } = useAuthStore.getState();

    const makeRequest = async (token) => {
        return fetch(`${BASE_URL}${endpoint}`, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                ...(token && { Authorization: `Bearer ${token}` }),
                ...(options.headers || {}),
            },
            credentials: "include",
        });
    };

    let res = await makeRequest(accessToken);

    if (res.status === 401 && user) {
        try {
            await restoreSession();

            const newToken = useAuthStore.getState().accessToken;

            if (!newToken) throw new Error("No token after refresh");

            res = await makeRequest(newToken);
        } catch (err) {
            logout();
            throw err;
        }
    }

    if (!res.ok) {
        const { message, data } = await res.json();
        throw Object.assign(new Error(message), { data });
    }

    return res.json();
}