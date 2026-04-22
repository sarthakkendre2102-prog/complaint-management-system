function trackComplaint() {

    const id = document.getElementById("complaintId").value;

    if (!id) {
        alert("Please enter Complaint ID");
        return;
    }

    fetch("http://localhost:3000/api/track/" + id)
    .then(response => response.json())
    .then(data => {

        if (data) {
            document.getElementById("result").innerHTML = `
                <h3>Complaint Status</h3>
                <p><b>Complaint ID:</b> ${data.complaint_id}</p>
                <p><b>Title:</b> ${data.title}</p>
                <p><b>Category:</b> ${data.category}</p>
                <p><b>Description:</b> ${data.description}</p>
                <p><b>Status:</b> ${data.status}</p>
                <p><b>Email:</b> ${data.user_email}</p>
            `;
        } 
        else {
            document.getElementById("result").innerHTML =
                "<h3>Complaint not found</h3>";
        }

    })
    .catch(error => {
        console.error("Error:", error);
        document.getElementById("result").innerHTML =
            "<h3>Server error. Try again.</h3>";
    });

}