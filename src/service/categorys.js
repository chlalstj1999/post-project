const { categoryNameRegx } = require("../const/regx")
const customError = require("../router/data/error")
const { isDuplicateCategory, postCategory } = require("../repository/categorys")

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

module.exports = { createCategory }