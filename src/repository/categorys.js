// const pool = require("../router/db/mariadb")
const client = require("../router/db/postgre")
const customError = require("../router/data/error")

const isDuplicateCategory = async (categoryName) => {
    try {
        const category = await client.query(`SELECT name FROM project.category WHERE name = $1`, [categoryName])
        const categoryRows = category.rows

        return categoryRows.length !== 0 ? categoryRows[0] : []
    } catch (err) {
        throw customError(500, err.message)
    }
}

const postCategory = async (categoryName) => {
    try {
        await client.query(`INSERT INTO project.category (name) VALUES ($1)`, [categoryName])
    } catch (err) {
        throw customError(500, err.message)
    }
}

const getCategorys = async () => {
    try {
        const categorys = await client.query(`SELECT idx AS "categoryIdx", name AS "categoryName" FROM project.category`)
        const categorysRows = categorys.rows

        return categorysRows.length !== 0 ? categorysRows : []
    } catch (err) {
        throw customError(500, err.message)
    }
}

const isCategory = async (categoryIdx) => {
    try {
        const category = await client.query(`SELECT * FROM project.category WHERE idx = $1`, [categoryIdx])
        const categoryRows = category.rows

        return categoryRows.length !== 0 ? categoryRows[0] : []
    } catch (err) {
        throw customError(500, err.message)
    }
}

const putCategory = async (categoryIdx, categoryName) => {
    try {
        await client.query(`UPDATE project.category SET name = $1 WHERE idx = $2`, [categoryName, categoryIdx])
    } catch (err) {
        throw customError(500, err.message)
    }
}

const deleteCategoryRepo = async (categoryIdx) => {
    try {
        await client.query(`DELETE FROM project.category WHERE idx = $1`, [categoryIdx])
    } catch (err) {
        throw customError(500, err.message)
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