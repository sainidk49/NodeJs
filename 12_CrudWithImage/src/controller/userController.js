import upload, { deleteOldImage } from '../multer/uploadConfig.js';
import User from "../model/userModel.js";

//////////// fetch users ///////////
export const getUsers = async (req, res) => {
    try {
        const usersData = await User.find();
        if (!usersData || usersData.length === 0) {
            return res.status(404).json({ message: "Users data not found!" });
        }
        res.status(200).json(usersData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

//////////// fetch single user ///////////
export const getSingleUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const userData = await User.findById(userId);
        if (!userData) {
            return res.status(404).json({ message: "User not found!" });
        }
        res.status(200).json(userData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

//////////// create user ////////////
export const createUser = async (req, res) => {
    upload.single("profileImage")(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: "Error uploading file" });
        }

        try {
            if (!req.body || Object.keys(req.body).length === 0) {
                return res.status(400).json({ message: "User data not provided!" });
            }
            const userData = new User({
                ...req.body,
                profileImage: req.file ? req.file.path : undefined
            });

            const userSave = await userData.save();
            res.status(201).json(userSave);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    });
};

//////////// delete user ///////////
export const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const userData = await User.findById(userId);
        if (!userData) {
            return res.status(404).json({ message: "User not found." });
        }

        // Delete the old image if it exists
        if (userData.profileImage) {
            deleteOldImage(userData.profileImage);
        }

        const userDelete = await User.findByIdAndDelete(userId);
        res.status(200).json(userDelete);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

// //////////// update user ///////////
// export const updateUser = async (req, res) => {
//     upload.single("profileImage")(req, res, async (err) => {
//         if (err) {
//             return res.status(400).json({ message: "Error uploading file" });
//         }
//         try {
//             const userId = req.params.id;
//             const userData = await User.findById(userId);
//             if (!userData) {
//                 return res.status(404).json({ message: "User not found." });
//             }


//             // Delete old image if a new one is being uploaded
//             if (req.file && userData.profileImage) {
//                 deleteOldImage(userData.profileImage);
//             }
//             return res.status(200).json({userPro: userData.profileImage, bodyPro: req.file});
//             // const userUpdate = await User.findByIdAndUpdate(userId, {
//             //     ...req.body,
//             //     profileImage: req.file ? req.file.path : userData.profileImage
//             // }, { new: true });

//             // res.status(200).json(userUpdate);
//         } catch (error) {
//             console.error(error);
//             res.status(500).json({ error: error.message });
//         }
//     });
// };

//////////// update user ///////////
export const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const userData = await User.findById(userId);
        if (!userData) {
            return res.status(404).json({ message: "User not found." });
        }
        upload.single("profileImage")(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ message: "Error uploading file" });
            }
            // Delete old image if a new one is being uploaded
            if (req.file && userData.profileImage) {
                deleteOldImage(userData.profileImage);
            }
            const userUpdate = await User.findByIdAndUpdate(userId, {
                ...req.body,
                profileImage: req.file ? req.file.path : userData.profileImage
            }, { new: true });

            res.status(200).json(userUpdate);
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};