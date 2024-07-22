const pool = require("../router/db/mariadb")

const getPosts = async (categoryIdx) => {
    try {
        const posts = await pool.query(`SELECT post.idx AS postIdx, account.name AS userName, post.title, post.createdAt 
            FROM post 
            JOIN account
            ON accountIdx = account.idx 
            WHERE categoryIdx = ? 
            ORDER BY post.createdAt DESC`, [categoryIdx])
        
        return posts.length !== 0 ? posts : null
    } catch (err) {
        next(err)
    }
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

        return post.length !== 0 ? post[0] : null
    } catch (err) {
        next(err)
    }
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

        return post.length !== 0 ? post[0] : null
    } catch (err) {
        next(err)
    }
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
        return ispostLike.length !== 0 ? ispostLike[0] : nulls
    } catch (err) {
        next(err)
    }
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
        next(err)
    }
}

const postRepository = {
    getPosts : getPosts,
    createPostRepo : createPostRepo,
    isPost : isPost,
    putPost : putPost,
    getPost : getPost,
    deletePostRepo : deletePostRepo,
    isPostLike : isPostLike,
    postLikeRepo : postLikeRepo,
    postUnlikeRepo : postUnlikeRepo
}

module.exports = postRepository