async function fetchJson(url, options = {}) {
    const headers = {
        Accept: "application/json",
        ...options.headers
    };

    const response = await fetch(url, { ...options, headers });
    const contentType = response.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
        const data = await response.json();
        if (!response.ok) {
            throw data;
        }
        return data;
    }

    if (!response.ok) {
        throw new Error(response.statusText || "Network error");
    }

    return response;
}

function renderNav(user) {
    const nav = document.getElementById("nav");
    if (!nav) return;

    let html = `<a href="/"><button>Home</button></a>`;

    if (user) {
        if (user.role === "admin") {
            html += `<a href="/dashboard/admin"><button>Admin Dashboard</button></a>`;
        } else {
            html += `<a href="/dashboard/user"><button>My Dashboard</button></a>`;
        }
        html += `<a href="/logout"><button>Logout (${user.fullname})</button></a>`;
    } else {
        html += `<a href="/register"><button>Register User</button></a>`;
        html += `<a href="/login"><button>Login Here</button></a>`;
    }

    nav.innerHTML = html;
}

function showMessage(message, type = "success") {
    const container = document.getElementById("alertContainer");
    if (!container) return;
    container.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
}

function clearMessage() {
    const container = document.getElementById("alertContainer");
    if (!container) return;
    container.innerHTML = "";
}

async function getSession() {
    try {
        const data = await fetchJson("/api/session");
        return data.user || null;
    } catch (_) {
        return null;
    }
}

async function setupPage() {
    const user = await getSession();
    renderNav(user);
    return user;
}
