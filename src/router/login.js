const router = require("express").Router()
const customError = require("../const/error")
const { idRegx, pwRegx } = require("../const/regx")

router.post("/", (req, res) => {
    const idValue = req.body.idValue
    const pwValue = req.body.pwValue

    try {
        if (!idValue.match(idRegx)) {
            throw customError(400, "아이디 형식이 잘못됨")
        } else if (!pwValue.match(pwRegx)) {
            throw customError(400, "비밀번호 형식이 잘못됨")
        } else if (idValue === "test12345" && pwValue === "test12345") {
            req.session.accountIdx = 1
            req.session.name = "name"
            req.session.roleIdx = 1
            res.status(200).send()
            console.log(req.session.accountIdx)
            console.log(req.session.name)
            console.log(req.session.roleIdx)
        } else {
            throw customError(404, "해당하는 계정 정보가 없습니다")
        }
    } catch (err) {
        res.status(err.statusCode || 500).send({
            "message" : err.message
        })
    }
})

module.exports = router