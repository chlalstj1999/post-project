const customError = require("../router/data/error")
const { isPost } = require("../repository/posts")
const { postComment, isComment, putComment, getComments, deleteCommentRepo, isCommentLike, commentLikeRepo, commentUnlikeRepo } = require("../repository/comments")

const createComment = async (accountIdx, postIdx, comment) => {
    const post = await isPost(postIdx)
    if (!post) {
        throw customError(404, "해당 게시물이 존재하지 않음")
    }

    await postComment(accountIdx, postIdx, comment)
}

const updateComment = async (commentIdx, comment) => {
    const comment = await isComment(commentIdx)
    if (!comment) {
        throw customError(404, "해당 댓글이 존재하지 않음")
    }

    await putComment(commentIdx, comment)
}

const selectComments = async (postIdx) => {
    const post = await isPost(postIdx)
    if (!post) {
        throw customError(404, "해당 게시물이 존재하지 않음")
    }

    const comments = await getComments(postIdx)

    return comments
}

const deleteComment = async (commentIdx) => {
    await deleteCommentRepo(commentIdx)
}

const commentLike = async (accountIdx, commentIdx) => {
    const comment = await isComment(commentIdx)
    if (!comment) {
        throw customError(404, "해당 댓글이 존재하지 않음")
    }

    const iscommentLike = await isCommentLike(accountIdx, commentIdx)
    if (!iscommentLike) {
        await commentLikeRepo(accountIdx, commentIdx)
    } else {
        await commentUnlikeRepo(accountIdx, commentIdx)
    }
}

module.exports = { createComment, updateComment, selectComments, deleteComment, commentLike }