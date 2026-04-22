fetch("http://localhost:3000/api/all")
.then(res => res.json())
.then(data => {

    const table = document.getElementById("table");

    data.forEach(c => {

        table.innerHTML += `
        <tr>
            <td>${c.complaint_id}</td>
            <td>${c.title}</td>
            <td>${c.status}</td>
            <td>${c.user_email}</td>
        </tr>
        `;

    });

});