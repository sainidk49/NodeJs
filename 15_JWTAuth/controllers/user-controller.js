const User = require("../models/user-model");
const bcrypt = require("bcryptjs");
const Cookies = require('cookies')

const { setUserSesion } = require("../services/auth-service")

const signupUser = async (req, res) => {
    try {
        if (Object.keys(req.body).length === 0) {
            return res.status(400).json({ status: false, message: "Please provide all required fields" });
        }

        // Check for missing fields
        for (const key in req.body) {
            if (!req.body[key]) {
                return res.status(400).json({ status: false, message: `Please provide ${key}` });
            }
        }

        const { name, email, password } = req.body;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ status: false, message: "Invalid email format" });
        }

        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ status: false, message: "Email already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            password: hashedPassword
        });

        await user.save();
        return res.status(201).json({ status: true, message: "User created successfully" });

    } catch (error) {
        console.log("Error", error);
        return res.status(500).json({ status: false, message: "Internal Server Error" });
    }
};


const loginUser = async (req, res) => {
    try {
        if (Object.keys(req.body).length === 0) {
            return res.status(400).json({ status: false, message: "Please provide all required fields" });
        }

        // Check for missing fields
        for (const key in req.body) {
            if (!req.body[key]) {
                return res.status(400).json({ status: false, message: `Please provide ${key}` });
            }
        }

        const { email, password } = req.body;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ status: false, message: "Invalid email format" });
        }


        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ status: false, message: "User not found" });
        }

        // check password
        const comparePassword = await bcrypt.compare(password, user.password);
        if (!comparePassword) {
            return res.status(401).json({ status: false, message: "Password is incorrect" });
        }

        const token = setUserSesion(user);

        const cookies = new Cookies(req, res);  
        cookies.set("token", token);

        return res.status(201).json({ status: true, message: "Login successfull" });

    } catch (error) {
        console.log("Error", error);
        return res.status(500).json({ status: false, message: "Internal Server Error" });
    }
};


module.exports = { signupUser, loginUser };
