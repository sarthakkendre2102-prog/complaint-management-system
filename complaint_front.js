document.querySelector("form").addEventListener("submit", async function (e) {
    e.preventDefault();

    let title = document.querySelector("input[name='title']").value;
    let category = document.querySelector("select").value;
    let description = document.querySelector("textarea").value;

    let user = JSON.parse(localStorage.getItem("user"));

    const res = await fetch("http://localhost:3000/api/complaint", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            title,
            category,
            description,
            email: user.email
        })
    });

    const data = await res.json();

    alert("Complaint Registered ID: " + data.complaintID);

    document.querySelector("form").reset();
});