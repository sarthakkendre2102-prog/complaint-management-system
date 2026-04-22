const mysql = require("mysql");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "sarthak",   // ← put your mysql password
    database: "complaint_system"
});

db.connect(err => {
    if (err) {
        console.log("Database connection failed");
        console.log(err);
    } else {
        console.log("MySQL Connected");
    }
});

module.exports = db;