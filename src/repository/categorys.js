const pool = require("../router/db/mariadb")

let conn
let rows

const isDuplicateCategory = async (categoryName) => {
    try {
        conn = await pool.getConnection()
        rows = await conn.query("SELECT name FROM category WHERE name = ?", [categoryName])
    } catch (err) {
        console.log(err)
    } finally {
        if (conn) conn.end()
    }
}

const postCategory = async (categoryName) => {
    try {
        conn = await pool.getConnection()
        await conn.query("INSERT INTO category (name) VALUES (?)", [categoryName])
    } catch (err) {
        console.log(err)
    } finally {
        if (conn) conn.end()
    }
}

const getCategorys = async () => {
    try {
        conn = await pool.getConnection()
        rows = await conn.query("SELECT idx AS categoryIdx, name AS categoryName FROM category")
    } catch (err) {
        console.log(err)
    } finally {
        if (conn) conn.end()
    }

    return rows.length !== 0 ? rows : null
}

module.exports = { isDuplicateCategory, postCategory, getCategorys }