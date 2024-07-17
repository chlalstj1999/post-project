const router = require("express").Router()
const customError = require("./data/error")
const { postTitleRegx, postContentRegx, commentRegx } = require("../const/regx")
const pool = require("./db/mariadb")
const checkLogin = require("../middleware/checkLogin")
const checkUserMatch = require("../middleware/checkUserMatch")

let conn

router.get("/list", async (req, res, next) => {
    const categoryIdx = req.query.categoryIdx

    try {
        if (!categoryIdx) {
            throw customError(400, "categoryIdx 값이 없음")
        }
        
        conn = await pool.getConnection()
        let rows = await conn.query("SELECT * FROM category WHERE idx = ?", [categoryIdx])

        if (rows.length === 0) {
            throw customError(404, "해당 카테고리가 존재하지 않음")
        }

        rows = await conn.query("SELECT post.idx AS postIdx, account.name AS userName, post.title, post.createdAt FROM post JOIN account ON accountIdx = account.idx")

        res.status(200).send(rows)
    } catch (err) {
        next(err)
    } finally {
        if (conn) return conn.end()
    }
}) 

router.post("/", checkLogin, async (req, res, next) => {
    const accountIdx = req.session.accountIdx
    const categoryIdx = req.body.categoryIdx
    const title = req.body.title
    const content = req.body.content

    try {
        if (!categoryIdx) {
            throw customError(400, "categoryIdx 값이 안옴")
        } else if (!title.match(postTitleRegx)) {
            throw customError(400, "제목 형식 확인 필요")
        } else if (!content.match(postContentRegx)) {
            throw customError(400, "내용 형식 확인 필요")
        }

        conn = await pool.getConnection()
        const rows = await conn.query("SELECT * FROM category WHERE idx = ?", [categoryIdx])

        if (rows.length === 0) {
            throw customError(404, "해당 카테고리가 존재하지 않음")
        }

        await conn.query("INSERT INTO post (accountIdx, title, content, categoryIdx, countLike) VALUES (?, ?, ?, ?, ?)", [accountIdx, title, content, categoryIdx, 0])

        res.status(200).send()
    } catch (err) {
        next(err)
    } finally {
        if (conn) return conn.end()
    }
})

router.put("/:postIdx", checkLogin, checkUserMatch, async (req, res, next) => {
    const postIdx = req.params.postIdx
    const title = req.body.title
    const content = req.body.content

    try {
        if (!title.match(postTitleRegx)) {
            throw customError(400, "제목 형식 확인 필요")
        } else if (!content.match(postContentRegx)) {
            throw customError(400, "내용 형식 확인 필요")
        }

        conn = await pool.getConnection()
        await conn.query("UPDATE post SET title = ?, content = ? WHERE idx = ?", [title, content, postIdx])

        res.status(200).send()
    } catch (err) {
        next(err)
    } finally {
        if (conn) return conn.end()
    }
})

router.get("/:postIdx", (req, res, next) => {
    const accountIdx = req.session.accountIdx
    const postIdx = req.params.postIdx
    
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
            "title" : "아무거나 제목",
            "content" : "아무거나 내용",
            "createdAt" : "작성 시간",
            "userName" : "작성자",
            "postLike" : "좋아요 수"
        })
    } catch (err) {
        next(err)
    }
})

router.delete("/:postIdx", (req, res, next) => {
    const accountIdx = req.session.accountIdx
    const postIdx = req.params.postIdx

    try {
        if (!accountIdx) {
            throw customError(401, "로그인 필요")
        } else if (!postIdx) {
            throw customError(400, "postIdx 값이 안옴")
        }

        if (postIdx != 1) {
            throw customError(404, "해당 게시물이 존재하지 않음")
        }

        res.status(200).send()
    } catch (err) {
        next(err)
    }
})

router.post("/:postIdx/like", (req, res, next) => {
    const accountIdx = req.session.accountIdx
    const postIdx = req.params.postIdx

    try {
        if (!accountIdx) {
            throw customError(401, "로그인 필요")
        } else if (!postIdx) {
            throw customError(400, "postIdx 값이 안옴")
        }

        if (postIdx != 1) {
            throw customError(404, "해당 게시물이 존재하지 않음")
        }

        res.status(200).send()
    } catch (err) {
        next(err)
    }
})

router.delete("/:postIdx/like", (req, res, next) => {
    const accountIdx = req.session.accountIdx
    const postIdx = req.params.postIdx

    try {
        if (!accountIdx) {
            throw customError(401, "로그인 필요")
        } else if (!postIdx) {
            throw customError(400, "postIdx 값이 안옴")
        }

        if (postIdx != 1) {
            throw customError(404, "해당 게시물이 존재하지 않음")
        }

        res.status(200).send()
    } catch (err) {
        next(err)
    }
})

module.exports = router