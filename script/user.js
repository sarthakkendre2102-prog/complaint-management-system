const user = JSON.parse(localStorage.getItem("user"));

fetch("http://localhost:3000/api/all")
.then(res => res.json())
.then(data => {

    const table = document.getElementById("userTable");

    data.forEach(c => {

        // show only logged in user's complaints
        if(c.user_email === user.email){

            table.innerHTML += `
            <tr>
                <td>${c.complaint_id}</td>
                <td>${c.title}</td>
                <td>${c.category}</td>
                <td>${c.status}</td>
            </tr>
            `;

        }

    });

});