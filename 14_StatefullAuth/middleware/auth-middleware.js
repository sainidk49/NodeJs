const { getUserSesion } = require("../services/auth-service");

const checkUserStatus = async (req, res, next) => {
    const userSessionId = req.cookies?.uid
    if(!userSessionId) return res.status(401).json({ message: "Unauthorized" })


    const user = await getUserSesion(userSessionId);
    if(!user) return res.status(401).json({ message: "Session out!" })

    req.user = user

    next()
}

const checkUserUrls = async (req, res, next) => {
    const userSessionId = req.cookies?.uid
    
    const user = await getUserSesion(userSessionId);

    req.user = user || null

    next()
}

module.exports = {checkUserStatus, checkUserUrls}