const customError = require("../router/data/error")
const { isDuplicateCategory, postCategory, getCategorys, isCategory, putCategory, deleteCategoryRepo } = require("../repository/categorys")

const createCategory = async (categoryName) => {
    const category = await isDuplicateCategory(categoryName)

    if (category) {
        throw customError(409, "카테고리가 이미 있음")
    }

    await postCategory(categoryName)
}

const selectCategory = async () => {
    const categorys = await getCategorys()

    return categorys
}

const updateCategory = async (categoryIdx, categoryName) => {
    let category = await isCategory(categoryIdx)
    if (!category) {
        throw customError(404, "해당 카테고리가 존재하지 않음")
    }

    let = await isDuplicateCategory(categoryName) 
    if (category) {
        throw customError(404, "카테고리가 이미 있음")
    }

    await putCategory(categoryIdx, categoryName)
}

const deleteCategory = async (categoryIdx) => {
    const category = await isCategory(categoryIdx)
    if (!category) {
        throw customError(404, "해당 카테고리가 존재하지 않음")
    }

    await deleteCategoryRepo(categoryIdx)
}

module.exports = { 
    createCategory, selectCategory, updateCategory, deleteCategory 
}