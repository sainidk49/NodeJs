const express = require("express");
const router = express.Router();
const { createUrl, getShortUrl } = require("../controllers/url-controller");
const {checkUserStatus} = require("../middleware/auth-middleware");

router.post("/create", checkUserStatus, createUrl);
router.get("/:shortID", getShortUrl);

module.exports = router;