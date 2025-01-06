const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
    url: { type: String, required: true },
    shortUrl: { type: String, required: true, unique: true },
    count: { type: Number, default: 0 },
    visitHistory: { type: Array, default: [] },
}, { timestamps: true });

const urlSchema = mongoose.model("urlSchema", Schema, "urlshortner");
module.exports = urlSchema;