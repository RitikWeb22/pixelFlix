const ADMIN_USERS_BASE_URL = "/api/admin";
const ADMIN_MOVIES_BASE_URL = "/api/admin/movies";

async function parseJsonResponse(response) {
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        const error = new Error(data.message || data.error || "Request failed");
        error.status = response.status;
        error.payload = data;
        throw error;
    }

    return data;
}

export async function fetchAdminUsers() {
    const response = await fetch(`${ADMIN_USERS_BASE_URL}/users`, {
        method: "GET",
        credentials: "include",
    });

    return parseJsonResponse(response);
}

export async function banOrUnbanUser(userId) {
    const response = await fetch(`${ADMIN_USERS_BASE_URL}/users/${userId}/ban`, {
        method: "PATCH",
        credentials: "include",
    });

    return parseJsonResponse(response);
}

export async function removeUser(userId) {
    const response = await fetch(`${ADMIN_USERS_BASE_URL}/users/${userId}`, {
        method: "DELETE",
        credentials: "include",
    });

    return parseJsonResponse(response);
}

export async function fetchAdminMovies() {
    const response = await fetch(`${ADMIN_MOVIES_BASE_URL}/`, {
        method: "GET",
        credentials: "include",
    });

    return parseJsonResponse(response);
}

export async function createAdminMovie(payload) {
    const response = await fetch(`${ADMIN_MOVIES_BASE_URL}/create`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
    });

    return parseJsonResponse(response);
}

export async function editAdminMovie(movieDbId, payload) {
    const response = await fetch(`${ADMIN_MOVIES_BASE_URL}/${movieDbId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
    });

    return parseJsonResponse(response);
}

export async function removeAdminMovie(movieDbId) {
    const response = await fetch(`${ADMIN_MOVIES_BASE_URL}/${movieDbId}`, {
        method: "DELETE",
        credentials: "include",
    });

    return parseJsonResponse(response);
}