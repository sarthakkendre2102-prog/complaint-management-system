document.addEventListener("DOMContentLoaded", async () => {
    await setupPage();

    const registerForm = document.getElementById("registerForm");
    if (!registerForm) return;

    registerForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        clearMessage();

        const formData = new FormData(registerForm);
        const payload = {
            fullname: formData.get("fullname"),
            email: formData.get("email"),
            phone: formData.get("phone"),
            password: formData.get("password"),
            confirm_password: formData.get("confirm_password")
        };

        try {
            const data = await fetchJson("/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });
            window.location.href = data.redirect || "/login";
        } catch (error) {
            showMessage(error.error || error.message || "Registration failed.", "error");
        }
    });
});
