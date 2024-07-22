const customError = require("../router/data/error")
const postRepository = require("../repository/posts")
const commentRepository = require("../repository/comments")

const createComment = async (accountIdx, postIdx, comment) => {
    const post = await postRepository.isPost(postIdx)
    if (!post) {
        throw customError(404, "해당 게시물이 존재하지 않음")
    }

    await commentRepository.postComment(accountIdx, postIdx, comment)
}

const updateComment = async (commentIdx, comment) => {
    const existingComment = await commentRepository.isComment(commentIdx)
    if (!existingComment) {
        throw customError(404, "해당 댓글이 존재하지 않음")
    }

    await commentRepository.putComment(commentIdx, comment)
}

const selectComments = async (postIdx) => {
    const post = await postRepository.isPost(postIdx)
    if (!post) {
        throw customError(404, "해당 게시물이 존재하지 않음")
    }

    const comments = await commentRepository.getComments(postIdx)

    return comments
}

const deleteComment = async (commentIdx) => {
    await commentRepository.deleteCommentRepo(commentIdx)
}

const commentLike = async (accountIdx, commentIdx) => {
    const comment = await commentRepository.isComment(commentIdx)
    if (!comment) {
        throw customError(404, "해당 댓글이 존재하지 않음")
    }

    const iscommentLike = await commentRepository.isCommentLike(accountIdx, commentIdx)
    if (!iscommentLike) {
        await commentRepository.commentLikeRepo(accountIdx, commentIdx)
    } else {
        await commentRepository.commentUnlikeRepo(accountIdx, commentIdx)
    }
}

const commentService = {
    createComment : createComment,
    updateComment : updateComment,
    selectComments : selectComments,
    deleteComment : deleteComment,
    commentLike : commentLike
}

module.exports = commentService