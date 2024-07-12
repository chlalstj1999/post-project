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

        res.status(200).send()
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

        res.status(200).send()
    } catch (err) {
        res.status(statusCode || 500).send({
            "message" : err.message
        })
    }
})

router.get("/:postIdx", (req, res) => {
    const accountIdx = req.session.accountIdx
    const postIdx = req.params.postIdx
    
    try {
        if (!accountIdx) {
            throw customError(401, "로그인 필요")
        } else if (!postIdx) {
            throw customError(400, "postIdx 값이 안옴")
        }

        if (postIdx != 1) {
            throw customError(409, "해당 게시물이 존재하지 않음")
        }

        res.status(200).send({
            "title" : "아무거나 제목",
            "content" : "아무거나 내용",
            "createdAt" : "작성 시간",
            "userName" : "작성자",
            "postLike" : "좋아요 수"
        })
    } catch (err) {
        res.status(statusCode || 500).send({
            "message" : err.message
        })
    }
})

router.delete("/:postIdx", (req, res) => {
    const accountIdx = req.session.accountIdx
    const postIdx = req.params.postIdx

    try {
        if (!accountIdx) {
            throw customError(401, "로그인 필요")
        } else if (!postIdx) {
            throw customError(400, "postIdx 값이 안옴")
        }

        if (postIdx != 1) {
            throw customError(409, "해당 게시물이 존재하지 않음")
        }

        res.status(200).send()
    } catch (err) {
        res.status(statusCode || 500).send({
            "message" : err.message
        })
    }
})

router.post("/:postIdx/comments", (req, res) => {
    const accountIdx = req.session.accountIdx
    const postIdx = req.params.postIdx
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
            throw customError(409, "해당 게시물이 존재하지 않음")
        }

        res.status(200).send()
    } catch (err) {
        res.status(statusCode || 500).send({
            "message" : err.message
        })
    }
})

router.put("/:postIdx/comments/:commentIdx", (req, res) => {
    const accountIdx = req.session.accountIdx
    const postIdx = req.params.postIdx
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
            throw customError(409, "해당 게시물이 존재하지 않음")
        }

        if (commentIdx != 1) {
            throw customError(409, "해당 댓글이 존재하지 않음")
        }

        res.status(200).send()
    } catch (err) {
        res.status(statusCode || 500).send({
            "message" : err.message
        })
    }
})

router.get("/:postIdx/comments", (req, res) => {
    const accountIdx = req.session.accountIdx
    const postIdx = req.params.postIdx
    
    try {
        if (!accountIdx) {
            throw customError(401, "로그인 필요")
        } else if (!postIdx) {
            throw customError(400, "postIdx 값이 안옴")
        }

        if (postIdx != 1) {
            throw customError(409, "해당 게시물이 존재하지 않음")
        }

        res.status(200).send({
            "comment" : "댓글 내용",
            "userName" : "작성자",
            "createdAt" : "작성 시간",
            "commentLike" : "좋아요 수"
        })
    } catch (err) {
        res.status(statusCode || 500).send({
            "message" : err.message
        })
    }
})

router.delete("/:postIdx/comments/:commentIdx", (req, res) => {
    const accountIdx = req.session.accountIdx
    const postIdx = req.params.postIdx
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
            throw customError(409, "해당 게시물이 존재하지 않음")
        }

        if (commentIdx != 1) {
            throw customError(409, "해당 댓글이 존재하지 않음")
        }

        res.status(200).send()
    } catch (err) {
        res.status(statusCode || 500).send({
            "message" : err.message
        })
    }
})

router.post("/:postIdx/like", (req, res) => {
    const accountIdx = req.session.accountIdx
    const postIdx = req.params.postIdx

    try {
        if (!accountIdx) {
            throw customError(401, "로그인 필요")
        } else if (!postIdx) {
            throw customError(400, "postIdx 값이 안옴")
        }

        if (postIdx != 1) {
            throw customError(409, "해당 게시물이 존재하지 않음")
        }

        res.status(200).send()
    } catch (err) {
        res.status(statusCode || 500).send({
            "message" : err.message
        })
    }
})

router.delete("/:postIdx/like", (req, res) => {
    const accountIdx = req.session.accountIdx
    const postIdx = req.params.postIdx

    try {
        if (!accountIdx) {
            throw customError(401, "로그인 필요")
        } else if (!postIdx) {
            throw customError(400, "postIdx 값이 안옴")
        }

        if (postIdx != 1) {
            throw customError(409, "해당 게시물이 존재하지 않음")
        }

        res.status(200).send()
    } catch (err) {
        res.status(statusCode || 500).send({
            "message" : err.message
        })
    }
})

router.post("/:postIdx/comments/:commentIdx/like", (req, res) => {
    const accountIdx = req.session.accountIdx
    const postIdx = req.params.postIdx
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
            throw customError(409, "해당 게시물이 존재하지 않음")
        }

        if (commentIdx != 1) {
            throw customError(409, "해당 댓글이 존재하지 않음")
        }

        res.status(200).send()
    } catch (err) {
        res.status(statusCode || 500).send({
            "message" : err.message
        })
    }
})

router.delete("/:postIdx/comments/:commentIdx/like", (req, res) => {
    const accountIdx = req.session.accountIdx
    const postIdx = req.params.postIdx
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
            throw customError(409, "해당 게시물이 존재하지 않음")
        }

        if (commentIdx != 1) {
            throw customError(409, "해당 댓글이 존재하지 않음")
        }

        res.status(200).send()
    } catch (err) {
        res.status(statusCode || 500).send({
            "message" : err.message
        })
    }
})

module.exports = router