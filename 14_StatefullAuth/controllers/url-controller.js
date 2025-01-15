const UrlSchema = require('../models/url-model');
const validUrl = require('valid-url');

const createUniqueId = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = "";
    for (let index = 0; index < length; index++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};

const makeShortUrl = (req, shortID) => {
    const domainName = req.headers.host;
    let domain;
    if (domainName === `localhost:${process.env.PORT}` || domainName === "127.0.0.1") {
        domain = "http://" + domainName;
    } else {
        domain = "https://" + domainName;
    }
    return domain + "/url/" + shortID;
};

const createUrl = async (req, res) => {
    try {
        if (!req.body.url) {
            return res.render("home", { status: false, message: "Please enter a URL" });
        }

        if (!validUrl.isUri(req.body.url)) {
            return res.render("home", { status: false, message: "Invalid URL" });
        }

        const existingUrl = await UrlSchema.findOne({ url: req.body.url });
        if (existingUrl) {
            return res.render("home", { status: true, message: "Existing URL", url: existingUrl.shortUrl });
        }

        const shortID = createUniqueId(6);
        const shortUrl = makeShortUrl(req, shortID);

        await UrlSchema.create({
            url: req.body.url,
            shortID: shortID,
            shortUrl: shortUrl,
            createdBy: req.user._id
        });

        return res.render("home", { status: true, message: "Short URL created successfully", url: shortUrl });

    } catch (err) {
        return res.render("home", { status: false, message: `Error :: ${err.message}` });
    }
};

const getShortUrl = async (req, res) => {
    try {
        const shortID = req.params.shortID;
        if (!shortID) {
            return res.status(400).json({ status: false, message: "Invalid ID" });
        }

        const checkUrl = await UrlSchema.findOne({ shortID: shortID });
        if (!checkUrl) {
            return res.status(400).json({ status: false, message: "Invalid ID" });
        }

        const entry = await UrlSchema.findOneAndUpdate({ shortID: shortID }, {
            $inc: { count: 1 },
            $push: { visitHistory: { time: new Date().toLocaleString() } }
        }, { new: true });

        return res.redirect(entry.url);

    } catch (err) {
        return res.status(400).json({ status: false, message: `Error :: ${err.message}` });
    }
};

module.exports = { createUrl, getShortUrl };
