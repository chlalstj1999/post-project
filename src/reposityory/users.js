const pool = require("../router/db/mariadb")
const { admin, user } = require("../const/role")
let conn

const getAccount = async ( idValue, pwValue ) => {
    let rows = null
    try {
        conn = await pool.getConnection()
        rows = await conn.query("SELECT idx, name, roleIdx FROM account WHERE id = ? AND password = ?", [idValue, pwValue])
    } catch(err) {
        console.log(err)
    } finally {
        if (conn) conn.end()
    }

    return rows.length !== 0 ? rows : null
}

const getId = async ( userName, email ) => {
    let rows = null
    try {
        conn = await pool.getConnection()
        rows = await conn.query("SELECT id FROM account WHERE name = ? AND email = ?", [userName, email])
    } catch(err) {
        console.log(err)
    } finally {
        if (conn) conn.end()
    }

    return rows.length !== 0 ? rows : null
}

const getPw = async ( userName, idValue ) => {
    let rows = null
    try {
        conn = await pool.getConnection()
        rows = await conn.query("SELECT password FROM account WHERE name = ? AND id = ?", [userName, idValue])
    } catch(err) {
        console.log(err)
    } finally {
        if (conn) conn.end()
    }

    return rows.length !== 0 ? rows : null
}

const getIsDuplicateId = async (idValue) => {
    let rows = null
    try {
        conn = await pool.getConnection()
        rows = await conn.query("SELECT id FROM account WHERE id = ?", [idValue])
    } catch(err) {
        console.log(err)
    } finally {
        if (conn) conn.end()
    }

    return rows.length !== 0 ? rows : null
}

const getIsDuplicateEmail = async (email) => {
    let rows = null
    try {
        conn = await pool.getConnection()
        rows = await conn.query("SELECT email FROM account WHERE email = ?", [email])
    } catch(err) {
        console.log(err)
    } finally {
        if (conn) conn.end()
    }

    return rows.length !== 0 ? rows : null
}

const postAccount = async (userName, idValue, pwValue, email, gender, birth) => {
    try {
        conn = await pool.getConnection()
    await conn.query("INSERT INTO account (name, id, password, email, gender, birth, roleIdx) VALUES (?, ?, ?, ?, ?, ?, ?)", [userName, idValue, pwValue, email, gender, birth, user])
    } catch(err) {
        console.log(err)
    } finally {
        if (conn) conn.end()
    }
}

const getUsersInfo = async () => {
    let rows = null

    try {
        conn = await pool.getConnection()
        rows = await conn.query("SELECT account.idx AS userIdx, account.name AS userName, account.id AS idValue, role.name AS roleName FROM account JOIN role ON account.roleIdx = role.idx")
    } catch(err) {
        console.log(err)
    } finally {
        if (conn) conn.end()
    }

    return rows.length !== 0 ? rows : null
}

module.exports = { getAccount, getId, getPw, getIsDuplicateId, getIsDuplicateEmail, postAccount, getUsersInfo }