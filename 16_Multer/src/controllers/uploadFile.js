const imageSchema = require("../models/imageSchema")
const upload = require("../multer/uploadFile")
const uploadImage = async (req, res) => {
    try {
        upload.single("image")(req, res, async (err) => {
            if (err) {
                return res.render("home", { message: "Error uploading image" });
            }

            if (!req.file) {
                return res.render("home", { message: "Pleae select the image" });
            }

            const image = new imageSchema({
                image: req.file.path
            })

            await image.save();

            res.render("home", { message: "Image uploaded successfully", url: req.file.path || 'hello' });
            
        })
    } catch (error) {
        return res.render("home", { message: error.message });
    }
}

module.exports = uploadImage