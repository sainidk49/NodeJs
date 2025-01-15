const express = require("express")
const UrlSchema = require('../models/url-model');
const { checkUserUrls } = require('../middleware/auth-middleware');

const router = express.Router();

router.get("/url", checkUserUrls, async (req, res) => {

    const userId = req.user?._id;
    const userUrls = await UrlSchema.find({ createdBy: userId })

    return res.render("home", { urls: userUrls })
})

router.get("/login", (req, res) => {
    return res.render("login")
})

router.get("/signup", (req, res) => {
    return res.render("signup")
})

module.exports = router;