const mongoose = require("mongoose");

const dbConnect = async (URL) => {
    try {
        return await mongoose.connect(URL)
    }
    catch (err) {
        console.log(err)
    };
}

module.exports = dbConnect;