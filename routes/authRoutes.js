const path = require("path");
const express = require("express");
const router = express.Router();
const db = require("../config/db");

function wantsJson(req) {
    return req.headers.accept?.includes("application/json");
}

// GET - Show login page
router.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "login.html"));
});

// POST - Handle login
router.post("/login", (req, res) => {
    const { email, password, role } = req.body;

    const sql = "SELECT * FROM users WHERE email=? AND password=? AND role=?";

    db.query(sql, [email, password, role], (err, result) => {
        if (err) {
            if (wantsJson(req)) {
                return res.status(500).json({ success: false, error: "Database error. Please try again." });
            }
            return res.redirect("/login");
        }

        if (result.length > 0) {
            req.session.user = result[0];
            const redirectUrl = role === "admin" ? "/dashboard/admin" : "/dashboard/user";
            if (wantsJson(req)) {
                return res.json({ success: true, redirect: redirectUrl });
            }
            return res.redirect(redirectUrl);
        }

        if (wantsJson(req)) {
            return res.status(401).json({ success: false, error: "Invalid Credentials. Please try again." });
        }
        return res.redirect("/login");
    });
});

// GET - Show registration page
router.get("/register", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "register-user.html"));
});

// POST - Handle registration
router.post("/register", (req, res) => {
    const { fullname, email, phone, password, confirm_password } = req.body;

    if (password !== confirm_password) {
        if (wantsJson(req)) {
            return res.status(400).json({ success: false, error: "Passwords do not match." });
        }
        return res.redirect("/register");
    }

    const sql = "INSERT INTO users (fullname, email, phone, password) VALUES (?,?,?,?)";

    db.query(sql, [fullname, email, phone, password], (err, result) => {
        if (err) {
            let errorMsg = "Registration failed. Please try again.";
            if (err.code === "ER_DUP_ENTRY") {
                errorMsg = "Email already registered. Please login.";
            }
            if (wantsJson(req)) {
                return res.status(400).json({ success: false, error: errorMsg });
            }
            return res.redirect("/register");
        }

        if (wantsJson(req)) {
            return res.json({ success: true, redirect: "/login", message: "Registration Successful! Please login." });
        }
        return res.redirect("/login");
    });
});

// GET - Logout
router.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.clearCookie("connect.sid");
        res.redirect("/");
    });
});

// GET - Session info
router.get("/api/session", (req, res) => {
    res.json({ user: req.session.user || null });
});

module.exports = router;
