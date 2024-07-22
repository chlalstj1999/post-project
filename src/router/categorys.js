const router = require("express").Router()
const isLogin = require("../middleware/isLogin")
const isRole = require("../middleware/isRole")
const regx = require("../const/regx")
const customError = require("./data/error")
const categoryService = require("../service/categorys")

router.post("/", isLogin, isRole, async (req, res, next) => {
    const categoryName = req.body.categoryName

    try{
        if (!categoryName.match(regx.categoryNameRegx)) {
            throw customError(400, "카테고리 이름 형식 확인 필요")
        }

        await categoryService.createCategory(categoryName)
        res.status(200).send()
    } catch (err) {
        next(err)
    }
})

router.get("/", async (req, res, next) => {
    try {    
        const categorys = await categoryService.selectCategory()
        res.status(200).send(categorys)
    } catch {
        next(err)
    }
})

router.put("/:categoryIdx", isLogin, isRole, async (req, res, next) => {
    const categoryIdx = req.params.categoryIdx
    const categoryName = req.body.categoryName

    try {
        if (!categoryName.match(regx.categoryNameRegx)) {
            throw customError(400, "카테고리 이름 형식 확인 필요")
        } else if (!categoryIdx) {
            throw customError(400, "categoryIdx 값이 오지 않음")
        }

        await categoryService.updateCategory(categoryIdx, categoryName)
        res.status(200).send()
    } catch (err) {
        next(err)
    }
})

router.delete("/:categoryIdx", isLogin, isRole, async (req, res, next) => {
    const categoryIdx = req.params.categoryIdx
    
    try {
        if (!categoryIdx) {
            throw customError(400, "categoryIdx 값이 오지 않음")
        }
        
        await categoryService.deleteCategory(categoryIdx)
        res.status(200).send()
    } catch (err) {
        next(err)
    }
})

module.exports = router