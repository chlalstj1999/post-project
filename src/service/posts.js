const { postTitleRegx, postContentRegx } = require("../const/regx")
const customError = require("../router/data/error")
const { getPosts, createPostRepo } = require("../repository/posts")
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

const createPost = async (accountIdx, categoryIdx, title, content) => {
    if (!categoryIdx) {
        throw customError(400, "categoryIdx 값이 안옴")
    } else if (!title.match(postTitleRegx)) {
        throw customError(400, "제목 형식 확인 필요")
    } else if (!content.match(postContentRegx)) {
        throw customError(400, "내용 형식 확인 필요")
    }

    rows = await isCategory(categoryIdx)
    if (!rows) {
        throw customError(404, "해당 카테고리가 존재하지 않음")
    }

    await createPostRepo(accountIdx, categoryIdx, title, content)
}

module.exports = { selectPosts, createPost }