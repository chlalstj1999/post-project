const router = require("express").Router()

router.post("/", (req, res) => {
    const title = req.body.title
    const content = req.body.content
})

router.put("/:postIdx", (req, res) => {
    const postIdx = req.params.postIdx
    const title = req.body.title
    const content = req.body.content
})

router.get("/:postIdx", (req, res) => {
    const postIdx = req.params.postIdx
    
    res.send({
        "tilte": title,
        "content": content,
        "userName": userName,
        "createdAt": createdAt
    })
})

router.delete("/:postIdx", (req, res) => {
    const postIdx = req.params.postIdx
})

router.post("/:postIdx/comments", (req, res) => {
    const postIdx = req.params.postIdx
    const content = req.body.content
})

router.put("/:postIdx/comments/:commentIdx", (req, res) => {
    const postIdx = req.params.postIdx
    const commentIdx = req.params.postIdx
    const content = req.body.content
})

router.get("/:postIdx/comments", (req, res) => {
    const postIdx = req.params.postIdx
    
    res.send({
        "content": content,
        "userName": userName,
        "createdAt": createdAt
    })
})

router.delete("/:postIdx/comments/:commentIdx", (req, res) => {
    const postIdx = req.params.postIdx
    const commentIdx = req.params.commentIdx
})

router.post("/:postIdx/like", (req, res) => {
    const postIdx = req.params.postIdx
})

router.delete("/:postIdx/like", (req, res) => {
    const postIdx = req.params.postIdx
})

router.post("/:postIdx/comments/:commentIdx/like", (req, res) => {
    const postIdx = req.params.postIdx
    const commentIdx = req.params.commentIdx
})

router.delete("/:postIdx/comments/:commentIdx/like", (req, res) => {
    const postIdx = req.params.postIdx
    const commentIdx = req.params.commentIdx
})

module.exports = router