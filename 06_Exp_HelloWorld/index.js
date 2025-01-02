const express = require("express");
const app = express();

const PORT = 3000 || process.env.PORT;

app.get("/", (req, res) => {
    res.send("Hello, World!");
})

app.get("/about", (req, res) => {
    res.send("about page!");
})

app.get("/search", (req, res) => {
    if (Object.keys(req.query).length > 0)
        res.send(`Hello ${req.query.name} ! I gusse your age is ${req.query.age}`);
    else
        res.send("Search")
})

app.listen(PORT, () => {
    console.log("Server start with :: ", `http://localhost:${PORT}`)
})