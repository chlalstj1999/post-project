const pool = require("../router/db/mariadb")
const { admin, user } = require("../const/role")

const getAccount = async ( idValue, pwValue ) => {
    try {
        const user = await pool.query("SELECT idx, name, roleIdx FROM account WHERE id = ? AND password = ?", [idValue, pwValue])
        return user.length !== 0 ? user[0] : null
    } catch(err) {
        next(err)
    }
}

const getId = async ( userName, email ) => {
    try {
        const user = await pool.query("SELECT id AS idValue FROM account WHERE name = ? AND email = ?", [userName, email])
        return user.length !== 0 ? user[0] : null
    } catch(err) {
        next(err)
    }
}

const getPw = async ( userName, idValue ) => {
    try {
        const user = await pool.query("SELECT password AS pwValue FROM account WHERE name = ? AND id = ?", [userName, idValue])
        return user.length !== 0 ? user[0] : null
    } catch(err) {
        next(err)
    }
}

const getIsDuplicateId = async (idValue) => {
    try {
        const duplicatedUser = await pool.query("SELECT id FROM account WHERE id = ?", [idValue])
        return duplicatedUser.length !== 0 ? duplicatedUser[0] : null
    } catch(err) {
        next(err)
    }
}

const getIsDuplicateEmail = async (email, accountIdx) => {
    try {
        if (!accountIdx) {
            const duplicatedUser = await pool.query("SELECT email FROM account WHERE email = ?", [email])
            return duplicatedUser.length !== 0 ? duplicatedUser[0] : null
        } else {
            const duplicatedUser = await pool.query("SELECT email FROM account WHERE email = ? AND idx != ?", [email, accountIdx])
            return duplicatedUser.length !== 0 ? duplicatedUser[0] : null
        }
    } catch(err) {
        next(err)
    }
}

const postAccount = async (userName, idValue, pwValue, email, gender, birth) => {
    try {
        await pool.query("INSERT INTO account (name, id, password, email, gender, birth, roleIdx) VALUES (?, ?, ?, ?, ?, ?, ?)", [userName, idValue, pwValue, email, gender, birth, user])
    } catch(err) {
        next(err)
    }
}

const getUsersInfo = async () => {
    try {
        const usersInfo = await pool.query("SELECT account.idx AS userIdx, account.name AS userName, account.id AS idValue, role.name AS roleName FROM account JOIN role ON account.roleIdx = role.idx")
        return usersInfo.length !== 0 ? usersInfo : null
    } catch(err) {
        next(err)
    }
}

const getUser = async (userIdx) => {
    try {
        const user = await pool.query("SELECT * FROM account WHERE idx = ?", [userIdx])
        return user.length !== 0 ? user[0] : null
    } catch(err) {
        next(err)
    }
}

const putUserRole = async (userIdx) => {
    try {
        const accounts = await pool.query("SELECT roleIdx FROM account WHERE idx = ?", [userIdx])

        const account = accounts[0]

        if (account.roleIdx === admin) {
            await pool.query("UPDATE account SET roleIdx = ? WHERE idx = ?", [user, userIdx])
        } else if (account.roleIdx === user) {
            await pool.query("UPDATE account SET roleIdx = ? WHERE idx = ?", [admin, userIdx])
        }
    } catch(err) {
        next(err)
    }
}

const getUserInfo = async (accountIdx) => {
    try {
        const userInfo = await pool.query("SELECT name AS userName, email, gender, birth FROM account WHERE idx=?", [accountIdx])
        return userInfo.length !== 0 ? userInfo[0] : null
    } catch(err) {
        next(err)
    }
}

const putUserInfo = async (accountIdx, userName, email, gender, birth) => {
    try {
        await pool.query("UPDATE account SET name = ?, email = ?, gender = ?, birth = ? WHERE idx = ?", [userName, email, gender, birth, accountIdx])
    } catch(err) {
        next(err)
    }
}

const deleteUserRepo = async (accountIdx) => {
    try {
        await pool.query("DELETE FROM account WHERE idx = ?", [accountIdx])
    } catch(err) {
        next(err)
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