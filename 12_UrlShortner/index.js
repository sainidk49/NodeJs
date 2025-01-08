const express = require("express");
const connectDb = require("./src/connection/config")
const PORT = 3000

const urlRoute = require("./src/routes/url-routes")

const app = express();
app.use(express.json());


connectDb().then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, ()=>{
        console.log(`http://localhost:${PORT}`);
    })
}).catch((err) => console.log(err))

app.get("/", (req, res) => {
    res.send("Welcome to home")
})

app.use("/api/url", urlRoute)