const customError = require("../router/data/error")
const postRepository = require("../repository/posts")
const commentRepository = require("../repository/comments")

const createComment = async (accountIdx, postIdx, comment) => {
    const post = await postRepository.isPost(postIdx)
    if (post.length === 0) {
        throw customError(404, "해당 게시물이 존재하지 않음")
    }

    await commentRepository.postComment(accountIdx, postIdx, comment)
}

const updateComment = async (accountIdx, commentIdx, comment) => {
    const iscomment = await commentRepository.isComment(commentIdx)
    if (iscomment.length === 0) {
        throw customError(404, "해당 댓글이 존재하지 않음")
    }

    if (iscomment.accountIdx !== accountIdx) {
        throw customError(403, "해당 유저만 가능")
    }

    await commentRepository.putComment(commentIdx, comment)
}

const selectComments = async (postIdx) => {
    const post = await postRepository.isPost(postIdx)
    if (post.length === 0) {
        throw customError(404, "해당 게시물이 존재하지 않음")
    }

    const comments = await commentRepository.getComments(postIdx)

    return comments
}

const deleteComment = async (commentIdx) => {
    const comment = await commentRepository.isComment(commentIdx)
    if (comment.length === 0) {
        throw customError(404, "해당 댓글이 존재하지 않음")
    }
    
    await commentRepository.deleteCommentRepo(commentIdx)
}

const commentLike = async (accountIdx, commentIdx) => {
    const comment = await commentRepository.isComment(commentIdx)
    if (comment.length === 0) {
        throw customError(404, "해당 댓글이 존재하지 않음")
    }

    const iscommentLike = await commentRepository.isCommentLike(accountIdx, commentIdx)
    if (iscommentLike.length === 0) {
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