const customError = require("../router/data/error")
const categoryRepository = require("../repository/categorys")

const createCategory = async (categoryName) => {
    const category = await categoryRepository.isDuplicateCategory(categoryName)

    if (category) {
        throw customError(409, "카테고리가 이미 있음")
    }

    await categoryRepository.postCategory(categoryName)
}

const selectCategory = async () => {
    const categorys = await categoryRepository.getCategorys()

    return categorys
}

const updateCategory = async (categoryIdx, categoryName) => {
    let category = await categoryRepository.isCategory(categoryIdx)
    if (!category) {
        throw customError(404, "해당 카테고리가 존재하지 않음")
    }

    let = await categoryRepository.isDuplicateCategory(categoryName) 
    if (category) {
        throw customError(404, "카테고리가 이미 있음")
    }

    await categoryRepository.putCategory(categoryIdx, categoryName)
}

const deleteCategory = async (categoryIdx) => {
    const category = await categoryRepository.isCategory(categoryIdx)
    if (!category) {
        throw customError(404, "해당 카테고리가 존재하지 않음")
    }

    await categoryRepository.deleteCategoryRepo(categoryIdx)
}

const categoryService = {
    createCategory : createCategory,
    selectCategory : selectCategory,
    updateCategory : updateCategory,
    deleteCategory : deleteCategory
}

module.exports = categoryService