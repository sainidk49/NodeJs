const multer = require("multer")
const fs = require('fs');
const path = require('path');

const uploadDir = 'public/uploads'

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const uploadfolder = uploadDir.split("/")[1]
console.log(uploadfolder)

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadfolder);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname);
    }
})

const upload = multer({ storage: storage });

module.exports = upload