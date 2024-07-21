const router = require("express").Router()
const isLogin = require("../middleware/isLogin")
const isRole = require("../middleware/isRole")
const { createCategory, selectCategory } = require("../service/categorys")

let rows

router.post("/", isLogin, isRole, async (req, res, next) => {
    const categoryName = req.body.categoryName

    try{
        await createCategory(categoryName)
        res.status(200).send()
    } catch (err) {
        next(err)
    }
})

router.get("/", async (req, res, next) => {
    try {    
        rows = await selectCategory()
        res.status(200).send(rows)
    } catch {
        next(err)
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
    }
})

module.exports = router