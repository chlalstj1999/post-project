const { postTitleRegx, postContentRegx } = require("../const/regx")
const customError = require("../router/data/error")
const { getPosts } = require("../repository/posts")
const { isCategory } = require("../repository/categorys")

let rows = null

const selectPosts = async (categoryIdx) => {
    if (!categoryIdx) {
        throw customError(400, "categoryIdx 값이 안 옴")
    }

    rows = await isCategory(categoryIdx)
    if (!rows) {
        throw customError(404, "해당 카테고리가 존재하지 않음")
    }

    rows = await getPosts(categoryIdx)

    return rows
}

module.exports = { selectPosts }