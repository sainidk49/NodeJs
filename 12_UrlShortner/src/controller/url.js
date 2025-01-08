const validUrl = require('valid-url');
const urlSchema = require("../model/schema");

const genShortStr = (length) => {
    let str = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += str.charAt(Math.floor(Math.random() * str.length));
    }
    return result
}

const shortUrl = async (req, res) => {
    const shortID = genShortStr(8)

    if (!req.body.url) {
        return res.status(400).json({ error: "Please enter a URL" });
    }

    if (!validUrl.isUri(req.body.url)) {
        return res.status(400).json({ error: "Invalid URL" });
    }

    const checkUrl = await urlSchema.findOne({ url: req.body.url });
    if (checkUrl) {
        return res.status(201).json({ message: "Exsit url!", url: `http://localhost:3000/url/${checkUrl.shortUrl}` })
    }

    await urlSchema.create({
        url: req.body.url,
        shortUrl: shortID,
        count: 0,
        visitHistory: []
    })

    return res.status(201).json({ message: "Generate successfull 2!", url: `http://localhost:3000/url/${shortID}` })
}

const getRedirectUrl = async (req, res) => {
    const shortID = req.params.shortID
    console.log(shortID)
    const checkUrl = await urlSchema.findOne({ shortUrl: shortID })
    if (!checkUrl) {
        return res.status(404).json({ error: "URL not found" })
    }

    const entry = await urlSchema.findOneAndUpdate({ shortUrl: shortID },
        {
            $inc: { count: 1 },
            $push: { visitHistory: { "time": new Date().toLocaleString() } }
        }, { new: true })

    res.redirect(entry.url)
}

const getVisitHistory = async (req, res) => {
    const shortID = req.params.shortID
    if (!shortID) {
        return res.status(404).json({ message: "Please enter a shortID" })
    }

    const urlData = await urlSchema.findOne({ shortUrl: shortID })
    if (!urlData) {
        return res.status(404).json({ message: "URL not found" })
    }

    const { url, count, visitHistory } = urlData

    return res.status(200).json({ message: "Successfull!", analytics: { url, count, visitHistory } })

}


module.exports = { shortUrl, getRedirectUrl, getVisitHistory }