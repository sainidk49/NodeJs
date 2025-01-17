const express = require("express");
const router = express.Router();
const { createUrl, getShortUrl, getAllData } = require("../controllers/url-controller");
const {checkUserStatus, checkUserUrls} = require("../middleware/auth-middleware");


router.post("/create", checkUserStatus, createUrl);
router.get("/:shortID", getShortUrl);
router.post("/all", checkUserUrls, getAllData);

module.exports = router;