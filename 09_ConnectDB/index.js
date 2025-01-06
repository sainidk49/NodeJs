const express = require("express");
const app = express();
const PORT = 3000;

const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/MyDB")
.then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, ()=>{
        console.log(`Server is running on port ${PORT}`);
    })
})
.catch((err)=> console.log("Error to connect MongoDB", err));

app.get("/", (req, res) => {{
    res.send("Welcome to our hame page1")
}})