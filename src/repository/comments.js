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
        if (conn) return conn.end()
    }
}

module.exports = { postComment }