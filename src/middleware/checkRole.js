const customError = require("../router/data/error")
const { admin } = require("../const/role")

const checkLogin = (req, res, next) => {
    const roleIdx = req.session.roleIdx

    try {
        if ( roleIdx !== admin ) {
            throw customError(401, "관리자 권한 필요")
        }
        next()
    } catch (err) {
        next(err)
    }
}

module.exports = checkLogin