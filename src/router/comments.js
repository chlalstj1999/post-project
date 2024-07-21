const router = require("express").Router()
const isLogin = require("../middleware/isLogin")
const isCommentUserMatch = require("../middleware/isCommentUserMatch")
const { createComment } = require("../service/comments")

let rows = null

router.post("/", isLogin, async (req, res, next) => {
    const accountIdx = req.session.accountIdx
    const postIdx = req.body.postIdx
    const comment = req.body.comment

    try {
        await createComment(accountIdx, postIdx, comment)
        res.status(200).send()
    } catch (err) {
        next(err)
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
        const rows = await conn.query(`SELECT comment.idx AS commentIdx, account.name AS userName, comment.content AS comment, comment.createdAt, comment.countLike AS cntCommentLike
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

router.post("/:commentIdx/like", isLogin, async (req, res, next) => {
    const accountIdx = req.session.accountIdx
    const commentIdx = req.params.commentIdx

    try {
        if (!commentIdx) {
            throw customError(400, "commentIdx 값이 안옴")
        }

        conn = await pool.getConnection()
        let rows = await conn.query("SELECT * FROM comment WHERE idx = ?", [commentIdx])
        if (rows.length === 0) {
            throw customError(404, "해당 댓글이 존재하지 않음")
        }

        rows = await conn.query("SELECT * FROM commentLike WHERE commentIdx = ? AND accountIdx = ?", [commentIdx, accountIdx])
        if (rows.length !== 0) {
            throw customError(409, "이미 좋아요 누른 유저임")
        }

        await conn.query("INSERT INTO commentLike (commentIdx, accountIdx) VALUES (?, ?)", [commentIdx, accountIdx])
        await conn.query(`UPDATE comment SET countLike = (
            SELECT COUNT(*)
            FROM commentLike 
            JOIN comment ON commentLike.commentIdx = comment.idx
            ) WHERE idx = ?`, [commentIdx])

        res.status(200).send()
    } catch (err) {
        next(err)
    } finally {
        if (conn) return conn.end()
    }
})

router.delete("/:commentIdx/like", isLogin, async (req, res, next) => {
    const accountIdx = req.session.accountIdx
    const commentIdx = req.params.commentIdx

    try {
        if (!commentIdx) {
            throw customError(400, "commentIdx 값이 안옴")
        }

        conn = await pool.getConnection()
        let rows = await conn.query("SELECT * FROM comment WHERE idx = ?", [commentIdx])
        if (rows.length === 0) {
            throw customError(404, "해당 댓글이 존재하지 않음")
        }

        rows = await conn.query("SELECT * FROM commentLike WHERE commentIdx = ? AND accountIdx = ?", [commentIdx, accountIdx])
        if (rows.length === 0) {
            throw customError(404, "좋아요 누른 유저가 아님")
        }

        await conn.query("DELETE FROM commentLike WHERE commentIdx = ? AND accountIdx = ?", [commentIdx, accountIdx])
        await conn.query(`UPDATE comment SET countLike = (
            SELECT COUNT(*)
            FROM commentLike 
            JOIN comment ON commentLike.commentIdx = comment.idx
            ) WHERE idx = ?`, [commentIdx])

        res.status(200).send()
    } catch (err) {
        next(err)
    } finally {
        if (conn) return conn.end()
    }
})

module.exports = router