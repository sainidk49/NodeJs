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
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    }
})

const urlSchema = mongoose.model("Url", schema, "urls");
module.exports = urlSchema;