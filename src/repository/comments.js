const pool = require("../router/db/mariadb")

const postComment = async (accountIdx, postIdx, comment) => {
    try {
        await pool.query("INSERT INTO comment (postIdx, accountIdx, content, countLike) VALUES (?, ?, ?, ?)", [postIdx, accountIdx, comment, 0])
    } catch (err) {
        next(err)
    }
}

const isComment = async (commentIdx) => {
    try {
        const comment = await pool.query("SELECT idx FROM comment WHERE idx = ?", [commentIdx])
    } catch (err) {
        next(err)
    } 

    return comment.length !== 0 ? comment[0] : null
}

const putComment = async (commentIdx, comment) => {
    try {
        await pool.query("UPDATE comment SET content = ? WHERE idx = ?", [comment, commentIdx])
    } catch (err) {
        next(err)
    } 
}

const getComments = async (postIdx) => {
    try {
        const comments = await pool.query(`SELECT comment.idx AS commentIdx, account.name AS userName, comment.content AS comment, comment.createdAt, comment.countLike AS cntCommentLike
            FROM comment JOIN account ON comment.accountIdx = account.idx WHERE comment.postIdx = ? ORDER BY comment.createdAt DESC`, [postIdx])
    } catch (err) {
        next(err)
    } 

    return comments.length !== 0 ? comments : null
}

const deleteCommentRepo = async (commentIdx) => {
    try {
        await pool.query("DELETE FROM comment WHERE idx = ?", [commentIdx])
    } catch (err) {
        next(err)
    }
}

const isCommentLike = async (accountIdx, commentIdx) => {
    try {
        const commentLike = await pool.query("SELECT * FROM commentLike WHERE commentIdx = ? AND accountIdx = ?", [commentIdx, accountIdx])
    } catch (err) {
        next(err)
    }

    return commentLike.length !== 0 ? commentLike[0] : null
}

const commentLikeRepo = async (accountIdx, commentIdx) => {
    try {
        await pool.query("INSERT INTO commentLike (commentIdx, accountIdx) VALUES (?, ?)", [commentIdx, accountIdx])
        await pool.query(`UPDATE comment SET countLike = (
            SELECT COUNT(*)
            FROM commentLike 
            JOIN comment ON commentLike.commentIdx = comment.idx
            ) WHERE idx = ?`, [commentIdx])
    } catch (err) {
        next(err)
    }
}

const commentUnlikeRepo = async (accountIdx, commentIdx) => {
    try {
        await pool.query("DELETE FROM commentLike WHERE commentIdx = ? AND accountIdx = ?", [commentIdx, accountIdx])
        await pool.query(`UPDATE comment SET countLike = (
            SELECT COUNT(*)
            FROM commentLike 
            JOIN comment ON commentLike.commentIdx = comment.idx
            ) WHERE idx = ?`, [commentIdx])
    } catch (err) {
        next(err)
    }
}

module.exports = { 
    postComment, isComment, putComment, getComments, deleteCommentRepo, 
    isCommentLike, commentLikeRepo, commentUnlikeRepo
 }