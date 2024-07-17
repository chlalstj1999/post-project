const router = require("express").Router()
const { categoryNameRegx } = require("../const/regx")
const customError = require("./data/error")
const isLogin = require("../middleware/isLogin")
const isRole = require("../middleware/isRole")
const pool = require("./db/mariadb")

let conn

router.post("/", isLogin, isRole, async (req, res, next) => {
    const categoryName = req.body.categoryName

    try{
        if (!categoryName.match(categoryNameRegx)) {
            throw customError(401, "카테고리 이름 형식 확인 필요")
        }
        
        conn = await pool.getConnection()
        const rows = await conn.query("SELECT name FROM category WHERE name = ?", [categoryName])

        if (rows.length !== 0) {
            throw customError(409, "카테고리가 이미 있음")
        }

        await conn.query("INSERT INTO category (name) VALUES (?)", [categoryName])

        res.status(200).send()
    } catch (err) {
        next(err)
    } finally {
        if (conn) return conn.end()
    }
})

router.get("/", async (req, res, next) => {
    try {    
        conn = await pool.getConnection()
        const rows = await conn.query("SELECT idx AS categoryIdx, name AS categoryName FROM category")

        res.status(200).send(rows)
    } catch {
        next(err)
    } finally {
        if (conn) return conn.end()
    }
})

router.put("/:categoryIdx", isLogin, isRole, async (req, res, next) => {
    const categoryIdx = req.params.categoryIdx
    const categoryName = req.body.categoryName

    try {
        if (!categoryName.match(categoryNameRegx)) {
            throw customError(400, "카테고리 이름 형식 확인 필요")
        } else if (!categoryIdx) {
            throw customError(400, "categoryIdx 값이 오지 않음")
        }

        conn = await pool.getConnection()
        let rows = await conn.query("SELECT * FROM category WHERE idx = ?", [categoryIdx])

        if (rows.length === 0) {
            throw customError(404, "해당 카테고리가 존재하지 않음")
        }

        rows = await conn.query("SELECT * FROM category WHERE name = ?", [categoryName])
    
        if (rows.length !== 0) {
            throw customError(409, "카테고리가 이미 있음")
        }

        await conn.query("UPDATE category SET name = ? WHERE idx = ?", [categoryName, categoryIdx])
    
        res.status(200).send()
    } catch (err) {
        next(err)
    } finally {
        if (conn) return conn.end()
    }
})

router.delete("/:categoryIdx", isLogin, isRole, async (req, res, next) => {
    const categoryIdx = req.params.categoryIdx
    
    try {
        if (!categoryIdx) {
            throw customError(400, "categoryIdx 값이 오지 않음")
        }

        conn = await pool.getConnection()
        const rows = await conn.query("SELECT * FROM category WHERE idx = ?", [categoryIdx])
    
        if (rows.length === 0) {
            throw customError(404, "해당 카테고리가 존재하지 않음")
        }

        await conn.query("DELETE FROM category WHERE idx = ?", [categoryIdx])
    
        res.status(200).send()
    } catch (err) {
        next(err)
    } finally {
        if (conn) return conn.end()
    }
})

module.exports = router