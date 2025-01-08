const mongoose = require("mongoose");

const schema =  new mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    shortUrl:{
        type: String,
        require: true,
        unique: true
    },
    count:{
        type: Number,
        default: 0
    },
    visitHistory:{
        type: Array,
        default: [],
    }
})

const urlSchema = mongoose.model("Url", schema, "urlshortner");
module.exports = urlSchema;