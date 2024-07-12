const router = require("express").Router()
const { categoryNameRegx } = require("../const/regx")
const customError = require("../const/error")

router.post("/", (req, res) => {
    const accountIdx = req.session.accountIdx
    const roleIdx = req.session.roleIdx
    const categoryName = req.body.categoryName

    try{
        if (!accountIdx) {
            throw customError(401, "로그인 필요")
        } else if (roleIdx != 1) {
            throw customError(403, "관리자가 아니면 추가할 수 없음")
        } else if (!categoryName.match(categoryNameRegx)) {
            throw customError(401, "카테고리 이름 형식 확인 필요")
        }
        
        if (categoryName === "야구") {
            throw customError(404, "카테고리가 이미 있음")
        }

        res.status(200).send()
    } catch (err) {
        res.status(err.statusCode || 500).send({
            "message" : err.message
        })
    }
})

router.get("/", (req, res) => {
    const accountIdx = req.session.accountIdx
    
    if (!accountIdx) {
        throw customError(401, "로그인 필요")
    }

    res.status(200).send({
        "categoryIdx" : 1,
        "categoryName" : "야구"
    })
})

router.put("/:categoryIdx", (req, res) => {
    const accountIdx = req.session.accountIdx
    const roleIdx = req.session.roleIdx
    const categoryIdx = req.params.categoryIdx
    const categoryName = req.body.categoryName

    try {
        if (!accountIdx) {
            throw customError(401, "로그인 필요")
        } else if (roleIdx != 1) {
            throw customError(403, "관리자가 아니면 수정할 수 없음")
        } else if (!categoryName.match(categoryNameRegx)) {
            throw customError(400, "카테고리 이름 형식 확인 필요")
        } else if (!categoryIdx) {
            throw customError(400, "categoryIdx 값이 오지 않음")
        }

        if (categoryIdx != 1) {
            throw customError(409, "해당 카테고리가 존재하지 않음")
        }
    
        if (categoryName === "야구") {
            throw customError(404, "카테고리가 이미 있음")
        }
    
        res.status(200).send()
    } catch (err) {
        res.status(err.statusCode || 500).send({
            "message" : err.message
        })
    }
})

router.delete("/:categoryIdx", (req, res) => {
    const accountIdx = req.session.accountIdx
    const roleIdx = req.session.roleIdx
    const categoryIdx = req.params.categoryIdx
    
    try {
        if (!accountIdx) {
            throw customError(401, "로그인 필요")
        } else if (roleIdx != 1) {
            throw customError(403, "관리자가 아니면 삭제할 수 없음")
        } else if (!categoryIdx) {
            throw customError(400, "categoryIdx 값이 오지 않음")
        }
    
        if (categoryIdx != 1) {
            throw customError(409, "해당 카테고리가 존재하지 않음")
        }
    
        res.status(200).send
    } catch (err) {
        res.status(err.statusCode || 500).send({
            "message" : err.message
        })
    }
})

module.exports = router