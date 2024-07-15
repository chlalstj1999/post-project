const router = require("express").Router()
const { idRegx, pwRegx, userNameRegx, emailRegx, genderRegx, birthRegx } = require("../const/regx")
const customError = require("../const/error")

router.post("/", (req, res, next) => {
    const userName = req.body.userName
    const idValue = req.body.idValue
    const pwValue = req.body.pwValue
    const email = req.body.email
    const gender = req.body.gender
    const birth = req.body.birth

    try {
        if (!userName.match(userNameRegx)) {
            throw customError(400, "이름 형식이 잘못됨")
        } else if (!idValue.match(idRegx)) {
            throw customError(400, "아이디 형식이 잘못됨")
        } else if (!pwValue.match(pwRegx)) {
            throw customError(400, "비밀번호 형식이 잘못됨")
        } else if (!email.match(emailRegx)) {
            throw customError(400, "이메일 형식이 잘못됨")
        } else if (!gender.match(genderRegx)) {
            throw customError(400, "성별 형식이 잘못됨")
        } else if (!birth.match(birthRegx)) {
            throw customError(400, "생일 형식이 잘못됨")
        }

        if (idValue === "test12345") {
            throw customError(409, "아이디 중복")
        }

        if (email === "test12345@example.com") {
            throw customError(409, "이메일 중복")
        }

        res.status(200).send()
    } catch (err) {
        next(err)
    }
})

router.get("/", (req, res, next) => {
    const accountIdx = req.session.accountIdx
    const roleIdx = req.session.roleIdx

    try {
        if (!accountIdx) {
            throw customError(401, "로그인 필요")
        } else if (roleIdx != 1) {
            throw customError(409, "관리자 권한 필요")
        }

        res.status(200).send({
            "userName" : "최민서",
            "email" : "test12345@example.com",
            "roleName" : "user"
        })
    } catch (err) {
        next(err)
    }
})

router.put("/auth/:userIdx", (req, res, next) => {
    const accountIdx = req.session.accountIdx
    const roleIdx = req.session.roleIdx
    const userIdx = req.params.userIdx

    try {
        if (!accountIdx) {
            throw customError(401, "로그인 필요")
        } else if (roleIdx != 1) {
            throw customError(409, "관리자 권한 필요")
        } else if (!userIdx) {
            throw customError(400, "userIdx 안 옴")
        }

        if (userIdx != 2) {
            throw customError(404, "해당 user 존재하지 않음")
        }

        res.status(200).send()
    } catch (err) {
        next(err)
    }
})

router.get("/me", (req, res, next) => {
    const accountIdx = req.session.accountIdx

    try {
        if (!accountIdx) {
            throw customError(401, "로그인 필요")
        }

        res.status(200).send({
                "userName" : "최민서",
                "email" : "test12345@example.com",
                "gender" : "Men",
                "birth" : "2000-01-01"
        })
    } catch (err) {
        next(err)
    }
})

router.put("/me", (req, res, next) => {
    const accountIdx = req.session.accountIdx
    const userName = req.body.userName
    const email = req.body.email
    const gender = req.body.gender
    const birth = req.body.birth

    try {
        if (!accountIdx) {
            throw customError(401, "로그인 필요")
        } else if (!userName.match(userNameRegx)) {
            throw customError(400, "이름 형식이 잘못됨")
        } else if (!email.match(email)) {
            throw customError(400, "이메일 형식이 잘못됨")
        } else if (!gender.match(gender)) {
            throw customError(400, "성별 형식이 잘못됨")
        } else if (!birth.match(birth)) {
            throw customError(400, "생일 형식이 잘못됨")
        }
        
        if (email === "test12345@example.com") {
            throw customError(409, "이메일 중복")
        }

        res.status(200).send({
            "userName" : userName,
            "email" : email,
            "gender" : gender,
            "birth" : birth
        })
    } catch (err) {
        next(err)
    }
})

router.delete("/me", (req, res, next) => {{
    const accountIdx = req.session.accountIdx

    try {
        if (!accountIdx) {
            throw customError(401, "로그인 필요")
        }
            
        res.status(200).send()
    } catch (err) {
        next(err)
    }
}})

module.exports = router