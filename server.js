const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname));

const auth = require("./auth");
const complaintroute = require("./complaintroute");

app.use("/api", auth);
app.use("/api", complaintroute);

app.listen(3000, () => {
    console.log("Server running on port 3000");
});