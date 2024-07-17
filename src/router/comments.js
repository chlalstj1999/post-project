const router = require("express").Router()
const customError = require("./data/error")
const { commentRegx } = require("../const/regx")
const isLogin = require("../middleware/isLogin")
const isCommentUserMatch = require("../middleware/isCommentUserMatch")
const pool = require("./db/mariadb")
let conn

router.post("/", isLogin, async (req, res, next) => {
    const accountIdx = req.session.accountIdx
    const postIdx = req.body.postIdx
    const comment = req.body.comment

    try {
        if (!postIdx) {
            throw customError(400, "postIdx 값이 안옴")
        } else if (!comment.match(commentRegx)) {
            throw customError(400, "댓글 형식 확인 필요")
        }

        conn = await pool.getConnection()
        const rows = await conn.query("SELECT * FROM post WHERE idx = ?", [postIdx])

        if (rows.length === 0) {
            throw customError(404, "해당 게시물이 존재하지 않음")
        }

        await conn.query("INSERT INTO comment (postIdx, accountIdx, content, countLike) VALUES (?, ?, ?, ?)", [postIdx, accountIdx, comment, 0])

        res.status(200).send()

    } catch (err) {
        next(err)
    } finally {
        if (conn) return conn.end()
    }
})

router.put("/:commentIdx", isLogin, isCommentUserMatch, async (req, res, next) => {
    const commentIdx = req.params.commentIdx
    const comment = req.body.comment

    try {
        if (!comment.match(commentRegx)) {
            throw customError(400, "댓글 형식 확인 필요")
        }

        conn = await pool.getConnection()
        await conn.query("UPDATE comment SET content = ? WHERE idx = ?", [comment, commentIdx])

        res.status(200).send()
    } catch (err) {
        next(err)
    } finally {
        if (conn) return conn.end()
    }
})

router.get("/", async(req, res, next) => {
    const postIdx = req.body.postIdx
    
    try {
        if (!postIdx) {
            throw customError(400, "postIdx 값이 안옴")
        }
        
        conn = await pool.getConnection()
        const rows = await conn.query(`SELECT comment.idx AS commentIdx, account.name AS userName, comment.content, comment.createdAt, comment.countLike AS cntCommentLike
            FROM comment JOIN account ON comment.accountIdx = account.idx WHERE comment.postIdx = ? ORDER BY comment.createdAt DESC`, [postIdx])

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

router.delete("/:commentIdx", isLogin, isCommentUserMatch, async (req, res, next) => {
    const commentIdx = req.params.commentIdx

    try {
        conn = await pool.getConnection()
        await conn.query("DELETE FROM comment WHERE idx = ?", [commentIdx])

        res.status(200).send()
    } catch (err) {
        next(err)
    } finally {
        if (conn) return conn.end()
    }
})

router.post("/:commentIdx/like", (req, res, next) => {
    const accountIdx = req.session.accountIdx
    const commentIdx = req.params.commentIdx

    try {
        if (!accountIdx) {
            throw customError(401, "로그인 필요")
        } else if (!postIdx) {
            throw customError(400, "postIdx 값이 안옴")
        } else if (!commentIdx) {
            throw customError(400, "commentIdx 값이 안옴")
        }

        if (postIdx != 1) {
            throw customError(404, "해당 게시물이 존재하지 않음")
        }

        if (commentIdx != 1) {
            throw customError(404, "해당 댓글이 존재하지 않음")
        }

        res.status(200).send()
    } catch (err) {
        next(err)
    }
})

router.delete("/:commentIdx/like", (req, res, next) => {
    const accountIdx = req.session.accountIdx
    const commentIdx = req.params.commentIdx

    try {
        if (!accountIdx) {
            throw customError(401, "로그인 필요")
        } else if (!postIdx) {
            throw customError(400, "postIdx 값이 안옴")
        } else if (!commentIdx) {
            throw customError(400, "commentIdx 값이 안옴")
        }

        if (postIdx != 1) {
            throw customError(404, "해당 게시물이 존재하지 않음")
        }

        if (commentIdx != 1) {
            throw customError(404, "해당 댓글이 존재하지 않음")
        }

        res.status(200).send()
    } catch (err) {
        next(err)
    }
})

module.exports = router