const router = require("express").Router()
const isLogin = require("../middleware/isLogin")
const isRole = require("../middleware/isRole")
const { 
    validateLogin, selectId, selectPw, createAccount, 
    selectUsersInfo, updateUserRole, selectUserInfo, updateUserInfo, deleteUser
 } = require("../service/users")

let conn
let rows

router.post("/login", async (req, res, next) => {
    const idValue = req.body.idValue
    const pwValue = req.body.pwValue

    try {
       rows = await validateLogin(idValue, pwValue)

       req.session.accountIdx = rows[0].idx
       req.session.name = rows[0].name
       req.session.roleIdx = rows[0].roleIdx
       res.status(200).send()
    } catch (err) {
        next(err)
    }
})

router.delete("/logout", isLogin, (req, res, next) => {
    try {
        req.session.destroy()
        res.status(200).send()
    } catch (err) {
        next(err)
    }
})

router.get("/find/id", async (req, res, next) => {
    const userName = req.body.userName
    const email = req.body.email

    try {
        rows = await selectId(userName, email)

        res.status(200).send({
            "idValue" : rows[0].id
        })
    } catch (err) {
        next(err)
    }
})

router.get("/find/pw", async (req, res, next) => {
    const userName = req.body.userName
    const idValue = req.body.idValue

    try {
        rows = await selectPw(userName, idValue)

        res.status(200).send({
            "pwValue" : rows[0].password
        })
    } catch (err) {
        next(err)
    }
})

router.post("/", async (req, res, next) => {
    const userName = req.body.userName
    const idValue = req.body.idValue
    const pwValue = req.body.pwValue
    const email = req.body.email
    const gender = req.body.gender
    const birth = req.body.birth

    try {
        await createAccount(userName, idValue, pwValue, email, gender, birth)
        res.status(200).send()
        // console.log(`userName : ${userName}`)
        // console.log(`idValue : ${idValue}`)
        // console.log(`pwValue : ${pwValue}`)
        // console.log(`email : ${email}`)
        // console.log(`gender : ${gender}`)
        // console.log(`birth : ${birth}`)
        // 나중에는 지워주기
        // develop / production -> if (모두가 develope일때만 실행) -> 환경변수로 해보기
    } catch (err) {
        next(err)
    }
})

router.get("/", isLogin, isRole, async (req, res, next) => {
    try {
        rows = await selectUsersInfo()

        res.status(200).send(rows)
    } catch (err) {
        next(err)
    }
})

router.put("/:userIdx/auth", isLogin, isRole, async(req, res, next) => {
    const userIdx = req.params.userIdx

    try {
        await updateUserRole(userIdx) 
        res.status(200).send()
    } catch (err) {
        next(err)
    }
})

router.get("/me", isLogin, async (req, res, next) => {
    const accountIdx = req.session.accountIdx

    try {
        rows = await selectUserInfo(accountIdx)
        res.status(200).send(rows)
    } catch (err) {
        next(err)
    }
})

router.put("/me", isLogin, async (req, res, next) => {
    const accountIdx = req.session.accountIdx
    const userName = req.body.userName
    const email = req.body.email
    const gender = req.body.gender
    const birth = req.body.birth

    try {
        await updateUserInfo(accountIdx, userName, email, gender, birth)
        res.status(200).send()
    } catch (err) {
        next(err)
    }
})

router.delete("/me", isLogin, async (req, res, next) => {{
    const accountIdx = req.session.accountIdx

    try {
        await deleteUser(accountIdx)
        res.status(200).send()
    } catch (err) {
        next(err)
    } finally {
        if (conn) return conn.end()
    }
}})

module.exports = router