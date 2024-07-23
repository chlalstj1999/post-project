const customError = require("../router/data/error")

const checkLogin = param => {
    return (req, res, next) => {
        req.user = req.session
        const accountIdx = req.user[param]
    
        try {
            if (!accountIdx) {
                throw customError(401, "로그인 필요")
            }
            next()
        } catch (err) {
            next(err)
        }
    }
}

module.exports = checkLogin