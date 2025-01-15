const map = new Map();

const setUserSesion = (sessionId, user) => {
    map.set(sessionId, user)
}

const getUserSesion = (sessionId) => {
    return map.get(sessionId)
}

module.exports = { setUserSesion, getUserSesion }