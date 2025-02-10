const imageSchema = require("../models/imageSchema")
const upload = require("../multer/uploadFile")
const uploadImage = async (req, res) => {
    try {
        upload.single("image")(req, res, async (err) => {
            if (err) {
                return res.status(401).json({status:false,  message: "Error uploading image" });
            }

            if (!req.file) {
                return res.status(400).json({status:false,  message: "Pleae select the image" });
            }
            let fileDes = req.file.destination.includes("public") ? req.file.destination.replace("public/", "") : req.file.destination
            let filePath = fileDes + "/" + req.file.filename
            const image = new imageSchema({
                image: filePath
            })

            await image.save();

            return res.status(201).json({ status: true, message: "Image uploaded successfully", url: filePath || 'hello' });

        })
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
}

module.exports = uploadImage