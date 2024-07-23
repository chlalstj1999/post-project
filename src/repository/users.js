// const pool = require("../router/db/mariadb")
const { admin, user } = require("../const/role")
const client = require("../router/db/postgre")
const customError = require("../router/data/error")

const getAccount = async ( idValue, pwValue ) => {
    try {
        const user = await client.query(`SELECT idx, name, "roleIdx" FROM project.account WHERE id = $1 AND password = $2`, [idValue, pwValue])
        const userRows = user.rows
        return userRows.length !== 0 ? userRows[0] : []
    } catch(err) {
        throw customError(500, err.message)
    }
}

const getId = async ( userName, email ) => {
    try {
        const user = await client.query(`SELECT id AS "idValue" FROM project.account WHERE name = $1 AND email = $2`, [userName, email])
        const userRows = user.rows
        return userRows.length !== 0 ? userRows[0] : []
    } catch(err) {
        throw customError(500, err.message)
    }
}

const getPw = async ( userName, idValue ) => {
    try {
        const user = await client.query(`SELECT password AS "pwValue" FROM project.account WHERE name = $1 AND id = $2`, [userName, idValue])
        const userRows = user.rows
        return userRows.length !== 0 ? userRows[0] : []
    } catch(err) {
        throw customError(500, err.message)
    }
}

const getIsDuplicateId = async (idValue) => {
    try {
        const duplicatedUser = await client.query(`SELECT id FROM project.account WHERE id = $1`, [idValue])
        const duplicatedUserRows = duplicatedUser.rows
        return duplicatedUserRows.length !== 0 ? duplicatedUserRows[0] : []
    } catch(err) {
        throw customError(500, err.message)
    }
}

const getIsDuplicateEmail = async (email, accountIdx) => {
    try {
        if (!accountIdx) {
            const duplicatedUser = await client.query(`SELECT 1 FROM project.account WHERE email = $1`, [email])
            const duplicatedUserRows = duplicatedUser.rows
            return duplicatedUserRows.length !== 0 ? duplicatedUserRows[0] : []
        } else {
            const duplicatedUser = await client.query(`SELECT 1 FROM project.account WHERE email = $1 AND idx != $2`, [email, accountIdx])
            const duplicatedUserRows = duplicatedUser.rows
            return duplicatedUserRows.length !== 0 ? duplicatedUserRows[0] : []
        }
    } catch(err) {
        throw customError(500, err.message)
    }
}

const postAccount = async (userName, idValue, pwValue, email, gender, birth) => {
    try {
        await client.query(`INSERT INTO project.account (name, id, password, email, gender, birth, "roleIdx") VALUES ($1, $2, $3, $4, $5, $6, $7)`, [userName, idValue, pwValue, email, gender, birth, user])
    } catch(err) {
        throw customError(500, err.message)
    }
}

const getUsersInfo = async () => {
    try {
        const usersInfo = await client.query(`SELECT project.account.idx AS "userIdx", project.account.name AS "userName", project.account.id AS "idValue", project.role.name AS "roleName" FROM project.account JOIN project.role ON project.account."roleIdx" = project.role.idx`)
        const usersInfoRows = usersInfo.rows
        return usersInfoRows.length !== 0 ? usersInfoRows : []
    } catch(err) {
        throw customError(500, err.message)
    }
}

const getUser = async (userIdx) => {
    try {
        const user = await client.query(`SELECT 1 FROM project.account WHERE idx = $1`, [userIdx])
        const userRows = user.rows
        return userRows.length !== 0 ? userRows[0] : []
    } catch(err) {
        throw customError(500, err.message)
    }
}

const putUserRole = async (userIdx) => {
    try {
        const accounts = await client.query(`SELECT "roleIdx" FROM project.account WHERE idx = $1`, [userIdx])
        const accountsRow = accounts.rows
        const account = accountsRow[0]

        if (account.roleIdx === admin) {
            await client.query(`UPDATE project.account SET "roleIdx" = $1 WHERE idx = $2`, [user, userIdx])
        } else if (account.roleIdx === user) {
            await client.query(`UPDATE project.account SET "roleIdx" = $1 WHERE idx = $2`, [admin, userIdx])
        }
    } catch(err) {
        throw customError(500, err.message)
    }
}

const getUserInfo = async (accountIdx) => {
    try {
        const userInfo = await client.query(`SELECT name AS "userName", email, gender, birth FROM project.account WHERE idx=$1`, [accountIdx])
        const userInfoRows = userInfo.rows
        return userInfoRows.length !== 0 ? userInfoRows[0] : []
    } catch(err) {
        throw customError(500, err.message)
    }
}

const putUserInfo = async (accountIdx, userName, email, gender, birth) => {
    try {
        await client.query(`UPDATE project.account SET name = $1, email = $2, gender = $3, birth = $4 WHERE idx = $5`, [userName, email, gender, birth, accountIdx])
    } catch(err) {
        throw customError(500, err.message)
    }
}

const deleteUserRepo = async (accountIdx) => {
    try {
        await client.query(`DELETE FROM project.account WHERE idx = $1`, [accountIdx])
    } catch(err) {
        throw customError(500, err.message)
    }
}

const userRepository = {
    getAccount : getAccount,
    getId : getId,
    getPw : getPw,
    getIsDuplicateId : getIsDuplicateId,
    getIsDuplicateEmail : getIsDuplicateEmail,
    postAccount : postAccount,
    getUsersInfo : getUsersInfo,
    getUser : getUser,
    putUserRole : putUserRole,
    getUserInfo : getUserInfo,
    putUserInfo : putUserInfo,
    deleteUserRepo : deleteUserRepo
}
module.exports = userRepository