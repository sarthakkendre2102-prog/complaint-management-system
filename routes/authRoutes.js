const express = require("express");
const router = express.Router();
const db = require("../config/db");

// GET - Show login page
router.get("/login", (req, res) => {
    res.render("login", {
        title: "Login",
        user: req.session.user || null,
        success: null,
        error: null
    });
});

// POST - Handle login
router.post("/login", (req, res) => {
    const { email, password, role } = req.body;

    const sql = "SELECT * FROM users WHERE email=? AND password=? AND role=?";

    db.query(sql, [email, password, role], (err, result) => {
        if (err) {
            return res.render("login", {
                title: "Login",
                user: null,
                success: null,
                error: "Database error. Please try again."
            });
        }

        if (result.length > 0) {
            // Save user to session
            req.session.user = result[0];

            // Redirect based on role
            if (role === "admin") {
                res.redirect("/dashboard/admin");
            } else {
                res.redirect("/dashboard/user");
            }
        } else {
            res.render("login", {
                title: "Login",
                user: null,
                success: null,
                error: "Invalid Credentials. Please try again."
            });
        }
    });
});

// GET - Show registration page
router.get("/register", (req, res) => {
    res.render("register-user", {
        title: "Register",
        user: req.session.user || null,
        success: null,
        error: null
    });
});

// POST - Handle registration
router.post("/register", (req, res) => {
    const { fullname, email, phone, password, confirm_password } = req.body;

    // Check passwords match
    if (password !== confirm_password) {
        return res.render("register-user", {
            title: "Register",
            user: null,
            success: null,
            error: "Passwords do not match."
        });
    }

    const sql = "INSERT INTO users (fullname, email, phone, password) VALUES (?,?,?,?)";

    db.query(sql, [fullname, email, phone, password], (err, result) => {
        if (err) {
            let errorMsg = "Registration failed. Please try again.";
            if (err.code === "ER_DUP_ENTRY") {
                errorMsg = "Email already registered. Please login.";
            }
            return res.render("register-user", {
                title: "Register",
                user: null,
                success: null,
                error: errorMsg
            });
        }

        res.render("login", {
            title: "Login",
            user: null,
            success: "Registration Successful! Please login.",
            error: null
        });
    });
});

// GET - Logout
router.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/");
});

module.exports = router;
