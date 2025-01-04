const express = require('express');
const app = express();
const users = require("./user-data.json");
const fs = require("fs");
const cors = require('cors');
const PORT = 3000 || process.env.PORT;


app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors())

app.get("/", (req, res) => {
    res.send("Welcome to our domain");
})


////// get data //////
app.get("/api/users", (req, res) => {
    res.json(users);
})


//// create user //////
app.post("/api/create", (req, res) => {
    console.log(req.body)
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).send({ message: "Please provide all user data" });
    }

    const newUser = { ...req.body, id: users.length + 1 };
    users.push(newUser);

    fs.writeFile("./user-data.json", JSON.stringify(users, null, 2), (err) => {
        if (err) {
            console.error("Error writing to file:", err);
            return res.status(500).send({ message: "Failed to save user data" });
        }
        return res.status(201).json(newUser);
    });
});


//// update user //////
app.put("/api/update/:id", (req, res) => {
    const id = req.params.id;
    if(!id){
        return res.status(400).send({ satus: false, message: "Please provide user id" });
    }

    const userID = users.findIndex(user => user.id === parseInt(id));
    if (userID === -1) {
        return res.status(404).send({ status: false, message: "User not found"})
    }

    let updatedUser = { ...users[userID], ...req.body };
    users[userID] = updatedUser;
    console.log(users)

    fs.writeFile("./user-data.json", JSON.stringify(users, null, 2), (err)=>{
        if(err){
            console.error("Error writing to file:", err);
            return res.status(500).send({ message: "Failed to save user data" });
        }
        return res.status(200).json(updatedUser);
    })

})


///// delete user ////
app.delete("/api/delete/:id", (req, res) => {
    const id = req.params.id;
    if(!id){
        return res.status(400).send({ satus: false, message: "Please provide user id" });
    }

    const userID = users.findIndex(user => user.id === parseInt(id));
    if(userID == -1){
        return res.status(404).send({ status: false, message: "User not found"})
    }

    const user = users.splice(userID, 1);

    fs.writeFile("./user-data.json", JSON.stringify(users, null, 2), (err)=>{
        if(err){
            console.error("Error writing to file:", err);
            return res.status(500).send({ message: "Failed to save user data" });
        }
        return res.status(200).send({ status: true, message: "success", user})
    })

})

//// patch user //////
app.patch("/api/patch/:id", (req, res) => {
    const id = req.params.id;
    if(!id){
        return res.status(400).send({ satus: false, message: "Please provide user id" });
    }

    const userID = users.findIndex(user => user.id === parseInt(id));
    if(userID == -1){
        return res.status(404).send({ status: false, message: "User not found"})
    }

    const user = users[userID];

    return res.status(200).send({ status: true, message: "success", user})

})

app.listen(PORT, () => {
    console.log("Server start with :: ", `http://localhost:${PORT}`)
})