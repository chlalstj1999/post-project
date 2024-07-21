const router = require("express").Router()
const { idRegx, pwRegx, userNameRegx, emailRegx, genderRegx, birthRegx } = require("../const/regx")
const isLogin = require("../middleware/isLogin")
const isRole = require("../middleware/isRole")
const customError = require("./data/error")
const pool = require("./db/mariadb")
const { validateLogin, selectId, selectPw, createAccount, selectUsersInfo,
    updateUserRole
 } = require("../service/users")

let conn

router.post("/login", async (req, res, next) => {
    const idValue = req.body.idValue
    const pwValue = req.body.pwValue

    try {
       const account = await validateLogin(idValue, pwValue)

       req.session.accountIdx = account[0].idx
       req.session.name = account[0].name
       req.session.roleIdx = account[0].roleIdx
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
        const rows = await selectId(userName, email)

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
        const rows = await selectPw(userName, idValue)

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
        const usersInfo = await selectUsersInfo()

        res.status(200).send(usersInfo)
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
        conn = await pool.getConnection()
        const rows = await conn.query("SELECT name AS userName, email, gender, birth FROM account WHERE idx=?", [accountIdx])

        res.status(200).send(rows)
    } catch (err) {
        next(err)
    } finally {
        if (conn) return conn.end()
    }
})

router.put("/me", isLogin, async (req, res, next) => {
    const accountIdx = req.session.accountIdx
    const userName = req.body.userName
    const email = req.body.email
    const gender = req.body.gender
    const birth = req.body.birth

    try {
        if (!userName.match(userNameRegx)) {
            throw customError(400, "이름 형식이 잘못됨")
        } else if (!email.match(email)) {
            throw customError(400, "이메일 형식이 잘못됨")
        } else if (!gender.match(gender)) {
            throw customError(400, "성별 형식이 잘못됨")
        } else if (!birth.match(birth)) {
            throw customError(400, "생일 형식이 잘못됨")
        }
        
        conn = await pool.getConnection()
        const rows = await conn.query("SELECT email FROM account WHERE email = ? AND idx != ?", [email, accountIdx])

        if (rows.length !== 0) {
            throw customError(409, "이메일 중복")
        }

        await conn.query("UPDATE account SET name = ?, email = ?, gender = ?, birth = ? WHERE idx = ?", [userName, email, gender, birth, accountIdx])
        res.status(200).send()
    } catch (err) {
        next(err)
    } finally {
        if (conn) return conn.end()
    }
})

router.delete("/me", isLogin, async (req, res, next) => {{
    const accountIdx = req.session.accountIdx

    try {
        conn = await pool.getConnection()
        await conn.query("DELETE FROM account WHERE idx = ?", [accountIdx])
            
        res.status(200).send()
    } catch (err) {
        next(err)
    } finally {
        if (conn) return conn.end()
    }
}})

module.exports = router