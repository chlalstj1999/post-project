const router = require("express").Router()
const isLogin = require("../middleware/isLogin")
const isCommentUserMatch = require("../middleware/isCommentUserMatch")
const { createComment, updateComment, selectComments, deleteComment } = require("../service/comments")

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
        await updateComment(commentIdx, comment)
        res.status(200).send()
    } catch (err) {
        next(err)
    }
})

router.get("/", async(req, res, next) => {
    const postIdx = req.body.postIdx
    
    try {
        rows = await selectComments(postIdx)
        res.status(200).send(rows)
    } catch (err) {
        next(err)
    }
})

router.delete("/:commentIdx", isLogin, isCommentUserMatch, async (req, res, next) => {
    const commentIdx = req.params.commentIdx

    try {
        await deleteComment(commentIdx)
        res.status(200).send()
    } catch (err) {
        next(err)
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