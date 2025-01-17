const express = require("express");
const path = require("path");
const cookieParser = require('cookie-parser');

// import the database connection
const connectDB = require("./config/db");
const webRouter = require("./routes/web-router");
const urlRouter = require("./routes/url-router");
const userRouter = require("./routes/user-router");


const dotenv = require("dotenv")
dotenv.config();

///// make app ////
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser());

const PORT = process.env.PORT || 3000;

////// set view engine /////
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"))


connectDB()
    .then(() => {
        console.log("Connected to database");
        /////// make a port ////
        app.listen(PORT, () => {
            console.log(`Server is running at http://localhost:${PORT}`);
        })

    })
    .catch((err) => {
        console.log("Error :: ", err);
    })


/// make a initial route///
app.get("/", (req, res) => {
    res.send("Hello World!");
})

app.use("/", webRouter)
app.use("/api/url", urlRouter)
app.use("/api/user", userRouter)