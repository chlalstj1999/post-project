const { categoryNameRegx } = require("../const/regx")
const customError = require("../router/data/error")
const { isDuplicateCategory, postCategory, getCategorys, isCategory, putCategory, deleteCategoryRepo } = require("../repository/categorys")

let rows

const createCategory = async (categoryName) => {
    if (!categoryName.match(categoryNameRegx)) {
        throw customError(400, "카테고리 이름 형식 확인 필요")
    }

    rows = await isDuplicateCategory(categoryName)

    if (rows) {
        throw customError(409, "카테고리가 이미 있음")
    }

    await postCategory(categoryName)
}

const selectCategory = async () => {
    rows = await getCategorys()

    return rows
}

const updateCategory = async (categoryIdx, categoryName) => {
    if (!categoryName.match(categoryNameRegx)) {
        throw customError(400, "카테고리 이름 형식 확인 필요")
    } else if (!categoryIdx) {
        throw customError(400, "categoryIdx 값이 오지 않음")
    }

    rows = await isCategory(categoryIdx)
    if (!rows) {
        throw customError(404, "해당 카테고리가 존재하지 않음")
    }

    rows = await isDuplicateCategory(categoryName) 
    if (rows) {
        throw customError(404, "카테고리가 이미 있음")
    }

    await putCategory(categoryIdx, categoryName)
}

const deleteCategory = async (categoryIdx) => {
    if (!categoryIdx) {
        throw customError(400, "categoryIdx 값이 오지 않음")
    }

    rows = await isCategory(categoryIdx)
    if (!rows) {
        throw customError(404, "해당 카테고리가 존재하지 않음")
    }

    await deleteCategoryRepo(categoryIdx)
}

module.exports = { 
    createCategory, selectCategory, updateCategory, deleteCategory 
}