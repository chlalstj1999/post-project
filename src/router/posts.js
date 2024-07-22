const router = require("express").Router()
const isLogin = require("../middleware/isLogin")
const isPostUserMatch = require("../middleware/isPostUserMatch")
const regx = require("../const/regx")
const customError = require("./data/error")
const postService = require("../service/posts")

router.get("/list", async (req, res, next) => {
    const categoryIdx = req.query.categoryIdx

    try {
        if (!categoryIdx) {
            throw customError(400, "categoryIdx 값이 안 옴")
        }

        const posts = await postService.selectPosts(categoryIdx)
        res.status(200).send(posts)
    } catch (err) {
        next(err)
    }
}) 

router.post("/", isLogin, async (req, res, next) => {
    const accountIdx = req.user.accountIdx
    const categoryIdx = req.body.categoryIdx
    const title = req.body.title
    const content = req.body.content

    try {
        if (!categoryIdx) {
            throw customError(400, "categoryIdx 값이 안옴")
        } 
        
        if (!title.match(regx.postTitleRegx)) {
            throw customError(400, "제목 형식 확인 필요")
        } 
        
        if (!content.match(regx.postContentRegx)) {
            throw customError(400, "내용 형식 확인 필요")
        }
        
        await postService.createPost(accountIdx, categoryIdx, title, content)
        res.status(200).send()
    } catch (err) {
        next(err)
    }
})

router.put("/:postIdx", isLogin, isPostUserMatch, async (req, res, next) => {
    const postIdx = req.params.postIdx
    const title = req.body.title
    const content = req.body.content

    try {
        if (!title.match(regx.postTitleRegx)) {
            throw customError(400, "제목 형식 확인 필요")
        } else if (!content.match(regx.postContentRegx)) {
            throw customError(400, "내용 형식 확인 필요")
        }

        await postService.udpatePost(postIdx, title, content)
        res.status(200).send()
    } catch (err) {
        next(err)
    }
})

router.get("/:postIdx", async (req, res, next) => {
    const postIdx = req.params.postIdx
    
    try {
        if (!postIdx) {
            throw customError(400, "postIdx 값이 안옴")
        }

        const post = await postService.selectPost(postIdx) 
        res.status(200).send(post)
    } catch (err) {
        next(err)
    }
})

router.delete("/:postIdx", isLogin, isPostUserMatch, async (req, res, next) => {
    const postIdx = req.params.postIdx

    try {
        await postService.deletePost(postIdx)
        res.status(200).send()
    } catch (err) {
        next(err)
    }
})

router.put("/:postIdx/like", isLogin, async (req, res, next) => {
    const accountIdx = req.user.accountIdx
    const postIdx = req.params.postIdx

    try {
        if (!postIdx) {
            throw customError(400, "postIdx 값이 안옴")
        }

        await postService.postLike(accountIdx, postIdx)
        res.status(200).send()
    } catch (err) {
        next(err)
    }
})

module.exports = router