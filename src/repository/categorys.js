const pool = require("../router/db/mariadb")

let conn
let rows

const isDuplicateCategory = async (categoryName) => {
    try {
        conn = await pool.getConnection()
        rows = await conn.query("SELECT name FROM category WHERE name = ?", [categoryName])
    } catch(err) {
        console.log(err)
    } finally {
        if (conn) conn.end()
    }
}

const postCategory = async (categoryName) => {
    try {
        conn = await pool.getConnection()
        await conn.query("INSERT INTO category (name) VALUES (?)", [categoryName])
    } catch(err) {
        console.log(err)
    } finally {
        if (conn) conn.end()
    }
}
module.exports = { isDuplicateCategory, postCategory }