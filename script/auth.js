const express = require("express");
const router = express.Router();
const db = require("./db");

router.post("/register", (req, res) => {

    const { fullname, email, phone, password } = req.body;

    const sql = "INSERT INTO users (fullname,email,phone,password) VALUES (?,?,?,?)";

    db.query(sql, [fullname, email, phone, password], (err, result) => {

        if (err) {
            res.send("Error");
        } else {
            res.send("User Registered");
        }

    });

});

router.post("/login", (req, res) => {

    const { email, password, role } = req.body;

    const sql = "SELECT * FROM users WHERE email=? AND password=? AND role=?";

    db.query(sql, [email, password, role], (err, result) => {

        if (result.length > 0) {
            res.json({ success: true, user: result[0] });
        } else {
            res.json({ success: false });
        }

    });

});

module.exports = router;