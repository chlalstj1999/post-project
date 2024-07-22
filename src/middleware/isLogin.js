const customError = require("../router/data/error")

const checkLogin = (req, res, next) => {
    const accountIdx = req.session.accountIdx

    req.user = req.session

    try {
        if (!accountIdx) {
            throw customError(401, "로그인 필요")
        }
        next()
    } catch (err) {
        next(err)
    }
}

module.exports = checkLogin