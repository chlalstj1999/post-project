const router = require("express").Router()

router.post("/", (req, res) => {
    const accountIdx = req.session.accountIdx
    const title = req.body.title
    const content = req.body.content

    if (title == "" || content == "") {
        res.send("제목과 내용을 입력해주세요.")
    } else if (accountIdx) {
        res.send({
            "title" : title,
            "content" : content
        })
    } else {
        res.send("로그인 후 이용해주세요")
    }
})

router.put("/:postIdx", (req, res) => {
    const accountIdx = req.session.accountIdx
    const postIdx = req.params.postIdx
    const title = req.body.title
    const content = req.body.content

    if (accountIdx == "") {
        res.send("로그인 후 이용해주세요.") 
    } else if (title == "" || content == "") {
        res.send("제목 및 내용을 입력해주세요.")
    } else {
        res.send({
            "title" : title,
            "content" : content
        })
    }
})

// router.get('/session-test', (req, res) => {
//     console.log(req.session)

//     res.status(200).end()
// })

router.get("/:postIdx", (req, res) => {
    const accountIdx = req.session.accountIdx
    const postIdx = req.params.postIdx
    
    if (accountIdx) {
        res.send({
            "tilte": "title",
            "content": "content",
            "userName": "userName",
            "createdAt": "createdAt"
        })
    } else {
        res.send("로그인 후 이용해주세요.")
    }
})

router.delete("/:postIdx", (req, res) => {
    const accountIdx = req.session.accountIdx
    const postIdx = req.params.postIdx

    if (accountIdx != "") {
        res.send("게시물이 삭제되었습니다.")
    } else {
        res.send("로그인 후 이용해주세요.")
    }
})

router.post("/:postIdx/comments", (req, res) => {
    const accountIdx = req.session.accountIdx
    const postIdx = req.params.postIdx
    const content = req.body.content

    if (accountIdx != "") {
        res.send({
            "content" : content
        })
    } else if (content != "") {
        res.send("댓글을 입력해주세요.")
    } else {
        res.send("로그인 후 이용해주세요.")
    }
})

router.put("/:postIdx/comments/:commentIdx", (req, res) => {
    const accountIdx = req.session.accountIdx
    const postIdx = req.params.postIdx
    const commentIdx = req.params.postIdx
    const content = req.body.content

    if (accountIdx == "") {
        res.send("로그인 후 이용해주세요.") 
    } else if (content == "") {
        res.send("댓글을 입력해주세요.")
    } else {
        res.send({
            "content" : content
        })
    }
})

router.get("/:postIdx/comments", (req, res) => {
    const accountIdx = req.session.accountIdx
    const postIdx = req.params.postIdx
    
    if (accountIdx != "") {
        res.send({
            "content": "content",
            "userName": "userName",
            "createdAt": "createdAt"
            // 더미데이터가 있어야 함
        })
    } else {
        res.send("로그인 후 이용해주세요.")
    }
})

router.delete("/:postIdx/comments/:commentIdx", (req, res) => {
    const accountIdx = req.session.accountIdx
    const postIdx = req.params.postIdx
    const commentIdx = req.params.commentIdx

    if (accountIdx != "") {
        res.send("댓글이 삭제되었습니다.")
    } else {
        res.send("로그인 후 이용해주세요.")
    }
})

router.post("/:postIdx/like", (req, res) => {
    const accountIdx = req.session.accountIdx
    const postIdx = req.params.postIdx

    if (accountIdx != "") {
        res.send("좋아요 눌렀습니다.")
    } else {
        res.send("로그인 후 이용해주세요.")
    }
})

router.delete("/:postIdx/like", (req, res) => {
    const accountIdx = req.session.accountIdx
    const postIdx = req.params.postIdx

    if (accountIdx != "") {
        res.send("좋아요 취소했습니다.")
    } else {
        res.send("로그인 후 이용해주세요.")
    }
})

router.post("/:postIdx/comments/:commentIdx/like", (req, res) => {
    const accountIdx = req.session.accountIdx
    const postIdx = req.params.postIdx
    const commentIdx = req.params.commentIdx

    if (accountIdx != "") {
        res.send("좋아요 눌렀습니다.")
    } else {
        res.send("로그인 후 이용해주세요.")
    }
})

router.delete("/:postIdx/comments/:commentIdx/like", (req, res) => {
    const accountIdx = req.session.accountIdx
    const postIdx = req.params.postIdx
    const commentIdx = req.params.commentIdx

    if (accountIdx != "") {
        res.send("좋아요 취소했습니다.")
    } else {
        res.send("로그인 후 이용해주세요.")
    }
})

module.exports = router