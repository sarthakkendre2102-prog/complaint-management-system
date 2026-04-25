const path = require("path");
const express = require("express");
const session = require("express-session");
require("dotenv").config();

const db = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const complaintRoutes = require("./routes/complaintRoutes");

// 🔍 Validate environment variables
const requiredEnv = ["DB_HOST", "DB_USER", "DB_PASSWORD", "DB_NAME"];

requiredEnv.forEach((key) => {
    if (!process.env[key]) {
        console.error(`❌ Missing environment variable: ${key}`);
        process.exit(1);
    }
});

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(
    session({
        secret: process.env.SESSION_SECRET || "keyboard cat",
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }
    })
);

app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

// Routes
app.get("/", (req, res) => {
    res.render("index", {
        title: "Complaint Management System",
        user: req.session.user || null,
        success: null,
        error: null
    });
});

app.use("/", authRoutes);
app.use("/", complaintRoutes);

// 404 fallback
app.use((req, res) => {
    res.status(404).render("index", {
        title: "Page Not Found",
        user: req.session.user || null,
        success: null,
        error: "Page not found."
    });
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});

server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
        console.error(`❌ Port ${PORT} is already in use. Stop the running server or choose a different PORT.`);
    } else {
        console.error("❌ Server failed to start:", err.message);
    }
    process.exit(1);
});

module.exports = app;
