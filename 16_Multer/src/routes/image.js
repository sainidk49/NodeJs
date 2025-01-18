const express = require("express")
const route = express.Router()

const uploadFile = require("../controllers/uploadFile")

route.get("/", (req, res) => {
    res.render("home");
})

route.post("/upload", uploadFile)

module.exports = route