const { getAccount, getId, getPw, getIsDuplicateEmail, getIsDuplicateId, 
    postAccount, getUsersInfo, getUser, putUserRole, getUserInfo, putUserInfo, deleteUserRepo } = require("../repository/users")
const customError = require("../router/data/error")

const validateLogin = async ( idValue, pwValue ) => {
    const account = await getAccount(idValue, pwValue)

    if (!account) {
        throw customError(404, "해당하는 계정 정보가 없습니다")
    }

    return account
}

const selectId = async ( userName, email ) => {
    const account = await getId(userName, email)

    if (!account) {
        throw customError(404, "계정 정보가 없음")
    }

    return account
}

const selectPw = async (userName, idValue) => {
    const account = await getPw(userName, idValue)

    if (!account) {
        throw customError(404, "계정 정보가 없음")
    }
    
    return account
}

const createAccount = async (userName, idValue, pwValue, email, gender, birth) => {
    let duplicatedUser = await getIsDuplicateId(idValue)

    if (duplicatedUser) {
        throw customError(409, "아이디 중복")
    }

    duplicatedUser = await getIsDuplicateEmail(email)

    if (rows) {
        throw customError(409, "이메일 중복")
    }

    await postAccount(userName, idValue, pwValue, email, gender, birth)
}

const selectUsersInfo = async () => {
    const usersInfo = await getUsersInfo()

    return usersInfo
}

const updateUserRole = async (userIdx) => {
    const users = await getUser(userIdx)

    if (!users) {
        throw customError(404, "해당 user 존재하지 않음")
    }

    await putUserRole(userIdx)
}

const selectUserInfo = async (accountIdx) => {
    const userInfo = await getUserInfo(accountIdx)

    return userInfo
}

const updateUserInfo = async (accountIdx, userName, email, gender, birth) => {
    const duplicatedUser = await getIsDuplicateEmail(email, accountIdx)
    if (duplicatedUser) {
        throw customError(409, "이메일 중복")
    }

    await putUserInfo(accountIdx, userName, email, gender, birth)
}
 
const deleteUser = async (accountIdx) => {
    await deleteUserRepo(accountIdx)
}

module.exports = { 
    validateLogin, selectId, selectPw, createAccount, 
    selectUsersInfo, updateUserRole, selectUserInfo, updateUserInfo, deleteUser
 }