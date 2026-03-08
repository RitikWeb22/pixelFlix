const API_BASE_URL = "/api/auth";

async function parseJsonResponse(response) {
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data.message || "Request failed");
    }

    return data;
}

export async function registerUser(payload) {
    const response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
    });

    return parseJsonResponse(response);
}

export async function loginUser(payload) {
    const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
    });

    return parseJsonResponse(response);
}

export async function getMe() {
    const response = await fetch(`${API_BASE_URL}/get-me`, {
        method: "GET",
        credentials: "include",
    });

    return parseJsonResponse(response);
}

export async function logoutUser() {
    const response = await fetch(`${API_BASE_URL}/logout`, {
        method: "POST",
        credentials: "include",
    });

    return parseJsonResponse(response);
}
