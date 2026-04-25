document.addEventListener("DOMContentLoaded", async () => {
    const user = await setupPage();
    if (!user || user.role === "admin") {
        window.location.href = "/login";
        return;
    }

    const dashboardContent = document.getElementById("dashboardContent");
    if (!dashboardContent) return;

    try {
        const data = await fetchJson("/api/dashboard/user");
        if (!data.success) {
            showMessage(data.error || "Unable to load complaints.", "error");
            return;
        }

        document.getElementById("welcomeTitle").textContent = `Welcome, ${data.user.fullname}! — Your Complaints`;

        if (data.complaints.length === 0) {
            dashboardContent.innerHTML = `<p>You have not filed any complaints yet.</p>
                <a href="/complaint/new"><button>File a Complaint</button></a>`;
            return;
        }

        let tableHtml = `
            <table border="1" id="userTable">
                <tr>
                    <th>Complaint ID</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Status</th>
                </tr>
        `;

        data.complaints.forEach((c) => {
            tableHtml += `
                <tr>
                    <td>${c.complaint_id}</td>
                    <td>${c.title}</td>
                    <td>${c.category}</td>
                    <td><span class="status-badge status-${c.status.toLowerCase().replace(/\s+/g, "-")}">${c.status}</span></td>
                </tr>
            `;
        });

        tableHtml += `</table>
            <br>
            <a href="/complaint/new"><button>File Another Complaint</button></a>
        `;

        dashboardContent.innerHTML = tableHtml;
    } catch (error) {
        showMessage(error.error || error.message || "Unable to load complaints.", "error");
    }
});
