const pool = require("../router/db/mariadb")

let conn = null
let rows = null

const postComment = async (accountIdx, postIdx, comment) => {
    try {
        conn = await pool.getConnection()
        await conn.query("INSERT INTO comment (postIdx, accountIdx, content, countLike) VALUES (?, ?, ?, ?)", [postIdx, accountIdx, comment, 0])
    } catch (err) {
        console.log(err)
    } finally {
        if (conn) conn.end()
    }
}

const isComment = async (commentIdx) => {
    try {
        conn = await pool.getConnection()
        rows = await conn.query("SELECT idx FROM comment WHERE idx = ?", [commentIdx])
    } catch (err) {
        console.log(err)
    } finally {
        if (conn) conn.end()
    }

    return rows.length !== 0 ? rows : null
}

const putComment = async (commentIdx, comment) => {
    try {
        conn = await pool.getConnection()
        await conn.query("UPDATE comment SET content = ? WHERE idx = ?", [comment, commentIdx])
    } catch (err) {
        console.log(err)
    } finally {
        if (conn) conn.end()
    }
}

module.exports = { postComment, isComment, putComment }