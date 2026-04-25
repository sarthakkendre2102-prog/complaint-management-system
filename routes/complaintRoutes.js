const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Middleware - check if user is logged in
function isLoggedIn(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.redirect("/login");
    }
}

// Middleware - check if user is admin
function isAdmin(req, res, next) {
    if (req.session.user && req.session.user.role === "admin") {
        next();
    } else {
        res.redirect("/login");
    }
}

// GET - Show complaint form (must be logged in)
router.get("/complaint/new", isLoggedIn, (req, res) => {
    res.render("register-complaint", {
        title: "Register Complaint",
        user: req.session.user,
        success: null,
        error: null
    });
});

// POST - Submit complaint
router.post("/complaint/new", isLoggedIn, (req, res) => {
    const { title, category, description } = req.body;
    const email = req.session.user.email;
    const complaintID = "CMP" + Math.floor(Math.random() * 100000);

    const sql = `INSERT INTO complaints (complaint_id, title, category, description, user_email) VALUES (?,?,?,?,?)`;

    db.query(sql, [complaintID, title, category, description, email], (err, result) => {
        if (err) {
            return res.render("register-complaint", {
                title: "Register Complaint",
                user: req.session.user,
                success: null,
                error: "Failed to register complaint. Please try again."
            });
        }

        res.render("register-complaint", {
            title: "Register Complaint",
            user: req.session.user,
            success: "Complaint Registered Successfully! Your Complaint ID: " + complaintID,
            error: null
        });
    });
});

// GET - Show track form
router.get("/track", (req, res) => {
    res.render("track", {
        title: "Track Complaint",
        user: req.session.user || null,
        complaint: null,
        searched: false,
        success: null,
        error: null
    });
});

// POST - Track a complaint
router.post("/track", (req, res) => {
    const { complaint_id } = req.body;

    const sql = "SELECT * FROM complaints WHERE complaint_id=?";

    db.query(sql, [complaint_id], (err, result) => {
        if (err) {
            return res.render("track", {
                title: "Track Complaint",
                user: req.session.user || null,
                complaint: null,
                searched: true,
                success: null,
                error: "Server error. Please try again."
            });
        }

        res.render("track", {
            title: "Track Complaint",
            user: req.session.user || null,
            complaint: result.length > 0 ? result[0] : null,
            searched: true,
            success: null,
            error: null
        });
    });
});

// GET - User dashboard (must be logged in)
router.get("/dashboard/user", isLoggedIn, (req, res) => {
    const email = req.session.user.email;

    const sql = "SELECT * FROM complaints WHERE user_email=? ORDER BY id DESC";

    db.query(sql, [email], (err, result) => {
        if (err) {
            return res.render("user-dashboard", {
                title: "User Dashboard",
                user: req.session.user,
                complaints: [],
                success: null,
                error: "Failed to load complaints."
            });
        }

        res.render("user-dashboard", {
            title: "User Dashboard",
            user: req.session.user,
            complaints: result,
            success: null,
            error: null
        });
    });
});

// GET - Admin dashboard (must be admin)
router.get("/dashboard/admin", isAdmin, (req, res) => {
    const sql = "SELECT * FROM complaints ORDER BY id DESC";

    db.query(sql, (err, result) => {
        if (err) {
            return res.render("admin-dashboard", {
                title: "Admin Dashboard",
                user: req.session.user,
                complaints: [],
                success: null,
                error: "Failed to load complaints."
            });
        }

        res.render("admin-dashboard", {
            title: "Admin Dashboard",
            user: req.session.user,
            complaints: result,
            success: null,
            error: null
        });
    });
});

// POST - Admin update complaint status
router.post("/dashboard/admin/update", isAdmin, (req, res) => {
    const { complaint_id, status } = req.body;

    const sql = "UPDATE complaints SET status=? WHERE complaint_id=?";

    db.query(sql, [status, complaint_id], (err, result) => {
        res.redirect("/dashboard/admin");
    });
});

module.exports = router;
