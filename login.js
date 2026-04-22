document.querySelector("form").addEventListener("submit", async function (e) {
    e.preventDefault();

    let role = document.querySelector("select").value;
    let email = document.querySelector("input[type='email']").value;
    let password = document.querySelector("input[type='password']").value;

    const res = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email,
            password,
            role
        })
    });

    const data = await res.json();

    if (data.success) {
        alert("Login Successful");

        localStorage.setItem("user", JSON.stringify(data.user));

        // 👇 redirect based on role
        if(role === "admin"){
            window.location.href = "admin-dashboard.html";
        }else{
            window.location.href = "user-dashboard.html";
        }

    } else {
        alert("Invalid Credentials");
    }
});