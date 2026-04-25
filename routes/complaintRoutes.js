const path = require("path");
const express = require("express");
const router = express.Router();
const db = require("../config/db");

function wantsJson(req) {
    return req.headers.accept?.includes("application/json");
}

function ensureLoggedIn(req, res, next) {
    if (req.session.user) {
        return next();
    }
    if (wantsJson(req)) {
        return res.status(401).json({ success: false, error: "Authentication required." });
    }
    return res.redirect("/login");
}

function ensureAdmin(req, res, next) {
    if (req.session.user && req.session.user.role === "admin") {
        return next();
    }
    if (wantsJson(req)) {
        return res.status(403).json({ success: false, error: "Admin access required." });
    }
    return res.redirect("/login");
}

// GET - Show complaint form (must be logged in)
router.get("/complaint/new", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "register-complaint.html"));
});

// POST - Submit complaint
router.post("/complaint/new", ensureLoggedIn, (req, res) => {
    const { title, category, description } = req.body;
    const email = req.session.user.email;
    const complaintID = "CMP" + Math.floor(Math.random() * 100000);

    const sql = `INSERT INTO complaints (complaint_id, title, category, description, user_email) VALUES (?,?,?,?,?)`;

    db.query(sql, [complaintID, title, category, description, email], (err, result) => {
        if (err) {
            if (wantsJson(req)) {
                return res.status(500).json({ success: false, error: "Failed to register complaint. Please try again." });
            }
            return res.redirect("/complaint/new");
        }

        const message = "Complaint Registered Successfully! Your Complaint ID: " + complaintID;
        if (wantsJson(req)) {
            return res.json({ success: true, message });
        }
        return res.redirect("/complaint/new");
    });
});

// GET - Show track page
router.get("/track", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "track.html"));
});

// POST - Track a complaint
router.post("/api/track", (req, res) => {
    const { complaint_id } = req.body;

    const sql = "SELECT * FROM complaints WHERE complaint_id=?";

    db.query(sql, [complaint_id], (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, error: "Server error. Please try again." });
        }

        return res.json({ success: true, complaint: result.length > 0 ? result[0] : null });
    });
});

// GET - User dashboard (must be logged in)
router.get("/dashboard/user", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "user-dashboard.html"));
});

router.get("/api/dashboard/user", ensureLoggedIn, (req, res) => {
    const email = req.session.user.email;
    const sql = "SELECT * FROM complaints WHERE user_email=? ORDER BY id DESC";

    db.query(sql, [email], (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, error: "Failed to load complaints." });
        }
        return res.json({ success: true, complaints: result, user: req.session.user });
    });
});

// GET - Admin dashboard (must be admin)
router.get("/dashboard/admin", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "admin-dashboard.html"));
});

router.get("/api/dashboard/admin", ensureAdmin, (req, res) => {
    const sql = "SELECT * FROM complaints ORDER BY id DESC";

    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, error: "Failed to load complaints." });
        }
        return res.json({ success: true, complaints: result, user: req.session.user });
    });
});

// POST - Admin update complaint status
router.post("/dashboard/admin/update", ensureAdmin, (req, res) => {
    const { complaint_id, status } = req.body;

    const sql = "UPDATE complaints SET status=? WHERE complaint_id=?";

    db.query(sql, [status, complaint_id], (err, result) => {
        if (err) {
            if (wantsJson(req)) {
                return res.status(500).json({ success: false, error: "Failed to update status." });
            }
            return res.redirect("/dashboard/admin");
        }
        if (wantsJson(req)) {
            return res.json({ success: true });
        }
        return res.redirect("/dashboard/admin");
    });
});

module.exports = router;
