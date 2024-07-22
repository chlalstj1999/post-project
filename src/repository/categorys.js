const pool = require("../router/db/mariadb")

const isDuplicateCategory = async (categoryName) => {
    try {
        const category = await pool.query("SELECT name FROM category WHERE name = ?", [categoryName])
        return category.length !== 0 ? category[0] : null
    } catch (err) {
        next(err)
    }
}

const postCategory = async (categoryName) => {
    try {
        await pool.query("INSERT INTO category (name) VALUES (?)", [categoryName])
    } catch (err) {
        next(err)
    }
}

const getCategorys = async () => {
    try {
        const categorys = await pool.query("SELECT idx AS categoryIdx, name AS categoryName FROM category")
        
        return categorys.length !== 0 ? categorys : null
    } catch (err) {
        next(err)
    }
}

const isCategory = async (categoryIdx) => {
    try {
        const category = await pool.query("SELECT * FROM category WHERE idx = ?", [categoryIdx])
        return category.length !== 0 ? category[0] : null
    } catch (err) {
        next(err)
    }
}

const putCategory = async (categoryIdx, categoryName) => {
    try {
        await pool.query("UPDATE category SET name = ? WHERE idx = ?", [categoryName, categoryIdx])
    } catch (err) {
        next(err)
    }
}

const deleteCategoryRepo = async (categoryIdx) => {
    try {
        await pool.query("DELETE FROM category WHERE idx = ?", [categoryIdx])
    } catch (err) {
        next(err)
    }
}

const categoryRepository = {
    isDuplicateCategory : isDuplicateCategory,
    postCategory : postCategory,
    getCategorys : getCategorys,
    isCategory : isCategory,
    putCategory : putCategory,
    deleteCategoryRepo : deleteCategoryRepo,
}

module.exports = categoryRepository