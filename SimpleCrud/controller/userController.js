import User from "../model/userModel.js"

////////// create user ////////////////
export const create = async (req, res) => {
    try {
        const userData = new User(req.body);
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ message: "User data not provided." });
        }
        const savedData = await userData.save();
        console.log(savedData);
        res.status(201).json(savedData);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

//////////// get all users data ///////////
export const getUsers = async (req, res) => {
    try {
        const userData = await User.find();
        if (!userData || Object.keys(userData).length === 0) {
            return res.status(400).json({ message: "Users data not found." });
        }
        res.status(200).json(userData)
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

//////////// get one user data ///////////
export const getUser = async (req, res) => {
    try {
        const id = req.params.id;
        const userData = await User.findById(id);
        if (!userData || Object.keys(userData).length === 0) {
            return res.status(400).json({ message: "User not found." });
        }
        res.status(200).json(userData)
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

//////////// update user data ///////////
export const updateUser = async (req, res) => {
    try {
        const id = req.params.id;
        const userData = await User.findById(id);
        if (!userData || Object.keys(userData).length === 0) {
            return res.status(400).json({ message: "User not found." });
        }

        const userUpdate = await User.findByIdAndUpdate(id, req.body, {new: true});
        res.status(200).json(userUpdate)
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

//////////// update user data ///////////
export const deleteUser = async (req, res) => {
    try {
        const id = req.params.id;
        const userData = await User.findById(id);
        if (!userData || Object.keys(userData).length === 0) {
            return res.status(400).json({ message: "User not found." });
        }

        const userDelete = await User.findByIdAndDelete(id);
        res.status(200).json(userDelete)
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}
