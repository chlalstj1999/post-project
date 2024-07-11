const router = require("express").Router()

router.delete("/", (req, res) => {
    req.session.destroy()

    res.send("로그아웃 완료")
})

module.exports = router