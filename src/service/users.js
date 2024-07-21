const { getAccount } = require("../reposityory/users")
const customError = require("../router/data/error")
const { idRegx, pwRegx } = require("../const/regx")

const validateLogin = async ( idValue, pwValue ) => {
    if (!idValue.match(idRegx)) {
        throw customError(400, "아이디 형식이 잘못됨")
    } else if (!pwValue.match(pwRegx)) {
        throw customError(400, "비밀번호 형식이 잘못됨")
    }

    const account = await getAccount(idValue, pwValue)

    console.log(account)

    if (!account) {
        throw customError(404, "해당하는 계정 정보가 없습니다")
    }

    return account
}

module.exports = { validateLogin }