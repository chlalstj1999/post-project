const pool = require("../router/db/mariadb")

const getPosts = async (categoryIdx) => {
    try {
        const posts = await pool.query(`SELECT post.idx AS postIdx, account.name AS userName, post.title, post.createdAt 
            FROM post 
            JOIN account
            ON accountIdx = account.idx 
            WHERE categoryIdx = ? 
            ORDER BY post.createdAt DESC`, [categoryIdx])
    } catch (err) {
        next(err)
    }

    return posts.length !== 0 ? posts : null
}

const createPostRepo = async (accountIdx, categoryIdx, title, content) => {
    try {
        await pool.query("INSERT INTO post (accountIdx, title, content, categoryIdx, countLike) VALUES (?, ?, ?, ?, ?)", [accountIdx, title, content, categoryIdx, 0])
    } catch (err) {
        next(err)
    }
}

const isPost = async (postIdx) => {
    try {
        const post = await pool.query(`SELECT idx FROM post WHERE idx = ?`, [postIdx])
    } catch (err) {
        next(err)
    }

    return post.length !== 0 ? post[0] : null
}

const putPost = async (postIdx, title, content) => {
    try {
        await pool.query("UPDATE post SET title = ?, content = ? WHERE idx = ?", [title, content, postIdx])
    } catch (err) {
        next(err)
    }
}

const getPost = async (postIdx) => {
    try {
        const post = await pool.query(`SELECT post.idx AS postIdx, account.name AS userName, post.title, post.content, post.createdAt, post.countLike AS cntPostLike
            FROM post JOIN account ON post.accountIdx = account.idx WHERE post.idx = ?`, [postIdx])
    } catch (err) {
        next(err)
    }

    return post.length !== 0 ? post[0] : null
}

const deletePostRepo = async (postIdx) => {
    try {
        await pool.query("DELETE FROM post WHERE idx = ?", [postIdx])
    } catch (err) {
        next(err)
    }
}

const isPostLike = async (accountIdx, postIdx) => {
    try {
        const ispostLike = await pool.query("SELECT * FROM postLike WHERE postIdx = ? AND accountIdx = ?", [postIdx, accountIdx])
    } catch (err) {
        next(err)
    }

    return ispostLike.length !== 0 ? ispostLike[0] : null
}

const postLikeRepo = async (accountIdx, postIdx) => {
    try {
        await pool.query("INSERT INTO postLike (postIdx, accountIdx) VALUES (?, ?)", [postIdx, accountIdx])
        await pool.query(`UPDATE post SET countLike = (
            SELECT COUNT(*)
            FROM postLike 
            JOIN post ON postLike.postIdx = post.idx
            ) WHERE idx = ?`, [postIdx])
    } catch (err) {
        next(err)
    }
}

const postUnlikeRepo = async (accountIdx, postIdx) => {
    try {
        await pool.query("DELETE FROM postLike WHERE postIdx = ? AND accountIdx = ?", [postIdx, accountIdx])
        await pool.query(`UPDATE post SET countLike = (
            SELECT COUNT(*)
            FROM postLike 
            JOIN post ON postLike.postIdx = post.idx
            ) WHERE idx = ?`, [postIdx])
    } catch (err) {
        console.log(err)
    }
}
module.exports = { getPosts, createPostRepo, isPost, putPost, getPost, deletePostRepo, isPostLike, postLikeRepo, postUnlikeRepo }