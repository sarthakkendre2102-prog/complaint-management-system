document.querySelector("form").addEventListener("submit", async function (e) {
    e.preventDefault();

    let fullname = document.querySelector("input[name='fullname']").value;
    let email = document.querySelector("input[name='email']").value;
    let phone = document.querySelector("input[name='phone']").value;
    let password = document.querySelector("input[name='password']").value;

    const res = await fetch("http://localhost:3000/api/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            fullname,
            email,
            phone,
            password
        })
    });

    alert("Registration Successful");
    window.location.href = "login.html";
});