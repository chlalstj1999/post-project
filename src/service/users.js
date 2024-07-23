const userRepository = require("../repository/users")
const customError = require("../router/data/error")

const validateLogin = async ( idValue, pwValue ) => {
    const account = await userRepository.getAccount(idValue, pwValue)

    if (account.length === 0) {
        throw customError(404, "해당하는 계정 정보가 없습니다")
    }

    return account
}

const selectId = async ( userName, email ) => {
    const account = await userRepository.getId(userName, email)
    
    if (account.length === 0) {
        throw customError(404, "계정 정보가 없음")
    }

    return account
}

const selectPw = async (userName, idValue) => {
    const account = await userRepository.getPw(userName, idValue)

    if (account.length === 0) {
        throw customError(404, "계정 정보가 없음")
    }
    
    return account
}

const createAccount = async (userName, idValue, pwValue, email, gender, birth) => {
    let duplicatedUser = await userRepository.getIsDuplicateId(idValue)

    if (duplicatedUser.length !== 0) {
        throw customError(409, "아이디 중복")
    }
    
    duplicatedUser = await userRepository.getIsDuplicateEmail(email)

    if (duplicatedUser.length !== 0) {
        throw customError(409, "이메일 중복")
    }

    await userRepository.postAccount(userName, idValue, pwValue, email, gender, birth)
}

const selectUsersInfo = async () => {
    const usersInfo = await userRepository.getUsersInfo()

    return usersInfo
}

const updateUserRole = async (userIdx) => {
    const users = await userRepository.getUser(userIdx)

    if (users.length === 0) {
        throw customError(404, "해당 user 존재하지 않음")
    }

    await userRepository.putUserRole(userIdx)
}

const selectUserInfo = async (accountIdx) => {
    const userInfo = await userRepository.getUserInfo(accountIdx)

    return userInfo
}

const updateUserInfo = async (accountIdx, userName, email, gender, birth) => {
    const duplicatedUser = await userRepository.getIsDuplicateEmail(email, accountIdx)
    if (duplicatedUser.length !== 0) {
        throw customError(409, "이메일 중복")
    }

    await userRepository.putUserInfo(accountIdx, userName, email, gender, birth)
}
 
const deleteUser = async (accountIdx) => {
    await userRepository.deleteUserRepo(accountIdx)
}

const userService = {
    validateLogin : validateLogin,
    selectId : selectId,
    selectPw : selectPw,
    createAccount : createAccount,
    selectUsersInfo : selectUsersInfo,
    updateUserRole : updateUserRole,
    selectUserInfo : selectUserInfo,
    updateUserInfo : updateUserInfo,
    deleteUser : deleteUser
}

module.exports = userService