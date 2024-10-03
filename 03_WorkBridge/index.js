import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./src/routes/userRoute.js"; 
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Routes
app.get('/', (req, res) => {
    res.status(200).send('Hello, world!');
});

// Serve images from the uploads folder
app.use('/uploads', express.static("uploads"));

app.use("/api", userRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Connect to MongoDB and start the server
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log("DB connected successfully!");
    app.listen(PORT, () => {
        console.log(`Server started at http://localhost:${PORT}`);
    });
})
.catch((err) => {
    console.error("Error connecting to DB:", err);
});
