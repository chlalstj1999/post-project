const router = require("express").Router()
const customError = require("../const/error")
const { postTitleRegx, postContentRegx, commentRegx } = require("../const/regx")

router.get("/", (req, res) => {
    const accountIdx = req.session.accountIdx
    const categoryIdx = req.query.categoryIdx

    try {
        if (!accountIdx) {
            throw customError(401, "로그인 필요")
        } else if (!categoryIdx) {
            throw customError(400, "categoryIdx 값이 없음")
            // idx 값이 빈 값으로 옴
        }
        // 데이터 존재하지 않으면
        if (categoryIdx != 1) {
            throw customError(409, "해당 카테고리가 존재하지 않음")
        }

        res.status(200).send({
            "categoryIdx" : categoryIdx,
            "postTitle" : "아무거나 제목"
        })
    } catch (err) {
        res.status(err.statusCode || 500).send({
            "message" : err.message
        })
    }
}) 

router.post("/", (req, res) => {
    const accountIdx = req.session.accountIdx
    const categoryIdx = req.query.categoryIdx
    const title = req.body.title
    const content = req.body.content

    try {
        if (!accountIdx) {
            throw customError(401, "로그인 필요")
        } else if (!categoryIdx) {
            throw customError(400, "categoryIdx 값이 안옴")
        } else if (!title.match(postTitleRegx)) {
            throw customError(400, "제목 형식 확인 필요")
        } else if (!content.match(postContentRegx)) {
            throw customError(400, "내용 형식 확인 필요")
        }

        if (categoryIdx != 1) {
            throw customError(409, "해당 카테고리가 존재하지 않음")
        }

        res.status(200).send({
            //작성한 게시글로 가니까,,,
            "postIdx" : 1
        })
    } catch (err) {
        res.status(statusCode || 500).send({
            "message" : err.message
        })
    }
})

router.put("/:postIdx", (req, res) => {
    const accountIdx = req.session.accountIdx
    const postIdx = req.params.postIdx
    const title = req.body.title
    const content = req.body.content

    try {
        if (!accountIdx) {
            throw customError(401, "로그인 필요")
        } else if (!postIdx) {
            throw customError(400, "postIdx 값이 안옴")
        } else if (!title.match(postTitleRegx)) {
            throw customError(400, "제목 형식 확인 필요")
        } else if (!content.match(postContentRegx)) {
            throw customError(400, "내용 형식 확인 필요")
        }

        if (postIdx != 1) {
            throw customError(409, "해당 게시물이 존재하지 않음")
        }

        res.status(200).send({
            "postIdx" : 1
        })
    } catch (err) {
        res.status(statusCode || 500).send({
            "message" : err.message
        })
    }
})

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