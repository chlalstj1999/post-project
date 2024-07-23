// const pool = require("../router/db/mariadb")
const client = require("../router/db/postgre")
const customError = require("../router/data/error")

const getPosts = async (categoryIdx) => {
    try {
        const posts = await client.query(
            `SELECT post.idx AS "postIdx", account.name AS "userName", post.title, post."createdAt" 
            FROM project.post 
            JOIN project.account ON "accountIdx" = account.idx 
            WHERE "categoryIdx" = $1 
            ORDER BY post."createdAt" DESC`, [categoryIdx]
        )

        const postsRows = posts.rows
        
        return postsRows.length !== 0 ? postsRows : []
    } catch (err) {
        throw customError(500, err.message)
    }
}

const createPostRepo = async (accountIdx, categoryIdx, title, content) => {
    try {
        await client.query(`INSERT INTO project.post ("accountIdx", title, content, "categoryIdx", "countLike") VALUES ($1, $2, $3, $4, $5)`, [accountIdx, title, content, categoryIdx, 0])
    } catch (err) {
        throw customError(500, err.message)
    }
}

const isPost = async (postIdx) => {
    try {
        const post = await client.query(`SELECT idx, "accountIdx" FROM project.post WHERE idx = $1`, [postIdx])
        const postRows = post.rows

        return postRows.length !== 0 ? postRows[0] : []
    } catch (err) {
        throw customError(500, err.message)
    }
}

const putPost = async (postIdx, title, content) => {
    try {
        await client.query(`UPDATE project.post SET title = $1, content = $2 WHERE idx = $3`, [title, content, postIdx])
    } catch (err) {
        throw customError(500, err.message)
    }
}

const getPost = async (postIdx) => {
    try {
        const post = await client.query(
            `SELECT post.idx AS "postIdx", account.name AS "userName", post.title, post.content, post."createdAt", post."countLike" AS "cntPostLike"
            FROM project.post 
            JOIN project.account ON post."accountIdx" = account.idx 
            WHERE post.idx = $1`, [postIdx]
        )
        const postRows = post.rows

        return postRows.length !== 0 ? postRows[0] : []
    } catch (err) {
        throw customError(500, err.message)
    }
}

const deletePostRepo = async (postIdx) => {
    try {
        await client.query(`DELETE FROM project.post WHERE idx = $1`, [postIdx])
    } catch (err) {
        throw customError(500, err.message)
    }
}

const isPostLike = async (accountIdx, postIdx) => {
    try {
        const postLike = await client.query(`SELECT * FROM project."postLike" WHERE "postIdx" = $1 AND "accountIdx" = $2`, [postIdx, accountIdx])
        const postLikeRows = postLike.rows

        return postLikeRows.length !== 0 ? postLikeRows[0] : []
    } catch (err) {
        throw customError(500, err.message)
    }
}

const postLikeRepo = async (accountIdx, postIdx) => {
    try {
        await client.query(`INSERT INTO project."postLike" ("postIdx", "accountIdx") VALUES ($1, $2)`, [postIdx, accountIdx])
        await client.query(
            `UPDATE project.post SET "countLike" = (
            SELECT COUNT(*)
            FROM project."postLike" 
            JOIN project.post ON "postLike"."postIdx" = post.idx
            ) WHERE idx = $1`, [postIdx]
        )
    } catch (err) {
        throw customError(500, err.message)
    }
}

const postUnlikeRepo = async (accountIdx, postIdx) => {
    try {
        await client.query(`DELETE FROM project."postLike" WHERE "postIdx" = $1 AND "accountIdx" = $2`, [postIdx, accountIdx])
        await client.query(
            `UPDATE project.post SET "countLike" = (
            SELECT COUNT(*)
            FROM project."postLike" 
            JOIN project.post ON "postLike"."postIdx" = post.idx
            ) WHERE idx = $1`, [postIdx]
        )
    } catch (err) {
        throw customError(500, err.message)
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