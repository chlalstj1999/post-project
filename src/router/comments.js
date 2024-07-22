const router = require("express").Router()
const isLogin = require("../middleware/isLogin")
const isCommentUserMatch = require("../middleware/isCommentUserMatch")
const customError = require("./data/error")
const { commentRegx } = require("../const/regx")
const { createComment, updateComment, selectComments, deleteComment, commentLike } = require("../service/comments")

router.post("/", isLogin, async (req, res, next) => {
    const accountIdx = req.user.accountIdx
    const postIdx = req.body.postIdx
    const comment = req.body.comment

    try {
        if (!postIdx) {
            throw customError(400, "postIdx 값이 안옴")
        } else if (!comment.match(commentRegx)) {
            throw customError(400, "댓글 형식 확인 필요")
        }

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

        await updateComment(commentIdx, comment)
        res.status(200).send()
    } catch (err) {
        next(err)
    }
})

router.get("/", async(req, res, next) => {
    const postIdx = req.body.postIdx
    
    try {
        if (!postIdx) {
            throw customError(400, "postIdx 값이 안옴")
        }

        const comments = await selectComments(postIdx)
        res.status(200).send(comments)
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

router.put("/:commentIdx/like", isLogin, async (req, res, next) => {
    const accountIdx = req.user.accountIdx
    const commentIdx = req.params.commentIdx

    try {
        if (!commentIdx) {
            throw customError(400, "commentIdx 값이 안옴")
        }

        await commentLike(accountIdx, commentIdx)
        res.status(200).send()
    } catch (err) {
        next(err)
    }
})

module.exports = router