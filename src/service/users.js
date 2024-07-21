const { getAccount, getId, getPw } = require("../reposityory/users")
const customError = require("../router/data/error")
const { idRegx, pwRegx, userNameRegx, emailRegx } = require("../const/regx")

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

module.exports = { validateLogin, selectId }