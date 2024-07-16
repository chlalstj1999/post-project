// 특정한 데이터 집합을 반환하고 있으므로 data 파일 만들어서 넣어주기
const customError = (statusCode, message) => {
    const error = new Error(message)
    error.statuscode = statusCode
    return error
}

module.exports = customError