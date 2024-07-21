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

    return rows.length !== 0 ? rows : null
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

const isCategory = async (categoryIdx) => {
    try {
        conn = await pool.getConnection()
        rows = await conn.query("SELECT * FROM category WHERE idx = ?", [categoryIdx])
    } catch (err) {
        console.log(err)
    } finally {
        if (conn) conn.end()
    }

    return rows.length !== 0 ? rows : null
}

const putCategory = async (categoryIdx, categoryName) => {
    try {
        conn = await pool.getConnection()
        await conn.query("UPDATE category SET name = ? WHERE idx = ?", [categoryName, categoryIdx])
    } catch (err) {
        console.log(err)
    } finally {
        if (conn) conn.end()
    }
}

const deleteCategoryRepo = async (categoryIdx) => {
    try {
        conn = await pool.getConnection()
        rows = await conn.query("DELETE FROM category WHERE idx = ?", [categoryIdx])
    } catch (err) {
        console.log(err)
    } finally {
        if (conn) conn.end()
    }
}

module.exports = { 
    isDuplicateCategory, postCategory, getCategorys, isCategory,
    putCategory, deleteCategoryRepo
 }