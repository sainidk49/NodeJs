import upload, { deleteOldImage, saveImageFromUrl } from '../multer/uploadConfig.js';
import User from "../model/userModel.js";

//////////// create user ////////////
const validateUserData = (data) => {
    const requiredFields = ['name', 'email', 'mobile', 'category', 'workType', 'state', 'city', 'area', 'cityPin'];
    for (let field of requiredFields) {
        if (!data[field]) {
            return { status: false, message: `${field} is required` };
        }
        if (field === 'email' && !(/\S+@\S+\.\S+/.test(data[field]))) {
            return { status: false, message: `${field} address is invalid` };
        }
        if (field === 'mobile' && !(/^\d{10}$/.test(data[field]))) {
            return { status: false, message: `${field} number must be exactly 10 digits` };
        }
    }
    return { status: true };
};

export const createUser = async (req, res) => {
    const contentType = req.headers['content-type'];
    //// handle json data request
    if (contentType === 'application/json') {
        let fileImage = '';
        try {
            if (!req.body || Object.keys(req.body).length === 0) {
                return res.status(400).json({ status: false, message: 'User data not provided!' });
            }

            const validation = validateUserData(req.body);
            if (!validation.status) {
                return res.status(400).json(validation);
            }

            if (req.body.profileImage) {
                fileImage = await saveImageFromUrl(req.body.profileImage);
            }

            const userData = new User({
                ...req.body,
                profileImage: fileImage
            });

            const userSave = await userData.save();
            res.status(201).json({ status: true, message: 'Success.', data: userSave });
        } catch (error) {
            if (fileImage) {
                deleteOldImage(fileImage);
            }
            if (error.code === 11000) {
                return res.status(400).json({ status: false, message: 'Email may already be in use.' });
            }
            res.status(500).json({ status: false, error: error.message });
        }
    }
    //// handle form data request
    else {
        upload.single('profileImage')(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ status: false, message: 'Error uploading file' });
            }

            try {
                if (!req.body || Object.keys(req.body).length === 0) {
                    return res.status(400).json({ status: false, message: 'User data not provided!' });
                }

                const validation = validateUserData(req.body);
                if (!validation.status) {
                    return res.status(400).json(validation);
                }

                const userData = new User({
                    ...req.body,
                    profileImage: req.file ? req.file.path : ''
                });

                const userSave = await userData.save();
                res.status(201).json({ status: true, message: 'Success.', data: userSave });
            } catch (error) {
                if (req.file) {
                    deleteOldImage(req.file.path);
                }
                if (error.code === 11000) {
                    return res.status(400).json({ status: false, message: 'Email may already be in use.' });
                }
                res.status(500).json({ status: false, error: error.message });
            }
        });
    }
};


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
        const userId = req.body.id;
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


//////////// delete user ///////////
export const deleteUser = async (req, res) => {
    try {
        const userId = req.body.id;
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


//////////// update user ///////////
export const updateUser = async (req, res) => {
    const contentType = req.headers['content-type'];
    // return res.status(200).json({ status: true, contentType: contentType});
    if (contentType === 'application/json') {
        try {
            const userId = req.body.id;

            if (!userId) {
                return res.status(400).json({ message: "User id is invalid" });
            }

            const userData = await User.findById(userId);

            if (!userData) {
                return res.status(404).json({ message: "User not found." });
            }

            // Update profileImage if provided
            let fileImage = userData.profileImage;
            if (req.body.profileImage) {
                if (userData.profileImage) {
                    const fileDeleted = await deleteOldImage(userData.profileImage);
                    if (fileDeleted) {
                        fileImage = await saveImageFromUrl(req.body.profileImage);
                    }
                } else {
                    fileImage = await saveImageFromUrl(req.body.profileImage);
                }
            }

            const userUpdate = await User.findByIdAndUpdate(
                userId,
                { ...req.body, profileImage: fileImage },
                { new: true, runValidators: true }
            );

            return res.status(200).json({ status: true, message: 'Success.', data: userUpdate });
        } catch (error) {
            console.error(error); // Log the error for debugging
            return res.status(500).json({ status: false, message: "Internal server error." });
        }
    }
    else {
        upload.single("profileImage")(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ status: false, message: "Error uploading file" });
            }
            try {
                const userId = req.body.id;
                if (!userId) {
                    return res.status(404).json({ status: false, message: "User id is invaild" });
                }
                const userData = await User.findById(userId);
                if (!userData) {
                    return res.status(404).json({ status: false, message: "User not found." });
                }
                // Delete old image if a new one is being uploaded
                if (req.file && userData.profileImage) {
                    deleteOldImage(userData.profileImage);
                }

                const userUpdate = await User.findByIdAndUpdate(userId, {
                    ...req.body,
                    profileImage: req.file ? req.file.path : userData.profileImage
                }, { new: true });

                res.status(200).json({ status: true, message: 'Success.', data: userUpdate });
            } catch (error) {
                // Delete old image if a new one is being uploaded
                if (req.file) {
                    deleteOldImage(req.file.path);
                }
                res.status(400).json({ status: false, message: error.message });
            }
        });
    }
};