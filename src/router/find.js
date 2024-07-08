const router = require("express").Router()

router.get("/id", (req, res) => {
    const userName = req.body.userName
    const phonenumber = req.body.phonenumber

    res.send({
        "idValue": idValue
    })
})

router.get("/pw", (req, res) => {
    const userName = req.body.userName
    const idValue = req.body.idValue

    res.send({
        "pwValue": pwValue
    })
})

module.exports = router