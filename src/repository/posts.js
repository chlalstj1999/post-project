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

module.exports = { getPosts }