

const express = require("express")
const router = express.Router();

const { shortUrl,  getRedirectUrl} = require("../controller/url");
router.post("/", shortUrl);
router.get("/:shortID", getRedirectUrl);

module.exports = router