const pool = require("../router/db/mariadb")
const { admin, user } = require("../const/role")

let conn = null
let rows = null

const getAccount = async ( idValue, pwValue ) => {
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

const getIsDuplicateEmail = async (email, accountIdx) => {
    try {
        conn = await pool.getConnection()

        if (!accountIdx) {
            rows = await conn.query("SELECT email FROM account WHERE email = ?", [email])
        } else {
            rows = await conn.query("SELECT email FROM account WHERE email = ? AND idx != ?", [email, accountIdx])
        }
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

const getUser = async (userIdx) => {
    try {
        conn = await pool.getConnection()
        rows = await conn.query("SELECT roleIdx FROM account WHERE idx = ?", [userIdx])
    } catch(err) {
        console.log(err)
    } finally {
        if (conn) conn.end()
    }

    return rows.length !== 0 ? rows : null
}

const putUserRole = async (userIdx) => {
    try {
        conn = await pool.getConnection()
        rows = await conn.query("SELECT roleIdx FROM account WHERE idx = ?", [userIdx])
        
        if (rows[0].roleIdx === admin) {
            await conn.query("UPDATE account SET roleIdx = ? WHERE idx = ?", [user, userIdx])
        } else if (rows[0].roleIdx === user) {
            await conn.query("UPDATE account SET roleIdx = ? WHERE idx = ?", [admin, userIdx])
        }
    } catch(err) {
        console.log(err)
    } finally {
        if (conn) conn.end()
    }
}

const getUserInfo = async (accountIdx) => {
    try {
        conn = await pool.getConnection()
        rows = await conn.query("SELECT name AS userName, email, gender, birth FROM account WHERE idx=?", [accountIdx])
    } catch(err) {
        console.log(err)
    } finally {
        if (conn) conn.end()
    }

    return rows.length !== 0 ? rows : null
}

const putUserInfo = async (accountIdx, userName, email, gender, birth) => {
    try {
        conn = await pool.getConnection()
        rows = await conn.query("UPDATE account SET name = ?, email = ?, gender = ?, birth = ? WHERE idx = ?", [userName, email, gender, birth, accountIdx])
    } catch(err) {
        console.log(err)
    } finally {
        if (conn) conn.end()
    }

    return rows.length !== 0 ? rows : null
}

module.exports = { 
    getAccount, getId, getPw, getIsDuplicateId, 
    getIsDuplicateEmail, postAccount, getUsersInfo, getUser, 
    putUserRole, getUserInfo, putUserInfo 
}