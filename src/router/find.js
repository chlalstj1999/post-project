const router = require("express").Router()
const customError = require("../const/error")
const { userNameRegx, emailRegx, idRegx } = require("../const/regx")

router.get("/id", (req, res, next) => {
    const userName = req.body.userName
    const email = req.body.email

    try {
        if (!userName.match(userNameRegx)) {
            throw customError(400, "이름 형식이 잘못됨")
        } else if (!email.match(emailRegx)) {
            throw customError(400, "이메일 형식이 잘못됨")
        } 
        
        if (userName === "최민서" && email === "test12345@example.com") {
            res.status(200).send({
                "idValue" : "test12345"
            })
        } else {
            throw customError(404, "계정 정보가 없음")
        }
    } catch (err) {
        next(err)
    }
})

router.get("/pw", (req, res, next) => {
    const userName = req.body.userName
    const idValue = req.body.idValue

    try {
        if (!userName.match(userNameRegx)) {
            throw customError(400, "이름 형식이 잘못됨")
        } else if (!idValue.match(idRegx)) {
            throw customError(400, "id 형식이 잘못됨")
        } 
        
        if (userName === "최민서" && idValue === "test12345") {
            res.status(200).send({
                "pwValue" : "test12345"
            })
        } else {
            throw customError(404, "계정 정보가 없음")
        }
    } catch (err) {
        next(err)
    }
})

module.exports = router