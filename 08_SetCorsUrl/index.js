const express = require("express");
const app = express();
const fs = require("fs");
const cors = require("cors");

const PORT = process.env.PORT || 3000;

// Get users data
const users = require("./user-data.json");

// Allowed origins
const allowOrigin = "http://192.168.1.115:5500";

// Middleware to handle CORS // Allow only specific origin
// app.use(cors({
//     origin: allowOrigin,  
//     methods: 'GET, POST, PUT, DELETE',
//     allowedHeaders: 'Content-Type, Authorization'
// }));

////////////// handle manual crors error /////////////////
app.use((req, res, next) => {
    const origin = req.headers.origin;

    if (origin && allowOrigin === origin) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        if (req.method === 'OPTIONS') {
            return res.status(200).end();
        }
    } else {
        res.setHeader('Access-Control-Allow-Origin', '');
    }

    next();
});


// Parse incoming JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Get users data
app.get("/api/users", (req, res) => {
    res.json(users);
});


// Create user
app.post("/api/user/create", (req, res) => {
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ message: "Please fill in all fields" });
    }

    if (Object.keys(req.body).length > 0) {
        for (const key in req.body) {
            if (req.body[key] === "" || req.body[key] === null) {
                return res.status(400).json({ message: `Please fill in ${key}` });
            }
        }
    }

    const user = { ...req.body, id: users.length + 1 };
    users.push(user);

    fs.writeFile("./user-data.json", JSON.stringify(users, null, 2), (err) => {
        if (err) {
            return res.status(500).json({ message: "Error creating user" });
        }
        return res.json(users);
    });
});



// Home page
app.get("/", (req, res) => {
    res.send("You are on the home page");
});



// Start the server
app.listen(PORT, () => {
    console.log("Server running at http://localhost:" + PORT);
});
