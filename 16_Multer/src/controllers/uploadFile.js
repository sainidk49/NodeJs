const imageSchema = require("../models/imageSchema")
const upload = require("../multer/uploadFile")

const uploadImage = async (req, res) => {
    try {
        upload.single(image)(req, res, async (err)=>{
            if (err) {
                return res.render("home",{ message: "Error uploading image" });
            }
            const image = await new imageSchema({
                image: req.file.path
            })

            await image.save()

            res.render("home",{ message: "Image uploaded successfully" });
        })
    } catch (error) {
        return res.render("home",{ message: error.message });
    }
}

module.exports = uploadImage