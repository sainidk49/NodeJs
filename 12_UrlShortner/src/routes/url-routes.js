

const express = require("express")
const router = express.Router();

const { shortUrl,  getRedirectUrl, getVisitHistory} = require("../controller/url");
router.post("/", shortUrl);
router.get("/:shortID", getRedirectUrl);
router.get("/analytics/:shortID", getVisitHistory);

module.exports = router