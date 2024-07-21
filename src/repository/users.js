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

module.exports = { getAccount }