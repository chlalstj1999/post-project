const router = require("express").Router()

router.get("/id", (req, res) => {
    const userName = req.body.userName
    const phonenumber = req.body.phonenumber

    if (userName == "test" && phonenumber == "test") {
        res.send({
            "idValue": "testId"
        })
    } else {
        res.send("존재하지 않는 계정입니다.")
    }
})

router.get("/pw", (req, res) => {
    const userName = req.body.userName
    const idValue = req.body.idValue

    if (userName == "test" && idValue == "testId") {
        res.send({
            "pwValue": "testPw"
        })
    } else {
        res.send("존재하지 않는 계정입니다.")
    }
})

module.exports = router