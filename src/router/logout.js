const router = require("express").Router()
const customError = require("../const/error")

router.delete("/", (req, res, next) => {
    try {
        if (!req.session.accountIdx) {
            throw customError(401, "로그인 후 이용해주세요")
        } else {
            req.session.destroy()
            res.status(200).send()
        }
    } catch (err) {
        next(err)
    }
})

module.exports = router