const router = require("express").Router()

router.post("/", (req, res) => {
    const userName = req.body.userName
    const idValue = req.body.idValue
    const pwValue = req.body.pwValue
    const email = req.body.email
    const phonenumber = req.body.phonenumber
    const gender = req.body.gender
    const birth = req.body.birth

    res.send({
        "userName": userName,
        "idValue" : idValue,
        "pwValue" : pwValue,
        "email": email,
        "phonenumber": phonenumber,
        "gender": gender,
        "birth": birth
    })
})

router.get("/me", (req, res) => {
    const accountIdx = req.session.accountIdx

    if (accountIdx) {
        res.send({
            "userName": "test",
            "email": "test@example.com",
            "phonenumber": "test",
            "gender": "M",
            "birth": "2000-01-01"
        })
    } else {
        res.send("로그인 후 이용해주세요.")
    }
})

router.put("/me", (req, res) => {
    const accountIdx = req.session.accountIdx
    const userName = req.body.userName
    const email = req.body.email
    const phonenumber = req.body.phonenumber
    const gender = req.body.gender
    const birth = req.body.birth

    if (accountIdx != "" ) {
        res.send({
            "userName" : "test",
            "email" : "test@example.com",
            "phonenumber" : "test",
            "gender" : "M",
            "birth" : "2000-01-01"
        })
    } else {
        res.send("로그인 후 이용해주세요.")
    }
})

router.delete("/me", (req, res) => {{
    const accountIdx = req.session.accountIdx

    if (accountIdx != "") {
        res.send("회원 탈퇴가 완료되었습니다.")
    } else {
        res.send("로그인 후 이용해주세요.")
    }
}})

module.exports = router