const router = require("express").Router()
const isLogin = require("../middleware/isLogin")
const isPostUserMatch = require("../middleware/isPostUserMatch")
const { postTitleRegx, postContentRegx } = require("../const/regx")
const customError = require("./data/error")
const { selectPosts, createPost, udpatePost, selectPost, deletePost, postLike } = require("../service/posts")

router.get("/list", async (req, res, next) => {
    const categoryIdx = req.query.categoryIdx

    try {
        if (!categoryIdx) {
            throw customError(400, "categoryIdx 값이 안 옴")
        }

        const posts = await selectPosts(categoryIdx)
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
        
        if (!title.match(postTitleRegx)) {
            throw customError(400, "제목 형식 확인 필요")
        } 
        
        if (!content.match(postContentRegx)) {
            throw customError(400, "내용 형식 확인 필요")
        }
        
        await createPost(accountIdx, categoryIdx, title, content)
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
        if (!title.match(postTitleRegx)) {
            throw customError(400, "제목 형식 확인 필요")
        } else if (!content.match(postContentRegx)) {
            throw customError(400, "내용 형식 확인 필요")
        }

        await udpatePost(postIdx, title, content)
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

        const post = await selectPost(postIdx) 
        res.status(200).send(post)
    } catch (err) {
        next(err)
    }
})

router.delete("/:postIdx", isLogin, isPostUserMatch, async (req, res, next) => {
    const postIdx = req.params.postIdx

    try {
        await deletePost(postIdx)
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

        await postLike(accountIdx, postIdx)
        res.status(200).send()
    } catch (err) {
        next(err)
    }
})

module.exports = router