const router = require("express").Router()
const isLogin = require("../middleware/isLogin")
const isAdmin = require("../middleware/isAdmin")
const regx = require("../const/regx")
const userService = require("../service/users")
const isRegxMatch = require("../middleware/isRegxMatch")
const customError = require("./data/error")

router.post("/login", isRegxMatch([['idValue', regx.idRegx],['pwValue', regx.pwRegx]]), async (req, res, next) => {
    const idValue = req.body.idValue
    const pwValue = req.body.pwValue

    try {
        const account = await userService.validateLogin(idValue, pwValue)

        req.session.accountIdx = account.idx
        req.session.name = account.name
        req.session.roleIdx = account.roleIdx
        res.status(200).send()
    } catch (err) {
        next(err)
    }
})

router.delete("/logout", isLogin('accountIdx'), (req, res, next) => {
    try {
        req.session.destroy()
        res.status(200).send()
    } catch (err) {
        next(err)
    }
})

router.get("/find/id", isRegxMatch([['userName', regx.userNameRegx], ['email', regx.emailRegx]]), async (req, res, next) => {
    const userName = req.body.userName
    const email = req.body.email

    try {
        const account = await userService.selectId(userName, email)
        res.status(200).send(account)
    } catch (err) {
        next(err)
    }
})

router.get("/find/pw", isRegxMatch([['userName', regx.userNameRegx],['idValue', regx.idRegx]]), async (req, res, next) => {
    const userName = req.body.userName
    const idValue = req.body.idValue

    try {
        const account = await userService.selectPw(userName, idValue)
        res.status(200).send(account)
    } catch (err) {
        next(err)
    }
})

router.post("/", isRegxMatch([
    ['userName', regx.userNameRegx],
    ['idValue', regx.idRegx],
    ['pwValue', regx.pwRegx],
    ['email', regx.emailRegx],
    ['gender', regx.genderRegx],
    ['birth', regx.birthRegx]
]), async (req, res, next) => {
    const userName = req.body.userName
    const idValue = req.body.idValue
    const pwValue = req.body.pwValue
    const email = req.body.email
    const gender = req.body.gender
    const birth = req.body.birth

    try {
        await userService.createAccount(userName, idValue, pwValue, email, gender, birth)
        res.status(200).send()
    } catch (err) {
        next(err)
    }
})

router.get("/", isLogin('accountIdx'), isAdmin, async (req, res, next) => {
    try {
        const usersInfo = await userService.selectUsersInfo()
        res.status(200).send(usersInfo)
    } catch (err) {
        next(err)
    }
})

router.put("/:userIdx/auth", isLogin('accountIdx'), isAdmin, async(req, res, next) => {
    const userIdx = req.params.userIdx

    try {
        if (!userIdx.match(regx.idxRegx)) {
            throw customError(400, "userIdx 값이 안 옴")
        }

        await userService.updateUserRole(userIdx) 
        res.status(200).send()
    } catch (err) {
        next(err)
    }
})

router.get("/me", isLogin('accountIdx'), async (req, res, next) => {
    const accountIdx = req.user.accountIdx

    try {
        const userInfo = await userService.selectUserInfo(accountIdx)
        res.status(200).send(userInfo)
    } catch (err) {
        next(err)
    }
})

router.put("/me", isLogin('accountIdx'), isRegxMatch([
    ['userName', regx.userNameRegx],
    ['email', regx.emailRegx],
    ['gender', regx.genderRegx],
    ['birth', regx.birthRegx]
]), async (req, res, next) => {
    const accountIdx = req.user.accountIdx
    const userName = req.body.userName
    const email = req.body.email
    const gender = req.body.gender
    const birth = req.body.birth

    try {
        await userService.updateUserInfo(accountIdx, userName, email, gender, birth)
        res.status(200).send()
    } catch (err) {
        next(err)
    }
})

router.delete("/me", isLogin('accountIdx'), async (req, res, next) => {{
    const accountIdx = req.user.accountIdx

    try {
        await userService.deleteUser(accountIdx)
        res.status(200).send()
    } catch (err) {
        next(err)
    }
}})

module.exports = router