const express = require("express");
const router = express.Router();
const { createUrl, getShortUrl } = require("../controller/url-controller");


router.post("/create-url", createUrl);
router.get("/:shortID", getShortUrl);

module.exports = router;