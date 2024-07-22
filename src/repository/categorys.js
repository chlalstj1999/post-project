const pool = require("../router/db/mariadb")

const isDuplicateCategory = async (categoryName) => {
    try {
        const category = await pool.query("SELECT name FROM category WHERE name = ?", [categoryName])
    } catch (err) {
        console.log(err)
    }

    return category.length !== 0 ? category[0] : null
}

const postCategory = async (categoryName) => {
    try {
        await pool.query("INSERT INTO category (name) VALUES (?)", [categoryName])
    } catch (err) {
        console.log(err)
    }
}

const getCategorys = async () => {
    try {
        const categorys = await pool.query("SELECT idx AS categoryIdx, name AS categoryName FROM category")
    } catch (err) {
        console.log(err)
    }

    return categorys.length !== 0 ? categorys : null
}

const isCategory = async (categoryIdx) => {
    try {
        const category = await pool.query("SELECT * FROM category WHERE idx = ?", [categoryIdx])
    } catch (err) {
        console.log(err)
    }

    return category.length !== 0 ? category[0] : null
}

const putCategory = async (categoryIdx, categoryName) => {
    try {
        await pool.query("UPDATE category SET name = ? WHERE idx = ?", [categoryName, categoryIdx])
    } catch (err) {
        console.log(err)
    }
}

const deleteCategoryRepo = async (categoryIdx) => {
    try {
        await pool.query("DELETE FROM category WHERE idx = ?", [categoryIdx])
    } catch (err) {
        console.log(err)
    }
}

module.exports = { 
    isDuplicateCategory, postCategory, getCategorys, isCategory,
    putCategory, deleteCategoryRepo
 }