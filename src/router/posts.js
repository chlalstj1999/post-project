const router = require("express").Router()
const isLogin = require("../middleware/isLogin")
const regx = require("../const/regx")
const postService = require("../service/posts")
const isRegxMatch = require("../middleware/isRegxMatch")
const customError = require("./data/error")

router.get("/list", async (req, res, next) => {
    const categoryIdx = req.query.categoryIdx

    try {
        if (!categoryIdx.match(regx.idxRegx)) {
            throw customError(400, "categoryIdx값이 안 옴")
        } 

        const posts = await postService.selectPosts(categoryIdx)
        res.status(200).send(posts)
    } catch (err) {
        next(err)
    }
}) 

router.post("/", isLogin('accountIdx'), isRegxMatch([['title', regx.postTitleRegx],['content', regx.postContentRegx]]), async (req, res, next) => {
    const accountIdx = req.user.accountIdx
    const categoryIdx = req.body.categoryIdx
    const title = req.body.title
    const content = req.body.content

    try {
        if (!categoryIdx.match(regx.idxRegx)) {
            throw customError(400, "categoryIdx값이 안 옴")
        } 

        await postService.createPost(accountIdx, categoryIdx, title, content)
        res.status(200).send()
    } catch (err) {
        next(err)
    }
})

router.put("/:postIdx", isLogin('accountIdx'), isRegxMatch([['title', regx.postTitleRegx],['content', regx.postContentRegx]]), async (req, res, next) => {
    const accountIdx = req.user.accountIdx
    const postIdx = req.params.postIdx
    const title = req.body.title
    const content = req.body.content

    try {
        if (!postIdx.match(regx.idxRegx)) {
            throw customError(400, "categoryIdx값이 안 옴")
        } 

        await postService.udpatePost(accountIdx, postIdx, title, content)
        res.status(200).send()
    } catch (err) {
        next(err)
    }
})

router.get("/:postIdx", async (req, res, next) => {
    const postIdx = req.params.postIdx
    
    try {
        if (!postIdx.match(regx.idxRegx)) {
            throw customError(400, "categoryIdx값이 안 옴")
        } 

        const post = await postService.selectPost(postIdx) 
        res.status(200).send(post)
    } catch (err) {
        next(err)
    }
})

router.delete("/:postIdx", isLogin('accountIdx'), async (req, res, next) => {
    const postIdx = req.params.postIdx

    try {
        if (!postIdx.match(regx.idxRegx)) {
            throw customError(400, "categoryIdx값이 안 옴")
        }  

        await postService.deletePost(postIdx)
        res.status(200).send()
    } catch (err) {
        next(err)
    }
})

router.put("/:postIdx/like", isLogin('accountIdx'), async (req, res, next) => {
    const accountIdx = req.user.accountIdx
    const postIdx = req.params.postIdx

    try {
        if (!postIdx.match(regx.idxRegx)) {
            throw customError(400, "categoryIdx값이 안 옴")
        } 

        await postService.postLike(accountIdx, postIdx)
        res.status(200).send()
    } catch (err) {
        next(err)
    }
})

module.exports = router