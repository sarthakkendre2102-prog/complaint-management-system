document.addEventListener("DOMContentLoaded", async () => {
    const user = await setupPage();
    if (!user || user.role !== "admin") {
        window.location.href = "/login";
        return;
    }

    const dashboardContent = document.getElementById("dashboardContent");
    if (!dashboardContent) return;

    try {
        const data = await fetchJson("/api/dashboard/admin");
        if (!data.success) {
            showMessage(data.error || "Unable to load complaints.", "error");
            return;
        }

        if (data.complaints.length === 0) {
            dashboardContent.innerHTML = `<p>No complaints have been filed yet.</p>`;
            return;
        }

        let tableHtml = `
            <table border="1" id="adminTable">
                <tr>
                    <th>Complaint ID</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Update Status</th>
                </tr>
        `;

        data.complaints.forEach((c) => {
            tableHtml += `
                <tr>
                    <td>${c.complaint_id}</td>
                    <td>${c.title}</td>
                    <td>${c.category}</td>
                    <td>${c.user_email}</td>
                    <td><span class="status-badge status-${c.status.toLowerCase().replace(/\s+/g, "-")}">${c.status}</span></td>
                    <td>
                        <form class="status-form" data-complaint-id="${c.complaint_id}">
                            <select name="status">
                                <option value="Pending" ${c.status === "Pending" ? "selected" : ""}>Pending</option>
                                <option value="In Progress" ${c.status === "In Progress" ? "selected" : ""}>In Progress</option>
                                <option value="Resolved" ${c.status === "Resolved" ? "selected" : ""}>Resolved</option>
                            </select>
                            <button type="submit">Update</button>
                        </form>
                    </td>
                </tr>
            `;
        });

        tableHtml += `</table>`;
        dashboardContent.innerHTML = tableHtml;

        document.querySelectorAll(".status-form").forEach((form) => {
            form.addEventListener("submit", async (event) => {
                event.preventDefault();
                clearMessage();

                const complaintId = form.dataset.complaintId;
                const status = form.querySelector("select").value;

                try {
                    await fetchJson("/dashboard/admin/update", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({ complaint_id: complaintId, status })
                    });
                    showMessage("Status updated successfully.", "success");
                    window.location.reload();
                } catch (error) {
                    showMessage(error.error || error.message || "Failed to update status.", "error");
                }
            });
        });
    } catch (error) {
        showMessage(error.error || error.message || "Unable to load complaints.", "error");
    }
});
