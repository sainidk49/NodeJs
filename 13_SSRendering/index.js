const express = require("express");
const path = require("path");

// import the database connection
const connectDB = require("./config/db");
const webRouter = require("./routes/web-router");
const apiRouter = require("./routes/api-router");

const dotenv = require("dotenv")
dotenv.config();

///// make app ////
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: false}))

const PORT = process.env.PORT || 3000;

////// set view engine /////
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"))


connectDB()
.then(()=>{
    console.log("Connected to database");
    /////// make a port ////
    app.listen(PORT, ()=>{
        console.log(`Server is running at http://localhost:${PORT}`);
    })
    
})
.catch((err)=>{
    console.log("Error :: ",err);
})


/// make a initial route///
app.get("/", (req, res) => {
    res.send("Hello World!");
})

app.use("/api", apiRouter)
app.use("/web", webRouter)