const router = require("express").Router()

router.post("/", (req, res) => {
    const userName = req.body.userName
    const idValue = req.body.idValue
    const pwValue = req.body.pwValue
    const email = req.body.email
    const phonenumber = req.body.phonenumber
    const gender = req.body.gender
    const birth = req.body.birth
})

router.post("/me", (req, res) => {
    res.send({
        "userName": userName,
        "email": email,
        "phonenumber": phonenumber,
        "gender": gender,
        "birth": birth
    })
})

router.put("/me", (req, res) => {
    const userName = req.body.userName
    const email = req.body.email
    const phonenumber = req.body.phonenumber
    const gender = req.body.gender
    const birth = req.body.birth
})

router.delete("/me", (req, res) => {{
    
}})

module.exports = router