const { getAccount, getId, getPw, getIsDuplicateEmail, getIsDuplicateId, postAccount, getUsersInfo } = require("../reposityory/users")
const customError = require("../router/data/error")
const { idRegx, pwRegx, userNameRegx, emailRegx, genderRegx, birthRegx } = require("../const/regx")

const validateLogin = async ( idValue, pwValue ) => {
    if (!idValue.match(idRegx)) {
        throw customError(400, "아이디 형식이 잘못됨")
    } else if (!pwValue.match(pwRegx)) {
        throw customError(400, "비밀번호 형식이 잘못됨")
    }

    const account = await getAccount(idValue, pwValue)

    if (!account) {
        throw customError(404, "해당하는 계정 정보가 없습니다")
    }

    return account
}

const selectId = async ( userName, email ) => {
    if (!userName.match(userNameRegx)) {
        throw customError(400, "이름 형식이 잘못됨")
    } else if (!email.match(emailRegx)) {
        throw customError(400, "이메일 형식이 잘못됨")
    }

    const account = await getId(userName, email)

    if (!account) {
        throw customError(404, "계정 정보가 없음")
    }

    return account
}

const selectPw = async (userName, idValue) => {
    if (!userName.match(userNameRegx)) {
        throw customError(400, "이름 형식이 잘못됨")
    } else if (!idValue.match(idRegx)) {
        throw customError(400, "id 형식이 잘못됨")
    } 
    
    const account = await getPw(userName, idValue)

    if (!account) {
        throw customError(404, "계정 정보가 없음")
    }
    
    return account
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

    let account = await getIsDuplicateId(idValue)

    if (account) {
        throw customError(409, "아이디 중복")
    }

    account = await getIsDuplicateEmail(email)

    if (account) {
        throw customError(409, "이메일 중복")
    }

    await postAccount(userName, idValue, pwValue, email, gender, birth)
}

const selectUsersInfo = async () => {
    let usersInfo = await getUsersInfo()

    return usersInfo
}

module.exports = { validateLogin, selectId, selectPw, createAccount, selectUsersInfo }