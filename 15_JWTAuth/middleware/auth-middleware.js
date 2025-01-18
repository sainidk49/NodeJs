const { getUserSesion } = require("../services/auth-service");

const checkUserStatus = async (req, res, next) => {
    const token = req.cookies?.token
    if (!token) return res.status(401).json({ status: false, message: "You must be logged in to access this page", page: "/login" })


    const user = await getUserSesion(token);
    if (!user) return res.status(401).json({ status: false, message: "Invalid token", page: "/login" })

    req.user = user

    next()
}

const checkUserUrls = async (req, res, next) => {
    const userSessionId = req.cookies?.token

    const user = await getUserSesion(userSessionId);
    
    req.user = user || null

    next()
}

module.exports = { checkUserStatus, checkUserUrls }