const express = require("express")

const router = express.Router();

router.get("/url", async (req, res) => {
    return res.render("home")
})

router.get("/login", (req, res) => {
    return res.render("login")
})

router.get("/signup", (req, res) => {
    return res.render("signup")
})

module.exports = router;