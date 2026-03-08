const API_BASE_URL = "/api/history";

export async function addToHistory(movieId, token) {
    const response = await fetch(`${API_BASE_URL}/${movieId}`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    });

    if (!response.ok) {
        throw new Error("Failed to add to watch later");
    }

    return response.json();
}

export async function getHistory(token) {
    const response = await fetch(API_BASE_URL, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    });

    if (!response.ok) {
        throw new Error("Failed to fetch watch later");
    }

    return response.json();
}
