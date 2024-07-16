const router = require("express").Router()
const customError = require("./data/error")
const { commentRegx } = require("../const/regx")

router.post("/", (req, res, next) => {
    const accountIdx = req.session.accountIdx
    const postIdx = req.body.postIdx
    const comment = req.body.comment

    try {
        if (!accountIdx) {
            throw customError(401, "로그인 필요")
        } else if (!postIdx) {
            throw customError(400, "postIdx 값이 안옴")
        } else if (!comment.match(commentRegx)) {
            throw customError(400, "댓글 형식 확인 필요")
        }

        if (postIdx != 1) {
            throw customError(404, "해당 게시물이 존재하지 않음")
        }

        res.status(200).send()
        console.log(`comment : ${comment}`)
    } catch (err) {
        next(err)
    }
})

router.put("/:commentIdx", (req, res, next) => {
    const accountIdx = req.session.accountIdx
    const commentIdx = req.params.postIdx
    const comment = req.body.comment

    try {
        if (!accountIdx) {
            throw customError(401, "로그인 필요")
        } else if (!postIdx) {
            throw customError(400, "postIdx 값이 안옴")
        } else if (!commentIdx) {
            throw customError(400, "commentIdx 값이 안 옴")
        } else if (!comment.match(commentRegx)) {
            throw customError(400, "댓글 형식 확인 필요")
        }

        if (postIdx != 1) {
            throw customError(404, "해당 게시물이 존재하지 않음")
        }

        if (commentIdx != 1) {
            throw customError(404, "해당 댓글이 존재하지 않음")
        }

        res.status(200).send()
        console.log(`comment : ${comment}`)
    } catch (err) {
        next(err)
    }
})

router.get("/", (req, res, next) => {
    const accountIdx = req.session.accountIdx
    const postIdx = req.body.postIdx
    
    try {
        if (!accountIdx) {
            throw customError(401, "로그인 필요")
        } else if (!postIdx) {
            throw customError(400, "postIdx 값이 안옴")
        }

        if (postIdx != 1) {
            throw customError(404, "해당 게시물이 존재하지 않음")
        }

        res.status(200).send({
            "comment" : "댓글 내용",
            "userName" : "작성자",
            "createdAt" : "작성 시간",
            "commentLike" : "좋아요 수"
        })
    } catch (err) {
        next(err)
    }
})

router.delete("/:commentIdx", (req, res, next) => {
    const accountIdx = req.session.accountIdx
    const commentIdx = req.params.commentIdx

    try {
        if (!accountIdx) {
            throw customError(401, "로그인 필요")
        } else if (!postIdx) {
            throw customError(400, "postIdx 값이 안옴")
        } else if (!commentIdx) {
            throw customError(400, "commentIdx 값이 안옴")
        }

        if (postIdx != 1) {
            throw customError(404, "해당 게시물이 존재하지 않음")
        }

        if (commentIdx != 1) {
            throw customError(404, "해당 댓글이 존재하지 않음")
        }

        res.status(200).send()
    } catch (err) {
        next(err)
    }
})

router.post("/:commentIdx/like", (req, res, next) => {
    const accountIdx = req.session.accountIdx
    const commentIdx = req.params.commentIdx

    try {
        if (!accountIdx) {
            throw customError(401, "로그인 필요")
        } else if (!postIdx) {
            throw customError(400, "postIdx 값이 안옴")
        } else if (!commentIdx) {
            throw customError(400, "commentIdx 값이 안옴")
        }

        if (postIdx != 1) {
            throw customError(404, "해당 게시물이 존재하지 않음")
        }

        if (commentIdx != 1) {
            throw customError(404, "해당 댓글이 존재하지 않음")
        }

        res.status(200).send()
    } catch (err) {
        next(err)
    }
})

router.delete("/:commentIdx/like", (req, res, next) => {
    const accountIdx = req.session.accountIdx
    const commentIdx = req.params.commentIdx

    try {
        if (!accountIdx) {
            throw customError(401, "로그인 필요")
        } else if (!postIdx) {
            throw customError(400, "postIdx 값이 안옴")
        } else if (!commentIdx) {
            throw customError(400, "commentIdx 값이 안옴")
        }

        if (postIdx != 1) {
            throw customError(404, "해당 게시물이 존재하지 않음")
        }

        if (commentIdx != 1) {
            throw customError(404, "해당 댓글이 존재하지 않음")
        }

        res.status(200).send()
    } catch (err) {
        next(err)
    }
})

module.exports = router