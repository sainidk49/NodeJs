import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv"
import cors from "cors"
import route from "./src/routes/userRoute.js";

////// config dotenv ///////
dotenv.config();


const app = express();
const PORT = process.env.PORT || 8000;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(express.json())
app.use(cors())
app.use("/api", route)

app.get("/", (req, res)=>{
    res.status(200).send("Hello Deepak!")
})

//////////// connect to database /////////////
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log("Connection successful!")
        app.listen(PORT, () => {
            console.log(`Server started at http://localhost:${PORT}`)
        })
    })
    .catch((err) => {
        console.log("Error :: ", err)
    })
