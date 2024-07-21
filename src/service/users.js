const { getAccount, getId, getPw, getIsDuplicateEmail, getIsDuplicateId, 
    postAccount, getUsersInfo, getUser, putUserRole, getUserInfo, putUserInfo, deleteUserRepo } = require("../reposityory/users")
const customError = require("../router/data/error")
const { idRegx, pwRegx, userNameRegx, emailRegx, genderRegx, birthRegx } = require("../const/regx")

let rows = null

const validateLogin = async ( idValue, pwValue ) => {
    if (!idValue.match(idRegx)) {
        throw customError(400, "아이디 형식이 잘못됨")
    } else if (!pwValue.match(pwRegx)) {
        throw customError(400, "비밀번호 형식이 잘못됨")
    }

    rows = await getAccount(idValue, pwValue)

    if (!rows) {
        throw customError(404, "해당하는 계정 정보가 없습니다")
    }

    return rows
}

const selectId = async ( userName, email ) => {
    if (!userName.match(userNameRegx)) {
        throw customError(400, "이름 형식이 잘못됨")
    } else if (!email.match(emailRegx)) {
        throw customError(400, "이메일 형식이 잘못됨")
    }

    rows = await getId(userName, email)

    if (!rows) {
        throw customError(404, "계정 정보가 없음")
    }

    return rows
}

const selectPw = async (userName, idValue) => {
    if (!userName.match(userNameRegx)) {
        throw customError(400, "이름 형식이 잘못됨")
    } else if (!idValue.match(idRegx)) {
        throw customError(400, "id 형식이 잘못됨")
    } 
    
    rows = await getPw(userName, idValue)

    if (!rows) {
        throw customError(404, "계정 정보가 없음")
    }
    
    return rows
}

const createAccount = async (userName, idValue, pwValue, email, gender, birth) => {
    if (!userName.match(userNameRegx)) {
        throw customError(400, "이름 형식이 잘못됨")
    } else if (!idValue.match(idRegx)) {
        throw customError(400, "아이디 형식이 잘못됨")
    } else if (!pwValue.match(pwRegx)) {
        throw customError(400, "비밀번호 형식이 잘못됨")
    } else if (!email.match(emailRegx)) {
        throw customError(400, "이메일 형식이 잘못됨")
    } else if (!gender.match(genderRegx)) {
        throw customError(400, "성별 형식이 잘못됨")
    } else if (!birth.match(birthRegx)) {
        throw customError(400, "생일 형식이 잘못됨")
    }

    rows = await getIsDuplicateId(idValue)

    if (rows) {
        throw customError(409, "아이디 중복")
    }

    rows = await getIsDuplicateEmail(email)

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
    if (!userIdx) {
        throw customError(400, "userIdx 안 옴")
    }

    rows = await getUser(userIdx)

    if (!rows) {
        throw customError(404, "해당 user 존재하지 않음")
    }

    await putUserRole(userIdx)
}

const selectUserInfo = async (accountIdx) => {
    rows = await getUserInfo(accountIdx)

    return rows
}

const updateUserInfo = async (accountIdx, userName, email, gender, birth) => {
    if (!userName.match(userNameRegx)) {
        throw customError(400, "이름 형식이 잘못됨")
    } else if (!email.match(emailRegx)) {
        throw customError(400, "이메일 형식이 잘못됨")
    } else if (!gender.match(genderRegx)) {
        throw customError(400, "성별 형식이 잘못됨")
    } else if (!birth.match(birthRegx)) {
        throw customError(400, "생일 형식이 잘못됨")
    }

    rows = await getIsDuplicateEmail(email, accountIdx)
    if (rows) {
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