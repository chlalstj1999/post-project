const pool = require("../router/db/mariadb")
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

module.exports = { getAccount, getId, getPw }