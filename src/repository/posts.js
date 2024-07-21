const pool = require("../router/db/mariadb")

let conn = null
let rows = null

const getPosts = async (categoryIdx) => {
    try {
        conn = await pool.getConnection()
        rows = await conn.query(`SELECT post.idx AS postIdx, account.name AS userName, post.title, post.createdAt 
            FROM post 
            JOIN account
            ON accountIdx = account.idx 
            WHERE categoryIdx = ? 
            ORDER BY post.createdAt DESC`, [categoryIdx])
    } catch (err) {
        console.log(err)
    } finally {
        if (conn) conn.end()
    }

    return rows.length !== 0 ? rows : null
}

const createPostRepo = async (accountIdx, categoryIdx, title, content) => {
    try {
        conn = await pool.getConnection()
        await conn.query("INSERT INTO post (accountIdx, title, content, categoryIdx, countLike) VALUES (?, ?, ?, ?, ?)", [accountIdx, title, content, categoryIdx, 0])
    } catch (err) {
        console.log(err)
    } finally {
        if (conn) conn.end()
    }
}

const isPost = async (postIdx) => {
    try {
        conn = await pool.getConnection()
        rows = await conn.query(`SELECT idx FROM post WHERE idx = ?`, [postIdx])
    } catch (err) {
        console.log(err)
    } finally {
        if (conn) conn.end()
    }

    return rows.length !== 0 ? rows : null
}

const putPost = async (postIdx, title, content) => {
    try {
        conn = await pool.getConnection()
        await conn.query("UPDATE post SET title = ?, content = ? WHERE idx = ?", [title, content, postIdx])
    } catch (err) {
        console.log(err)
    } finally {
        if (conn) conn.end()
    }
}

module.exports = { getPosts, createPostRepo, isPost, putPost }