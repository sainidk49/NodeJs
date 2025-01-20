const express = require("express")
const path = require("path")
const dbConnect = require("./src/config/dbConnect")
const imageRouter = require("./src/routes/image")

const dotenv = require("dotenv");
dotenv.config();

const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL;

const app = express();

///// encode upcoming data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

///// set view engin
app.set("view engine", "ejs");
app.set("views", path.resolve("src/views"));

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));


dbConnect(MONGO_URL)
    .then(() => {
        console.log("Connected to MongoDB")
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        })
    })
    .catch((err) => {
        console.log(err)
    });


app.use("/file", imageRouter)