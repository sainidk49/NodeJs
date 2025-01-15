const UrlSchema = require('../models/url-model');
const validUrl = require('valid-url');

const createUniqueId = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = "";
    for (let index = 0; index < length; index++) {
        result += characters.at(Math.floor(Math.random() * characters.length))
    }
    return result;
}

const makeShortUrl =()=>{
    const domainName = window.location.hostname;
    let domain
    if(domainName === "localhost" || domainName === "127.0.0.1"){
      domain = "http://" + domainName;
    }
    else{
      domain = "https://" + domainName;
    }
    
    return domain + "/short/" + createUniqueId(6);
} 

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
            return res.render("home", { status: true, message: "From exixt url", url: `http://localhost:5500/api/${existingUrl.shortUrl}` });
        }

        await UrlSchema.create({
            url: req.body.url,
            shortUrl: makeShortUrl(),
            createdBy: req.user._id
        })

        return res.render("home", { status: true, message: "New url", url: `http://localhost:5500/api/${shortID}` });
    }
    catch (err) {
        res.render("home", { status: true, message: `Error :: ${err.message}` });
    }
}

const getShortUrl = async (req, res) => {
    try {
        const shortID = req.params.shortID;
        if (!shortID) {
            return res.status(400).json({ status: false, message: "Invalid ID1" });
        }
     
        const checkUrl = await UrlSchema.findOne({ shortUrl: shortID });
        if (!checkUrl) {
            return res.status(400).json({ status: false, message: "Invalid ID2" });
        }

        const entry = await UrlSchema.findOneAndUpdate({ shortUrl: shortID }, {
            $inc: { count: 1 },
            $push: { visitHistory: { "time": Date.now().toLocaleString } }
        }, { new: true })


        return res.redirect(entry.url);

    } catch (err) {
        return res.status(400).json({ status: false, message: `Error :: ${err.message}` })
    }
}

module.exports = { createUrl, getShortUrl }