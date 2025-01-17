const jwt = require('jsonwebtoken');
// const fs = require("fs")
const secret = process.env.SECRET_KEY;
// let secret
// fs.readFile("./key.txt", "utf-8", (err, data) => {
//     if(err){
//         console.log(err)
//     }
//     else{
//         secret = data
//     }
// })

const setUserSesion = (user) => {
    const { _id, email } = user
    return jwt.sign({ _id, email }, secret, { expiresIn: '1h' });
}

const getUserSesion = (token) => {
    try {
        return jwt.verify(token, secret);
    } catch (err) {
        if(err.message = "invalid signature"){
            return null
        }
    }
}

module.exports = { setUserSesion, getUserSesion };
