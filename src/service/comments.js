const customError = require("../router/data/error")
const { commentRegx } = require("../const/regx")
const { isPost } = require("../repository/posts")
const { postComment } = require("../repository/comments")

let rows = null

const createComment = async (accountIdx, postIdx, comment) => {
    if (!postIdx) {
        throw customError(400, "postIdx 값이 안옴")
    } else if (!comment.match(commentRegx)) {
        throw customError(400, "댓글 형식 확인 필요")
    }

    rows = await isPost(postIdx)
    if (!rows) {
        throw customError(404, "해당 게시물이 존재하지 않음")
    }

    await postComment(accountIdx, postIdx, comment)
}

module.exports = { createComment }