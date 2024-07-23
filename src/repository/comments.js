// const pool = require("../router/db/mariadb")
const client = require("../router/db/postgre")
const customError = require("../router/data/error")

const postComment = async (accountIdx, postIdx, comment) => {
    try {
        await client.query(`INSERT INTO project.comment ("postIdx", "accountIdx", content, "countLike") VALUES ($1, $2, $3, $4)`, [postIdx, accountIdx, comment, 0])
    } catch (err) {
        throw customError(500, err.message)
    }
}

const isComment = async (commentIdx) => {
    try {
        const comment = await client.query(`SELECT idx, "accountIdx" FROM project.comment WHERE idx = $1`, [commentIdx])
        const commentRows = comment.rows

        return commentRows.length !== 0 ? commentRows[0] : []
    } catch (err) {
        throw customError(500, err.message)
    } 
}

const putComment = async (commentIdx, comment) => {
    try {
        await client.query(`UPDATE project.comment SET content = $1 WHERE idx = $2`, [comment, commentIdx])
    } catch (err) {
        throw customError(500, err.message)
    } 
}

const getComments = async (postIdx) => {
    try {
        const comments = await client.query(
            `SELECT comment.idx AS "commentIdx", account.name AS "userName", comment.content AS comment, comment."createdAt", comment."countLike" AS "cntCommentLike"
            FROM project.comment 
            JOIN project.account ON comment."accountIdx" = account.idx 
            WHERE comment."postIdx" = $1 
            ORDER BY comment."createdAt" DESC`, [postIdx]
        )
        const commentsRows = comments.rows
        
        return commentsRows.length !== 0 ? commentsRows : []
    } catch (err) {
        throw customError(500, err.message)
    } 
}

const deleteCommentRepo = async (commentIdx) => {
    try {
        await client.query(`DELETE FROM project.comment WHERE idx = $1`, [commentIdx])
    } catch (err) {
        throw customError(500, err.message)
    }
}

const isCommentLike = async (accountIdx, commentIdx) => {
    try {
        const commentLike = await client.query(`SELECT * FROM project."commentLike" WHERE "commentIdx" = $1 AND "accountIdx" = $2`, [commentIdx, accountIdx])
        const commentLikeRows = commentLike.rows
        
        return commentLikeRows.length !== 0 ? commentLikeRows[0] : []
    } catch (err) {
        throw customError(500, err.message)
    }
}

const commentLikeRepo = async (accountIdx, commentIdx) => {
    try {
        await client.query(`INSERT INTO project."commentLike" ("commentIdx", "accountIdx") VALUES ($1, $2)`, [commentIdx, accountIdx])
        await client.query(
            `UPDATE project.comment SET "countLike" = (
            SELECT COUNT(*)
            FROM project."commentLike" 
            JOIN project.comment ON "commentLike"."commentIdx" = comment.idx
            ) WHERE idx = $1`, [commentIdx]
        )
    } catch (err) {
        throw customError(500, err.message)
    }
}

const commentUnlikeRepo = async (accountIdx, commentIdx) => {
    try {
        await client.query(`DELETE FROM project."commentLike" WHERE "commentIdx" = $1 AND "accountIdx" = $2`, [commentIdx, accountIdx])
        await client.query(
            `UPDATE project.comment SET "countLike" = (
            SELECT COUNT(*)
            FROM project."commentLike" 
            JOIN project.comment ON "commentLike"."commentIdx" = comment.idx
            ) WHERE idx = $1`, [commentIdx]
        )
    } catch (err) {
        throw customError(500, err.message)
    }
}

const commentRepository = {
    postComment : postComment,
    isComment : isComment,
    putComment : putComment,
    getComments : getComments,
    deleteCommentRepo : deleteCommentRepo,
    isCommentLike : isCommentLike,
    commentLikeRepo : commentLikeRepo,
    commentUnlikeRepo : commentUnlikeRepo
}

module.exports = commentRepository