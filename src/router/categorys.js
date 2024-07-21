const router = require("express").Router()
const isLogin = require("../middleware/isLogin")
const isRole = require("../middleware/isRole")
const { createCategory, selectCategory, updateCategory, deleteCategory } = require("../service/categorys")

let rows

router.post("/", isLogin, isRole, async (req, res, next) => {
    const categoryName = req.body.categoryName

    try{
        await createCategory(categoryName)
        res.status(200).send()
    } catch (err) {
        next(err)
    }
})

router.get("/", async (req, res, next) => {
    try {    
        rows = await selectCategory()
        res.status(200).send(rows)
    } catch {
        next(err)
    }
})

router.put("/:categoryIdx", isLogin, isRole, async (req, res, next) => {
    const categoryIdx = req.params.categoryIdx
    const categoryName = req.body.categoryName

    try {
        await updateCategory(categoryIdx, categoryName)
        res.status(200).send()
    } catch (err) {
        next(err)
    }
})

router.delete("/:categoryIdx", isLogin, isRole, async (req, res, next) => {
    const categoryIdx = req.params.categoryIdx
    
    try {
        await deleteCategory(categoryIdx)
        res.status(200).send()
    } catch (err) {
        next(err)
    }
})

module.exports = router