const pool = require("../router/db/mariadb")
const customError = require("../router/data/error")

const checkUserMatch = async (req, res, next) => {
    const accountIdx = req.session.accountIdx
    const postIdx = req.params.postIdx
    const conn = await pool.getConnection()

    try {
        if (!postIdx) {
            throw customError(400, "postIdx 값이 안 옴")
        }

        const rows = await conn.query("SELECT accountIdx FROM post WHERE idx = ?", [postIdx])
        if(rows.length === 0) {
            throw customError(404, "해당 게시물이 존재하지 않음")
        }

        if(rows[0].accountIdx !== accountIdx) {
            throw customError(403, "해당 유저만 가능")
        }

        next()
    } catch(err) {
        next(err)
    } finally {
        if (conn) return conn.end()
    }
}

module.exports = checkUserMatch