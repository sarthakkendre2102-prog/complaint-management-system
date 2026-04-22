const express = require("express");
const router = express.Router();
const db = require("./db");

router.post("/complaint", (req, res) => {

    const { title, category, description, email } = req.body;

    let complaintID = "CMP" + Math.floor(Math.random() * 100000);

    const sql = `
    INSERT INTO complaints 
    (complaint_id,title,category,description,user_email)
    VALUES (?,?,?,?,?)
    `;

    db.query(sql,
        [complaintID, title, category, description, email],
        (err, result) => {

            res.json({
                message: "Complaint Registered",
                complaintID: complaintID
            });

        });

});

router.get("/track/:id", (req, res) => {

    const id = req.params.id;

    const sql = "SELECT * FROM complaints WHERE complaint_id=?";

    db.query(sql, [id], (err, result) => {

        if (result.length > 0) {
            res.json(result[0]);
        } else {
            res.json(null);
        }

    });

});
router.get("/all", (req, res) => {

    const sql = "SELECT * FROM complaints ORDER BY id DESC";

    db.query(sql, (err, result) => {
        res.json(result);
    });

});

module.exports = router;