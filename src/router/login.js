const router = require("express").Router()

router.post("/", (req, res) => {
    const idValue = req.body.idValue
    const pwValue = req.body.pwValue

    if (idValue == "testId" && pwValue == "testPw") {
        req.session.accountIdx = 1
        res.send({
            "session" : req.session.accountIdx
        })
    } else if (idValue == "" || pwValue == "") {
        res.send("아이디 또는 비밀번호를 입력해주세요.")
    } else {
        res.send("로그인 실패")
    }
})

module.exports = router