const router = require("express").Router()
const isLogin = require("../middleware/isLogin")
const isAdmin = require("../middleware/isAdmin")
const regx = require("../const/regx")
const categoryService = require("../service/categorys")
const isRegxMatch = require("../middleware/isRegxMatch")
const customError = require("./data/error")

router.post("/", isLogin('accountIdx'), isAdmin, isRegxMatch([['categoryName', regx.categoryNameRegx]]), async (req, res, next) => {
    const categoryName = req.body.categoryName

    try{
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

router.put("/:categoryIdx", isLogin('accountIdx'), isAdmin, isRegxMatch([['categoryName', regx.categoryNameRegx]]), async (req, res, next) => {
    const categoryIdx = req.params.categoryIdx
    const categoryName = req.body.categoryName

    try {
        if (!categoryIdx.match(regx.idxRegx)) {
            throw customError(400, "categoryIdx값이 안 옴")
        } 

        await categoryService.updateCategory(categoryIdx, categoryName)
        res.status(200).send()
    } catch (err) {
        next(err)
    }
})

router.delete("/:categoryIdx", isLogin('accountIdx'), isAdmin, async (req, res, next) => {
    const categoryIdx = req.params.categoryIdx
    
    try {
        if (!categoryIdx.match(regx.idxRegx)) {
            throw customError(400, "categoryIdx값이 안 옴")
        } 

        await categoryService.deleteCategory(categoryIdx)
        res.status(200).send()
    } catch (err) {
        next(err)
    }
})

module.exports = router