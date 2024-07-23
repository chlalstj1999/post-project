const router = require("express").Router()
const isLogin = require("../middleware/isLogin")
const regx = require("../const/regx")
const commentService = require("../service/comments")
const isRegxMatch = require("../middleware/isRegxMatch")
const customError = require("./data/error")

router.post("/", isLogin('accountIdx'), isRegxMatch([['comment', regx.commentRegx]]), async (req, res, next) => {
    const accountIdx = req.user.accountIdx
    const postIdx = req.body.postIdx
    const comment = req.body.comment

    try {
        if (!postIdx.match(regx.idxRegx)) {
            throw customError(400, "categoryIdx값이 안 옴")
        } 

        await commentService.createComment(accountIdx, postIdx, comment)
        res.status(200).send()
    } catch (err) {
        next(err)
    }
})

router.put("/:commentIdx", isLogin('accountIdx'), isRegxMatch([['comment', regx.commentRegx]]), async (req, res, next) => {
    const accountIdx = req.user.accountIdx
    const commentIdx = req.params.commentIdx
    const comment = req.body.comment

    try {
        if (!commentIdx.match(regx.idxRegx)) {
            throw customError(400, "categoryIdx값이 안 옴")
        } 

        await commentService.updateComment(accountIdx, commentIdx, comment)
        res.status(200).send()
    } catch (err) {
        next(err)
    }
})

router.get("/", async(req, res, next) => {
    const postIdx = req.body.postIdx
    
    try {
        if (!postIdx.match(regx.idxRegx)) {
            throw customError(400, "categoryIdx값이 안 옴")
        } 

        const comments = await commentService.selectComments(postIdx)
        res.status(200).send(comments)
    } catch (err) {
        next(err)
    }
})

router.delete("/:commentIdx", isLogin('accountIdx'), async (req, res, next) => {
    const commentIdx = req.params.commentIdx

    try {
        if (!commentIdx.match(regx.idxRegx)) {
            throw customError(400, "categoryIdx값이 안 옴")
        } 

        await commentService.deleteComment(commentIdx)
        res.status(200).send()
    } catch (err) {
        next(err)
    }
})

router.put("/:commentIdx/like", isLogin('accountIdx'), async (req, res, next) => {
    const accountIdx = req.user.accountIdx
    const commentIdx = req.params.commentIdx

    try {
        if (!commentIdx.match(regx.idxRegx)) {
            throw customError(400, "categoryIdx값이 안 옴")
        } 

        await commentService.commentLike(accountIdx, commentIdx)
        res.status(200).send()
    } catch (err) {
        next(err)
    }
})

module.exports = router