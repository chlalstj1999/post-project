const router = require("express").Router()
const isLogin = require("../middleware/isLogin")
const isPostUserMatch = require("../middleware/isPostUserMatch")
const { selectPosts, createPost, udpatePost, selectPost, deletePost, postLike } = require("../service/posts")

let conn = null
let rows = null

router.get("/list", async (req, res, next) => {
    const categoryIdx = req.query.categoryIdx

    try {
        rows = await selectPosts(categoryIdx)
        res.status(200).send(rows)
    } catch (err) {
        next(err)
    }
}) 

router.post("/", isLogin, async (req, res, next) => {
    const accountIdx = req.session.accountIdx
    const categoryIdx = req.body.categoryIdx
    const title = req.body.title
    const content = req.body.content

    try {
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
        await udpatePost(postIdx, title, content)
        res.status(200).send()
    } catch (err) {
        next(err)
    }
})

router.get("/:postIdx", async (req, res, next) => {
    const postIdx = req.params.postIdx
    
    try {
        rows = await selectPost(postIdx) 
        res.status(200).send(rows)
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

router.post("/:postIdx/like", isLogin, async (req, res, next) => {
    const accountIdx = req.session.accountIdx
    const postIdx = req.params.postIdx

    try {
        await postLike(accountIdx, postIdx)
        res.status(200).send()
    } catch (err) {
        next(err)
    } finally {
        if (conn) return conn.end()
    }
})

router.delete("/:postIdx/like", isLogin, async (req, res, next) => {
    const accountIdx = req.session.accountIdx
    const postIdx = req.params.postIdx

    try {
        await postLike(accountIdx, postIdx)
        res.status(200).send()
    } catch (err) {
        next(err)
    } finally {
        if (conn) return conn.end()
    }
})

module.exports = router