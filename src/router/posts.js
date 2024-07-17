const router = require("express").Router()
const customError = require("./data/error")
const { postTitleRegx, postContentRegx } = require("../const/regx")
const pool = require("./db/mariadb")
const checkLogin = require("../middleware/checkLogin")
const checkUserMatch = require("../middleware/checkUserMatch")

let conn

router.get("/list", async (req, res, next) => {
    const categoryIdx = req.query.categoryIdx

    try {
        if (!categoryIdx) {
            throw customError(400, "categoryIdx 값이 없음")
        }
        
        conn = await pool.getConnection()
        let rows = await conn.query("SELECT * FROM category WHERE idx = ?", [categoryIdx])

        if (rows.length === 0) {
            throw customError(404, "해당 카테고리가 존재하지 않음")
        }

        rows = await conn.query(`SELECT post.idx AS postIdx, account.name AS userName, post.title, post.createdAt 
            FROM post 
            JOIN account 
            ON accountIdx = account.idx ORDER BY post.createdAt DESC`)

        res.status(200).send(rows)
    } catch (err) {
        next(err)
    } finally {
        if (conn) return conn.end()
    }
}) 

router.post("/", checkLogin, async (req, res, next) => {
    const accountIdx = req.session.accountIdx
    const categoryIdx = req.body.categoryIdx
    const title = req.body.title
    const content = req.body.content

    try {
        if (!categoryIdx) {
            throw customError(400, "categoryIdx 값이 안옴")
        } else if (!title.match(postTitleRegx)) {
            throw customError(400, "제목 형식 확인 필요")
        } else if (!content.match(postContentRegx)) {
            throw customError(400, "내용 형식 확인 필요")
        }

        conn = await pool.getConnection()
        const rows = await conn.query("SELECT * FROM category WHERE idx = ?", [categoryIdx])

        if (rows.length === 0) {
            throw customError(404, "해당 카테고리가 존재하지 않음")
        }

        await conn.query("INSERT INTO post (accountIdx, title, content, categoryIdx, countLike) VALUES (?, ?, ?, ?, ?)", [accountIdx, title, content, categoryIdx, 0])

        res.status(200).send()
    } catch (err) {
        next(err)
    } finally {
        if (conn) return conn.end()
    }
})

router.put("/:postIdx", checkLogin, checkUserMatch, async (req, res, next) => {
    const postIdx = req.params.postIdx
    const title = req.body.title
    const content = req.body.content

    try {
        if (!title.match(postTitleRegx)) {
            throw customError(400, "제목 형식 확인 필요")
        } else if (!content.match(postContentRegx)) {
            throw customError(400, "내용 형식 확인 필요")
        }

        conn = await pool.getConnection()
        await conn.query("UPDATE post SET title = ?, content = ? WHERE idx = ?", [title, content, postIdx])

        res.status(200).send()
    } catch (err) {
        next(err)
    } finally {
        if (conn) return conn.end()
    }
})

router.get("/:postIdx", async (req, res, next) => {
    const postIdx = req.params.postIdx
    
    try {
        if (!postIdx) {
            throw customError(400, "postIdx 값이 안옴")
        }

        conn = await pool.getConnection()
        const rows = await conn.query(`SELECT post.idx AS postIdx, account.name AS userName, post.title, post.content, post.createdAt, post.countLike AS cntPostLike
            FROM post JOIN account ON post.accountIdx = account.idx WHERE post.idx = ?`, [postIdx])

        if (rows.length === 0) {
            throw customError(404, "해당 게시물이 존재하지 않음")
        }

        res.status(200).send(rows)
    } catch (err) {
        next(err)
    } finally {
        if (conn) return conn.end()
    }
})

router.delete("/:postIdx", checkLogin, checkUserMatch, async (req, res, next) => {
    const postIdx = req.params.postIdx

    try {
        conn = await pool.getConnection()
        await conn.query("DELETE FROM post WHERE idx = ?", [postIdx])

        res.status(200).send()
    } catch (err) {
        next(err)
    } finally {
        if (conn) return conn.end()
    }
})

router.post("/:postIdx/like", checkLogin, async (req, res, next) => {
    const accountIdx = req.session.accountIdx
    const postIdx = req.params.postIdx

    try {
        if (!postIdx) {
            throw customError(400, "postIdx 값이 안옴")
        }

        conn = await pool.getConnection()
        let rows = await conn.query("SELECT * FROM post WHERE idx = ?", [postIdx])
        if (rows.length === 0) {
            throw customError(404, "해당 게시물이 존재하지 않음")
        }

        rows = await conn.query("SELECT * FROM postLike WHERE postIdx = ? AND accountIdx = ?", [postIdx, accountIdx])
        if (rows.length !== 0) {
            throw customError(409, "이미 좋아요 누른 유저임")
        }

        await conn.query("INSERT INTO postLike (postIdx, accountIdx) VALUES (?, ?)", [postIdx, accountIdx])
        await conn.query(`UPDATE post SET countLike = (
            SELECT COUNT(*)
            FROM postLike 
            JOIN post ON postLike.postIdx = post.idx
            ) WHERE idx = ?`, [postIdx])

        res.status(200).send()
    } catch (err) {
        next(err)
    } finally {
        if (conn) return conn.end()
    }
})

router.delete("/:postIdx/like", checkLogin, async (req, res, next) => {
    const accountIdx = req.session.accountIdx
    const postIdx = req.params.postIdx

    try {
        if (!postIdx) {
            throw customError(400, "postIdx 값이 안옴")
        }

        conn = await pool.getConnection()
        let rows = await conn.query("SELECT * FROM post WHERE idx = ?", [postIdx])
        if (rows.length === 0) {
            throw customError(404, "해당 게시물이 존재하지 않음")
        }

        rows = await conn.query("SELECT * FROM postLike WHERE postIdx = ? AND accountIdx = ?", [postIdx, accountIdx])
        if (rows.length === 0) {
            throw customError(404, "좋아요 누른 유저가 아님")
        }

        await conn.query("DELETE FROM postLike WHERE postIdx = ? AND accountIdx = ?", [postIdx, accountIdx])
        await conn.query(`UPDATE post SET countLike = (
            SELECT COUNT(*)
            FROM postLike 
            JOIN post ON postLike.postIdx = post.idx
            ) WHERE idx = ?`, [postIdx])

        res.status(200).send()
    } catch (err) {
        next(err)
    } finally {
        if (conn) return conn.end()
    }
})

module.exports = router